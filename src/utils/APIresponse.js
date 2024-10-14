class APIresponse {
  // Constructor method to initialize the object when a new instance is created
  constructor(statuscode, data, message = "Success") {
    // 'statuscode' represents the HTTP status code (e.g., 200 for success, 404 for not found)
    this.statuscode = statuscode;

    // 'data' represents the payload that you want to send back in the API response (e.g., user info, list of items, etc.)
    this.data = data;

    // 'message' is an optional parameter with a default value of "Success".
    // It can be used to send a message along with the response, like "Request successful" or a custom message.
    this.message = message;

    // 'success' is a boolean flag that indicates if the request was successful.
    // If the status code is less than 400, it's considered a success (i.e., status codes 200-399).
    this.success = statuscode < 400;
  }
}

export default APIresponse;
