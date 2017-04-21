conn = new Mongo();
db = conn.getDB("pokemon");
pokemon = db.pokemon;
pokemon.remove({});

pokemon.insert(
[
  {
    "name": "Pikachu",
    "hp": 23
  },
  {
    "name": "Squirtle",
    "hp": 17
  },
  {
    "name": "Bulbasaur",
    "hp": 14
  },
  {
    "name": "Charmander",
    "hp": 4001
  }
]
);

print("Querying for all characters:")
pokemon.find().forEach(printjson);

pokemon.remove(
  { "name": "Pikachu" }
);
pokemon.remove(
  { "name": "Squirtle" }
);

pokemon.updateMany({}, { $set: { "hp": 9001 } });

print("Querying for remaining characters:")
pokemon.find().forEach(printjson);

print("Querying for one character:")
pokemon.find({"name": "Charmander"}).forEach(printjson);
