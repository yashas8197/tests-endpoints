const express = require("express");
const { getShows, getShowById, addShow } = require("./controllers");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

app.get("/shows", async (req, res) => {
  const shows = await getShows();
  res.json({ shows });
});

app.get("/shows/:id", async (req, res) => {
  const show = await getShowById(parseInt(req.params.id));

  if (!show) {
    return res.status(404).json({ error: "no show found" });
  }

  res.status(200).json({ show });
});

app.post("/shows", async (req, res) => {
  const { title, theatreId, time } = req.body;
  if (!title || !theatreId || !time) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const newShow = await addShow(req.body);

  res.status(201).json({ newShow });
});

module.exports = { app };
