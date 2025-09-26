// @ts-ignore
import { auth } from "../../lib/auth.js";
import { Router } from "express";
import prisma from "../db/db.js"; // Changed .ts to .js

const router = Router();

router.post("/createpost", auth(true), async (req, res) => {
  try {
    const { title, content, published } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });
    if (user!.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        published,
        author: {
          connect: { id: user!.id },
        },
      },
    });

    return res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/publish/:postid", auth(true), async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });
    if (user!.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.postid) },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: post.id },
      data: { published: true },
    });

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error publishing post:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/unpublish/:postid", auth(true), async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });
    if (user!.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.postid) },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: post.id },
      data: { published: false },
    });

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error unpublishing post:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/deletepost/:postid", auth(true), async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });
    if (user!.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.postid) },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    await prisma.post.delete({
      where: { id: post.id },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const adminRouter = router;
export default adminRouter;
