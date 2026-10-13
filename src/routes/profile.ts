import { User } from "../models/user.js";
import { userAuth } from "../middlewares/userAuth.js";
import express from "express";
import { validateEditProfileData } from "../utils/validator.js";
import bcrypt from "bcrypt";

const profileRouter = express.Router();

profileRouter.get("/getAllUsers", userAuth, async (req, res) => {
  try {
    const users = await User.find({}).select("-password"); // Exclude the password field from the user data
    if (users.length === 0) {
      res.status(404).send("No users found");
    } else res.send(users);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});

profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send("Unauthorized user");
    }

    res.status(200).send(req.user);
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      return res.status(401).send("these fields can't be updated");
    }
    const latestDetails = req.user;
    Object.keys(req.body).forEach((key: string) => {
      latestDetails[key] = req.body[key];
    });
    await latestDetails.save();
    // res
    //   .status(200)
    //   .send(
    //     `${latestDetails.firstName} ${latestDetails.lastName} updated successfully`,
    //   );

    // better and recommended format
    res.json({
      message: `${latestDetails.firstName}, your profile is successfully updated`,
      user: latestDetails,
    });
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

profileRouter.patch("/updatePassword", userAuth, async (req, res) => {
  try {
    const newPassword = req.body.password;
    console.log(
      newPassword,
      typeof newPassword,
      typeof newPassword !== "string" || newPassword.trim().length === 0,
    );
    if (typeof newPassword !== "string" || newPassword.trim().length === 0) {
      console.log("hi from first if");
      return res.status(400).send("Please enter a valid password");
    }

    const isPasswordSameAsOld = await req.user.validatePassword(newPassword);
    console.log("here", isPasswordSameAsOld);
    // req.user.validateNewPassword(newPassword),
    // isPasswordSameAsOld || !req.user.validateNewPassword(newPassword),
    // entered password is same as old password || new password doesn't meet the criteria
    if (isPasswordSameAsOld || !req.user.validateNewPassword(newPassword)) {
      console.log("hi from second if");
      return res
        .status(400)
        .send("Make sure that the password is new and meets the criteria");
    }

    const loggedInUser = req.user;
    loggedInUser.password = await bcrypt.hash(newPassword, 10);
    await loggedInUser.save();
    res
      .clearCookie("token")
      .status(200)
      .json({ message: "Password updated successfully" });

    // cookies for old password will be deleted and new cookie will be added when user will login again
  } catch (err) {
    res.status(500).send("Enter a valid password");
  }
});

export default profileRouter;
