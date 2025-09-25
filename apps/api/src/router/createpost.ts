// @ts-ignore
import { auth } from "../../lib/auth.js";
import { Router } from "express";
import prisma from "../db/db.js";

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

const createPostRouter = router;
export default createPostRouter;
