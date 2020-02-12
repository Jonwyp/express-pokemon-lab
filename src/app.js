const express = require("express");
const app = express();
const pokemonRouter = require("./routes/pokemons.routes");
const cookieParser = require("cookie-parser");
const trainerRouter = require("./routes/trainers.route");

// const corsOptions = {
//   credentials: true,
//   allowedHeaders: "content-type",
//   origin: "http://localhost:3001",
// };

// app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    "0": "GET    /",
    "1": "GET   /pokemons",
    "2": "GET   /pokemons?name=pokemonNameNotExact",
    "3": "POST    /pokemons",
    "4": "GET /pokemons/:id",
    "5": "PUT /pokemons/:id",
    "6": "PATCH /pokemons/:id",
    "7": "DELETE /pokemons/:id"
  });
});

app.use("/pokemons", pokemonRouter);

app.use("/trainers", trainerRouter);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  if (err.statusCode) {
    res.send({ error: err.message });
  } else {
    res.send({ error: "internal server error" });
  }
});

module.exports = app;
