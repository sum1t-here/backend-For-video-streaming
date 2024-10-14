import { User } from "../models/user.models.js";
import APIerror from "../utils/APIerror.js";
import { asynchandler } from "../utils/asynchandler.js";

export const verifyJwt = asynchandler(async (req, _, next) => {
  const token =
    req.cookies.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new APIerror(401, "Unauthorised");
  }
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new APIerror(404, "Unauthorised");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new APIerror(401, error?.message || "Invalid Access token");
  }
});
