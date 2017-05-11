:- use_module(library(clpfd)).

% Original Markus Triska, taken from the SWI-Prolog manual.
% Code has been modified as according to assignment.

/*subset([ ],_).
subset([H|T],List) :-
    member(H,List),
    subset(T,List).*/

all_distinct_atoms(List) :-
  sort(List, Sorted),
  length(List, Length),
  length(Sorted, Length).

letter(a).
letter(b).
letter(c).
letter(d).
letter(e).
letter(f).
letter(g).
letter(h).
letter(i).
letter(j).
letter(k).
letter(l).
letter(m).
letter(n).
letter(o).
letter(p).

sudoku(Rows) :-
        length(Rows, 16), maplist(same_length(Rows), Rows),
        append(Rows, Vs), letter(Vs),
        maplist(all_distinct_atoms, Rows),
        transpose(Rows, Columns),
        maplist(all_distinct_atoms, Columns),
        Rows = [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P],
        blocks(A, B, C, D), blocks(E, F, G, H), blocks(I, J, K, L), blocks(M, N, O, P).

blocks([], [], [], []).
blocks([A,B,C,D|Bs1], [E,F,G,H|Bs2], [I,J,K,L|Bs3], [M,N,O,P|Bs4]) :-
        all_distinct_atoms([A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P]),
        blocks(Bs1, Bs2, Bs3, Bs4).

problem(1, [
  [_,o,_,_, n,p,_,_, _,_,_,_, _,i,_,_],
  [c,_,_,_, b,_,o,_, j,l,i,_, _,_,_,_],
  [i,_,_,a, g,_,_,_, _,_,d,_, _,_,_,c],
  [e,j,_,_, _,_,_,c, k,_,a,_, h,d,_,_],

  [_,c,_,d, _,_,_,_, _,f,m,l, _,k,a,_],
  [h,_,_,_, _,_,j,_, i,b,_,k, _,g,c,_],
  [_,_,_,f, _,_,_,_, _,j,_,_, o,_,_,n],
  [_,_,k,_, m,_,f,p, _,d,h,_, _,_,j,b],

  [a,h,_,_, _,d,b,_, e,m,_,i, _,o,_,_],
  [f,_,_,l, _,_,a,_, _,_,_,_, c,_,_,_],
  [_,p,d,_, i,_,m,f, _,h,_,_, _,_,_,j],
  [_,n,g,_, o,c,p,_, _,_,_,_, l,_,i,_],

  [_,_,o,p, _,m,_,i, b,_,_,_, _,_,n,d],
  [j,_,_,_, _,n,_,_, _,_,_,o, f,_,_,h],
  [_,_,_,_, _,f,l,j, _,k,_,m, _,_,_,e],
  [_,_,a,_, _,_,_,_, _,_,n,c, _,_,p,_]
]).

problem(2, [
  [_,o,_,_, n,p,_,_, _,_,_,_, _,i,_,_],
  [_,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_],
  [_,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_],
  [_,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_],

  [_,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_],
  [_,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_],
  [_,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_],
  [_,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_],

  [_,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_],
  [_,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_],
  [_,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_],
  [_,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_],

  [_,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_],
  [_,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_],
  [_,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_],
  [_,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_]
]).

main :-
  problem(2, Test), sudoku(Test), halt.
