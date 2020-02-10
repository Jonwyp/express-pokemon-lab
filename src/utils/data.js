const endPoints = {
  "0": "GET    /",
  "1": "GET   /pokemons",
  "2": "GET   /pokemons?name=pokemonNameNotExact",
  "3": "POST    /pokemons",
  "4": "GET /pokemons/:id",
  "5": "PUT /pokemons/:id",
  "6": "PATCH /pokemons/:id",
  "7": "DELETE /pokemons/:id"
}

const pokemons = [
  {
    id: 1,
    name: "Chikorita",
    japaneseName: "チコリータ",
    type: "Grass",
    baseHP: 45,
    baseATK: 49,
    baseDEF: 65,
    category: "Leaf Pokémon"
  },
  {
    id: 2,
    name: "Cyndaquil",
    japaneseName: "ヒノアラシ",
    type: "Fire",
    baseHP: 39,
    baseATK: 52,
    baseDEF: 43,
    category: "Fire Mouse Pokémon"
  },
  {
    id: 3,
    name: "Totodile",
    japaneseName: "ワニノコ",
    type: "Water",
    baseHP: 50,
    baseATK: 65,
    baseDEF: 64,
    category: "Big Jaw Pokémon"
  },
  {
    id: 4,
    name: "Pikachu",
    japaneseName: "ピカチュウ",
    type: "Electric",
    baseHP: 35,
    baseATK: 55,
    baseDEF: 40,
    category: "Mouse Pokémon"
  }
];

module.exports = {endPoints, pokemons}