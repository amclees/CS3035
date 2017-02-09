/*
Notes about naming:
Challenges are made using "Event"
Walls are marked by the "passable" boolean
The 8x8 matrix is named "map"
Prizes are in "player.inventory"
Start is the empty spot where the player is put at the beginning
End is the boss fight event. Game will automatically end after this fight is completed. Boss fight is sufficiently difficult to require player to explore.
*/

mapWidth = 3;
mapHeight = 3;
var gameOver = false;

var displayParent = document.getElementById("optional-container");
if(!displayParent) {
  displayParent = document.body;
}
var combatLog = document.getElementById("combat-log");
if(!combatLog) {
  console.log("Please connect a combat-log id-ed div");
}

var Combat = {
  log: function(entry) {
    var line = document.createElement("p");
    line.innerText = entry;
    combatLog.appendChild(line);
  }
}

var Dice = {
  d20: function(number) {
    return 1 + Math.floor(Math.random() * 20);
  },
  d6: function(number) {
    return 1 + Math.floor(Math.random() * 6);
  }
};

var events = getEvents();

var playerName;
do {
  playerName = prompt("Please enter your player's name.");
  if(playerName === null) {
    playerName = "Player";
    break;
  }
} while(!playerName);

var player = new Player(playerName, 15, 10);

var map = [];
for(var i = 0; i < mapWidth; i++) {
  map[i] = [];
  for(var j = 0; j < mapHeight; j++) {
    map[i].push({ event: null, explored: false, passable: true });
  }
}

if(map.length * map[0].length < events.length + 10) {
  console.log("Insufficient map size to host events. Please try a bigger map.");
}

while(events.length != 0) {
  var event = events.pop();
  while(true) {
    var x = Math.round(Math.random() * (mapWidth - 1));
    var y = Math.round(Math.random() * (mapHeight - 1));
    console.log([x,y]);
    if(map[x][y].event === null) {
      map[x][y].event = event;
      console.log(event.name + " at " + x + ", " + y);
      break;
    }
  }
}

while(true) {
  var x = Math.round(Math.random() * (mapWidth - 1));
  var y = Math.round(Math.random() * (mapHeight - 1));

  if(map[x][y].event === null) {
    player.x = x;
    player.y = y;
    map[x][y].explored = true;
    break;
  }
}

//Only one wall
while(true) {
  var x = Math.round(Math.random() * (mapWidth - 1));
  var y = Math.round(Math.random() * (mapHeight - 1));

  if(map[x][y].event === null && player.x != x && player.y != y) {
    map[x][y].passable = false;
    console.log("Wall at " + x + ", " + y);
    break;
  }

}

display();

function round() {
  if(gameOver) return;
  var move;
  do {
    var moveText = "Please enter your move. Enter: \n  \"n\" to go north \n  \"s\" to go south \n  \"e\" to go east \n  \"w\" to go west";
    move = prompt(moveText);
    if(move === null) return;
  } while((!move) || !(move === "n" || move === "s" || move === "e" || move === "w"));

  var destMap = {
    "n": { x: player.x, y: player.y - 1 },
    "s": { x: player.x, y: player.y + 1 },
    "e": { x: player.x + 1, y: player.y },
    "w": { x: player.x - 1, y: player.y },
  }
  var dest = destMap[move];
  if((dest.x < 0) || (dest.y < 0) || (dest.x > mapWidth - 1) || (dest.y > mapHeight - 1)) {
    round();
    return;
  }
  
  var destTile = map[dest.x][dest.y];
  if(!destTile.passable) {
    destTile.explored = true;
    alert("Upon entering the area, you see a small wall. Beyond the wall is a large, empty area. The wall is only 4 feet, something you could easily scale, but you somehow feel that you cannot cross it.");
    if(confirm("Would you like to try crossing the small wall?")) {
      alert("Upon closer examination, you find that the wall has a very odd texture. Even above the wall, this same texture persists. It feels almost like an enourmous amount of large shields were connected together. For some reason however, you cannot seem to see them nor anything behind them.");
      var quiz = prompt("If you could choose one word to describe the behavior of these tower shields, what would it be?");
      if(quiz.trim().toLowerCase() === "broken") {
        alert("When the word broken comes to your mind, you glance at your hand and notice it is invisible.");
        player.ac += 10;
      } else {
        alert("Why would a word you think of be important? You return to where you were before you visited the wall.");
      }
    } else {
      player.ac -= 4;
      alert("Your lack of curiosity makes you more susceptible to your enemies. You might have been able to dodge before, but now you are simply a slug.");
      var slugImg = document.createElement("img");
      slugImg.src = "https://cdn.psychologytoday.com/sites/default/files/field_blog_entry_images/slug_0.jpg";
      slugImg.alt = "slug";
      slugImg.width = 300;
      slugImg.height = 150;
      var desc = document.createElement("p");
      desc.innerText = "You became a ";
      combatLog.appendChild(desc);
      combatLog.appendChild(slugImg);
    }
    Combat.log("Player runs into a wall at (" + dest.x + ", " + dest.y + ") and has to turn back.");
    display();
    return;
  }
  if(destTile.event) {
    if(!confirm("You have a feeling the area ahead might contain something interesting. Would you like to proceed?")) return;
    destTile.event.run();
    if(!destTile.event.done) {
      destTile.explored = true;
      Combat.log("Player runs into enemies at (" + dest.x + ", " + dest.y + ") and flees.");
      return;
    }
  }

  player.x = dest.x;
  player.y = dest.y;
  destTile.explored = true;
  Combat.log("Player successfully moves to (" + player.x + ", " + player.y + ") with " + player.hp + " HP.");

  display();
}

function getEvents() {
  var events = [];

  var muramasa = new Event("Muramasa", 
    "You find an old wooden chest rotting away. Inside, you find a pristine katana made of a dark colored metal with an inscription written in a language unknown to you.");
  muramasa.run = function() {
    alert(muramasa.text);
    if(confirm("Would you like to wield the katana?")) {
      player.damage += 4;
      player.attack += 6;
      player.inventory.push("Muramasa");
      alert("The katana's balance feels perfect. You are certain you will be able to take on tougher enemies with this.");
      Combat.log("Player obtains Muramasa.");
      if(confirm("Would you like to test the sharpness with your finger?")) {
        player.hp -= 2;
        if(player.hp < 0) {
          alert("You were so close to death that a small cut killed you.");
          var deathMessage = document.createElement("h2");
          deathMessage.style.color = "#3366ff";
          deathMessage.innerText = "You died by touching a katana with your finger.";
          displayParent.appendChild(deathMessage);
          Combat.log("Player died from 2 damage by idiotically touching a legendary sword.");
          gameOver = true;
        } else {
          alert("The katana is sharp enough that you cut deeper than planned, reaching the bone of your finger.");
        }
      } 
    } else {
      alert("Reluctantly, you leave what could have made an excellent weapon in the chest.");
    }
    this.done = true;
  };
  events.push(muramasa);

  var cobraReward = function() {
    alert("Inside the cabin, you find a vial filled with a murky liquid labeled \"health serum.\"")
    if(confirm("Would you like to drink the liquid?")) {
      player.hp += 150;
      alert("You feel reinvigorated.");
      Combat.log("Player drinks health serum.");
    } else {
      alert("Drinking a strange liquid is probably not a good idea, so you leave without drinking it.");
    }
  };
  var cobra = new CombatEvent("Iron Cobra", 
    "You encounter an Iron Cobra outside a small log cabin. It is a 7 foot long cobra made entirely of iron except for an enchanted core created by an artifacer. They usually are created to guard valuables.",
    [(new Character("Iron Cobra", 27, 16, 11, 3))],
    cobraReward
  );
  events.push(cobra);

  var knightReward = function() {
    if(confirm("Would you like to take the knight's prized armor?")) {
      player.ac += 9;
      alert("Now you should be much harder to damage.");
      Combat.log("Player equips adamantium full-plate.");
    } else {
      alert("Why would you pass up some good armor? In any case, you leave with nothing.");
    }
  };
  var knight = new CombatEvent("Knight", 
    "You encounter a knight who proclaims that he is invincible due to his adamantium armor. He draws his sword and attacks.",
    [(new Character("Knight", 20, 19, 4, 4))],
    knightReward
  );
  events.push(knight);

  return events;
}

function Player(name, hp, ac) {
  return {
    "name": name,
    "hp": hp,
    "ac": ac,
    "attack": 0,
    "damage": 0,
    "x": null,
    "y": null,
    inventory: [],

    attackRoll: function() {
      return Dice.d20() + this.attack;
    },

    damageRoll: function() {
      return Dice.d6() + this.damage;
    }
  };
};

function Event(name, text) {
  return {
    "name": name,
    "text": text,
    done: false,

    run: function() {
      done = true;
      return;
    }
  }
};

//Note this function is for NPCs only
function Character(name, hp, ac, attack, damage) {
  return {
    "name": name,
    "hp": hp,
    "ac": ac,
    "attack": attack,
    "damage": damage,

    attackRoll: function() {
      return Dice.d20() + this.attack;
    },

    damageRoll: function() {
      return Dice.d6() + this.damage;
    }
  }
}

function CombatEvent(name, text, characters, end) {
  var combatEvent = new Event(name, text);

  combatEvent.run = function() {
    alert(text);

    while(characters.length != 0) {
      var statusAlert = "You have " + player.hp + " HP left. Your enemies are:\n";
      for(var i = 0; i < characters.length; i++) {
        var character = characters[i];
        statusAlert += character.name + " with " + character.hp + " HP left.\n";
      }
      alert(statusAlert);

      if(confirm("Would you like to run away?")) {
        alert("You run away.");
        return;
      }

      for(var i = 0; i < characters.length; i++) {
        var character = characters[i];
        var attackRoll = character.attackRoll();
        if(attackRoll >= player.ac) {
          var damageRoll = character.damageRoll();
          player.hp -= damageRoll;
          Combat.log(player.name + " takes " + damageRoll + " damage from " + character.name + ", leaving " + player.hp + " HP left.");
        } else {
          Combat.log(character.name + " fails to hit " + player.name);
        }
      }

      var attackRoll = player.attackRoll();
      var character = characters[0];
      if(attackRoll >= character.ac) {
        var damageRoll = player.damageRoll();
        character.hp -= damageRoll;
        Combat.log(character.name + " takes " + damageRoll + " damage from " + player.name + ", leaving " + character.hp + " HP left.");
      } else {
        Combat.log(player.name + " fails to hit " + character.name);
      }

      if(character.hp <= 0) {
        Combat.log(character.name + " is defeated.");
        characters.splice(0, 1);
      }
    }

    this.done = true;
    alert("You win the battle.");
    Combat.log("Player wins battle.");
    end();
  };

  return combatEvent;
}

function display() {
  var inventoryContainer = document.getElementById("inventory-list");
  if(!inventoryContainer) {
    console.log("No Inventory Container in HTML.");
    return;
  }
  inventoryContainer.innerHTML = "";
  var li = document.createElement("li");
  li.innerHTML = "You have " + player.inventory.length + " item" + (player.inventory.length === 1 ? "" : "s") + ".";
  inventoryContainer.appendChild(li);
  for(var i = 0; i < player.inventory.length; i++) {
    var li = document.createElement("li");
    li.innerHTML = player.inventory[i];
    inventoryContainer.appendChild(li);
  }     

  var table = document.getElementById("map-table");
  if(table) {
    table.innerHTML = "";
  } else {
    table = document.createElement("table");
    table.id = "map-table";

    displayParent.appendChild(table);
  }

  for(var i = 0; i < mapWidth; i++) {
    var row = document.createElement("tr");
    for(var j = 0; j < mapHeight; j++) {
      var mapCell = map[j][i];

      var displayCell = document.createElement("td");
      if(player.x === j && player.y === i) {
        displayCell.innerText = player.name;
      } else if(mapCell.explored === true) {
        if(mapCell.event) {
          displayCell.innerHTML = mapCell.event.name;
        } else if(!mapCell.passable) {
          displayCell.innerHTML = "Wall";
        } else {
          displayCell.innerHTML = "Empty";
        }
      } else {
        displayCell.innerHTML = "Unknown";
      }

      row.appendChild(displayCell);
    }
    table.appendChild(row);
  }
}
