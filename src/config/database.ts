import mongoose from "mongoose";

// connect returns a promise, so we should use async/await or .then() to handle the connection
export const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://bhavyakumari17_db_user:zXIqvC6K6gRaR5UE@mydb.ai423o8.mongodb.net/mydb",
  );
};
