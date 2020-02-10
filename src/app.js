const express = require("express");
const app = express();
const pokemonRouter = require("./routes/pokemons-routes");

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

app.use((err, req, res, next) => {
  res.status(err.code || 500);
  if(err.code) {
    res.send({error: err.message})
  } else {
    res.send({error: "internal server error"})
  }
})

module.exports = app;
