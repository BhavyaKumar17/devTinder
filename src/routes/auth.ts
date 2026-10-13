import { validateSignUpData } from "../utils/validator.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import express from "express";

// const app = express();
const authRouter = express.Router();

// app.use(express.json());

authRouter.post(
  "/signup",
  async (req: express.Request, res: express.Response) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        gender,
        phoneNumber,
        bio,
        skills,
        imageUrl,
      } = req.body;

      //validate data
      validateSignUpData(req.body);

      //encrypt password
      const hashedPassword = await bcrypt.hash(password, 10);

      //save to DB
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        skills,
        phoneNumber,
        bio,
        imageUrl,
        gender,
      });

      //returns a promise.. so do await or .then() to handle the save operation
      await user.save();
      res.send("User created successfully");
    } catch (err: any) {
      // console.error("Error creating user: ", err);
      res.status(500).send(err.message);
    }
  },
);

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      return res.status(401).send("Unauthorised!");
    }

    const jwtToken = await user.getJWT();
    res.cookie("token", jwtToken, { maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(200).send("Login Successful");
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

authRouter.post("/logout", (req, res) => {
  console.log("Logging out user");
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .status(200)
    .send("Logged out successfully");
});

export default authRouter;
