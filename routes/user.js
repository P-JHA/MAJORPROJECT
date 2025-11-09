// Importing required modules and dependencies
const express = require("express");
const router = express.Router(); // Creates a new router instance
const User = require("../models/user.js"); // User model for database operations
const wrapAsync = require("../utils/wrapAsync.js"); // Utility to handle async errors
const passport = require("passport"); // For authentication handling
const { savredirectUrl } = require("../middleware.js"); // Middleware to save intended redirect path

const userController = require("../controllers/users.js"); // Controller handling user logic

// Route: /signup - Handles user registration
// GET  -> Renders the signup form
// POST -> Creates a new user account and handles validation/errors
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

// Route: /login - Handles user login
// GET  -> Renders the login form
// POST -> Authenticates the user with Passport.js
//         - savredirectUrl middleware saves the intended URL before login
//         - If login fails, redirects back to /login with a flash message
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    savredirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

// Route: /logout - Logs the user out of the session
router.get("/logout", userController.logout);

// Exporting the router to be used in the main application
module.exports = router;
