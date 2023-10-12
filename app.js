import express from "express";
import userRouter from "./Routes/userRoutes.js";
import taskRouter from "./Routes/taskRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";

export const app = express();

config({
  path: "./local.env",
});
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  }),
);
app.use("/user", userRouter);
app.use("/task", taskRouter);
app.get("/", (req, res) => {
  res.send("Hello The server is working fine");
});
