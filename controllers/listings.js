// Import required modules
const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

// Access Mapbox token from environment variables
const mapToken = process.env.MAP_TOKEN;

// Initialize Mapbox Geocoding client with the token
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// Controller: INDEX (Show all listings)

module.exports.index = async (req, res) => {
  console.log("✅ Route hit: /listings");
  try {
    // Fetch all listings from the database
    const allListings = await Listing.find({});
    console.log("✅ Listings fetched:", allListings.length);

    // Render the listings index page with fetched data
    res.render("listings/index", { allListings });
  } catch (err) {
    console.log("❌ Error in index:", err);
    res.send("Error fetching listings");
  }
};

// Controller: NEW (Render form to create a new listing)

module.exports.renderNewForm = (req, res) => {
  // Render the form page for adding a new listing
  res.render("listings/new");
};

// Controller: SHOW (Show details for a single listing)

module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  // Find listing by ID and populate reviews and owner data
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  // If listing not found, redirect with error
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  console.log(listing);

  // Render the listing details page
  res.render("listings/show.ejs", { listing });
};

// Controller: CREATE (Add new listing to database)

module.exports.createListing = async (req, res, next) => {
  try {
    // Get geographic coordinates from Mapbox API based on user input
    const geoResponse = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    // Check if a valid location was returned
    if (!geoResponse.body.features || geoResponse.body.features.length === 0) {
      req.flash("error", "Invalid location. Please try again.");
      return res.redirect("/listings/new");
    }

    // Create a new Listing document using form data
    const newListing = new Listing(req.body.listing);

    // Assign logged-in user as the owner
    newListing.owner = req.user._id;

    // Add uploaded image details (if available)
    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    // Add geographic coordinates to the listing
    newListing.geometry = geoResponse.body.features[0].geometry;

    // Save listing to database
    await newListing.save();

    req.flash("success", "Listing added successfully!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    console.error("❌ Error while creating listing:", err);
    req.flash("error", "Something went wrong while creating the listing!");
    res.redirect("/listings/new");
  }
};

// Controller: EDIT (Render edit form for a listing)

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;

  // Find listing to edit
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Cannot edit a listing that doesn't exist!");
    return res.redirect("/listings");
  }

  // Optionally resize the existing image for preview
  let originalImageUrl = listing.image.url;
  if (originalImageUrl) {
    originalImageUrl = originalImageUrl.replace(
      "/upload",
      "/upload/h_300,w_250"
    );
  }

  // Render edit form with current listing data
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// Controller: UPDATE (Save changes to an existing listing)

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  // Find listing to update
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Update listing fields with form data
  listing.title = req.body.listing.title;
  listing.description = req.body.listing.description;
  listing.price = req.body.listing.price;
  listing.location = req.body.listing.location;
  listing.country = req.body.listing.country;

  // Update image if a new file was uploaded
  if (req.file) {
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { url, filename };
  }

  // Save updated listing
  await listing.save();

  req.flash("success", "Listing Updated Successfully!");
  res.redirect(`/listings/${listing._id}`);
};

// Controller: DELETE (Remove a listing from the database)

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;

  // Delete listing by ID
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);

  // Flash success or error based on deletion result
  if (deletedListing) {
    req.flash("success", "Listing Deleted Successfully!");
  } else {
    req.flash("error", "Listing not found or already deleted!");
  }

  res.redirect("/listings");
};
