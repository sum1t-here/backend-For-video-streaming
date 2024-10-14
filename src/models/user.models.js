/**
  id string pk
  watchHistory ObjectId[] videos
  username string
  email string
  fullName string
  avatar string
  coverImage string
  password string
  refreshToken string
  createdAt Date
  updatedAt Date
 */

import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true, // Username is mandatory
      unique: true, // Must be unique (no duplicate usernames)
      lowercase: true, // Automatically converts to lowercase for consistency
      trim: true, // Trims leading and trailing whitespaces
      index: true, // Indexed for faster lookup in queries
    },

    email: {
      type: String,
      required: true, // Email is mandatory
      unique: true, // Must be unique (no duplicate emails)
      lowercase: true, // Automatically converts to lowercase for consistency
      trim: true, // Trims leading and trailing whitespaces
    },

    fullname: {
      type: String,
      required: true, // Full name is mandatory
      trim: true, // Trims leading and trailing whitespaces
      index: true, // Indexed for faster searches
    },

    avatar: {
      type: String,
      required: true, // Avatar is mandatory (likely a URL or file path)
    },

    coverImage: {
      type: String, // Optional field for cover image
    },

    watchHistory: {
      type: Schema.Types.ObjectId, // Stores an ObjectId referencing another document
      ref: "Video", // Refers to the 'Video' model
    },

    password: {
      type: String,
      required: [true, "Password is required"], // Password is mandatory with a custom error message
    },

    refreshToken: {
      type: String, // Optional field for storing a refresh token
    },
  },
  {
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next;
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPaaswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
