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
const server = app.listen(port, "0.0.0.0", () => {
  console.log(
    `API listening on port ${port}. CORS enabled for: ${process.env.FRONTEND_URL} and ${process.env.ADMIN_URL}`
  );
});

// Improved graceful shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`${signal} received, shutting down gracefully`);
  server.close((err) => {
    if (err) {
      console.error("Error during server shutdown:", err);
      process.exit(1);
    }
    console.log("Server closed successfully");
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.log("Forcing shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
