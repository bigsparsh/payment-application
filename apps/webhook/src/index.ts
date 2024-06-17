import express from "express";
const app = express();
const PORT = 3002;

app.use(express.json());

app.get("/get", async (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT);
