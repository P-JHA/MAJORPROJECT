// Import required modules
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// Define the schema for the User model
const userSchema = new Schema({
  // Store the user's email address
  email: {
    type: String,
    required: true, // Email is mandatory for each user
  },
});

// Add passport-local-mongoose plugin to the user schema
// This plugin automatically handles username, password hashing, and authentication logic
userSchema.plugin(passportLocalMongoose);

// Export the User model so it can be used throughout the application
module.exports = mongoose.model("User", userSchema);
