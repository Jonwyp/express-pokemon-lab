const app = require("./app");
const ExpressPokemon = require("./models/express-pokemon.model");
require("./utils/db");

const PORT = 3000;


app.listen(PORT, () => {
  console.log(`Server is running on http:localhost:${PORT}.`);
});
