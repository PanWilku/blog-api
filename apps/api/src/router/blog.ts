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
    const params = req.query;
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    const totalPostsCount = await prisma.post.count();

    const posts = await prisma.post.findMany({
      where: {
        //9 last posts
        published: true,
      },
      skip:
        ((params.page ? parseInt(params.page as string) : 1) - 1) *
        (params.limit ? parseInt(params.limit as string) : 10),
      take: params.limit ? parseInt(params.limit as string) : 10,
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
      orderBy: { id: "desc" },
    });

    console.log(totalPostsCount);

    res.json({
      user: user,
      posts: posts,
      totalPostsCount: totalPostsCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog data" });
  }
});

const blogRouter = router;
export default blogRouter;
