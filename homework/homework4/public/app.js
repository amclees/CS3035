var app = angular.module("todo-list-amclees", []);
app.controller("TodoCtrl", ["$scope", "$http", function($scope, $http) {

  var refresh = function() {
    $http.get("/todos/").then(function(response) {
      $scope.todolist = response.data;
      $scope.todo = {};
    });
  };

  refresh();

  $scope.addTodo = function() {
    $http.post("/todos/", $scope.todo).then(function(response) {
      refresh();
    });
  };

  $scope.remove = function(id) {
    $http.delete("/todos/" + id).then(function(response) {
      refresh();
    });
  };

  $scope.edit = function(id) {
    $http.get("/todos/" + id).then(function(response) {
      $scope.todo = response.data;
    });
  };

  $scope.update = function() {
    $http.put("/todos/" + $scope.todo._id, $scope.todo).then(function(response) {
      refresh();
    });
  };

  $scope.push = function(todo) {
    $http.put("/todos/" + todo._id, todo).then(function(response) {
      refresh();
    });
  };

  $scope.deselect = function() {
    $scope.todo = {};
  }

}]);﻿
