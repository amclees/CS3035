main :-
  open('strings.txt', read, Stream),
  repeat,
  read_line_to_codes(Stream, X), writef(" "),
	writef(X), nl,
	X = end_of_file, !,
	nl,
	close(Stream),
  halt.
