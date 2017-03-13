// Textbook code start

var mountains = [
  {name: "Kilimanjaro", height: 5895, country: "Tanzania"},
  {name: "Everest", height: 8848, country: "Nepal"},
  {name: "Mount Fuji", height: 3776, country: "Japan"},
  {name: "Mont Blanc", height: 4808, country: "Italy\nFrance"},
  {name: "Vaalserberg", height: 323, country: "Netherlands"},
  {name: "Denali", height: 6168, country: "United States"},
  {name: "Popocatepetl", height: 5465, country: "Mexico"}
];

function rowHeights(rows) {
  return rows.map(function(row) {
    return row.reduce(function(max, cell) {
      return Math.max(max, cell.minHeight());
    }, 0);
  });
}

function colWidths(rows) {
  return rows[0].map(function(_, i) {
    return rows.reduce(function(max, row) {
      return Math.max(max, row[i].minWidth());
    }, 0);
  });
}

function drawTable(rows) {
  var heights = rowHeights(rows);
  var widths = colWidths(rows);
  function drawLine(blocks, lineNo) {
    return blocks.map(function(block) {
      return block[lineNo];
    }).join(" ");
  }

  function drawRow(row, rowNum) {
    var blocks = row.map(function(cell, colNum) {
      return cell.draw(widths[colNum], heights[rowNum]);
    });
    return blocks[0].map(function(_, lineNo) {
      return drawLine(blocks, lineNo);
    }).join("\n");
  }

  return rows.map(drawRow).join("\n");
}

function repeat(string, times) {
  var result = "";
  for (var i = 0; i < times; i++)
    result += string;
  return result;
}

function TextCell(text) {
  this.text = text.split("\n");
}

TextCell.prototype.minWidth = function() {
  return this.text.reduce(function(width, line) {
    return Math.max(width, line.length);
  }, 0);
};

TextCell.prototype.minHeight = function() {
  return this.text.length;
};

TextCell.prototype.draw = function(width, height) {
  var result = [];
  for (var i = 0; i < height; i++) {
    var line = this.text[i] || "";
    result.push(line + repeat(" ", width - line.length));
  }
  return result;
};

function UnderlinedCell(inner) {
  this.inner = inner;
}

UnderlinedCell.prototype.minWidth = function() {
  return this.inner.minWidth();
};

UnderlinedCell.prototype.minHeight = function() {
  return this.inner.minHeight() + 1;
};

UnderlinedCell.prototype.draw = function(width, height) {
  return this.inner.draw(width, height - 1).concat([repeat("-", width)]);
};

function dataTable(data) {
  var keys = Object.keys(data[0]);
  var headers = keys.map(function(name) {
    return new UnderlinedCell(new TextCell(name));
  });
  var body = data.map(function(row) {
    return keys.map(function(name) {
      var value = row[name];
      if (typeof value == "number")
        return new RTextCell(String(value));
      else
        return new TextCell(String(value));
    });
  });
  return [headers].concat(body);
}

function RTextCell(text) {
  TextCell.call(this, text);
}

RTextCell.prototype = Object.create(TextCell.prototype);

RTextCell.prototype.draw = function(width, height) {
  var result = [];
  for (var i = 0; i < height; i++) {
    var line = this.text[i] || "";
    result.push(repeat(" ", width - line.length) + line);
  }
  return result;
};
// Textbook code end

// Start CenteredTextCell

console.log("Problem 1:");

function CenteredTextCell(text) {
  TextCell.call(this, text);
}

CenteredTextCell.prototype = Object.create(TextCell.prototype);

CenteredTextCell.prototype.draw = function(width, height) {
  var result = [];
  for (var i = 0; i < height; i++) {
    var line = this.text[i] || "";
    var padding = Math.floor((width - line.length) / 2);
    var extraRight = (width - line.length) % 2 !== 0;
    result.push(repeat(" ", padding) + line + repeat(" ", padding) + (extraRight ? " " : ""));
  }
  return result;
};

function centeredDataTable(data) {
  var keys = Object.keys(data[0]);
  var headers = keys.map(function(name) {
    return new UnderlinedCell(new TextCell(name));
  });
  var body = data.map(function(row) {
    return keys.map(function(name) {
      var value = row[name];
      return new CenteredTextCell(String(value));
    });
  });
  return [headers].concat(body);
}

console.log(drawTable(centeredDataTable(mountains)));
// End CenteredTextCell



// Start BorderedCell

console.log("Problem 2:");

function BorderedCell(text) {
  TextCell.call(this, text);
}

BorderedCell.prototype = Object.create(TextCell.prototype);

BorderedCell.prototype.minWidth = function() {
  return this.text.reduce(function(width, line) {
    return Math.max(width, line.length);
  }, 0) + 2;
};

BorderedCell.prototype.minHeight = function() {
  return this.text.length;
};

BorderedCell.prototype.draw = function(width, height) {
  var result = [];
  result.push(repeat("-", width));
  for (var i = 0; i < height; i++) {
    var line = this.text[i] || "";
    var padding = width - line.length - 2;
    result.push("|" + line + repeat(" ", padding) + "|");
  }
  result.push(repeat("-", width));
  return result;
};

function borderedDataTable(data) {
  var keys = Object.keys(data[0]);
  var body = data.map(function(row) {
    return keys.map(function(name) {
      var value = row[name];
      return new BorderedCell(String(value));
    });
  });
  return body;
}

console.log(drawTable(borderedDataTable(mountains)));

// End BorderedCell

// Start get uppercase row table

function getUppercaseRow(rowNum, cellArray) {
  return cellArray.map(function(value, index) {
    if(index != rowNum) return value;
    else {
      return value.map(function(val) {
        return new BorderedCell(val.text.reduce(function(acc, toAdd) {
          return acc.toUpperCase() + "\n" + toAdd.toUpperCase();
        }));
      });
    }
  });
}

// End get uppercase row

// Start get uppercase column table

function getUppercaseCol(colNum, cellArray) {
  return cellArray.map(function(value, index) {
    return value.map(function(val, ind) {
      if(ind != colNum) return val;
      else {
        return new BorderedCell(val.text.reduce(function(acc, toAdd) {
          return acc.toUpperCase() + "\n" + toAdd.toUpperCase();
        }));
      }
    });
  });
}

console.log(drawTable(getUppercaseCol(2, borderedDataTable(mountains))));

// End get uppercase column

// Start person bordercell array

function makeCellFromPerson(person) {
  return new BorderedCell(Object.keys(person).reduce(function(acc, key, index) {
    return acc + key + ": " + person[key] + (index === Object.keys(person).length - 1 ? "" : "\n");
  }, ""));
}

var people = [
  [{
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
    mother: "Alicia Gilbert"
  }],
  [{
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
    mother: "Kurapika Gilbert"
  }],
  [{
    name: "Philip Gilbert",
    sex: "m",
    born: 1993,
    died: 1996,
    father: "Ron Smith",
    mother: "Alica Gilbert"
  },
  {
    name: "Jane Gilbert",
    sex: "f",
    born: 1966,
    died: 1979,
    father: "Ron Smith",
    mother: "Elizabeth Smith"
  },
  {
    name: "Alica Gilbert",
    sex: "f",
    born: 1979,
    died: 1999,
    father: "Ron Smith",
    mother: "Jane Gilbert"
  }]
];

function personCellsFromArray(personMatrix) {
  return personMatrix.map(function(row) {
    return row.map(function(person) {
      return makeCellFromPerson(person);
    });
  });
}

var personCellArray = personCellsFromArray(people);

console.log("Problem 5:");
console.log(drawTable(personCellArray));

// End person bordercell array

// Start uppercase tests

console.log("Problem 6:");
console.log(drawTable(getUppercaseRow(0, getUppercaseCol(2, personCellArray))));

// End uppercase tests
