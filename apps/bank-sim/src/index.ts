import express from "express";
const app = express();
const PORT = 3001;

app.use(express.json());
app.post("/hdfc/resolve-on-ramp", async (req, res) => {
  const body = req.body;
  console.log("body", body);
  res.send("Hello World!");
});
app.listen(PORT);
