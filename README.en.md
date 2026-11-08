# Valcendre: the clock of riddles

An illustrated puzzle game with a story. Tonight, the great clock of Valcendre stopped. Its 180 cogs rolled all over town, and each resident only gives theirs back to whoever solves their puzzle.

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

180 puzzles, each with its own illustration, in about twenty kinds:

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

When every cog is returned, the clock starts again: an ending tells what happens next and shows your total sparks. The top bar always shows the cogs found out of 180, your sparks and your candles.

## Data and sync

Solved puzzles, your tries, hints and candles are stored by NeoDex, backed up and synced between your PCs when sync is on. The plugin asks for no other permission.

## Install

In NeoDex: **NeoStore → Discover → Valcendre → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
