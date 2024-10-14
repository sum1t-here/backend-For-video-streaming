import mongoose from "mongoose";
import APIerror from "../utils/APIerror.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof APIerror)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? 400 : 500;

    const message = error.message || "Something went wrong";
    error = new APIerror(statusCode, message, error?.errors || []);
  }

  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.statusCode(error.statusCode).json(res);
};

export { errorHandler };
