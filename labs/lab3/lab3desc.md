# Lab 3 - Arrays

1. Use the reduce method in combination with the concat method to “flatten” an array of arrays into a single array that has all the elements of the input array. E.g. `[[1,2], [3,4]]` should become `[1,2,3,4]`. To test, create and print out an array of arrays. Flatten it, then print out again. (2 pts)

2. Write a function using the higher order functions learned so far that takes an array of person objects discussed in lecture and adds a property to each object called “generation.” If a person was born 1940 and before, they are in the “Greatest Generation.” If they are born from 1941 to 1965, they are “Baby Boomers.” If they are born from 1966 to 1976, they are “Generation X,” if they are born from 1977 to  1995, they are “Milennials,” and if they are born 1996 and later they are “Gen Z.” To test, create an array of at least 10 persons of varying generations (include at least 2 millennials and run the function to test it, printing out each of the persons with the additional generation property. (3 pts)

3. Using your person data, filter out all the people who are not millennials. Create a new function that uses map to transform each of these people objects into single strings that have their first and last name, a colon, and “Pokemon Go Fan.”

To test, print out all these strings (or you can just print the array as a whole). (3 pts)

Submit your code in a single JavaScript file here. Make sure you include your tests: no test, no points!
