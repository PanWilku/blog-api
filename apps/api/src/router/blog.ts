import { Router, Request } from "express";
import bcrypt from "bcrypt";
import prisma from "../db/db.js";
// @ts-ignore
import { generateToken } from "../../lib/jwt.js";
// @ts-ignore
import { auth } from "../../lib/auth.js";

const router = Router();

router.get("/", auth(true), async (req, res) => {
  try {
    // Debug: Log the user object to see its structure
    console.log("req.user:", req.user);

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "This is a protected blog route",
      user: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const blogRouter = router;
export default blogRouter;
