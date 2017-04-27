color(yellow).
color(blue).
color(red).
color(orange).

neighbor(A, B) :-
  color(A),
  color(B),
  A \== B.

south_america(Colombia, Venezuela, Guyana, Suriname, French_Guiana,
Ecuador, Peru, Brazil, Bolivia, Chile, Argentina, Paraguay, Uruguay) :-
  neighbor(Colombia, Ecuador), neighbor(Colombia, Peru), neighbor(Colombia, Brazil), neighbor(Colombia, Venezuela),
  neighbor(Venezuela, Colombia), neighbor(Venezuela, Brazil), neighbor(Venezuela, Guyana),
  neighbor(Guyana, Venezuela), neighbor(Guyana, Brazil), neighbor(Guyana, Suriname),
  neighbor(Suriname, Guyana), neighbor(Suriname, Brazil), neighbor(Suriname, French_Guiana),
  neighbor(French_Guiana, Suriname), neighbor(French_Guiana, Brazil),
  neighbor(Ecuador, Colombia), neighbor(Ecuador, Peru),
  neighbor(Peru, Ecuador), neighbor(Peru, Colombia), neighbor(Peru, Brazil), neighbor(Peru, Bolivia), neighbor(Peru, Chile),
  neighbor(Brazil, Colombia), neighbor(Brazil, Venezuela), neighbor(Brazil, Guyana), neighbor(Brazil, Suriname), neighbor(Brazil, French_Guiana),
  neighbor(Brazil, Peru), neighbor(Brazil, Bolivia), neighbor(Brazil, Paraguay), neighbor(Brazil, Argentina), neighbor(Brazil, Uruguay),
  neighbor(Bolivia, Peru), neighbor(Bolivia, Brazil), neighbor(Bolivia, Chile), neighbor(Bolivia, Paraguay), neighbor(Bolivia, Argentina),
  neighbor(Chile, Peru), neighbor(Chile, Bolivia), neighbor(Chile, Argentina),
  neighbor(Argentina, Chile), neighbor(Argentina, Bolivia), neighbor(Argentina, Paraguay), neighbor(Argentina, Brazil), neighbor(Argentina, Uruguay),
  neighbor(Paraguay, Bolivia), neighbor(Paraguay, Argentina), neighbor(Paraguay, Brazil),
  neighbor(Uruguay, Argentina), neighbor(Uruguay, Brazil).
