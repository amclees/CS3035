:- use_module(library(clpfd)).

% Original Markus Triska, taken from the SWI-Prolog manual.
% Code has been modified as according to assignment.

sudoku(Rows) :-
    length(Rows, 16), maplist(same_length(Rows), Rows),
    append(Rows, Vs), Vs ins 1..16,
    maplist(all_distinct, Rows),
    transpose(Rows, Columns),
    maplist(all_distinct, Columns),
    Rows = [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P],
    blocks(A, B, C, D), blocks(E, F, G, H), blocks(I, J, K, L), blocks(M, N, O, P).

blocks([], [], [], []).
blocks([A,B,C,D|Bs1], [E,F,G,H|Bs2], [I,J,K,L|Bs3], [M,N,O,P|Bs4]) :-
        all_distinct([A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P]),
        blocks(Bs1, Bs2, Bs3, Bs4).

problem(1, [
  [_,15,_,_, 14,16,_,_, _,_,_,_, _,9,_,_],
  [3,_,_,_, 2,_,15,_, 10,12,9,_, _,_,_,_],
  [9,_,_,1, 7,_,_,_, _,_,4,_, _,_,_,3],
  [5,10,_,_, _,_,_,3, 11,_,1,_, 8,4,_,_],

  [_,3,_,4, _,_,_,_, _,6,13,12, _,11,1,_],
  [8,_,_,_, _,_,10,_, 9,2,_,11, _,7,3,_],
  [_,_,_,6, _,_,_,_, _,10,_,_, 15,_,_,14],
  [_,_,11,_, 13,_,6,16, _,4,8,_, _,_,10,2],

  [1,8,_,_, _,4,2,_, 5,13,_,9, _,15,_,_],
  [6,_,_,12, _,_,1,_, _,_,_,_, 3,_,_,_],
  [_,16,4,_, 9,_,13,6, _,8,_,_, _,_,_,10],
  [_,14,7,_, 15,3,16,_, _,_,_,_, 12,_,9,_],

  [_,_,15,16, _,13,_,9, 2,_,_,_, _,_,14,4],
  [10,_,_,_, _,14,_,_, _,_,_,15, 6,_,_,8],
  [_,_,_,_, _,6,12,10, _,11,_,13, _,_,_,5],
  [_,_,1,_, _,_,_,_, _,_,14,3, _,_,16,_]
]).

main :-
  problem(1, Test),
  sudoku(Test),
  write(Test),
  halt.
