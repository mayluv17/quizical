import React from "react";
import he from "he";

export default function Quick(props) {
  //update selected answers classname in the answers (options) component
  const newAnswers = props.allAnswers.map((item) => {
    const answerClassname = item.selected
      ? "answer--selector selected"
      : "answer--selector";

    //if the game is completed mark the correct answers
    const correctScoreClassName =
      (props.gameCompleted && item.selected && item.isCorrect) ||
      (props.gameCompleted && item.isCorrect)
        ? "true"
        : props.gameCompleted && item.selected && !item.isCorrect
        ? "false"
        : "";
    return (
      <div
        key={item.id}
        className={answerClassname + " " + correctScoreClassName}
        onClick={() => props.handleAnswerSelector(props.id, item.id)}
      >
        {he.decode(item.text)}
      </div>
    );
  });

  return (
    <div>
      <div className="each--quiz">
        <div className="quiz">
          <h3 className="question" data-questionid={props.id}>
            {he.decode(props.question)}
          </h3>
          <div className="answers">{newAnswers}</div>
        </div>
      </div>
    </div>
  );
}
