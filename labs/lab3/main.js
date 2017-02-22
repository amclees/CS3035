// Start Part 1 - Flatten array
console.log("2D array:");
var array = [[3, 4], [5, 2], [1, 3]];
var out2d = "[ ";
for(var i = 0; i < array.length; i++) {
  out2d += "[";
  for(var j = 0; j < array[i].length; j++) {
    out2d += array[i][j];
    if(j !== array[i].length - 1) out2d += ", ";
  }
  out2d += "]";
  if(i !== array.length - 1) out2d += ", ";
}
out2d += " ]";
console.log(out2d);
var flatArray = array.reduce(function(flat, element) {
  return flat.concat(element);
}, []);
console.log("Flattened array:");
console.log(flatArray);
// End Part 1

// Start Part 2 - Generation Adder
var people = [
  {
    name: "John Smith",
    sex: "m",
    born: 142,
    died: 158,
    father: "George Smith",
    mother: "Jane Smith"
  },
  {
    name: "Jane Smith",
    sex: "m",
    born: 120,
    died: 159,
    father: "Door Smith",
    mother: "Wall Smith"
  },
  {
    name: "John Noname",
    sex: "m",
    born: 1999,
    died: 2011,
    father: "Ron Smith",
    mother: "Alicia Gilbertson"
  },
  {
    name: "John Surname",
    sex: "m",
    born: 14200,
    died: 14360,
    father: "Bon Surname",
    mother: "Janet Surname"
  },
  {
    name: "John Williams",
    sex: "m",
    born: 1422,
    died: 1522,
    father: "George Smith",
    mother: "Jane Smith"
  },
  {
    name: "Hyacinth Tippetts",
    sex: "f",
    born: 175,
    died: 199,
    father: "George Tippets",
    mother: "Kurapika Gilbertson"
  },
  {
    name: "Philip Gilbertson",
    sex: "m",
    born: 1993,
    died: 1996,
    father: "Ron Smith",
    mother: "Alica Gilbertson"
  },
  {
    name: "Jane Gilbertson",
    sex: "f",
    born: 1966,
    died: 1979,
    father: "Ron Smith",
    mother: "Elizabeth Smith"
  },
  {
    name: "Alica Gilbertson",
    sex: "f",
    born: 1979,
    died: 1999,
    father: "Ron Smith",
    mother: "Jane Gilbertson"
  }
];
function addGeneration(people) {
  people.forEach(function(person) {
    var gen = "Greatest Generation";
    if(person.born >= 1996) {
      gen = "Gen Z";
    } else if(person.born >= 1977) {
      gen = "Millennials";
    } else if(person.born >= 1966) {
      gen = "Generation X";
    } else if(person.born >= 1941) {
      gen = "Baby Boomers";
    }
    person.generation = gen;
  });
}
console.log("People without generations added:");
for(var i = 0; i < people.length; i++) {
  console.log(people[i]);
}
addGeneration(people);
console.log("People with generations added:");
for(var i = 0; i < people.length; i++) {
  console.log(people[i]);
}

// End Part 2

// Begin Part 3 - Pokemon Go Fans
var millennials = people.filter(function(person) {
  return person.generation === "Millennials";
})

function fanList(fans) {
  return fans.map(function(fan) {
    return fan.name + ": Pokemon Go Fan";
  });
}

console.log(fanList(millennials));
// End Part 3
