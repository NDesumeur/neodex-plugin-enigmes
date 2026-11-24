# Valcendre: the clock of riddles

An illustrated puzzle game with a story. Tonight, the great clock of Valcendre stopped. Its 192 cogs rolled all over town, and each resident only gives theirs back to whoever solves their puzzle.

*Version française : [README.md](README.md)*

## The town

Eight districts, each with its resident:

- the Market and Mrs Brindille, the baker;
- the Port and Octave, the ferryman;
- the Clock Tower and Ysé, the archivist;
- the Hanging Gardens and Capucine, the gardener;
- the Baths and Hector, the bath master;
- the Copper Mines and Gaspard, the miner;
- the Automaton Theatre and Madame Lyre;
- the Observatory and Sélène, the astronomer.

The first district is open; **solving 7 puzzles** in a district opens the next. You choose the order of the puzzles within a district freely.

## The puzzles

192 puzzles, each with its own illustration, in about twenty kinds:

- **hands-on**: matchsticks to move, river crossings, jugs to pour, pipes to turn, key mazes, towers of Hanoi, sliding puzzles, frogs swapping places, one-stroke drawings;
- **logic**: pieces that must not threaten each other, maps to colour, Latin squares, pictures to reveal (picross), mirror drawings to complete;
- **deduction**: queues and rows to put in order, combination locks, liars and chests;
- **arithmetic, observation and riddles**, with a clock to set.

Depending on the puzzle, you type a number or a word, pick among answers, or work directly on the picture (move, turn, pour, colour). The puzzles are written in French.

## Sparks and candles

- Each puzzle is worth **sparks**, shown on its card. Each wrong answer removes 10% of its value, down to half at most.
- **Candles** light the hints, one at a time (often three per puzzle, from the subtlest to the most direct). You start with 5 candles, and each solved puzzle gives you one back. Hints cost no sparks.
- After each solved puzzle, an **explanation** walks through the solution.

## The scratchpad

On every puzzle, a **scratchpad** lets you scribble on top: pen, red and eraser, to work out a sum or mark cells.

## The ending

When every cog is returned, the clock starts again: an ending tells what happens next and shows your total sparks. The top bar always shows the cogs found out of 192, your sparks and your candles.

## Data and sync

Solved puzzles, your tries, hints and candles are stored by NeoDex, backed up and synced between your PCs when sync is on. The plugin asks for no other permission.

## Install

In NeoDex: **NeoStore → Discover → Valcendre → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).

## What's new in version 1.3.0: the mystery of the clock

- **A story to follow**: who stopped the great clock, and why?
  - **Midnight**, the black cat of the missing clockmaker, guides you from one district to the next. When you arrive in each district, a short scene shows him with its resident.
  - **The Magpie**, a thief in a feathered cape, ran over the roofs with the cogs. But is she really a thief?
- **One clue per district**: once you have solved 7 riddles in a district, its resident tells you what they saw. The clues go into **THE INVESTIGATION**, a button on the map.
- **The Magpie's feathers**: a feather is hidden in the drawing of the 4th riddle of each district. Click it to read the little note it carries and win a candle. The nine notes make a letter.
- **The final question**: with all nine clues, point out who stopped the clock. A wrong answer is explained; the right one opens the final scene.
- **Scratchpad**: two more inks, blue and green.

## What's new in version 1.2.0

- **The Station**, a ninth district, open after 7 puzzles of the Observatory: Firmin the stationmaster offers 12 puzzles, including two new kinds.
  - **Bags**: push each trunk onto a cross (arrows, buttons or click; UNDO takes back the last step).
  - **Switches**: link same-colored signals without crossing tracks, filling the whole grid.
- **Notebook**: from the map, find the puzzles you solved and replay them, with no sparks or candles at stake (also a PLAY AGAIN button under the explanation).
- **Clearer goals**: the "WHAT TO FIND" box now really says what to do, and how to play, for about thirty puzzles that explained it badly.
- Puzzle numbers within each district, map titles that fit their frame, clearly visible paths in "In one stroke".
