// Importing required modules and dependencies
const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams allows access to parent route params (like listingId)
const wrapAsync = require("../utils/wrapAsync"); // Utility to handle async errors
const ExpressError = require("../utils/ExpressError"); // Custom error handling class
const Review = require("../models/review"); // Review model
const Listing = require("../models/listing.js"); // Listing model

// Middleware functions for validation and authentication
const {
  validateReview, // Ensures review data follows schema rules
  isLoggedIn, // Checks if user is authenticated
  isReviewAuthor, // Ensures only the review creator can delete
} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js"); // Controller for review logic

// Route: POST "/" - Create a new review for a listing
// 1. User must be logged in
// 2. Validate review content
// 3. Calls controller method to save review in DB
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// Route: DELETE "/:reviewId" - Delete an existing review
// 1. User must be logged in
// 2. Must be the review’s author
// 3. Calls controller method to remove review from DB
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

// Exporting the router to use in main app
module.exports = router;
