// Custom Express Error Class

class ExpressError extends Error {
  constructor(statuscode, message) {
    // Call the parent class (Error) constructor
    super();

    // Store HTTP status code (e.g., 404, 500)
    this.statuscode = statuscode;

    // Store error message to describe what went wrong
    this.message = message;
  }
}

// Export the custom error class so it can be used in other files
module.exports = ExpressError;
