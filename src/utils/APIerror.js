class APIerror extends Error {
  // Constructor method to initialize the object when a new instance is created
  constructor(
    statuscode, // The HTTP status code representing the type of error (e.g., 400 for bad request, 500 for server error)
    message = "Something went wrong", // Optional error message with a default value
    errors = [], // Optional array to hold additional error details
    stack = "" // Optional stack trace for debugging
  ) {
    // Call the parent class 'Error' constructor with the message
    super(message);

    // Assign the status code to the error object
    this.statuscode = statuscode;

    // 'data' is set to null because it's an error response, so there is no data to return
    this.data = null;

    // 'message' holds the error message (either provided or the default)
    this.message = message;

    // 'success' is always false for error responses
    this.success = false;

    // 'errors' is an array to store detailed error information (e.g., field validation errors)
    this.errors = errors;

    // If a stack trace is provided, assign it to the error object
    if (stack) {
      this.stack = stack;
    } else {
      // If no stack trace is provided, generate one using 'Error.captureStackTrace' for debugging purposes
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default APIerror;
