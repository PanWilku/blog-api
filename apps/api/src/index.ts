import "dotenv/config";
import express from "express";
import cors from "cors";
import signUpRouter from "./router/signUpRouter";
import signInRouter from "./router/signInRouter";
import blogRouter from "./router/blog";
import postsRouter from "./router/posts";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: process.env.FRONTEND_URL }));

app.get("/", (_req, res) => {
  res.json({ message: "Hello from the API" });
});

app.use("/sign-up", signUpRouter);
app.use("/sign-in", signInRouter);
app.use("/blog", blogRouter);
app.use("/posts", postsRouter);

const port = process.env.PORT || 3001;
app.listen(port, () =>
  console.log(
    `API listening on http://localhost:${port} App running at http://localhost:5173`
  )
);
