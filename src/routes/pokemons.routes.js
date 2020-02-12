const express = require("express");
const router = express.Router();
const ExpressPokemon = require("../models/express-pokemon.model");
const {protectRoute} = require("../middlewares/auth");
const wrapAsync = require("../utils/wrapAsync.js");

const filterById = async idNumber =>
  await ExpressPokemon.find({ id: idNumber });

const filterByName = async name => {
  const regex = new RegExp(name, "gi");
  const filteredPokemons = await ExpressPokemon.find({ name: regex });
  return filteredPokemons;
};

const displayAllPokemons = async () => {
  const allPokemons = await ExpressPokemon.find();
  return allPokemons;
};

const createOnePokemon = async pokemon => {
  const doc = new ExpressPokemon(pokemon);
  await ExpressPokemon.init();
  await doc.save();
};

router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    const result = !!req.query.name
      ? await filterByName(req.query.name)
      : await displayAllPokemons();
    res.status(200).send(result);
  })
);

router.post(
  "/", protectRoute,
  wrapAsync(async (req, res, next) => {
    const pokemon = req.body;
    await createOnePokemon(pokemon);
    res.status(201).send(pokemon);
  })
);

router.get("/:id", async (req, res, done) => {
  const pokemonId = String(req.params.id);
  const foundPokemon = await filterById(pokemonId);
  res.status(200).send(foundPokemon);
  done();
});

router.put("/:id", async (req, res, done) => {
  const pokemonId = String(req.params.id);
  const newPokemon = req.body;
  const foundPokemon = await ExpressPokemon.findOneAndReplace(
    { id: pokemonId },
    newPokemon,
    { new: true }
  );
  res.status(200).send(foundPokemon);
  done();
});

router.patch("/:id", async (req, res, done) => {
  const pokemonId = String(req.params.id);
  const newPokemon = req.body;
  const foundPokemon = await ExpressPokemon.findOneAndUpdate(
    { id: pokemonId },
    newPokemon,
    { new: true }
  );
  res.status(200).send(foundPokemon);
  done();
});

router.delete("/:id", async (req, res, done) => {
  const pokemonId = String(req.params.id);
  const deletedPokemon = await ExpressPokemon.findOneAndRemove({
    id: pokemonId
  });
  res.status(200).send(deletedPokemon);
  done();
});

router.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    err.statusCode = 400;
  }
  next(err);
});

module.exports = router;
