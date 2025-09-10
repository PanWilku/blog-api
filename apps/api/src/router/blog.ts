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

    res.json({ message: "This is a protected blog route" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


const blogRouter = router;
export default blogRouter;
