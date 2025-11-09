// Load environment variables from .env file in development mode
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// console.log("MAP TOKEN:", process.env.MAP_TOKEN);

// Core dependencies
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");

// Routers
const listingRouter = require("./routes/listings");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

const app = express();

// MongoDB connection
const dbUrl = process.env.ATLASDB_URL;
mongoose
  .connect(dbUrl)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// EJS setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB session store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => console.log("Session Store Error", err));

// Session configuration
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ Make `currUser`, `success`, and `error` available in all views
app.use((req, res, next) => {
  res.locals.currUser = req.user || null; // currUser will always exist (null if logged out)
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", userRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);

// Catch-all route for undefined paths
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Global error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { message });
});

// Server start
app.listen(8080, () => console.log("Server running on port 8080"));
