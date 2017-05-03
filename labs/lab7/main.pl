/*
eats(fred,tomatoes) and
eats(Whom,What)
unify because their usage is consistant and variables
can be let to equal atoms.
For example, Whom = fred, What = tomatoes.

eats(fred,Food)
eats(Person,jim)
unify because their terms unify.
Since Food is a variable, the first one may be
written eats(fred, jim)


cd(29,beatles,sgt_pepper).
cd(A,B,help).
No, help and sgt_pepper are different atoms
so their usage is inconsistent.
*/

/* Begin Part 2 */

count(Y, Y) :-
  write(Y), nl.

count(X, Y) :-
  Z is X + 1,
  Z = Y,
  write(Y), nl.

count(X, Y) :-
  K is X + 1,
  X \= Y, K \= Y,
  write(X), nl,
  Z is X + 2,
  count(Z, Y).

/* End Part 2 */

/* Begin Part 3 */

route(X, Y) :-
  is_move(X, Y).

route(X, Y) :-
  route(X, Z),
  route(Z, Y).

is_move(X, Y) :-
  move(X, Y) ; move(Y, X).

move(tranent, musselburgh).
move(tranent, wallyford).
move(tranent, prestonpans).

move(wallyford, musselburgh).
move(wallyford, prestonpans).

move(prestonpans, musselburgh).

move(musselburgh, craigmillar).
move(musselburgh, portobello).

move(portobello, craigmillar).
move(portobello, edinburgh).
move(portobello, leith).

move(craigmillar, edinburgh).

move(edinburgh, leith).

/* End Part 3 */

/* Start Part 4 */

print_even([HEAD]).
print_even([]).

print_even([FIRST, SECOND | TAIL]) :-
  write(SECOND), nl,
  print_even(TAIL).

/* End Part 4 */
