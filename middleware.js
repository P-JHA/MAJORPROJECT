// Import required models and utilities
const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

// Middleware to check if the user is logged in before allowing access
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // Save the URL the user was trying to access
    req.session.redirectUrl = req.originalUrl;

    // Show an error message
    req.flash("error", "You must be logged in to create a listing");

    // Redirect to login page
    return res.redirect("/login");
  }
  next(); // Proceed if logged in
};

// Middleware to save the redirect URL in locals (used after login)
module.exports.savredirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// Middleware to check if the current user is the owner of a listing
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  // If the logged-in user is not the owner
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next(); // Proceed if user is the owner
};

// Middleware to validate listing data using Joi schema
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);

  // If validation fails, throw an error with message
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next(); // Proceed if validation passes
  }
};

// Middleware to validate review data using Joi schema
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  // If validation fails, throw an error
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next(); // Proceed if validation passes
  }
};

// Middleware to check if the current user is the author of a review
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  // If logged-in user is not the review author
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next(); // Proceed if user is the review author
};
