import { Router } from "express";
import bcrypt from "bcrypt";
import prisma from "../db/db.js";
// @ts-ignore
import { generateToken } from "../../lib/jwt.js";
// @ts-ignore
import { auth } from "../../lib/auth.js";

const router = Router();

router.get("/", auth(true), async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      user: user,
      posts: posts,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog data" });
  }
});

const blogRouter = router;
export default blogRouter;
