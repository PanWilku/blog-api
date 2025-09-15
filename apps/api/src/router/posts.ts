// @ts-ignore
import { auth } from "../../lib/auth.js";
import { Router } from "express";
import prisma from "../db/db.js";

const router = Router();

router.get("/", auth(true), async (req, res) => {
  console.log("req.user:", req.user);
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
