const app = require("../src/app");
const { endPoints } = require("../src/utils/data");
const request = require("supertest");
const Pokemon = require("../src/models/express-pokemon.model");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

jest.mock("jsonwebtoken");

describe("pokemons", () => {
  let mongoServer;
  beforeAll(async () => {
    try {
      mongoServer = new MongoMemoryServer();
      const mongoUri = await mongoServer.getConnectionString();
      await mongoose.connect(mongoUri);
    } catch (err) {
      console.error(err);
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    const pokemonData = [
      {
        id: 1,
        name: "Pikachu",
        japaneseName: "ピカチュウ",
        baseHP: 35,
        category: "Mouse Pokemon"
      },
      {
        id: 2,
        name: "Squirtle",
        japaneseName: "ゼニガメ",
        baseHP: 44,
        category: "Tiny Turtle Pokemon"
      }
    ];
    await Pokemon.create(pokemonData);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await Pokemon.deleteMany();
  });
  it("GET /pokemons should return all pokemon in the database", async () => {
    const pokemonData = [
      {
        id: 1,
        name: "Pikachu",
        japaneseName: "ピカチュウ",
        baseHP: 35,
        category: "Mouse Pokemon"
      },
      {
        id: 2,
        name: "Squirtle",
        japaneseName: "ゼニガメ",
        baseHP: 44,
        category: "Tiny Turtle Pokemon"
      }
    ];
    const { body: actualPokemon } = await request(app).get("/pokemons").expect(200);
    actualPokemon.sort((a, b) => a.id > b.id);
    expect(actualPokemon).toMatchObject(pokemonData);
  });
  it("GET /pokemons?query should return Pikachu when chu is queried", async () => {
    const nameQuery = "chu";
    const expectedPokemon = [
      {
        id: 1,
        name: "Pikachu",
        japaneseName: "ピカチュウ",
        baseHP: 35,
        category: "Mouse Pokemon"
      }
    ];
    const { body: actualPokemon } = await request(app)
      .get(`/pokemons?name=${nameQuery}`)
      .expect(200);
    expect(actualPokemon).toMatchObject(expectedPokemon);
  });
  it("POST /pokemons should add a new pokemon to the database", async () => {
    jwt.verify.mockReturnValueOnce({});
    const newPokemon = {
      id: 3,
      name: "Totodile",
      japaneseName: "ワニノコ",
      type: "Water",
      baseHP: 50,
      baseATK: 65,
      baseDEF: 64,
      category: "Big Jaw Pokémon"
    };
    const response = await request(app)
      .post("/pokemons")
      .set("Cookie", "token=valid-token")
      .send(newPokemon)
      .expect(201);
    expect(response.body).toMatchObject(newPokemon);
  });
  it("GET /pokemons/:id should return pokemon with matching ID", async () => {
    const pokemonId = 2;
    const pokemonData = [
      {
        id: 1,
        name: "Pikachu",
        japaneseName: "ピカチュウ",
        baseHP: 35,
        category: "Mouse Pokemon"
      },
      {
        id: 2,
        name: "Squirtle",
        japaneseName: "ゼニガメ",
        baseHP: 44,
        category: "Tiny Turtle Pokemon"
      }
    ];
    const response = await request(app)
      .get(`/pokemons/${pokemonId}`)
      .expect(200);
    expect(response.body).toMatchObject([pokemonData[1]]);
  });
  it("PUT /pokemons/:id should replace existing pokemon with new pokemon", async () => {
    const pokemonId = 2;
    const newPokemon = {
      id: 2,
      name: "Totodile",
      japaneseName: "ワニノコ",
      type: "Water",
      baseHP: 50,
      baseATK: 65,
      baseDEF: 64,
      category: "Big Jaw Pokémon"
    };
    const { body: actualPokemon } = await request(app)
      .put(`/pokemons/${pokemonId}`)
      .send(newPokemon)
      .expect(200);
    expect(actualPokemon).toMatchObject(newPokemon);
  });
  it("PATCH /pokemons/:id should change name of id: 2 pokemon to Monkey", async () => {
    const nameIsMonkey = { name: "Monkey" };
    const pokemonId = 2;
    const { body: actualPokemon } = await request(app)
      .patch(`/pokemons/${pokemonId}`)
      .send(nameIsMonkey)
      .expect(200);
    expect(actualPokemon.name).toBe(nameIsMonkey.name);
  });
  it("DELETE /pokemons/:id should delete pokemon with id: 2", async () => {
    const pokemonId = 2;
    const expectedPokemon = {
      id: 2,
      name: "Squirtle",
      japaneseName: "ゼニガメ",
      baseHP: 44,
      category: "Tiny Turtle Pokemon"
    };
    const { body: deletedPokemon } = await request(app)
      .delete(`/pokemons/${pokemonId}`)
      .expect(200);
    expect(deletedPokemon).toMatchObject(expectedPokemon);
  });
  it("POST /pokemons if name not provided should return error message in a JSON", async () => {
    jwt.verify.mockReturnValueOnce({});
    const errorPokemon = { id: 4 };
    const response = await request(app)
      .post("/pokemons")
      .send(errorPokemon).set("Cookie","token=valid-token")
      .expect(400);
    expect(response.body).toStrictEqual({
      error: "ExpressPokemon validation failed: name: Path `name` is required."
    });
  });
});
