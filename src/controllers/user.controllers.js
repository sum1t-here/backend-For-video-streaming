import { asynchandler } from "../utils/asynchandler.js";
import APIerror from "../utils/APIerror.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import APIresponse from "../utils/APIresponse.js";

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

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new APIerror();
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new APIerror(409, "Avatar file is required");
  }

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
    throw new APIerror(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new APIresponse(200, createdUser, "User registered successfullly"));
});

export { registerUser };
