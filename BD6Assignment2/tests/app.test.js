const request = require("supertest");
const http = require("http");
const {
  getAllStocks,
  getStockByTicker,
  addTrade,
} = require("../controllers/index");
const { app } = require("../index");

jest.mock("../controllers", () => ({
  ...jest.requireActual("../controllers"),
  getAllStocks: jest.fn(),
  getStockByTicker: jest.fn(),
  addTrade: jest.fn(),
}));

let server;
beforeAll(async () => {
  server = http.createServer(app);
  server.listen(3001);
});

afterAll(async () => {
  server.close();
});

describe("API Endpoints tests", () => {
  it("GET /stocks returns all the stocks", async () => {
    const mocksStocks = [
      { stockId: 1, ticker: "AAPL", companyName: "Apple Inc.", price: 150.75 },
      {
        stockId: 2,
        ticker: "GOOGL",
        companyName: "Alphabet Inc.",
        price: 2750.1,
      },
      { stockId: 3, ticker: "TSLA", companyName: "Tesla, Inc.", price: 695.5 },
    ];

    getAllStocks.mockResolvedValue(mocksStocks);

    const response = await request(server).get("/stocks");
    expect(response.body.stocks).toEqual(mocksStocks);
    expect(response.body.stocks.length).toBe(3);
    expect(response.status).toBe(200);
  });

  it("GET /stocks/:ticker retrieves a specific stock by ticker symbol", async () => {
    const mocksStock = {
      stockId: 1,
      ticker: "AAPL",
      companyName: "Apple Inc.",
      price: 150.75,
    };

    getStockByTicker.mockResolvedValue(mocksStock);

    const response = await request(server).get("/stocks/AAPL");
    expect(response.body.stock).toEqual(mocksStock);
    expect(response.status).toBe(200);
  });

  it("POST /trades/new adds a new trade with valid input", async () => {
    const mocksTrade = {
      tradeId: 4,
      stockId: 1,
      quantity: 10,
      tradeType: "buy",
      tradeDate: "2024-08-07",
    };

    addTrade.mockResolvedValue(mocksTrade);

    const response = await request(server).post("/trades/new").send(mocksTrade);
    expect(response.body.newStock).toEqual(mocksTrade);
    expect(response.status).toBe(201);
  });

  it("POST /trades/new adds a new trade with valid input", async () => {
    const invalidTrade = {
      stockId: 1,
      tradeType: "buy",
      tradeDate: "2024-08-07",
    };

    const response = await request(server)
      .post("/trades/new")
      .send(invalidTrade);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("All fields are required");
  });

  it("GET /stocks/:ticker  returns a 404 status code", async () => {
    getStockByTicker.mockResolvedValue(undefined);
    const response = await request(server).get("/stocks/KEB");
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("no Stock found");
  });
});

describe("controllers function tests", () => {
  it("getAllStocks return all stocks", () => {
    const mocksStocks = [
      { stockId: 1, ticker: "AAPL", companyName: "Apple Inc.", price: 150.75 },
      {
        stockId: 2,
        ticker: "GOOGL",
        companyName: "Alphabet Inc.",
        price: 2750.1,
      },
      { stockId: 3, ticker: "TSLA", companyName: "Tesla, Inc.", price: 695.5 },
    ];

    getAllStocks.mockReturnValue(mocksStocks);

    const result = getAllStocks();
    expect(result).toEqual(mocksStocks);
    expect(result.length).toBe(3);
  });

  it("addTrade return new trade", async () => {
    const mocksTrade = {
      tradeId: 4,
      stockId: 1,
      quantity: 10,
      tradeType: "buy",
      tradeDate: "2024-08-07",
    };

    const response = await addTrade(mocksTrade);
    expect(response).toEqual(mocksTrade);
  });
});
