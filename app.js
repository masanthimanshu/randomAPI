const express = require("express");
const crypto = require("crypto");
const func = require("./functions");

const port = 3000;
const app = express();

app.use(express.json());

app.get("/read", (req, res) => {
  var obj = func.readData();
  res.json(obj);
});

app.get("/readOne", (req,res) => {
  func.oneField();
  res.send();
})

app.get("/generate", (req,res) => {
  var id = crypto.randomBytes(8).toString("hex");
  res.send(id);
})

app.post("/write", (req, res) => {
  const { key } = req.body;
  const { first } = req.body;
  const { last } = req.body;
  var msg = func.writeData(key, first, last);
  res.json(msg);
});

app.put("/update", (req, res) => {
  const { id } = req.body;
  const { field } = req.body;
  const { data } = req.body;
  func.updateData(id, field, data);
  res.send();
})

app.delete("/delete", (req, res) => {
  const { id } = req.body;
  var msg = func.deleteData(id);
  res.json(msg);
})

app.listen(port, () => {
  console.log(`Active On Port ${port}`);
});
