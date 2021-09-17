console.log("server");
import express from "express";
import path from "path";

const app = express();
const file = (fileName) => path.join(__dirname, `/dist/${fileName}`);

app.get("/", (req, res) => {
  res.sendFile(file("main.js"));
});

const port = 4000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
