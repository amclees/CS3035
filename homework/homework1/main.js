/*
Notes about naming:
Challenges are made using "Event(name, text)" and its extender versions CombatEvent and HealingEvent
Walls are marked by the "passable" boolean
The 8x8 matrix is named "map"
Prizes are in "player.inventory"
Start is the empty spot where the player is put at the beginning
End is the boss fight event. Game will automatically end after this fight is completed. Boss fight is sufficiently difficult to require player to explore.
unusedStringIndicatingTypeForPositions is used to fulfill the requirement. The long name is to ensure it is not mistaken for a used variable.
*/
document.body.innerHTML = "";

var mapWidth = 8;
var mapHeight = 8;
var gameOver = false;
var allDiscovered = true;
var wallDone = false;
var numberOfWalls = 16;
var playerBaseHp = 25;
var playerBaseAc = 12;

document.title = "Text Adventure";

var head = document.getElementsByTagName("head")[0];

var bootstrapLink = document.createElement("link");
bootstrapLink.rel = "stylesheet";
bootstrapLink.href = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
bootstrapLink.type = "text/css";
bootstrapLink.media = 'all';
head.appendChild(bootstrapLink);

var styles = "td {padding: 12px;text-align: center;}#combat-log {overflow: scroll;height: 150px;width: 700px;}.player {background-color: #22FF66;}.unknown {background-color: black;color: white;}.event {background-color: #3333FF;color: white;}.done {background-color: #FFFF00;}.red {color: red;}";
var styleElement = document.createElement("style");
styleElement.innerHTML = styles;
head.appendChild(styleElement);

var displayParent = document.createElement("div");
displayParent.classList.add("container");

var title = document.createElement("h3");
title.innerText = "Text Adventure";
displayParent.appendChild(title);

var intro = document.createElement("p");
intro.innerText = "Welcome. Your goal is to find Oboro, the \"Messenger of the Heavens,\" and remove him from this world.";
displayParent.appendChild(intro);

var button = document.createElement("button");
button.classList.add("btn");
button.classList.add("btn-success");
button.innerText = "Next Round";
button.onclick = function() { round(); };
displayParent.appendChild(button);

var keyShortcutLabel = document.createElement("p");
keyShortcutLabel.innerText = "You can also press spacebar to continue to the next round. You can also use the arrow keys or WASD to move instead of typing your move into a prompt.";
displayParent.appendChild(keyShortcutLabel);

var combatHeader = document.createElement("h4");
combatHeader.innerText = "Play Log";
displayParent.appendChild(combatHeader);

var combatLog = document.createElement("div");
combatLog.id = "combat-log";
displayParent.appendChild(combatLog);

var hpDisplay = document.createElement("h4");
hpDisplay.id = "hp-display";
displayParent.appendChild(hpDisplay);

var mapHeader = document.createElement("h4");
mapHeader.innerText = "Map";
displayParent.appendChild(mapHeader);

var table = document.createElement("table");
table.id = "map-table";
table.className += "table table-bordered";
displayParent.appendChild(table);

var inventoryHeader = document.createElement("h4");
inventoryHeader.innerText = "Inventory";
displayParent.appendChild(inventoryHeader);

var inventoryList = document.createElement("ul");
inventoryList.id = "inventory-list";
displayParent.appendChild(inventoryList);

document.body.appendChild(displayParent);


var Combat = {
  log: function(entry, className) {
    var line = document.createElement("p");
    line.innerText = entry;
    if(className) {
      line.className = className;
    }
    combatLog.appendChild(line);
    
    combatLog.scrollTop = line.offsetTop;
  }
};

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
} while(!playerName || playerName.trim() === "");

var player = new Player(playerName, playerBaseHp, playerBaseAc);

var map = [];
for(var i = 0; i < mapWidth; i++) {
  map[i] = [];
  for(var j = 0; j < mapHeight; j++) {
    map[i].push({ event: null, explored: allDiscovered, passable: true, unusedStringIndicatingTypeForPositions: "Empty" });
  }
}

if(map.length * map[0].length < events.length + 10) {
  console.log("Insufficient map size to host events. Please try a bigger map.");
}

var desiredEvents = (mapWidth * mapHeight) / 4;
var healingEvents = desiredEvents - events.length;
for(var i = 0; i < healingEvents; i++) {
  events.push(new HealingEvent());
} 

while(events.length != 0) {
  var event = events.pop();
  while(true) {
    var x = Math.round(Math.random() * (mapWidth - 1));
    var y = Math.round(Math.random() * (mapHeight - 1));
    if(map[x][y].event === null) {
      map[x][y].event = event;
      map[x][y].unusedStringIndicatingTypeForPositions = "E";
      if(event.name === "Oboro") map[x][y].unusedStringIndicatingTypeForPositions = "G";
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
    map[x][y].unusedStringIndicatingTypeForPositions = "S";
    break;
  }
}

for(var i = 0; i < numberOfWalls; i++) {
  var maxTries = 85;
  var tries = 0;
  while(true) {
    if(!(++tries < maxTries)) {
      console.log("Passed maxTries for wall placement.");
      break;
    }
    var x = Math.round(Math.random() * (mapWidth - 1));
    var y = Math.round(Math.random() * (mapHeight - 1));

    if(map[x][y].event === null && player.x != x && player.y != y) {
      var skip = false;
      var wallCount = 0;
      var eventCount = 0;
      for(var r = x - 1; r <= x + 1; r++) {
        for(var j = y - 1; j <= y + 1; j++) {
          //console.log("Running r/x " + r + " and j/y" + j);
          try {
            //console.log("Skip " + !map[r][j].passable + " for " + " (" + r + ", " + j + ") at (" + x + ", " + y + ")");
            if(!map[r][j].passable) {
              wallCount++;
            }
            if(map[r][j].event) {
              eventCount++;
            }
          } catch(error) { wallCount += 0.5 }
        }
      }
      if((wallCount > 3) || (wallCount > 1 && eventCount > 0)) {
        skip = true;
      }
      if(skip) {
        //console.log("Skipped placement of wall at " + x + ", " + y);
        continue;
      }

      map[x][y].passable = false;
      map[x][y].unusedStringIndicatingTypeForPositions = "W";
      console.log("Wall at " + x + ", " + y);
      break;
    }
  }
}

display();

function round(presetMove) {
  if(gameOver) return;
  var move;
  if(presetMove) {
    move = presetMove;
  } else {
    do {
      var moveText = "Please enter your move. Enter: \n  \"n\" to go north \n  \"s\" to go south \n  \"e\" to go east \n  \"w\" to go west";
      move = prompt(moveText);
      if(move === null) return;
      move = move.toLowerCase().trim();
    } while((!move) || !(move === "n" || move === "s" || move === "e" || move === "w"));
  }

  var destMap = {
    "n": { x: player.x, y: player.y - 1 },
    "s": { x: player.x, y: player.y + 1 },
    "e": { x: player.x + 1, y: player.y },
    "w": { x: player.x - 1, y: player.y }
  }
  var dest = destMap[move];
  if((dest.x < 0) || (dest.y < 0) || (dest.x > mapWidth - 1) || (dest.y > mapHeight - 1)) {
    if(!presetMove) round();
    return;
  }
  
  var destTile = map[dest.x][dest.y];
  if(!destTile.passable) {
    destTile.explored = true;
    if(!wallDone) {
      wallDone = true;
      alert("Upon entering the area, you see a small wall. Beyond the wall is a large, empty area. The wall is only 4 feet, something you could easily scale, but you somehow feel that you cannot cross it.");
      if(confirm("Would you like to try crossing the small wall?")) {
        alert("Upon closer examination, you find that the wall has a very odd texture. Even above the wall, this same texture persists. It feels almost like an enourmous amount of large shields were connected together. For some reason however, you cannot seem to see them nor anything behind them.");
        var quiz = prompt("If you could choose one word to describe the behavior of these tower shields, what would it be?");
        var wrongMessage = "Why would a word you think of be important? You return to where you were before you visited the wall.";
        if(quiz === null) {
          alert(wrongMessage);
        } else if(quiz.trim().toLowerCase() === "broken") {
          alert("When the word broken comes to your mind, you glance at your hand and notice it is invisible.");
          player.ac += 12;
        } else {
          alert(wrongMessage);
        }
      } else {
        player.ac = 4;
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
    } else {
      alert("You run into a stone wall extending into the sky as far as you can see. You turn back.");
    }
    Combat.log(player.name + " runs into a wall at (" + dest.x + ", " + dest.y + ") and has to turn back.");
    display();
    return;
  }
  if(destTile.event) {
    if(!destTile.event.done) {
      if(!confirm("You have a feeling the area ahead might contain something interesting. Would you like to proceed?")) return;
      destTile.event.run();
      if(gameOver) {
        destTile.explored = true;
        display();
        return;
      }
      if(!destTile.event.done) {
        destTile.explored = true;
        Combat.log(player.name + " leaves (" + dest.x + ", " + dest.y + ") and returns to their previous location.");
        display();
        return;
      }
    }
  }

  player.x = dest.x;
  player.y = dest.y;
  destTile.explored = true;
  Combat.log(player.name + " successfully moves to (" + player.x + ", " + player.y + ") with " + player.hp + " HP.");

  display();
}

document.onkeydown = function(e) {
  if(e.keyCode === 32) {
    round();
  } else if(e.keyCode === 38 || e.keyCode === 87) {
    round("n");
  } else if(e.keyCode === 37 || e.keyCode === 65) {
    round("w");
  } else if(e.keyCode === 40 || e.keyCode === 83) {
    round("s");
  } else if(e.keyCode === 39 || e.keyCode === 68) {
    round("e");
  }
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
      Combat.log(player.name + " obtains Muramasa.");
      if(confirm("Would you like to test the sharpness with your finger?")) {
        display();
        player.takeDamage(2, "Muramasa", "You died by touching a katana with your finger.");
        alert("The katana is sharp enough that you cut deeper than planned, reaching the bone of your finger.");
      }
      this.done = true; 
    } else {
      alert("Reluctantly, you leave what could have made an excellent weapon in the chest.");
    }
    
  };
  events.push(muramasa);

  var doll = new Event("Doll", 
    "In a clearing in the middle of a forest, you see a doll about 14 inches tall standing outside a staircase leading into the ground. It is wearing a black and white mask and is dressed in a tuxedo. It begins to approach you slowly.");
  doll.run = function() {
    alert(doll.text);
    if(confirm("Would you like to attack the doll?")) {
      alert("The doll explodes upon being hit but is far enough that is does not hurt you. After it explodes, about 50 more dolls march up the staircase in the ground one by one. You manage to destroy all of them without being injured.");  
    } else {
      alert("The doll approaches you and grabs your leg. You find it rather cute, until the doll suddenly explodes.");
      player.takeDamage(4, "a doll", "You died by letting a suspicious doll explode on you.");
      if(player.hp <= 0) {
        alert("The doll's explosion killed you.");
        display();
        return;
      } else {
        alert("After the doll explodes, you destroy another 50 that appear, without taking damage.");
      }
    }

    if(confirm("Do you want to enter the dungeon under the staircase?")) {
        alert("The staircase leads to an underground hallway made of smoothly carved stone. The entire area is well lit by torches as if it were populated. At the end of the hall, you find a man dressed in the same way as the dolls, wearing a similar mask. He says that he is disappointed that a single adventurer will be the one to complete his story. He crumbles into dust, leaving only his mask.");
        if(confirm("Would you like to equip the mask left on the ground.")) {
          alert("Upon equipping the mask, you feel your mind being invaded by the demon that left the mask. You are unsure if you will regain control.")
          if(Math.random() > 0.7) {
            player.inventory.push("Mask of Vanir");
            player.ac += 12;
            player.hp += 60;
            Combat.log(player.name + " defeats demon and gains Mask of Vanir.");
            alert("You manage to wrestle control from the demon. Your soul is now also fused the mask, making you immune to damage anywhere else.");
          } else {
            player.takeDamage(Infinity, "not having a soul", "Your soul was absorbed by a demon.");
            Combat.log(player.name + " has soul eaten by a demon.");
            display();
            alert("Your conciousness slowly fades as the demon absorbs your soul.");
            return;
          }
        } else {
          alert("You leave the mask where it is in the dungeon and leave.");
        }
    } else {
      alert("You leave emptyhanded.");
    }
    

    this.done = true;
  };
  events.push(doll);

  var bridgeMan = new Event("Orc Bridge", 
    "You enter a city filled with orcs. A large bridge with fewer orcs on it leads through the city. You take this bridge partway through the city. You are careful to maintain your position close the the center since a fall would be lethal.");
  bridgeMan.run = function() {
    alert(bridgeMan.text);
    alert("Partway along the bridge, you see what appears to be an orc captain weighing over 800 pounds. You hear him yell, \"Start the trolley!\"  Over the edge of the bridge, you see a small train on a path to collide with a group of 20 human slaves. The orc captain is positioned right on the edge of the bridge over the train tracks between the train and the slaves.");
    if(confirm("Would you like to push the orc captain over the edge of the bridge?")) {
      Combat.log(player.name + " saves slaves by pushing an orc captain off a bridge.");
      alert("The orc captain stops the trolley and dies in the process.");
    } else {
      Combat.log(player.name + " cold-bloodedly condemns slaves to death by being run over by a train.");
      alert("The train hits the slaves, and the orc captain appears to be overjoyed at the gruesome sight that has unfolded below.");
    }
    this.done = true;
  };
  events.push(bridgeMan);

  var cobraReward = function() {
    alert("Inside the cabin, you find a vial filled with a murky liquid labeled \"health serum.\"")
    if(confirm("Would you like to drink the liquid?")) {
      player.hp += 150;
      alert("You feel reinvigorated.");
      Combat.log(player.name + " drinks health serum.");
    } else {
      alert("Drinking a strange liquid is probably not a good idea, so you leave without drinking it.");
    }
  };
  var cobra = new CombatEvent("Iron Cobra", 
    "You encounter an Iron Cobra outside a small log cabin. It is a 7 foot long cobra made entirely of iron except for an enchanted core created by an artifacer. They usually are created to guard valuables.",
    [(new Character("Iron Cobra", 27, 16, 7, 2))],
    cobraReward
  );
  events.push(cobra);

  var squirrelReward = function() {
    alert("You take the squirrel's corpse with you as a \"prize.\"")
    Combat.log(player.name + " acquires squirrel.");
    player.inventory.push("Squirrel corpse");
  };
  var squirrel = new CombatEvent("Squirrel", 
    "You encounter a man who touches a tree. He suddenly turns into a squirrel that charges at you.",
    [(new Character("Squirrel", 6, 12, 0, 0))],
    squirrelReward
  );
  events.push(squirrel);


  var knightReward = function() {
    if(confirm("Would you like to take the knight's prized armor?")) {
      player.inventory.push("Adamantium full-plate");
      player.ac += 9;
      player.attack -= 1;
      alert("Now you should be much harder to damage, but the full-plate does slightly limit your movement.");
      Combat.log(player.name + " equips adamantium full-plate.");
    } else {
      alert("Why would you pass up some good armor? In any case, you leave with nothing.");
    }
  };
  var knight = new CombatEvent("Knight", 
    "You encounter a knight who proclaims that he is invincible due to his adamantium armor. He draws his sword and attacks.",
    [(new Character("Knight", 20, 19, 6, 3))],
    knightReward
  );
  events.push(knight);

  var infectedReward = function() {
    if(confirm("Would you like to enter the tower?")) {
      if(confirm("Inside the tower, you find a small table. Atop it are a mastercrafted crossbow and mask. Would you like to equip them?")) {
        player.inventory.push("Mastercrafted crossbow");
        player.inventory.push("Optical mask");
        player.ac += 1;
        player.attack += 4;
        alert("It seems this mask has a lense built into allowing you to magnify your view. This and the crossbow should be useful.");
        Combat.log(player.name + " equips optical mask and crossbow.");
      }
    } else {
      alert("You leave wondering what you could have found inside the tower.");
    }
  };
  var infected = new CombatEvent("Infected", 
    "In the middle of a ruined city, you find a tower surrounded by people. They seem to be infected with some sort of disease affecting their skin, and they all begin running toward you when they spot you.",
    [
      (new Character("Weeper", 13, 9, 3, 0)), 
      (new Character("Weeper", 9, 9, 3, 0)),
      (new Character("Weeper", 10, 9, 3, 0)),
      (new Character("Weeper", 8, 9, 3, 0)),
    ],
    infectedReward
  );
  events.push(infected);

  var bossReward = function() {
    alert("You have defeated Oboro. You have finally won the game.");
    if(player.hp === Infinity || player.ac === Infinity || player.attack === Infinity || player.damage === Infinity) alert("You victory is not satisfying, as you cheated to attain this victory.");
    var winMessage = document.createElement("h2");
    winMessage.style.color = "#00ff00";
    winMessage.innerText = "You defeated Oboro, the Messenger of the Heavens.";
    displayParent.appendChild(winMessage);
    Combat.log(player.name + " defeats Oboro.");
    gameOver = true;
    return;
  };
  var boss = new CombatEvent("Oboro", 
    "You come across what was once a wide open field, when you visited it before. Now, it is strewn with countless corpses. Each of the corpses has the same cut, going from the bottom left of their torsos to the top right, about 3 inches deep. Standing at the center of this field is one man, holding a sword in his right hand. He runs towards you and begins to attack.",
    [
      (new Character("Oboro \"Messenger of the Heavens\"", 200, 23, 16, 7))
    ],
    bossReward
  );
  events.push(boss);

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
    },

    takeDamage(amount, damageSource, customMessage) {
      this.hp -= amount;
      Combat.log(name + " takes " + amount + " damage from " + damageSource + ", leaving " + this.hp + " HP left.");
      if(this.hp <= 0) {
        var deathMessage = document.createElement("h2");
        deathMessage.style.color = "#3366ff";
        deathMessage.innerText = (customMessage ? customMessage : "You died due to " + damageSource);
        displayParent.insertBefore(deathMessage, displayParent.childNodes[0]);
        Combat.log(player.name + " dies.");
        gameOver = true; 
        return true;
      } else {
        return false;
      }
    }
  };
};

function Event(name, text) {
  return {
    "name": name,
    "text": text,
    done: false,

    run: function() {
      alert(this.text);
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

function HealingEvent() {
  var healingEvent;
  var namePrefixes = ["Dark", "Murky", "Shadow", "Dubious", "Final", "Demon", "シ", "Health", "Sled", "Scared", "Scarred", "Death", "Blueface"];
  var title = (namePrefixes[Math.floor(Math.random() * namePrefixes.length)]) + " Potion";
  var settings = ["You find a potion in the center of a ruined stone amphitheater. ",
  "You discover a potion in a small alcove carved into a tree. ",
  "You see a potion lying in the middle of a field. ",
  "You find a potion atop a stone pedestal on the summit of a mountain. ",
  "You find a potion in a cave. You painstakingly crawl through the cave to reach the potion. ",
  "You find a potion in a birds nest on the ground. "];
  var potionLooks = ["The potion is in an opaque wooden jug with a straw sticking out the top. ",
  "The potion is in a clear, pristine crystal vial. The contained liquid is mud-colored. ",
  "The potion is in an opaque triangular prism shaped bottle. ",
  "The potion is shaped like a sword with the tip of the blade serving as a straw. ",
  "The potion is in a glass. It is a jet black liquid that is bubbling wildly. ",
  "The potion is inside a balloon. ",
  "The potion is inside a leather waterskin. You cannot tell what color the potion is, but it appears to be bubbling wildly judging by the changing shape of the waterskin. ",
  "The potion is inside a clear, cut-gem-shaped crystal with a circular opening at the top. The potion is clear, but has letters suspended in it. These letters are \"E\", \"D\", and \"A.\" ",
  "The potion is inside a plastic bag. You will have to use your own vessel to drink it. The potion is bloodred and nearly frozen. "
  ];
  var omens = ["As you approach the potion, an owl flies above you.",
  "As you approach the potion, nothing happens.",
  "You trip as you approach the potion, and you take a large amount of happiness damage.",
  "Your name changes as you approach the potion.",
  "You hear whispers telling you to drink the potion as you approach it.",
  "You footsteps behind you, but there is nothing there. When you look back at the potion, nothing happens.",
  "The sun disappears from the sky as you approach the potion for about 5 seconds before returning."];
  var text = settings[Math.floor(Math.random() * settings.length)] 
  + potionLooks[Math.floor(Math.random() * potionLooks.length)] 
  + omens[Math.floor(Math.random() * omens.length)];
  healingEvent = new Event(title, text);

  var magnitude = Math.random();
  var effects = [
    function(speed) {
      player.hp += Math.round(magnitude * speed * 10);
      alert("You feel reinvigorated");
    },
    function(speed) {
      player.takeDamage(Math.round(magnitude * speed * 3), title, "You died after drinking a highly suspicous liquid.");
      alert("Whatever it was that you drank, it drains you.");
    },
    function(speed) {
      if(speed % 2 === 0) {
        player.ac += Math.round(magnitude * speed * 3); 
      }
      if(speed % 3 === 0) {
        player.ac *= Math.round(magnitude * speed / 7) + 1;
      }
      if(speed % 4 === 0) {
        player.attack += 5;
      }
      if(speed == 10) {
        player.attackRoll = function() {
          alert("The potion you took earlier seems to prevent you from even attempting to strike any enemy.");
          return -Infinity;
        }
      }
      alert("Whatever you just drank appears to have left you unconcious for a few hours. You feel like something has happened, but you aren't quite sure what.")
    }
  ];

  var runEffect = effects[Math.floor(Math.random() * effects.length)] ;
  healingEvent.run = function() {
    alert(this.name + "\n\n" + this.text);
    if(this.text.indexOf("Your name changes as you approach the potion.") != -1) {
        player.name = "";
        for(var i = 0; i < 1 + (Math.random() * 20); i++) {
          player.name += "あんパン";
        }
    }
    display();
    if(confirm("Would you like to drink the potion?")) {
      var speed = prompt("Potions' effects usually are stronger the faster you drink them. On a continuous scale of 1-10, you quickly would you like to drink the potion?");
      if((!speed) || isNaN(speed) || (speed < 1) || (speed > 10)) {
        player.ac -= 5;
        player.inventory.push("Physical Manifestation of your Headache earned by failing to think of a number 1-10 when drinking a " + this.name);
        alert("You try to think of how fast to drink the potion, but you fail. You leave sadly with a painful, slowing headache. It will be harder to dodge now.");
        return;
      }
      runEffect(speed);
      this.done = true;
    } else {
      alert("You leave the potion where it is and return to where you were before.");
    }
  };
  return healingEvent;
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

      if(prompt("If you would like to run, type \"run\" below. Otherwise you will continue to fight.") === "run") {
        alert("You run away.");
        return;
      }

      for(var i = 0; i < characters.length; i++) {
        var character = characters[i];
        var attackRoll = character.attackRoll();
        if(attackRoll >= player.ac) {
          var damageRoll = character.damageRoll();

          if(character.name === "Oboro \"Messenger of the Heavens\"") {
            damageRoll += 7;
            Combat.log(player.name + " takes additional 7 damage due to Oboro's masterful targeting of " + player.name + "'s pressure points.");
          }

          if(Dice.d20() === 20) {
            damageRoll *= 3;
            Combat.log(character.name + " scores a critical hit.", "red");
          }
          if(player.takeDamage(damageRoll, character.name)) return;
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
    Combat.log(player.name + " wins battle.");
    end();
  };

  return combatEvent;
}

function display() {
  var hpDisplay = document.getElementById("hp-display");
  if(hpDisplay) {
    hpDisplay.innerHTML = "";
  }    
  hpDisplay.innerText = player.name + " has " + player.hp + " HP left.";

  var table = document.getElementById("map-table");
  if(table) {
    table.innerHTML = "";
  } 

  for(var i = 0; i < mapWidth; i++) {
    var row = document.createElement("tr");
    for(var j = 0; j < mapHeight; j++) {
      var mapCell = map[j][i];

      var displayCell = document.createElement("td");
      if(player.x === j && player.y === i) {
        displayCell.innerText = player.name;
        displayCell.className = "player";
      } else if(mapCell.explored === true) {
        if(mapCell.event) {
          displayCell.innerHTML = mapCell.event.name;
          if(mapCell.event.done) {
            displayCell.className = "done";
          } else {
            displayCell.className = "event";
          }
        } else if(!mapCell.passable) {
          displayCell.innerHTML = "Wall";
          displayCell.className = "event";
        } else {
          displayCell.innerHTML = "Empty";
        }
      } else {
        displayCell.innerHTML = "Unknown";
        displayCell.className = "unknown";
      }

      row.appendChild(displayCell);
    }
    table.appendChild(row);
  }

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
  
}
