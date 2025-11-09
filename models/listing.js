// Import required modules
const { types, number } = require("joi"); // Joi is imported (not used directly here, possibly used for validation elsewhere)
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js"); // Importing the Review model to establish a reference

// Define the schema for a "Listing" document
const listingSchema = new mongoose.Schema({
  // Title of the listing (e.g., "Cozy Apartment in Goa")
  title: String,

  // Short description about the listing
  description: String,

  // Image information (stored as an object with URL and filename)
  image: {
    url: String,
    filename: String,
  },

  // Price of the listing
  price: Number,

  // Location details (city, area, etc.)
  location: String,

  // Country of the listing
  country: String,

  // Array of associated reviews (referencing Review model)
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  // Owner of the listing (referencing User model)
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  // GeoJSON structure to store geographical coordinates (for maps)
  geometry: {
    type: {
      type: String, // Defines the type of geometry (always "Point")
      enum: ["Point"], // Ensures only "Point" type is allowed
      required: true, // Must be provided
    },
    coordinates: {
      type: [Number], // Array storing longitude and latitude
      required: true, // Coordinates are mandatory
    },
  },
});

// Post middleware - runs after a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  // If a listing is deleted, remove all reviews associated with it
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

// Create a model from the schema
const Listing = mongoose.model("Listing", listingSchema);

// Export the model to be used in other files
module.exports = Listing;
