// Begin 2 pts) 1. Staircase
function staircase(n) {
  if(isNaN(n)) return "Not a Number";
  if(n > 50) return "Not available";
  for(var i = 0; i < n; i++) {
    var step = "";
    for(var j = 0; j < n - i; j++) step += " ";
    step += "#";
    for(var j = 0; j < i; j++) step += ":";
    console.log(step);
  }
}
// End 1. Staircase

// Begin 3 pts) 2. Divisibility
function divisiblePairs(n, array) {
  if(isNaN(n)) return "n is not a number. divisiblePairsCounter(n, array)";
  array.sort();
  var pairs = [];     
  for(var i = 0; i < array.length; i++) {
    for(var j = i + 1; j < array.length; j++) {
      if(array[i] === array[j]) continue;
      if((array[i] + array[j]) % n === 0) {
        pairs.push([array[i], array[j]]);
      }
    }
  }
  return pairs;
}
function divisiblePairsCount(n, array) {
  return divisiblePairs(n, array).length;
}
// End 2. Divisibility

// 3 pts) 3. Summing Subarray
// Extra Credit 2 pts) Run in O(n) time
/*
This function runs in O(n) time (Note the O(n) here is actually O(array.length). 
All non-loop lines are run once so they do not affect the asymptotic time efficiency. 
Each loop runs n times. The inside of each loop is constant time. Thus, this algorithm is 2n + c = O(n).
The reason the "i in potentials" call runs in constant time is because Javascript objects work like a HashMap in Java.
*/
function sumPairs(n, array) {
  var count = 0;
  var potentials = {};
  for(var i = 0; i < array.length; i++) {
    potentials[n - i] = true;
  }

  for(var i = 0; i < array.length; i++) {
    if(i in potentials) {
      count++;
    }
  }
  return count;
}
// End 3. Summing Subarray

// 3 pts) 4. Landscape Plus
function landscape(lakeSize, mountainSize, desertSize, forestSize, fenceSize) {
  function repeater(size, character) {
    var value = "";
    for(var i = 0; i < size; i++) value += character;
    return value;
  }

  function lake() { return repeater(lakeSize, "~"); }
  function mountain() { return "/" + repeater(mountainSize, "'") + "\\"; }
  function desert() { return repeater(desertSize, "*"); }
  function forest() { return repeater(forestSize, "Y"); }
  function fence() { return repeater(fenceSize, "X"); }

  return lake() + mountain() + desert() + forest() + fence();
}

// Automatic call and log as specified in assignment
console.log("Default call of landscape(5, 6, 5, 12, 3) below:");
console.log(landscape(5, 3, 4, 2, 3));

// End 4. Landscape Plus