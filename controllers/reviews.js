// Import required models
const Listing = require("../models/listing");
const Review = require("../models/review");

/* 
  Controller: CREATE REVIEW 
  → Adds a new review to a specific listing
*/
module.exports.createReview = async (req, res) => {
  // Find the listing by ID from the route parameter
  const listing = await Listing.findById(req.params.id);

  // Create a new review document using the form data
  const newReview = new Review(req.body.review);

  // Assign the currently logged-in user as the review author
  newReview.author = req.user._id;

  // Add the review reference to the listing’s reviews array
  listing.reviews.push(newReview);

  // Save both review and listing to the database
  await newReview.save();
  await listing.save();

  // Display a success message and redirect to the listing page
  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${listing._id}`);
};

/* Controller: DELETE REVIEW 
  → Removes a review from a listing and deletes it from the database 
*/

module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;

  // Remove the review reference from the listing’s reviews array
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete the actual review document from the Review collection
  await Review.findByIdAndDelete(reviewId);

  // Display a success message and redirect to the listing page
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
