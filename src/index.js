import express from "express";
import { matchRouter } from "./routes/matches.js";

const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Sportz server");
});

app.use("/matches", matchRouter);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}/`);
});
