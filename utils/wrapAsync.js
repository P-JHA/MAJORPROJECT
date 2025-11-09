// Utility function to handle async route errors

module.exports = (fn) => {
  // Return a new function that Express can use as middleware
  return (req, res, next) => {
    // Execute the async function (fn)
    // If it returns a rejected promise (error),
    // .catch(next) automatically forwards it to Express error handler
    fn(req, res, next).catch(next);
  };
};
