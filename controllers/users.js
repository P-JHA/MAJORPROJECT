// Import the User model
const User = require("../models/user");

/* 
  Controller: RENDER SIGNUP FORM 
  → Displays the signup page to the user
*/
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

/* 
  Controller: SIGNUP 
  → Registers a new user and logs them in automatically
*/
module.exports.signup = async (req, res) => {
  try {
    // Extract user details from the request body
    let { username, email, password } = req.body;

    // Create a new user object
    const newUser = new User({ email, username });

    // Register the user using Passport-Local-Mongoose
    let registeredUser = await User.register(newUser, password);
    console.log(registeredUser);

    // Log the user in after successful registration
    req.login(registeredUser, (err) => {
      if (err) {
        next(err);
      }
      req.flash("success", "Welcome to WanderLust");
      res.redirect("/listings");
    });
  } catch (e) {
    // Handle errors like duplicate usernames or validation issues
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

/* 
  Controller: RENDER LOGIN FORM 
  → Displays the login page to the user
*/
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

/* 
  Controller: LOGIN 
  → Logs in a user and redirects to their intended page
*/
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust! You are logged in");

  // Redirect to the URL the user originally requested or listings page
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

/* 
  Controller: LOGOUT 
  → Logs out the user and redirects to the listings page
*/
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged you out!");
    res.redirect("/listings");
  });
};
