import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true, 
  },
  email: {
    type: String,
    required: true, 
    unique: true,
  },
  phone: {
    type: Number, 
    required: true, 
    unique: true,
 }, 
  password: {
    type: String,
    required: true, 
  },
  priority: {
    type: Number,
    enum: [0, 1, 2], 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model("User", userSchema);
