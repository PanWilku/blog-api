import "dotenv/config";
import express from "express";
import cors from "cors";
import signUpRouter from "./router/signUpRouter.js";
import signInRouter from "./router/signInRouter.js";
import blogRouter from "./router/blog.js";
import postsRouter from "./router/posts.js";
import commentRouter from "./router/comment.js";
import adminRouter from "./router/adminRouter.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ([process.env.FRONTEND_URL, process.env.ADMIN_URL].filter(
          Boolean
        ) as string[]) // Remove undefined values
      : /^http:\/\/localhost:\d+$/,
  credentials: true,
};

app.use(cors(corsOptions));

app.get("/", (_req, res) => {
  res.json({ message: "Hello from the API" });
});

app.use("/sign-up", signUpRouter);
app.use("/sign-in", signInRouter);
app.use("/blog", blogRouter);
app.use("/post", postsRouter);
app.use("/comment", commentRouter);
app.use("/admin", adminRouter);

const port = process.env.PORT || 3001;
const server = app.listen(port, () =>
  console.log(
    `API listening. Corsed apps are: ${process.env.FRONTEND_URL} and ${process.env.ADMIN_URL}`
  )
);

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
