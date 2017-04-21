var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");

var app = express();
var db = mongojs("127.0.0.1:27017/todos", ["todos"]);
var port = 3000;

app.use(express.static("public"));
app.use(bodyParser.json());

app.get("/todos", function (request, response) {
  db.todos.find(function (err, docs) {
    response.json(docs);
  });
});

app.post("/todos", function (request, response) {
  delete request.body._id;
  db.todos.insert(request.body, function(err, doc) {
    response.json(doc);
  });
});

app.delete("/todos/:id", function (request, response) {
  var id = request.params.id;
  db.todos.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
    response.json(doc);
  });
});

app.get("/todos/:id", function (request, response) {
  var id = request.params.id;
  db.todos.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
    response.json(doc);
  });
});

app.put("/todos/:id", function (request, response) {
  var id = request.params.id;
  db.todos.findAndModify({
    query: {_id: mongojs.ObjectId(id)},
    update: {$set: {title: request.body.title, text: request.body.text, due: request.body.due, status: request.body.status}},
    new: true}, function (err, doc) {
      response.json(doc);
    }
  );
});

app.listen(port);
console.log("Running on port " + port);
