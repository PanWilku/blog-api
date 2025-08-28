import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors({ origin: process.env.FRONTEND_URL }));



app.get("/", (_req, res) => {
    res.json({ message: "Hello from the API" });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
