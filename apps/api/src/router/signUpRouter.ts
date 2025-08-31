import { Router } from "express";
import bcrypt from "bcrypt"
import prisma from "../db/db.js";

const router = Router();

router.post("/", async (req, res) => {

    console.log("Hello from post!!!")

    if(req.body) {
    await prisma.user.findUnique({
        where: {
            email: req.body.email
        }
    })
    console.log("db connection!")
    }


    const { email, password, confirmPassword} = req.body;

    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
    } else if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 11);


    console.log(req.body);
    res.json({ message: "User signed up" });
});

const signUpRouter = router;
export default signUpRouter;
