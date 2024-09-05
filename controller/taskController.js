import { Task } from "../model/taksModel.js";
import moment from "moment";

export const createTask = async (req, res) => {
  const { title, description, tag, due_date } = req.body;

  let priority = 0;

  const today = moment().startOf("day");
  const tomorrow = moment(today).add(1, "day");
  const dayAfterTomorrow = moment(tomorrow).add(1, "day");

  if (moment(due_date).isBetween(today, tomorrow, null, "[]")) {
    priority = 1;
  } else if (
    moment(due_date).isBetween(tomorrow, dayAfterTomorrow, null, "[]")
  ) {
    priority = 2;
  } else if (moment(due_date).isAfter(dayAfterTomorrow)) {
    priority = 3;
  }

  await Task.create({
    title,
    description,
    tag,
    user: req.user,
    due_date,
    priority,
  });

  res.status(201).json({
    success: true,
    message: "Task added successfully",
  });
};

export const getMyTask = async (req, res) => {
  const { due_date, priority } = req.query;
  const queryObject = { user: req.user._id };

  if (due_date) queryObject.due_date = due_date;
  if (priority) queryObject.priority = priority;

  let tasksdata = Task.find(queryObject).populate("subTasks");

  let page = req.query.page || 1;
  let limit = req.query.limit || 10;

  // Pagination
  let skip = (page - 1) * limit;
  tasksdata = tasksdata.skip(skip).limit(limit);

  const tasks = await tasksdata.sort("-createdAt");
  res.status(200).json({
    success: true,
    tasks,
  });
};

export const editTask = async (req, res) => {
  const { title, description, tag, status } = req.body;
  let task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  if (title) task.title = title;
  if (description) task.description = description;
  if (tag) task.tag = tag;
  if (status) task.status = status;

  await task.save();
  res.status(200).json({
    success: true,
    message: "Task Updated successfully",
  });
};

export const deleteTask = async (req, res) => {
  let task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  await task.deleteOne();
  res.status(200).json({
    success: true,
    message: "Task Deleted successfully",
  });
};
