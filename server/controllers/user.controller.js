import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(400, "User already exists");
  }

  if (password?.trim() === "") {
    throw new ApiError(400, "Invalid credentials");
  }

  const newUser = await User.create({
    email: email?.trim(),
    password: password?.trim(),
    username: username?.trim(),
  });
  await newUser.save();

  const user = await User.findById(newUser?._id).select("-password");

  if (!newUser) {
    throw new ApiError(400, "Something went wrong while registration");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email });
  if (!existedUser) {
    throw new ApiError(400, "Invalid credentials");
  }

  const isPasswordMatch = await existedUser.comparePassword(password);
  if (!isPasswordMatch) {
    throw new ApiError(400, "Invalid credentials");
  }
  const token = await existedUser.generateToken();

  const options = {
    httpOnly: true,
    secure: true,
  };

  const user = await User.findById(existedUser?._id).select("-password");

  return res
    .status(200)
    .cookie("accessToken", token, options)
    .json(new ApiResponse(200, user, "User logged in successfully"));
});
export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user?._id);
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logout successfully"));
});

export const googleAuth = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const token = await user?.generateToken();
    const options = {
      httpOnly: true,
      secure: true,
    };
    const loggedInUser = await User.findById(user?._id).select("-password");

    return res
      .status(200)
      .cookie("accessToken", token, options)
      .json(new ApiResponse(200, loggedInUser));
  } else {
    const generatePassword = Math.random().toString(36).slice(-8);
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: generatePassword,
      avatar: req.body.avatar,
    });
    await newUser.save();
    const token = await user?.generateToken();
    const options = {
      httpOnly: true,
      secure: true,
    };
    const loggedInUser = await User.findById(newUser?._id).select("-password");
    return res
      .status(200)
      .cookie("accessToken", token, options)
      .json(new ApiResponse(200, loggedInUser));
  }
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { username, email, avatar } = req.body;
  const avatarFile = await uploadOnCloudinary(req.file?.path);

  const updatedProfile = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        username: username?.trim(),
        email: email?.trim(),
        avatar: avatarFile?.secure_url,
      },
    },
    {
      new: true,
    }
  ).select("-password -createdAt -updatedAt");
  return res
    .status(200)
    .json(new ApiResponse(200, updatedProfile, "Profile updated succesfully"));
});

export const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid userId");
  }

  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new ApiError(400, "No user found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});
