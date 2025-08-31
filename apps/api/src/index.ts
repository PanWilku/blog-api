import "dotenv/config"
import express from "express";
import cors from "cors";
import signUpRouter from "./router/signUpRouter";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: process.env.FRONTEND_URL }));



app.get("/", (_req, res) => {
    res.json({ message: "Hello from the API" });
});

app.use("/sign-up", signUpRouter);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
