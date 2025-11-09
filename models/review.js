// Import required modules
const { number } = require("joi"); // Joi is imported (though not directly used here, likely for validation elsewhere)
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for a Review document
const reviewSchema = new Schema({
  // Text content of the user's review
  comment: String,

  // Rating given by the user (must be between 1 and 5)
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },

  // Timestamp for when the review was created
  createdAt: {
    type: Date,
    default: Date.now(), // Automatically sets the current date and time
  },

  // Reference to the user who wrote the review
  author: {
    type: Schema.Types.ObjectId,
    ref: "User", // Connects each review to a specific user
  },
});

// Export the Review model for use in other parts of the app
module.exports = mongoose.model("Review", reviewSchema);
