import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "dewtc6liq",
  api_key: "649686154482419",
  api_secret: "LdL2_XEA0pyPiekl0HNh7PtXA5g",
});

export const uploadOnCloudinary = async (filePath) => {
  if (!filePath) {
    return;
  }
  try {
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      asset_folder: "Hotel App",
    });
    fs.unlinkSync(filePath);

    return response;
  } catch (error) {
    fs.unlinkSync(filePath);
    return error.message;
  }
};
