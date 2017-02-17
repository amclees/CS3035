# Homework 1 - Text Adventure Game

This homework assignment involves a JavaScript text adventure game.

Create a 8 x 8 game map on which an adventurer is placed (randomly). The goal of the adventurer is to exit the game with two prizes. The adventurer moves one square at a time (left, right, up down) and encounters either an obstacle (can't move there), a prize, or a challenge. The challenge involves asking the user if they want to take the challenge or back out.

Challenges involve a hazard or monster who holds the prize (use your imagination as to what the monster or hazard is). One of two outcomes selected: 1) The adventurer takes damage. 2) The adventurer inflicts damage on monster or hazard. You decide how much damage in your game design for each point, and how much damage each monster can take. Also decide how much total damage (hit points) the adventurer can take. The game ends either if the player finds the goal with two prizes in hand (a win) or dies (all hit points are gone --- lose).

### Requirements

4pts: Create a 8x8 matrix. This will be an array of arrays, where each sub array is a row of squares.

12pts: Create challenge objects for each square that has one. This object should include: The monster/hazard's name, hit points for monster/hazard, the prize name, and a function that performs the challenge. This function should launch an input box and receive the input to ask whether the person wants to brave the challenge, and if the person chooses to, to determine the outcome. Texts regarding challenge should be put inside the prompt box. Also the function should ask the user whether they want to try again after the challenge is complete (think while loops). Place them in different places in the above matrix.

2pts: For non-challenge positions, place a string indicating whether it is merely blank, is a wall, or the name of a prize.

2pts: Randomly assign a starting and goal location (indicate with a 'S' and 'G' respectively). Make sure they do not fall on the same square, or on any square taken by a prize, wall or adventure. Place these in the matrix.

4pts: Create an object that represents the adventurer. This includes how many hit points she has left, current location on map (in terms of row and column), and an array of prizes.

2pts: Ask user for input about which direction she wants to move using a prompt box. Keep asking until the game is over.

4pts: Game logic and display: keep track of how many hit points the adventurer has, how many prizes she has, and display these, along with the outcome of any move or challenge (include location and results of challenge), by printing it to the webpage. You can do this with:

```javascript
document.write("<h3>The text you want to output</h3>");
```

Create any helper functions you need. This assignment requires that you do some thinking on your own regarding how to implement the game, what to use for monsters, what text to write, etc. Have fun with it!

Write all the javascript in a javascript file called main.js. Write a skeleton HTML page that loads this script. Upload both here.

Extra Credit (5 pts): Create a table on the screen using document.write with the area on the map already explored, and a text describing what the adventurer found. Implement it how you wish.
