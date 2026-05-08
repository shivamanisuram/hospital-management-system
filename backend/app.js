import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/error.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import ErrorHandler from "./middlewares/error.js";

const app = express();
config({ path: "./config.env" });

app.use(
  cors({
    origin:
      [process.env.FRONTEND_URL_ONE, process.env.FRONTEND_URL_TWO].filter(
        Boolean
      ).length > 0
        ? [process.env.FRONTEND_URL_ONE, process.env.FRONTEND_URL_TWO].filter(
            Boolean
          )
        : true,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(async (req, res, next) => {
  try {
    await dbConnection();
    next();
  } catch (error) {
    next(
      new ErrorHandler(
        `Database connection failed: ${error.message}`,
        500
      )
    );
  }
});

app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

app.use(errorMiddleware);
export default app;
