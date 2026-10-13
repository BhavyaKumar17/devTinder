import express from "express";
import { connectDB } from "./config/database.js";
import { userAuth } from "./middlewares/userAuth.js";
import cookieParser from "cookie-parser";
import { User } from "./models/user.js";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies - else req.body will return undefined
app.use(cookieParser()); // Middleware to read cookies

app.use("/auth", authRouter); // Mount the authRouter on the /auth path
app.use("/profile", profileRouter);

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err: Error) => {
    console.error("Error connecting to database: ", err);
  });

// route, middleware, routeHandler.. here only if the middleware will be successful it will move to execute the route handler else not.

app.get("/getUser", async (req, res) => {
  try {
    const users = await User.find({ email: req.body.email });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      console.log("here", req.cookies);
      res.send(users);
    }
  } catch (err) {
    res.status(404).send("User not found");
  }
});

app.delete("/deleteUserByID", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body.id);
    if (!user) {
      res.status(404).send("User not found");
    } else res.status(200).send("User deleted successfully");
  } catch (err) {
    res.status(404).send("User not found");
  }
});

app.patch("/updateUser", async (req, res) => {
  const updateData = req.body;
  try {
    const user = await User.find({ email: req.body.email });
    if (user.length === 0) {
      return res.status(404).send("User not found");
    } else {
      // console.log("before", updateData);
      const userData = await User.updateOne(
        { email: req.body.email },
        { $set: { password: req.body.password } },
        { runValidators: true },
      );
      // console.log("after", userData);
      res.status(200).send(`Successfully updated: ${userData}`);
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send("Error updating user details: " + err.message);
    } else res.status(500).send("Error updating user details");
  }
});
