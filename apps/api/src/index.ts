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

app.use(cors({ origin: /^http:\/\/localhost:\d+$/, credentials: true }));

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
app.listen(port, () =>
  console.log(
    `API listening on http://localhost:${port} App running at http://localhost:5173`
  )
);
