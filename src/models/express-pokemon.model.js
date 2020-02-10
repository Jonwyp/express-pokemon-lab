const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expressPokemonSchema = ({
  id:{
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    unique: true
  },
  japaneseName: String,
  type: String,
  baseHP: Number,
  baseATK: Number,
  baseDEF: Number,
  category: String
})

const ExpressPokemon = mongoose.model("ExpressPokemon", expressPokemonSchema)

module.exports = ExpressPokemon