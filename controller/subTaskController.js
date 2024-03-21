import { SubTask } from "../model/subTasksModel.js";
import { Task } from "../model/taksModel.js";
export const createSubTask = async (req, res) => {
    try {
      const { title, description, tag, due_date } = req.body;
      const parentTask = await Task.findById(req.params.parentId)
      
      const subtask = await SubTask.create({
        title,
        description,
        tag,
        user: req.user,
        due_date,
        parentTask: parentTask._id
      });
     
      //pushing the subtask into parent.subtask
     parentTask.subTasks.unshift(subtask._id)
     await parentTask.save()

      res.status(201).json({
        success: true,
        message: "SubTask added successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  

  export const editSubTask = async (req, res) => {
    try {
      const { title, description, tag, status } = req.body;
      let task = await SubTask.findById(req.params.id);
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
        message: "Sub-Task Updated succesfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  export const deleteSubTask = async (req, res) => {
    try {
      let subtask = await SubTask.findById(req.params.id);
  
      if (!subtask) {
        return res.status(404).json({
          success: false,
          message: "Sub Task not found",
        });
      }
  
      const parentTask = await Task.findById(subtask.parentTask);
  
      if (!parentTask) {
        return res.status(404).json({
          success: false,
          message: "ParentTask not found",
        });
      }
  
      await subtask.deleteOne();
  
      // Removing the subtask from the parent task
      parentTask.subTasks = parentTask.subTasks.filter(
        (subTaskId) => subTaskId.toString() !== req.params.id
      );
  
      await parentTask.save();
  
      res.status(200).json({
        success: true,
        message: "Task Delete successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  