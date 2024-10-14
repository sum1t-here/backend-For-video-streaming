import { asynchandler } from "../utils/asynchandler.js";
import APIerror from "../utils/APIerror.js";
import { User } from "../models/user.models.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import APIresponse from "../utils/APIresponse.js";
import app from "../app.js";

const registerUser = asynchandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exist : email, username
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and response token field from response
  // check for user creation
  // return res

  const { username, fullname, email, password } = req.body;
  console.log("email : ", email);

  // if (!fullname) {
  //   throw new APIerror(400, "fullname is required");
  // }

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new APIerror(400, "All fields are required   ");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new APIerror(409, "User already exists");
  }

  // we get access to req.files withthe help of multer

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new APIerror(400, "Avatar file is missing");
  }

  // const avatar = await uploadOnCloudinary(avatarLocalPath);
  // let coverImage = ""
  // if (coverImageLocalPath) {
  //   coverImage = await uploadOnCloudinary(coverImageLocalPath);
  // }

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Uploaded avatar", avatar);
  } catch (error) {
    console.log("Error uploading avatar", error);
    throw new APIerror(500, "Failed to upload avatar");
  }

  let coverImage;
  try {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
    console.log("Uploaded coverImage", coverImage);
  } catch (error) {
    console.log("Error uploading cover image", error);
    throw new APIerror(500, "Failed to upload cover image");
  }

  if (!avatar) {
    throw new APIerror(409, "Avatar file is required");
  }

  try {
    const user = await User.create({
      fullname,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id)?.select(
      "-password  -refreshToken "
    );

    if (!createdUser) {
      throw new APIerror(
        500,
        "Something went wrong while registering the user"
      );
    }

    return res
      .status(201)
      .json(new APIresponse(200, createdUser, "User registered successfullly"));
  } catch (error) {
    console.log("User creation failed");

    if (avatar) {
      await deleteFromCloudinary(avatar.public_id);
    }

    if (coverImage) {
      await deleteFromCloudinary(coverImage.public_id);
    }

    throw new APIerror(500, "Something went wrong while registering a user");
  }
});

export { registerUser };
