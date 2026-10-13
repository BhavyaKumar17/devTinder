import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { SECRETKEY } from "../utils/constants.js";
import jwt from "jsonwebtoken";

interface IUser {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  gender: string;
  phoneNumber: string;
  skills: string[];
  bio: string;
  imageUrl?: string;
}

interface IUserMethods {
  validatePassword(passwordInputByUser: string): Promise<boolean>;
  getJWT(): Promise<string>;
}

export type UserDocument = mongoose.HydratedDocument<IUser, IUserMethods>;

const userSchema = new mongoose.Schema<
  IUser,
  mongoose.Model<IUser, {}, IUserMethods>,
  IUserMethods
>(
  {
    firstName: {
      type: String,
      required: true,
      lowercase: true,
      minLength: 1,
      maxLength: 15,
      trim: true,
    },
    lastName: {
      type: String,
      lowercase: true,
      trim: true,
      minLength: 1,
      maxLength: 15,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
      maxLength: 150,
    },
    gender: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minLength: 4,
      maxLength: 12,
      // validate(value: string) {
      //   if (!["male", "female", "other"].includes(value)) {
      //     throw new Error("Invalid Gender");
      //   }
      // },
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      match: /^[0-9]{10}$/,
    },
    skills: {
      type: [String],
      required: true,
      trim: true,
      maxLength: 25,
    },
    bio: {
      type: String,
      required: true,
      trim: true,
      minLength: 10,
      maxLength: 150,
    },
    imageUrl: {
      type: String,
      trim: true,
      default:
        "https://stock.adobe.com/in/search?k=default+profile+picture&asset_id=2040499938",
    },
  },
  { timestamps: true },
);

userSchema.methods.validatePassword = async function (
  passwordInputByUser: string,
) {
  const passwordHash = this.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash,
  );
  return isPasswordValid;
};

// always use function syntax instead of arrow functions as here we need reference to 'this'
userSchema.methods.getJWT = async function () {
  // console.log("getJWT this: ", this);
  const token = await jwt.sign({ _id: this._id }, SECRETKEY, {
    expiresIn: "7d",
  });
  return token;
};

export const User = mongoose.model("User", userSchema);

export default User;
