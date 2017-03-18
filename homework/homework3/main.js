$(document).ready(function() {
  var mapWidth = 8;
  var mapHeight = 8;
  var gameOver = false;
  var pendingMessage = false;
  var allDiscovered = false;
  var wallDone = false;
  var numberOfWalls = 16;
  var playerBaseHp = 25;
  var playerBaseAc = 12;

  // Could use JQuery, but don't want it as a dependency later on so it is not used
  // JQuery would be done $("~")
  var inputBox = document.getElementById("input");
  var yesButton = document.getElementById("yes-button");
  var noButton = document.getElementById("no-button");
  var messageElement = document.getElementById("message");

  var northButton = document.getElementById("north-button");
  var westButton = document.getElementById("west-button");
  var eastButton = document.getElementById("east-button");
  var southButton = document.getElementById("south-button");

  /*
  Also could be done using JQuery's click(functionHere) method
  but it would then depend on JQuery, and buttons already have an attribute
  for a click handler.
  */
  northButton.onclick = function() {
    round("n");
  }
  westButton.onclick = function() {
    round("w");
  }
  eastButton.onclick = function() {
    round("e");
  }
  southButton.onclick = function() {
    round("s");
  }

  var message = function(binding, msg, callback) {
    pendingMessage = true;
    if(!callback) callback = function() {};
    else callback = callback.bind(binding);
    messageElement.innerText = msg;
    messageElement.classList.remove("hidden");
    yesButton.innerText = "Okay";
    yesButton.classList.remove("hidden");
    yesButton.onclick = function() {
      messageElement.classList.add("hidden");
      yesButton.classList.add("hidden");
      pendingMessage = false;
      callback();
      display();
    }
  };
  var getChoice = function(binding, msg, callback) {
    pendingMessage = true;
    if(!callback) callback = function() {};
    else callback = callback.bind(binding);
    messageElement.innerText = msg;
    messageElement.classList.remove("hidden");
    yesButton.innerText = "Yes";
    yesButton.classList.remove("hidden");
    noButton.innerText = "No";
    noButton.classList.remove("hidden");
    yesButton.onclick = function() {
      messageElement.classList.add("hidden");
      yesButton.classList.add("hidden");
      noButton.classList.add("hidden");
      pendingMessage = false;
      callback(true);
      display();
    };
    noButton.onclick = function() {
      messageElement.classList.add("hidden");
      yesButton.classList.add("hidden");
      noButton.classList.add("hidden");
      pendingMessage = false;
      callback(false);
      display();
    };
  };
  var getInput = function(binding, msg, callback) {
    pendingMessage = true;
    if(!callback) callback = function() {};
    else callback = callback.bind(binding);
    messageElement.innerText = msg;
    messageElement.classList.remove("hidden");
    inputBox.value = "";
    inputBox.classList.remove("hidden");
    yesButton.innerText = "Enter";
    yesButton.classList.remove("hidden");
    noButton.innerText = "No Input";
    noButton.classList.remove("hidden");
    yesButton.onclick = function() {
      messageElement.classList.add("hidden");
      inputBox.classList.add("hidden");
      yesButton.classList.add("hidden");
      noButton.classList.add("hidden");
      pendingMessage = false;
      callback(inputBox.value);
      display();
    };
    noButton.onclick = function() {
      messageElement.classList.add("hidden");
      inputBox.classList.add("hidden");
      yesButton.classList.add("hidden");
      noButton.classList.add("hidden");
      pendingMessage = false;
      callback(null);
      display();
    };
  };

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

  var combatLog = document.getElementById("combat-log");

  var hpDisplay = document.getElementById("hp-display");

  var table = document.getElementById("map-table");

  var inventoryList = document.getElementById("inventory-list");

  var events = getEvents();

  var player;

  var playerName;
  var map;
  getInput(this, "Please enter your player's name.", function(input) {
    playerName = input;
    if(playerName === null || playerName.trim() === "") {
      playerName = "Player";
    }
    player = new Player(playerName, playerBaseHp, playerBaseAc);
    map = generateMap();
    display();
  });




  var namePrefixes = ["Dark", "Murky", "Shadow", "Dubious", "Final", "Demon", "シ", "Health", "Sled", "Scared", "Scarred", "Death", "Blueface"];
  var settings = ["You find a potion in the center of a ruined stone amphitheater. ",
    "You discover a potion in a small alcove carved into a tree. ",
    "You see a potion lying in the middle of a field. ",
    "You find a potion atop a stone pedestal on the summit of a mountain. ",
    "You find a potion in a cave. You painstakingly crawl through the cave to reach the potion. ",
    "You find a potion in a birds nest on the ground. "
  ];
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
    "The sun disappears from the sky as you approach the potion for about 5 seconds before returning.",
    "You hear whispers telling you not to drink the potion as you approach.",
    "The moon disappears from the sky as you approach the potion for about 50 seconds before returning.",
    "As you approach the potion, a raven flies above you."
  ];
  var effects = [
      function(speed, magnitude, internalNums, callback) {
        player.hp += Math.round(magnitude * speed * 10);
        message(this, "You feel reinvigorated", callback);
      },
      function(speed, magnitude, internalNums, callback) {
        player.takeDamage(Math.round(magnitude * speed * 3), "Potion", "You died after drinking a highly suspicous liquid.");
        message(this, "Whatever it was that you drank, it drains you.", callback);
      },
      function(speed, magnitude, internalNums, callback) {
        player.ac += (magnitude * internalNums[0]) / (speed * internalNums[1]);
        player.ac = Math.ceil(player.ac);
        message(this, "You feel time seem to slow down.", callback);
      },
      function(speed, magnitude, internalNums, callback) {
        player.damage += Math.round((speed * magnitude * internalNums[0]) / internalNums[1]);
        message(this, "You feel somewhat stronger.", callback);
      },
      function(speed, magnitude, internalNums, callback) {
        var type = internalNums[0];
        if(type < 4) {
          player.damage = Math.round(magnitude * speed * internalNums[1]);
          player.attack += Math.round(magnitude * internalNums[2]);
          message(this, "After you drink the potion, you notice your hand has morphed into a sort of scythe. The scythe seems to be razor-sharp, are will likely be useful."
          , callback);
        } else {
          player.ac += Math.ceil((magnitude * internalNums[3] + speed) / 2);
          message(this, "Your skin seems to have hardened, its texture now resembles that of an insect's exoskeleton."
          , callback);
        }
      },
      function(speed, magnitude, internalNums, callback) {
        if(speed % internalNums[0] === 0) {
          player.ac += Math.round(magnitude * speed * 3);
        }
        if(speed % internalNums[1] === 0) {
          player.ac *= (magnitude * speed / 7) + 1;
          player.ac = Math.ceil(player.ac);
        }
        if(speed % internalNums[2] === 0) {
          player.attack += Math.round(magnitude * internalNums[6]);
        }
        if(speed % internalNums[3] === 0) {
          player.damage = Math.round(magnitude * internalNums[7]);
        }
        if(speed % internalNums[4] === 0) {
          player.ac += magnitude * internalNums[8];
        }
        if(speed % internalNums[5] === 0) {
          player.attackRoll = function() {
            return Math.round(Dice.d20() * 2.5);
          }
        }
        if(speed == 10) {
          player.attackRoll = function() {
            return -Infinity;
          }
        }
        message(this, "Whatever you just drank appears to have left you unconcious for a few hours. You feel like something has happened, but you aren't quite sure what."
        , callback)
      }
  ];
  var effectsText = [
    "you will be healed.",
    "you will be hurt.",
    "your clock will break.",
    "you will be stronger.",
    "you will become something else.",
    "something nobody can predict will happen to you."
  ];
  var magnitudeMap = {};
  for(var i = 0; i < settings.length; i++) {
    magnitudeMap[settings[i]] = Math.random();
  }
  var effectMap = {};
  var effectDisplayedMap = {};
  for(var i = 0; i < potionLooks.length; i++) {
    var effectChoice = Math.floor(Math.random() * effects.length);
    effectMap[potionLooks[i]] = effects[effectChoice];
    effectDisplayedMap[potionLooks[i]] = effectsText[effectChoice];
  }
  var internalMap = {};
  for(var i = 0; i < omens.length; i++) {
    internalMap[omens[i]] = [];
    for(var j = 0; j < 15; j++) {
      internalMap[omens[i]].push(Math.ceil(Math.random() * 10));
    }
  }



  function round(presetMove) {
    if(gameOver || pendingMessage) return;
    var move;
    if(presetMove) {
      move = presetMove;
    } else {
      console.log("Round was called without a move.");
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
        message(this, "Upon entering the area, you see a small wall. Beyond the wall is a large, empty area. The wall is only 4 feet, something you could easily scale, but you somehow feel that you cannot cross it."
        , function() {
          getChoice(this, "Would you like to try crossing the small wall?", function(crossWall) {
            if(crossWall) {
              message(this, "Upon closer examination, you find that the wall has a very odd texture. Even above the wall, this same texture persists. It feels almost like an enourmous amount of large shields were connected together. For some reason however, you cannot seem to see them nor anything behind them."
              , function() {
                getInput(this, "If you could choose one word to describe the behavior of these tower shields, what would it be?", function(quiz) {
                  var wrongMessage = "Why would a word you think of be important? You return to where you were before you visited the wall.";
                  if(quiz === null) quiz = "";
                  if(quiz.trim().toLowerCase() === "broken") {
                    message(this, "When the word broken comes to your mind, you glance at your hand and notice it is invisible."
                    , function() {
                      player.ac += 12;
                      Combat.log(player.name + " runs into a wall at (" + dest.x + ", " + dest.y + ") and has to turn back.");
                      display();
                    });
                  } else {
                    message(this, wrongMessage, function() {
                      Combat.log(player.name + " runs into a wall at (" + dest.x + ", " + dest.y + ") and has to turn back.");
                      display();
                    });
                  }
                });
              });
            } else {
              player.ac = 4;
              message(this, "Your lack of curiosity makes you more susceptible to your enemies. You might have been able to dodge before, but now you are simply a slug."
              , function() {
                var slugImg = document.createElement("img");
                slugImg.src = "https://cdn.psychologytoday.com/sites/default/files/field_blog_entry_images/slug_0.jpg";
                slugImg.alt = "slug";
                slugImg.width = 250;
                slugImg.height = 125;
                var desc = document.createElement("p");
                desc.innerText = "You became a ";
                combatLog.appendChild(desc);
                combatLog.appendChild(slugImg);
                Combat.log(player.name + " runs into a wall at (" + dest.x + ", " + dest.y + ") and has to turn back.");
                display();
              });
            }
          });
        });
      } else {
        message(this, "You run into a stone wall extending into the sky as far as you can see. You turn back."
        , function() {
          Combat.log(player.name + " runs into a wall at (" + dest.x + ", " + dest.y + ") and has to turn back.");
          display();
        });
      }
      return;
    }
    var successfulMove = function() {
      player.x = dest.x;
      player.y = dest.y;
      destTile.explored = true;
      Combat.log(player.name + " successfully moves to (" + player.x + ", " + player.y + ") with " + player.hp + " HP.");
      display();
    };
    if(destTile.event) {
      if(!destTile.event.done) {
        getChoice(this, "You have a feeling the area ahead might contain something interesting. Would you like to proceed?", function(proceed) {
          if(!proceed) return;
          destTile.event.run(function() {
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
            successfulMove();
          });
        });
      } else {
        successfulMove();
      }
    } else {
      successfulMove();
    }
  }

  document.onkeydown = function(e) {
    if(e.keyCode === 32) {
      round();
    } else if(e.keyCode === 38 || e.keyCode === 87) {
      if(e.keyCode !== 87) e.preventDefault();
      round("n");
    } else if(e.keyCode === 37 || e.keyCode === 65) {
      if(e.keyCode !== 65) e.preventDefault();
      round("w");
    } else if(e.keyCode === 40 || e.keyCode === 83) {
      if(e.keyCode !== 83) e.preventDefault();
      round("s");
    } else if(e.keyCode === 39 || e.keyCode === 68) {
      if(e.keyCode !== 68) e.preventDefault();
      round("e");
    }
  }


  function getEvents() {
    var events = [];

    var muramasa = new Event("Muramasa",
      "You find an old wooden chest rotting away. Inside, you find a pristine katana made of a dark colored metal with an inscription written in a language unknown to you.");
    muramasa.run = function(callback) {
      message(this, muramasa.text, function() {
        getChoice(this, "Would you like to wield the katana?"
        , function(wieldMuramasa) {
          if(wieldMuramasa) {
            player.damage += 4;
            player.attack += 6;
            player.inventory.push("Muramasa");
            message(this, "The katana's balance feels perfect. You are certain you will be able to take on tougher enemies with this."
            , function() {
              this.done = true;
              Combat.log(player.name + " obtains Muramasa.");
              getChoice(this, "Would you like to test the sharpness with your finger?"
              , function(testSharpness) {
                if(testSharpness) {
                  display();
                  player.takeDamage(2, "Muramasa", "You died by touching a katana with your finger.");
                  message(this, "The katana is sharp enough that you cut deeper than planned, reaching the bone of your finger.", callback);
                  return;
                }
                display();
                callback();
              });
            });
          } else {
            message(this, "Reluctantly, you leave what could have made an excellent weapon in the chest.", callback);
          }
        });
      });
    };
    events.push(muramasa);

    var potionBook = new Event("Potion Book",
      "You find a book titled: \"Ultimate Guide to Potions\"");
    potionBook.run = function(callback) {
      message(this, potionBook.text, function() {
        var potionBookText = "Ultimate Guide to Potions";
        potionBookText += "<p>All potions have an effect, a power level, and an effect matrix. These three combine with the drink speed to produce an effect. Drinking a potion at speed 10 is highly risky if the effect is unknown. The first numbers of the effect matrix are the ones used most often. Most effect matrices are used to determine either the variation of strength of the effect. Nothing outside of drink speed, magnitude, and the effect matrix is used in determining the effect. More general effects depend on more numbers from their effect matrices.</p>";
        potionBookText += "<h4>Effect Types:</h4>";
        for(var text in effectMap) {
          potionBookText += "<strong>\"" + text + "\"</strong> means <strong>" + effectDisplayedMap[text] + "</strong><br />";
        }
        potionBookText += "<h4>Effect Power:</h4>";
        for(var text in magnitudeMap) {
          potionBookText += "<strong>\"" + text + "\"</strong> means <strong>" + (Math.round(magnitudeMap[text] * 10) / 10) + "</strong> is the overall strength of the potion.<br />";
        }
        potionBookText += "<h4>Effect Matrix:</h4>";
        for(var text in internalMap) {
          var internalNumsAssoc = internalMap[text];
          var effectMatrix = " ";
          for(var i = 0; i < internalNumsAssoc.length; i++) {
            effectMatrix += internalNumsAssoc[i] + " ";
          }
          potionBookText += "<strong>\"" + text + "\"</strong> has an associated matrix of (" + effectMatrix + ")<br />";
        }
        player.inventory.push(potionBookText);
        this.done = true;
        callback();
      });
    };
    var potionBookHouse = new Event("Cave",
      "You find a cave entrance with a door built into a cliff overlooking a lake. There is a path leading up the side of the cliff towards the cave.");
    potionBookHouse.run = function(callback) {
      message(this, this.text, function() {
        getChoice(this, "Would you like to enter the cave through the door?"
        , function(enterCave) {
          if(enterCave) {
            message(this, "When you enter the door, you see an octopus. Each of the octopus' tentacles is holding an open book. The octopus seems to be reading multiple books at the same time. It gestures for you to take a book lying on a table between you and the octopus."
            , function() {
              getChoice(this, "Would you like to take the book?"
              , function(takeBook) {
                if(takeBook) {
                  potionBook.run(callback);
                  this.done = true;
                } else {
                  getChoice(this, "Would you like to attack the octopus?"
                  , function(attackOctopus) {
                    if(attackOctopus) {
                      message(this, "The octopus parries your strike with one of its tentacles while casting a spell with its other tentacle. When it finishes casting, you can no longer breathe.");
                      player.takeDamage(Infinity, "Asphyxiation", "You died after attempting to attack a peaceful but deadly octopus.");
                      display();
                      return;
                    } else {
                      message(this, "As you leave the cave, the octopus seems disappointed.", callback);
                      return;
                    }
                  });
                }
              });
            });
          } else {
            message(this, "You leave and return to where you were, wondering what could have been in the cave.", callback);
            return;
          }
        });
      });
    };
    events.push(potionBookHouse);


    var doll = new Event("Doll",
      "In a clearing in the middle of a forest, you see a doll about 14 inches tall standing outside a staircase leading into the ground. It is wearing a black and white mask and is dressed in a tuxedo. It begins to approach you slowly.");
    doll.run = function(callback) {
      message(this, doll.text, function() {
        var doDungeon = function() {
          getChoice(this, "Do you want to enter the dungeon under the staircase?"
          , function(enterDungeon) {
            if(enterDungeon) {
                message(this, "The staircase leads to an underground hallway made of smoothly carved stone. The entire area is well lit by torches as if it were populated. At the end of the hall, you find a man dressed in the same way as the dolls, wearing a similar mask. He says that he is disappointed that a single adventurer will be the one to complete his story. He crumbles into dust, leaving only his mask."
                , function() {
                  getChoice(this, "Would you like to equip the mask left on the ground."
                  , function(equipMask) {
                    if(equipMask) {
                      message(this, "Upon equipping the mask, you feel your mind being invaded by the demon that left the mask. You are unsure if you will regain control."
                      , function() {
                        if(Math.random() > 0.7) {
                          player.inventory.push("Mask of Vanir");
                          player.ac += 12;
                          player.hp += 60;
                          Combat.log(player.name + " defeats demon and gains Mask of Vanir.");
                          message(this, "You manage to wrestle control from the demon. Your soul is now also fused the mask, making you immune to damage anywhere else."
                          , callback);
                        } else {
                          player.takeDamage(Infinity, "not having a soul", "Your soul was absorbed by a demon.");
                          Combat.log(player.name + " has soul eaten by a demon.");
                          display();
                          message(this, "Your conciousness slowly fades as the demon absorbs your soul.", callback);
                          return;
                        }
                      });
                    } else {
                      message(this, "You leave the mask where it is in the dungeon and leave.", callback);
                    }
                  });
                });
            } else {
              message(this, "You leave emptyhanded.", callback);
            }
          });
          this.done = true;
        }

        getChoice(this, "Would you like to attack the doll?"
        , function(attackDoll) {
          if(attackDoll) {
            message(this, "The doll explodes upon being hit but is far enough that is does not hurt you. After it explodes, about 50 more dolls march up the staircase in the ground one by one. You manage to destroy all of them without being injured."
            , doDungeon);
          } else {
            message(this, "The doll approaches you and grabs your leg. You find it rather cute, until the doll suddenly explodes."
            , function() {
              player.takeDamage(4, "a doll", "You died by letting a suspicious doll explode on you.");
              if(player.hp <= 0) {
                message(this, "The doll's explosion killed you.", callback);
                display();
                return;
              } else {
                message(this, "After the doll explodes, you destroy another 50 that appear, without taking damage."
                , doDungeon);
              }
            });
          }
        });
      });
    };
    events.push(doll);

    var bridgeMan = new Event("Orc Bridge",
      "You enter a city filled with orcs. A large bridge with fewer orcs on it leads through the city. You take this bridge partway through the city. You are careful to maintain your position close the the center since a fall would be lethal.");
    bridgeMan.run = function(callback) {
      message(this, bridgeMan.text + " Partway along the bridge, you see what appears to be an orc captain weighing over 800 pounds. You hear him yell, \"Start the trolley!\"  Over the edge of the bridge, you see a small train on a path to collide with a group of 20 human slaves. The orc captain is positioned right on the edge of the bridge over the train tracks between the train and the slaves."
      , function() {
        getChoice(this, "Would you like to push the orc captain over the edge of the bridge?"
        , function(pushOrc) {
          if(pushOrc) {
            Combat.log(player.name + " saves slaves by pushing an orc captain off a bridge.");
            message(this, "The orc captain stops the trolley and dies in the process.", callback);
          } else {
            Combat.log(player.name + " cold-bloodedly condemns slaves to death by being run over by a train.");
            message(this, "The train hits the slaves, and the orc captain appears to be overjoyed at the gruesome sight that has unfolded below.", callback);
          }
          this.done = true;
        });
      });
    };
    events.push(bridgeMan);

    var cobraReward = function(callback) {
      message(this, "Inside the cabin, you find a vial filled with a murky liquid labeled \"health serum.\""
      , function() {
        getChoice(this, "Would you like to drink the liquid?"
        , function(drinkLiquid) {
          if(drinkLiquid) {
            player.hp += 150;
            Combat.log(player.name + " drinks health serum.");
            message(this, "You feel reinvigorated.", callback);
          } else {
            message(this, "Drinking a strange liquid is probably not a good idea, so you leave without drinking it.", callback);
          }
        });
      });
    };
    var cobra = new CombatEvent("Iron Cobra",
      "You encounter an Iron Cobra outside a small log cabin. It is a 7 foot long cobra made entirely of iron except for an enchanted core created by an artifacer. They usually are created to guard valuables.",
      [(new Character("Iron Cobra", 27, 16, 7, 2))],
      cobraReward
    );
    events.push(cobra);

    var squirrelReward = function(callback) {
      Combat.log(player.name + " acquires squirrel.");
      player.inventory.push("Squirrel corpse");
      message(this, "You take the squirrel's corpse with you as a \"prize.\"", callback);
    };
    var squirrel = new CombatEvent("Squirrel",
      "You encounter a man who is drinking beer and eating peanuts. He suddenly touches a tree then turns into a large squirrel that charges at you.",
      [(new Character("Squirrel", 6, 12, 2, 1))],
      squirrelReward
    );
    events.push(squirrel);

    var rabbitReward = function(callback) {
      Combat.log(player.name + " acquires rabbit.");
      player.inventory.push("Rabbit's Fur");
      player.attack += 12;
      message(this, "You take the rabbit's fur with you as a \"prize.\" It will likely make you much luckier.", callback)
    };
    var rabbit = new CombatEvent("Rabbit",
      "You encounter a rabbit. It looks to be about 25 kilograms and has painful-looking fangs.",
      [(new Character("Killer Rabbit", 14, 7, 2, 5 + Math.floor(Math.random() * 40)))],
      rabbitReward
    );
    events.push(rabbit);

    var knightReward = function(callback) {
      getChoice(this, "Would you like to take the knight's prized armor?"
      , function(takeArmor) {
        if(takeArmor) {
          player.inventory.push("Adamantium full-plate");
          player.ac += 9;
          player.attack -= 1;
          Combat.log(player.name + " equips adamantium full-plate.");
          message(this, "Now you should be much harder to damage, but the full-plate does slightly limit your movement.", callback);
        } else {
          message(this, "Why would you pass up some good armor? In any case, you leave with nothing.", callback);
        }
      });
    };
    var knight = new CombatEvent("Knight",
      "You encounter a knight who proclaims that he is invincible due to his adamantium armor. He draws his sword and attacks.",
      [(new Character("Knight", 20, 19, 6, 3))],
      knightReward
    );
    events.push(knight);

    var infectedReward = function(callback) {
      getChoice(this, "Would you like to enter the tower?"
      , function(enterTower) {
        if(enterTower) {
          getChoice(this, "Inside the tower, you find a small table. Atop it are a mastercrafted crossbow and mask. Would you like to equip them?"
          , function(equipGear) {
            if(equipGear) {
              player.inventory.push("Mastercrafted crossbow");
              player.inventory.push("Optical mask");
              player.ac += 1;
              player.attack += 4;
              message(this, "It seems this mask has a lense built into allowing you to magnify your view. This and the crossbow should be useful.", callback);
              Combat.log(player.name + " equips optical mask and crossbow.");
            } else {
              message(this, "You leave sadly.", callback);
            }
          });
        } else {
          message(this, "You leave wondering what you could have found inside the tower.", callback);
        }
      });
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
      message(this, "You have defeated Oboro. You have finally won the game.");
      if(player.hp === Infinity || player.ac === Infinity || player.attack === Infinity || player.damage === Infinity) message(this, "You victory is not satisfying, as you cheated to attain this victory.");
      var winMessage = document.createElement("h2");
      winMessage.style.color = "#00ff00";
      winMessage.innerText = "You defeated Oboro, the Messenger of the Heavens.";
      Combat.log(player.name + " defeats Oboro.");
      gameOver = true;
      return;
    };
    var bonus = Math.random() < 0.1 ? 20 : 0;
    var boss = new CombatEvent("Oboro",
      "You come across what was once a wide open field, when you visited it before. Now, it is strewn with countless corpses. Each of the corpses has the same cut, going from the bottom left of their torsos to the top right, about 3 inches deep. Standing at the center of this field is one man, holding a sword in his right hand. He runs towards you and begins to attack.",
      [
        (new Character("Oboro \"Messenger of the Heavens\"", 200 + Math.floor(Math.random() * 50), 25 + Math.floor(Math.random() * 5), 23 + bonus, 9 + bonus))
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

      takeDamage: function(amount, damageSource, customMessage) {
        this.hp -= amount;
        display();
        Combat.log(name + " takes " + amount + " damage from " + damageSource + ", leaving " + this.hp + " HP left.");
        if(this.hp <= 0) {
          var deathMessage = document.createElement("h2");
          deathMessage.style.color = "#3366ff";
          deathMessage.innerText = (customMessage ? customMessage : "You died due to " + damageSource);
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

      run: function(callback) {
        message(this, this.text);
        done = true;
        callback();
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

    var title = (namePrefixes[Math.floor(Math.random() * namePrefixes.length)]) + " Potion";

    var omenChoice = Math.floor(Math.random() * omens.length);
    var looksChoice = Math.floor(Math.random() * potionLooks.length);
    var settingChoice = Math.floor(Math.random() * settings.length);
    var text = settings[settingChoice]
    + potionLooks[looksChoice]
    + omens[omenChoice];
    healingEvent = new Event(title, text);

    var magnitude = magnitudeMap[settings[settingChoice]];
    var runEffect = effectMap[potionLooks[looksChoice]];

    healingEvent.run = function(callback) {
      message(this, this.name + "\n\n" + this.text
      , function() {
        var toRun = function() {
          if(this.text.indexOf("Your name changes as you approach the potion.") != -1) {
              player.name = "";
              for(var i = 0; i < 1 + (Math.random() * 10); i++) {
                player.name += "あんパン";
              }
          }
          display();
          getChoice(this, "Would you like to drink the potion?"
          , function(drinkPotion) {
            if(drinkPotion) {
              getInput(this, "Potions' effects are USUALLY stronger the faster you drink them. On a continuous scale of 1-10, you quickly would you like to drink the potion?"
              , function(speed) {
                if((!speed) || isNaN(speed) || (speed < 1) || (speed > 10)) {
                  player.ac -= 5;
                  player.inventory.push("Physical Manifestation of your Headache earned by failing to think of a number 1-10 when drinking a " + this.name);
                  message(this, "You try to think of how fast to drink the potion, but you fail. You leave sadly with a painful, slowing headache. It will be harder to dodge now."
                  , callback);
                  return;
                }
                runEffect(speed, magnitude, internalMap[omens[omenChoice]], (function() {
                  this.done = true;
                  callback();
                }).bind(this));
              });
            } else {
              message(this, "You leave the potion where it is and return to where you were before."
              , callback);
            }
          });
        }
        toRun.bind(this)();
      });
    };
    return healingEvent;
  }

  function CombatEvent(name, text, characters, reward) {
    var combatEvent = new Event(name, text);

    combatEvent.run = function(callback) {
      message(this, text
      , function() {
        function combatRound() {
          var statusmessage = "You have " + player.hp + " HP left. Your enemies are:\n";
          for(var i = 0; i < characters.length; i++) {
            var character = characters[i];
            statusmessage += character.name + " with " + character.hp + " HP left.\n";
          }
          message(this, statusmessage, function() {
            getChoice(this, "Would you like to keep fighting?", function(inputValue) {
              if(!inputValue) {
                message(this, "You run away.", callback);
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
              if(characters.length !== 0) {
                combatRound();
              } else {
                this.done = true;
                message(this, "You win the battle.", function() {
                  Combat.log(player.name + " wins battle.");
                  reward(callback);
                });
              }
            });
          });
        }
        combatRound = combatRound.bind(this);
        combatRound();
      });
    };

    return combatEvent;
  }

  function generateMap() {
    var map = [];

    for(var i = 0; i < mapWidth; i++) {
      map[i] = [];
      for(var j = 0; j < mapHeight; j++) {
        map[i].push({ event: null, explored: allDiscovered, passable: true});
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
              } catch(error) { wallCount += 0.7 }
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
          console.log("Wall at " + x + ", " + y);
          break;
        }
      }
    }
    return map;
  }

  function display() {
    var hpDisplay = document.getElementById("hp-display");
    if(hpDisplay) {
      hpDisplay.innerHTML = "";
    }
    hpDisplay.innerHTML = player.name + " has " + player.ac + " AC, " + player.attack + " bonus attack, " + player.damage + " bonus damage, <strong>" + player.hp + " HP</strong> left.";

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

});