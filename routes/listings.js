// Importing required modules and dependencies
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); // Handles async errors
const Listing = require("../models/listing.js"); // Mongoose model for listings
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js"); // Middleware functions
const listingController = require("../controllers/listings.js"); // Controller methods
const multer = require("multer");
const { storage } = require("../cloudConfig.js"); // Cloudinary storage config
const upload = multer({ storage }); // Multer setup for file uploads

// Route: "/" - Handles index and create operations

router
  .route("/")
  // GET request → Show all listings
  .get(wrapAsync(listingController.index))

  // POST request → Create a new listing
  // - Must be logged in
  // - Validates form data
  // - Uploads single image to Cloudinary
  .post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
  );

// Route: "/new" - Form to create a new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Route: "/:id" - Show, update, or delete a listing
router
  .route("/:id")

  // GET → Show single listing details
  .get(wrapAsync(listingController.showListing))

  // PUT → Update listing details
  // - Must be logged in and be the owner
  // - Uploads new image (if any)
  // - Validates updated data
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )

  // DELETE → Remove a listing
  // - Must be logged in and be the owner
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Route: "/:id/edit" - Render edit form for an existing listing
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

// Exporting the router to be used in app.js
module.exports = router;
