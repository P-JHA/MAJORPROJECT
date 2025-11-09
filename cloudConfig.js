// Import the Cloudinary library (v2 version for newer API features)
const cloudinary = require("cloudinary").v2;

// Import Cloudinary storage engine for multer (used for handling file uploads)
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary with credentials stored in environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // Cloudinary account name
  api_key: process.env.CLOUD_API_KEY, // Cloudinary API key
  api_secret: process.env.CLOUD_API_SECRET, // Cloudinary API secret
});

// Create a storage object to define how and where files will be stored in Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // Connect this storage to the configured Cloudinary instance
  params: {
    folder: "wanderlust_DEV", // Folder name in your Cloudinary account
    allowedFormats: ["jpeg", "png", "jpg"], // Allow only these image file types
  },
});

// Export both cloudinary instance and storage configuration for use in other files
module.exports = {
  cloudinary,
  storage,
};
