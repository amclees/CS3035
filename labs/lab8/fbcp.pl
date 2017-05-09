% Fizz Buzz Crackle Pop

isFizz(Num) :- 0 is Num mod 3.
isBuzz(Num) :- 0 is Num mod 5.
isCrackle(Num) :- 0 is Num mod 7.
isPop(Num) :- 0 is Num mod 10.
isFizzbuzz(Num) :- isFizz(Num), isBuzz(Num).

fizzbuzz(Num, Res) :-
  isFizzbuzz(Num) -> Res = 'fizzbuzz';
    isFizz(Num) -> Res = 'fizz';
    isBuzz(Num) -> Res = 'buzz';
    isCrackle(Num) -> Res = 'crackle';
    isPop(Num) -> Res = 'pop';
    Res = Num.

fizzbuzzes(TopNum, TopNum, List) :-
  List = [],!.
fizzbuzzes(TopNum, CurrentNum, [Head | Tail]) :-
  CurrentNum > TopNum -> throw('the CurrentNum is greater than TopNum');
  TopNum < 1 -> throw('the TopNum is less than 1');
  (NextNum is CurrentNum + 1,
  fizzbuzz(CurrentNum, Head),
  fizzbuzzes(TopNum, NextNum, Tail)).

fizzbuzzes(TopNum, List) :-
  OneHigher is TopNum + 1,
  fizzbuzzes(OneHigher, 1, List).

printFizzbuzzes(TopNum) :-
  fizzbuzzes(TopNum, FizzbuzzList),
  forall(member(X, FizzbuzzList), (print(X), nl)).

main :-
  read(X),
  printFizzbuzzes(X),
  halt.
