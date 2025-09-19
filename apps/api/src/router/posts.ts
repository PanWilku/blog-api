// @ts-ignore
import { auth } from "../../lib/auth.js";
import { Router } from "express";
import prisma from "../db/db.js";

const router = Router();

//get all posts endpoint
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

//get a post by id
router.get("/:postid", auth(true), async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(req.params.postid) },
      //include the authors of the comments
      include: { comments: { include: { author: true } }, author: true },
    });
    console.log(post);
    res.json({ post: post });
  } catch (error) {
    console.error("Posts route error:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

const postsRouter = router;
export default postsRouter;
