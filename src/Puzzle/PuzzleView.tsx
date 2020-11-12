import React, { Fragment } from "react";
import { usePuzzleControler, PuzzleWidth } from "./PuzzleController";
import "./style.css";

// TODO: Add Win Screen and Reset Puzzle Button

export default function PuzzleView() {
  const { puzzleState, moveableValues, actions, puzzleCompleted } = usePuzzleControler();

  const getTileStyle = () => {
    return {
      width: `calc(100% / ${PuzzleWidth})`,
      height: `calc(100% / ${PuzzleWidth})`,
    };
  };

  return (
    <div className="puzzleWrapper">
      <div className="header">{puzzleCompleted ? "Puzzle Complete" : ""}</div>
      <div className="puzzle">
        {puzzleState.map((value, index) => (
          <Fragment key={index}>
            {value !== 0 ? (
              <div
                onClick={moveableValues.includes(value) ? () => actions.moveTile(index) : () => {}}
                className={`puzzleTile ${moveableValues.includes(value) ? "moveable" : ""}`}
                style={getTileStyle()}
              >
                {value}
              </div>
            ) : (
              <div style={getTileStyle()} className="puzzleTile emptySpace"></div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
