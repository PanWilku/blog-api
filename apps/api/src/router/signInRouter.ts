import { Router } from "express";
import bcrypt from "bcrypt";
import prisma from "../db/db.js";
// @ts-ignore
import { generateToken } from "../../lib/jwt.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Missing credentials" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user);
    return res.json({
      message: "Logged in",
      user: { id: user.id, email: user.email, name: user.name },
      token
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const signInRouter = router;
export default signInRouter;
