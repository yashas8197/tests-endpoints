const express = require("express");
const cors = require("cors");
const app = express();
const {
  getAllStocks,
  getStockByTicker,
  addTrade,
} = require("./controllers/index");

app.use(express.json());
app.use(cors());

app.get("/stocks", async (req, res) => {
  const stocks = await getAllStocks();
  res.json({ stocks });
});

app.get("/stocks/:ticker", async (req, res) => {
  const stock = await getStockByTicker(req.params.ticker);
  if (!stock) {
    return res.status(404).json({ error: "no Stock found" });
  }
  res.json({ stock });
});

app.post("/trades/new", async (req, res) => {
  const { stockId, quantity, tradeType, tradeDate } = req.body;
  if (!stockId || !quantity || !tradeType || !tradeDate) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const newStock = await addTrade(req.body);
  res.status(201).json({ newStock });
});

module.exports = { app };
