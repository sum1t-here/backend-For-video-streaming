// 'asynchandler' is a higher-order function that takes a 'requestHandler' function as an argument.
// The purpose of this function is to wrap asynchronous route handlers in a try/catch block using Promises.
// This helps in automatically passing any errors that occur in async route handlers to the next middleware,
// such as an error-handling middleware in Express.

const asynchandler = (requestHandler) => {
  // This function returns a new function that serves as middleware for Express routes.
  return (req, res, next) => {
    // The Promise.resolve() ensures that even if the 'requestHandler' does not return a Promise,
    // it will be wrapped in a resolved Promise. This allows async/await functions to be handled.
    Promise.resolve(requestHandler(req, res, next))
      // If the 'requestHandler' throws an error (synchronously or asynchronously),
      // it is caught in the .catch() block and passed to 'next(err)'.
      // Passing the error to 'next' allows Express to handle it through its error-handling middleware.
      .catch((err) => next(err));
  };
};

export { asynchandler };
