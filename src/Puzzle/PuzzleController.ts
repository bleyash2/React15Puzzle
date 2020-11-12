import React from "react";
import * as Types from "./types";

// TODO: Add Tests

export const PuzzleWidth = 3;
const SolvedPuzzle = initialiseSolvedPuzzle();

// Helper Functions

function initialiseSolvedPuzzle(): Types.Puzzle {
  let puzzle = [];
  for (let i = 0; i < PuzzleWidth * PuzzleWidth - 1; i++) {
    puzzle[i] = i + 1;
  }
  puzzle[PuzzleWidth * PuzzleWidth - 1] = 0;
  return puzzle;
}

// Function to Randomise and Initalise Puzzle, Initally Randomly Swaps Tiles...
// If the inital Puzzle is unsolveable based on its inversions will then switch either the first two..
// ..Or last two tiles based on the position of the Empty Square
function initialisePuzzle(): Types.Puzzle {
  let puzzle = [...SolvedPuzzle];
  const arraySize = PuzzleWidth * PuzzleWidth;
  for (let i = 0; i < puzzle.length; i++) {
    let swapIndex = Math.floor(Math.random() * (arraySize - 1));
    const temp = puzzle[i];
    puzzle[i] = puzzle[swapIndex];
    puzzle[swapIndex] = temp;
  }
  if (isPuzzleSolveable(puzzle) === false) {
    if (puzzle[0] === 0 || puzzle[1] === 0) {
      const temp = puzzle[arraySize - 1];
      puzzle[arraySize - 1] = puzzle[arraySize - 2];
      puzzle[arraySize - 2] = temp;
    } else {
      const temp = puzzle[0];
      puzzle[0] = puzzle[1];
      puzzle[0] = temp;
    }
  }
  return puzzle;
}

function isPuzzleSolveable(puzzle: Types.Puzzle): boolean {
  return checkInversions(puzzle) % 2 === 0;
}

function isPuzzleComplete(puzzleState: Types.Puzzle): boolean {
  for (let i = 0; i < puzzleState.length; i++) {
    if (puzzleState[i] !== SolvedPuzzle[i]) {
      return false;
    }
  }
  return true;
}

// Function to Check the Total Inversions of the Puzzle
// Based on https://en.wikipedia.org/wiki/15_puzzle and https://en.wikipedia.org/wiki/Inversion_(discrete_mathematics)
function checkInversions(puzzleState: Types.Puzzle): number {
  let inversions: number = 0;
  for (let i = 0; i < puzzleState.length; i++) {
    for (let j = i + 1; j < puzzleState.length; j++) {
      if (puzzleState[i] > puzzleState[j] && puzzleState[j] !== 0) {
        inversions++;
      }
    }
  }
  return inversions;
}

function getMoveableValues(puzzleState: Types.Puzzle, emptySpaceIndex: number): number[] {
  let moveableValues: number[] = [];
  const emptySpaceCoOrd = {
    row: Math.floor(emptySpaceIndex / PuzzleWidth),
    col: emptySpaceIndex - PuzzleWidth * Math.floor(emptySpaceIndex / PuzzleWidth),
  };
  //Value Right of Empty Sapce
  if (emptySpaceCoOrd.col + 1 < PuzzleWidth) {
    moveableValues.push(puzzleState[emptySpaceIndex + 1]);
  }
  //Value Left of Empty Sapce
  if (emptySpaceCoOrd.col - 1 >= 0) {
    moveableValues.push(puzzleState[emptySpaceIndex - 1]);
  }
  // Value Below
  if (emptySpaceCoOrd.row + 1 < PuzzleWidth) {
    moveableValues.push(puzzleState[emptySpaceIndex + PuzzleWidth]);
  }
  // Value Above
  if (emptySpaceCoOrd.row - 1 >= 0) {
    moveableValues.push(puzzleState[emptySpaceIndex - PuzzleWidth]);
  }
  return moveableValues;
}

// React Hook to Manage Puzzle State
export function usePuzzleControler() {
  // State of Puzzle stored as Array
  const [puzzleState, setPuzzle] = React.useState<Types.Puzzle>(initialisePuzzle());
  // The Current Index of the Empty Space
  const emptySpaceIndex = puzzleState.findIndex((value) => value === 0);
  //   Find Moveable Tiles Based on the Empty Space
  const moveableValues = getMoveableValues(puzzleState, emptySpaceIndex);
  //   Bolean Value for Checking When Puzzle is Solved
  const puzzleCompleted = isPuzzleComplete(puzzleState);

  // Function to Handle the Moving of Tiles
  const moveTile = (indexToMove: number) => {
    let newPuzzleState = [...puzzleState];
    newPuzzleState[emptySpaceIndex] = puzzleState[indexToMove];
    newPuzzleState[indexToMove] = 0;
    setPuzzle(newPuzzleState);
  };

  return { puzzleState, moveableValues, emptySpaceIndex, puzzleCompleted, actions: { moveTile } };
}
