import express from "express";
const app = express();
const PORT = 3002;

app.use(express.json());

app.post("/", async (req, res) => {
  console.log(await req.body);
  res.send("Hello World");
});

app.listen(PORT);
