import "dotenv/config";
import express from "express";
import cors from "cors";
import signUpRouter from "./router/signUpRouter.ts";
import signInRouter from "./router/signInRouter.ts";
import blogRouter from "./router/blog.ts";
import postsRouter from "./router/posts.ts";
import commentRouter from "./router/comment.ts";
import adminRouter from "./router/adminRouter.ts";

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
