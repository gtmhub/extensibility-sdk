import express from "express";
import path from "path";
import cors from "cors";

const app = express();
const file = (fileName) => path.join(__dirname, `/dist/${fileName}`);

app.get("/", (req, res) => {
  res.sendFile(file("index.js"));
});

const port = 4000;
app.use(cors());
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
