import mongoose from "mongoose";
const { Schema } = mongoose;

//adding validation in due_date
const validateDueDate = (value) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return value >= today;
};

const subtaskSchema = new Schema({
  title: String,
  description: String,
  due_date: {
    type: Date,
    validate: [validateDueDate, "due_date cannot be before today’s date"],
  },
  parentTask:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },
  status: {
    type: String,
    enum: ["In Progress", "Done", "Todo"],
    default: "Todo",
  },
  tag: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compile model from schema
export const SubTask = mongoose.model("SubTask", subtaskSchema);
