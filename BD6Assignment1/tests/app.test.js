const request = require("supertest");
const http = require("http");
const { getShows, getShowById, addShow } = require("../controllers/index");
const { app } = require("../index");

jest.mock("../controllers", () => ({
  ...jest.requireActual("../controllers"),
  getShows: jest.fn(),
  getShowById: jest.fn(),
  addShow: jest.fn(),
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
  it("GET /shows should return all the shows", async () => {
    const mockShow = [
      { showId: 1, title: "The Lion King", theatreId: 1, time: "7:00 PM" },
      { showId: 2, title: "Hamilton", theatreId: 2, time: "8:00 PM" },
      { showId: 3, title: "Wicked", theatreId: 3, time: "9:00 PM" },
      { showId: 4, title: "Les Misérables", theatreId: 1, time: "6:00 PM" },
    ];

    getShows.mockResolvedValue(mockShow);

    const response = await request(server).get("/shows");
    expect(response.body.shows).toEqual(mockShow);
    expect(response.status).toBe(200);
    expect(response.body.shows.length).toEqual(4);
  });

  it("GET /shows/:id should return specific id from the shows", async () => {
    const mockShow = {
      showId: 1,
      title: "The Lion King",
      theatreId: 1,
      time: "7:00 PM",
    };

    getShowById.mockResolvedValue(mockShow);

    const response = await request(server).get("/shows/1");
    expect(response.body.show).toEqual(mockShow);
    expect(response.status).toBe(200);
  });

  it("POST /shows should return new show", async () => {
    const mockShow = {
      showId: 5,
      title: "ABCD",
      theatreId: 1,
      time: "7:00 PM",
    };

    addShow.mockResolvedValue(mockShow);

    const response = await request(server).post("/shows").send(mockShow);
    expect(response.body.newShow).toEqual(mockShow);
    expect(response.status).toBe(201);
  });

  it("POST /shows should return 400 for invalid show", async () => {
    const invalidShow = {
      title: "",
      theatreId: 1,
      time: "7:00 PM",
    };

    const response = await request(server).post("/shows").send(invalidShow);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("All fields are required");
  });

  it("GET /shows/:id should return 404 for non-exsisting show", async () => {
    getShowById.mockResolvedValue(undefined);

    const response = await request(server).get("/shows/111");
    expect(response.body.show).toEqual(undefined);
    expect(response.body.error).toEqual("no show found");
    expect(response.status).toBe(404);
  });
});

describe("controllers function tests", () => {
  it("GET /shows return all the shows", () => {
    const mockShows = [
      { showId: 1, title: "The Lion King", theatreId: 1, time: "7:00 PM" },
      { showId: 2, title: "Hamilton", theatreId: 2, time: "8:00 PM" },
      { showId: 3, title: "Wicked", theatreId: 3, time: "9:00 PM" },
      { showId: 4, title: "Les Misérables", theatreId: 1, time: "6:00 PM" },
    ];

    getShows.mockReturnValue(mockShows);

    const response = getShows();
    expect(response).toEqual(mockShows);
    expect(response.length).toBe(4);
  });

  it("POST /shows should return the new show", async () => {
    const mockShow = {
      showId: 5,
      title: "ABCD",
      theatreId: 1,
      time: "7:00 PM",
    };

    addShow.mockResolvedValue(mockShow);

    const response = await addShow(mockShow);
    expect(response).toEqual(mockShow);
  });
});
