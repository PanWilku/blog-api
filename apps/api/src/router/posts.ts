// @ts-ignore
import { auth } from "../../lib/auth.js";
import { Router } from "express";
import prisma from "../db/db.js";

const router = Router();

router.get("/", auth(true), async (req, res) => {
  console.log("req.user:", req.user);
  try {
    const posts = await prisma.post.findMany();
    console.log(posts);
    res.json({ posts: posts });
  } catch (error) {
    console.error("Posts route error:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

router.get("/paginate", auth(true), async (req, res) => {
  try {
    const page = parseInt(String(req.query.page), 10);
    const limit = parseInt(String(req.query.limit), 10);

    const posts = await prisma.post.findMany({
      where: {},
    });
    console.log(posts);
    res.json({ posts: posts });
  } catch (error) {
    console.error("Posts route error:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

//get a post by id
router.get("/:postid", auth(true), async (req, res) => {
  console.log("req.user:", req.user);
  try {
    console.log("Posts route reached successfully");
    const post = await prisma.post.findUnique({
      where: { id: Number(req.params.postid) },
      include: { comments: true, author: true },
    });
    console.log("route reached");
    console.log(post);
    res.json({ post: post });
  } catch (error) {
    console.error("Posts route error:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Test route without auth to check if router is working
router.get("/test", async (req, res) => {
  console.log("Test route reached");
  try {
    console.log("Posts route reached successfully");
    const posts = await prisma.post.findMany();
    console.log("route reached");
    console.log(posts);
    res.json({ posts: posts });
  } catch (error) {
    console.error("Posts route error:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

const postsRouter = router;
export default postsRouter;
