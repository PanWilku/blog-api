// @ts-ignore
import { auth } from "../../lib/auth.js";
import { Router } from "express";
import prisma from "../db/db.js";

const router = Router();

router.get("/:postid", auth(true), async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: Number(req.params.postid) },
      include: { author: true },
    });
    res.json({ comments: comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:postid", auth(true), async (req, res) => {
  try {
    // get data from the form body
    const { content } = req.body;
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId: Number(req.params.postid),
        authorId: req.user!.id,
      },
      include: { author: true },
    });
    res.status(201).json({ comment: newComment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:commentid", auth(true), async (req, res) => {
  try {
    const { content } = req.body;
    const updatedComment = await prisma.comment.updateMany({
      where: {
        id: Number(req.params.commentid),
        authorId: req.user!.id,
      },
      data: {
        content,
      },
    });
    res.status(200).json({ comment: updatedComment });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:commentid", auth(true), async (req, res) => {
  try {
    const deletedComment = await prisma.comment.deleteMany({
      where: {
        id: Number(req.params.commentid),
        authorId: req.user!.id,
      },
    });
    res.status(200).json({ comment: deletedComment });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const commentRouter = router;
export default commentRouter;
