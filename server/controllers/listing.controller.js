import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Listing } from "../models/listing.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { isValidObjectId } from "mongoose";

export const createListing = asyncHandler(async (req, res) => {
  try {
    const data = req.body;
    const userId = req.user?._id;

    const imageFiles = req.files?.images || [];
    const localPaths = imageFiles.map((file) => file?.path);

    const uploadPromises = localPaths.map(async(path) => await uploadOnCloudinary(path));
    const uploadResults = await Promise.all(uploadPromises);

    const imageUrls = uploadResults.map((result) => result?.secure_url);

    const listing = await Listing.create({
      ...data,
      userId,
      images: imageUrls,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, listing, "Listing created successfully"));
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Listing creation failed";

    return res.status(statusCode).json(new ApiResponse(statusCode, message));
  }
});

export const getAllListing = asyncHandler(async (req, res) => {
  const allListings = await Listing.find({ userId: req.user?._id });
  if (!allListings) {
    throw new ApiError(400, "No Listing available");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, allListings, "Listing fetched successfully"));
});

export const getListingById = asyncHandler(async (req, res) => {
  const { listingId } = req.params;
  if (!isValidObjectId(listingId)) {
    throw new ApiError(400, "Invalid Id");
  }
  const listing = await Listing.findById(listingId);
  if (!listing) {
    throw new ApiError(400, "No Listing available");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, listing, "Listing fetched successfully"));
});

export const deleteListingById = asyncHandler(async (req, res) => {
  const { listingId } = req.params;
  if (!isValidObjectId(listingId)) {
    throw new ApiError(400, "Invalid Id");
  }
  const listing = await Listing.findByIdAndDelete(listingId);
  if (!listing) {
    throw new ApiError(
      400,
      "Failed to delete the listing. Please try again later"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Listing deleted successfully"));
});

export const updateListingById = asyncHandler(async (req, res) => {
  try {
    const { listingId } = req.params;
    const data = req.body;
    if (!isValidObjectId(listingId)) {
      throw new ApiError(400, "Invalid Listing Id");
    }
    const listing = await Listing.findById(listingId);
    if (!listing) {
      throw new ApiError(404, "Listing not found!");
    }
    if (req.user?._id.toString() !== listing.userId.toString()) {
      throw new ApiError(401, "You can only update your own listings!");
    }

    const images = req.files?.images || []
    const localPaths = images?.map((image) => image?.path)

    const uploadPromises = localPaths.map((path) => uploadOnCloudinary(path))
    const result = await Promise.all(uploadPromises)

    const imageUrls  = result.map((response) => response?.secure_url)


    await Listing.findByIdAndUpdate(listingId,
       {
        $set:{
          ...data, 
          images: [...listing.images  ,...imageUrls]
        }
       },
       {new: true,}
  );
  const updatedListing = await Listing.findById(listingId)
    return res
      .status(200) 
      .json(
        new ApiResponse(200, updatedListing, "Listing updated successfully")
      );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message,  "listing updation failed"));
  }
});

export const getListing = asyncHandler(async(req, res) => {
  const limit = parseInt(req.query.limit) || 9
  const startIndex = parseInt(req.query.startIndex) || 0
  let offer = req.query.offer
  
  if(offer === undefined || offer === false){
    offer = { $in : [false, true] }
  }

  let furnished = req.query.furnished

  if(furnished === undefined || furnished === false){
    furnished = { $in : [false, true] }
  }

  let parking = req.query.parking

  if(parking === undefined || parking === false){
    parking = { $in : [false, true] }
  }

  let type = req.query.type

  if(type === undefined || type === "all"){
    type = { $in : ["sale", "rent"] }
  }

  let searchTerm = req.query.searchTerm || ''

  let sort = req.query.sort || 'createdAt'

  let order = req.query.order
  order = order ==="desc" ? -1 : 1

  const listing = await Listing.find({
    name: { $regex: searchTerm, $options: 'i'},
    offer, furnished, parking, type
  }).sort({[sort]: order}).limit(limit).skip(startIndex)
  
  return res.status(200)
  .json(new ApiResponse(200, listing, "listing fetched successfully"))
})
