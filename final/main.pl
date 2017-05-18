% Begin Part 1

son(X, Y) :-
  parent(Y, X),
  male(X).
daughter(X, Y) :-
  parent(Y, X),
  female(X).

mother(X, Y) :-
  parent(X, Y),
  female(X).
father(X, Y) :-
  parent(X, Y),
  male(X).

sister(X, Y) :-
  female(X),
  male(Z),
  parent(Z, X),
  parent(Z, Y),
  X \= Y.
brother(X, Y) :-
  male(X),
  male(Z),
  parent(Z, X),
  parent(Z, Y),
  X \= Y.


uncle(X, Y) :-
  parent(Z, Y),
  brother(X, Z).
aunt(X, Y) :-
  parent(Z, Y),
  sister(X, Z).

grandmother(X, Y) :-
  female(X),
  parent(Z, Y),
  parent(X, Z).
grandfather(X, Y) :-
  male(X),
  parent(Z, Y),
  parent(X, Z).

male(bob).
male(rick).
male(mike).
male(george).
male(dan).

female(sarah).
female(susan).
female(betty).
female(terry).
female(mary).

parent(bob, rick).
parent(sarah, rick).

parent(bob, betty).
parent(sarah, betty).

parent(susan, george).
parent(rick, george).

parent(susan, dan).
parent(rick, dan).

parent(betty, terry).
parent(mike, terry).

parent(betty, mary).
parent(mike, mary).

% End Part 1


% Begin Part 2

last_but_two(X, [X,_,_]).

last_but_two(X,[_, H|T]) :- last_but_two(X, [H|T]).

% End Part 2
