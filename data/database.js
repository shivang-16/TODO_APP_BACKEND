import mongoose from "mongoose";

const MongoURI = process.env.MONGO_URI;

const connectToDB = () => {
  try {
    mongoose.connect(MongoURI, {
      dbName: "TodoAPP",
    });
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
};

export default connectToDB;
