import { Task } from "../model/taksModel.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    await Task.create({
      title,
      description,
      tag,
      user: req.user,
    });
    res.status(201).json({
      success: true,
      message: "Task added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyTask = async (req, res) => {
  try {
    let tasks = await Task.find({ user: req.user._id });
    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const editTask = async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.title = title;
    task.description = description;
    task.tag = tag;

    await task.save();
    res.status(200).json({
      success: true,
      message: "Task Updated succesfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.deleteOne();
    res.status(200).json({
      success: true,
      message: "Task Delete succesfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
