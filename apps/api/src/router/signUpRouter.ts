import { Router } from "express";
import bcrypt from "bcrypt";
import prisma from "../db/db.js";
// @ts-ignore
import { generateToken } from "../../lib/jwt.js";

const router = Router();

router.post("/", async (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.confirmPassword) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { email, password, confirmPassword, name } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      name,
    },
  });

  //generate a token
  const token = generateToken(user);
  res.json({ token });
});

const signUpRouter = router;
export default signUpRouter;
