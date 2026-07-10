import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';   

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload image to Cloudinary
export const uploadToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new Error("No file path provided");
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: "ShopSphere/profiles",   // Optional: organizes images in folder
      use_filename: true,
    });

    // Delete the temporary file from your server after upload
    fs.unlinkSync(localFilePath);

    return result;   // Contains secure_url, public_id, etc.
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    
    // Delete file even if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    
    throw error;
  }
};