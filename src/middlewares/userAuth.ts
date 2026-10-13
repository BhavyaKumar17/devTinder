import jwt, { type JwtPayload } from "jsonwebtoken";
import User from "../models/user.js";
import type { Request, Response, NextFunction } from "express";
import { SECRETKEY } from "../utils/constants.js";

interface CustomJwtPayload extends JwtPayload {
  _id: string;
}

export const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid");
    }

    const decodedToken = (await jwt.verify(
      token,
      SECRETKEY,
    )) as CustomJwtPayload;

    const { _id } = decodedToken;
    const userData = await User.findById(_id).select("-password"); // Exclude the password field from the user data

    if (!userData) {
      throw new Error("User not found!");
    }
    req.user = userData;
    next();
  } catch (err) {
    res.status(401).send("Unauthorised user");
  }
};
