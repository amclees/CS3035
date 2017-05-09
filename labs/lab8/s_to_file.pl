main :-
	open('strings.txt', write, Stream),
	writelist(['string1', 'string2', 'string3', 'string4'], Stream), nl,
	halt.

writeitem(X,Stream) :-
  write(Stream, X),  nl(Stream).

writelist([], Stream).

writelist([H|T], Stream) :-
	writeitem(H, Stream),
	writelist(T, Stream).
