var game = function(mapWidth, mapHeight) {
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
  } while(!playerName);

  var player = new Player(playerName, 15, 10);

  var map = [];
  for(var i = 0; i < mapWidth; i++) {
    map[i] = [];
    for(var j = 0; j < mapHeight; j++) {
      map[i].push({ event: null, explored: false });
    }
  }

  if(map.length * map[0].length < events.length + 10) {
    console.log("Insufficient map size to host events. Please try a bigger map.");
    return;
  }

  while(events.length != 0) {
    var event = events.pop();
    while(true) {
      var x = Math.round(Math.random() * (mapWidth - 1));
      var y = Math.round(Math.random() * (mapHeight - 1));
      if(map[x][y].event === null) {
        map[x][y] = event;
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
  
  display();
  main();

  function main() {
    var move;
    do {
      var moveText = "Please enter your move. Enter: \n  \"n\" to go north \n  \"s\" to go south \n  \"e\" to go east \n  \"w\" to go west";
      move = prompt(moveText);
    } while((!move) || !(move === "n" || move === "s" || move === "e" || move === "w"));
    var destMap = {
      "n": { x: player.x - 1, y: player.y },
      "s": { x: player.x + 1, y: player.y },
      "e": { x: player.x, y: player.y + 1},
      "w": { x: player.x, y: player.y - 1 },
    }
    var dest = destMap[move];
    if((dest.x < 0) || (dest.y < 0) || (dest.x > mapWidth - 1) || (dest.y > mapHeight - 1)) main();
    player.x = dest.x;
    player.y = dest.y;
    var destTile = map[dest.x][dest.y];
    if(destTile.event) {
      if(!prompt("You have a feeling the area ahead might contain something interesting. Would you like to proceed?")) main();
      destTile.event.run();
    }
    destTile.explored = true;

    display();
    main();
  }

  function getEvents() {
    var events = [];

    var muramasa = new Event("Muramasa", "You find an old wooden chest rotting away. Inside, you find a pristine katana made of a dark colored metal with an inscription written in Abyssal.");
    muramasa.run = function() {
      alert(muramasa.text);
      if(confirm("Would you like to wield the katana?")) {
        player.damage = 13;
        player.inventory.push("Muramasa");
        alert("The katana's balance feels perfect. You decide to test its sharpness with your finger, and find it to be sharper than any sword you have tried previously. You are certain you will be able to take on tougher enemies with this.");
      } else {
        alert("Reluctantly, you leave what could have made an excellent weapon in the chest.");
      }
      muramasa.done = true;
    };

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
      gp: 0
    };
  };

  function Event(name, text) {
    return {
      name: null,
      text: null,
      done: false,

      run: function() {
        done = true;
        return;
      }
    }
  };

  function display() {
    var displayParent = document.getElementById("optional-container");
    if(!displayParent) {
      displayParent = document.body;
    }

    var inventoryContainer = document.getElementById("inventory-list");
    if(!inventoryContainer) {
      console.log("No Inventory Container in HTMl.");
      return;
    }
    inventoryContainer.innerHTML = "";
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
        var mapCell = map[i][j];

        var displayCell = document.createElement("td");
        if(player.x === i && player.y === j) {
          displayCell.innerText = player.name;
        } else if(mapCell.explored === true) {
          if(mapCell.event) {
            displayCell.innerHTML = mapCell.event.name;
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
}