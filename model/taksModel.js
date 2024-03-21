import mongoose from "mongoose";

const { Schema } = mongoose;

//adding validation in due_date
const validateDueDate = (value) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  return value >= today;
};

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true, 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tag: {
    type: String,
  },
  due_date: {
    type: Date,
    required: true, 
    validate: [validateDueDate, 'due_date cannot be before today’s date'], 
  },
  status: {
    type: String,
    enum: ['In Progress', 'Done', 'Todo'], 
    default: 'Todo'
  },
  priority: {
    type: Number,
  },
  subTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubTask",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compile model from schema
export const Task = mongoose.model('Task', taskSchema);