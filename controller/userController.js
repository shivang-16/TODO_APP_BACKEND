import { User } from "../model/userModel.js";
import bcrypt from "bcrypt";
import { setCookie } from "../utils/jwt.js";
import sendCall from "../utils/twilio.js";
import cron from "node-cron";
import { Task } from "../model/taksModel.js";
import moment from "moment";

export const register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
  });

  setCookie(res, user, "Registered Successfully", 201);
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid Email",
    });
  }

  const isMatched = await bcrypt.compare(password, user.password);

  if (!isMatched) {
    return res.status(400).json({
      success: false,
      message: "Invalid Password",
    });
  }

  setCookie(res, user, "Login Successfully", 200);
};

export const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Development" ? false : true,
    })
    .json({
      success: true,
      message: "Logout Successfully",
    });
};

export const getMyProfile = async (req, res) => {
  let user = await User.findById(req.user);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }
  res.status(200).json({
    success: true,
    user,
  });
};

export const deleteUser = async (req, res) => {
  let user = await User.findById(req.user);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  await user.deleteOne();
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Development" ? false : true,
    })
    .json({
      success: true,
      message: "Account Deleted Successfully",
    });
};

cron.schedule("* * * * *", async () => {
  const users = await User.find();

  for (const user of users) {
    let priority = 0;

    const userTasks = await Task.find({ user: user._id });

    let closestDueDate = null;
    for (const task of userTasks) {
      const dueDate = moment(task.due_date);
      const today = moment().startOf("day");

      if (
        dueDate.isSameOrBefore(today) &&
        (closestDueDate === null || dueDate.isAfter(closestDueDate))
      ) {
        closestDueDate = dueDate;
      }
    }

    // Set priority based on the closest due date
    if (closestDueDate !== null) {
      const daysUntilDue = closestDueDate.diff(moment().startOf("day"), "days");
      if (daysUntilDue <= 0) {
        priority = 0;
      } else if (daysUntilDue <= 1) {
        priority = 1;
      } else if (daysUntilDue <= 2) {
        priority = 2;
      } else {
        priority = 3;
      }
    }

    user.priority = priority;
    await user.save();
  }
});

cron.schedule("0 0 * * *", async () => {
  const overdueTasks = await Task.find({
    due_date: { $lt: new Date() },
  }).populate("user");

  // Sort tasks by user priority
  overdueTasks.sort((a, b) => a.user.priority - b.user.priority);

  const calledUsers = new Map();

  for (const task of overdueTasks) {
    const userId = task.user;

    const user = await User.findById(userId);

    if (!calledUsers.has(userId)) {
      try {
        console.log("Calling user...");
        await sendCall(user?.name, user?.phone);
        console.log("Call success...");
      } catch (error) {
        console.log("Voice call error:", error);
      }

      calledUsers.set(userId, true);

      break;
    }
  }
});
