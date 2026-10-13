import validator from "validator";
import type { CreateUserRequest, Gender } from "../types/index.js";

export function validateSignUpData(data: CreateUserRequest) {
  const {
    firstName,
    lastName,
    email,
    password,
    gender,
    phoneNumber,
    skills,
    bio,
    imageUrl,
  } = data;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !gender ||
    !phoneNumber ||
    !skills.length ||
    !bio ||
    !imageUrl
  ) {
    throw new Error("All fields are required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid Email");
  } else if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    throw new Error("Choose a strong password");
  } else if (!validator.isURL(imageUrl)) {
    throw new Error("Invalid Image URL");
  }
  // else if (!isValidGender(gender)) {
  //   throw new Error("Invalid Gender");
  // }
}

export function validateEditProfileData(req: any): boolean {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "password",
    "gender",
    "phoneNumber",
    "skills",
    "bio",
    "imageUrl",
  ];
  try {
    const isEditAllowed = Object.keys(req.body).every((key) =>
      allowedEditFields.includes(key),
    );
    return isEditAllowed;
  } catch (err) {
    throw new Error("Invalid data");
  }
}

export function validateNewPassword(req: any): boolean {
  try {
    console.log("Validating new password: ", req.body.password);
    const { password } = req.body;
    return (
      password &&
      validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    );
  } catch (err) {
    throw new Error("Invalid password");
  }
}
export function isValidGender(gender: string): gender is Gender {
  return ["female", "male", "others"].includes(gender);
}
