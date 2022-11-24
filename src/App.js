import "./App.css";
import Quiz from "./components/Quiz";
import React from "react";
import { nanoid } from "nanoid";

function App() {
  const [quizObj, setQuizObj] = React.useState([]);
  const [gameCompleted, setgameCompleted] = React.useState(false);
  const [score, setScore] = React.useState(0);

  function resetGame() {
    setQuizObj([]);
    setgameCompleted(false);
    setScore(0);
  }
  //created a function to restructor the answer object
  function extendAnswerObj(answer, isCorrect) {
    return {
      id: nanoid(),
      text: answer,
      selected: false,
      isCorrect: isCorrect,
    };
  }
  //restructurd data. merge both correct and incorrect answers
  function dataRestructor(data) {
    const questionsObj = data.map((result) => {
      const cans = extendAnswerObj(result.correct_answer, true);
      const ians = result.incorrect_answers.map((prevObj) =>
        extendAnswerObj(prevObj, false)
      );
      return {
        ...result,
        qid: nanoid(),
        correct_answer: cans,
        incorrect_answers: ians,
        //combined and randomise both corect and incorrect answers
        answers: [cans, ...ians].sort(() => 0.5 - Math.random()),
      };
    });
    return questionsObj;
  }

  //check if game is not on first before getting new data from API
  React.useEffect(() => {
    !gameCompleted &&
      fetch("https://opentdb.com/api.php?amount=6&category=18&difficulty=easy")
        .then((res) => res.json())
        .then((data) => setQuizObj(dataRestructor(data.results)));
  }, [gameCompleted]);

  //update the setQuizObj state when an answer is selected
  function answerSelector(questionid, answerid) {
    setQuizObj((prevData) =>
      prevData.map((eachQuestion) => {
        if (eachQuestion.qid === questionid) {
          //check the question answered
          return {
            ...eachQuestion,
            answers: eachQuestion.answers.map((answer) => {
              //match update the seleted answer status
              return answer.id === answerid
                ? {
                    ...answer,
                    selected: true,
                  }
                : //return other answer and set their staus to not selected
                  { ...answer, selected: false };
            }),
          };
        } else {
          return { ...eachQuestion };
        }
      })
    );
  }

  //map through quiz state and returned redered quiz component
  const allQuize = quizObj.map((item) => {
    return (
      <Quiz
        key={nanoid()}
        id={item.qid}
        question={item.question}
        correct_answer={item.correct_answer.id}
        incorrect_answers={item.incorrect_answers}
        allAnswers={item.answers}
        handleAnswerSelector={answerSelector}
        gameCompleted={gameCompleted}
      />
    );
  });

  function checkanswer() {
    // set game completed state to true
    setgameCompleted(true);
    const countAnswer = [];
    // map through quiz state, filter answer in each and compare selected answer & correct answer
    return quizObj.map((data) => {
      let correctAnswerCount = data.answers.filter(
        (each) => each.selected && each.isCorrect
      );
      //check if correct answer array is not empty before push
      correctAnswerCount[0] && countAnswer.push(correctAnswerCount);

      setScore(countAnswer.length);
      console.log(correctAnswerCount);
    });
  }

  return (
    <div className="container">
      {/* //all quiz component */}
      {allQuize}
      <div className="newgame--action">
        {gameCompleted && (
          <h4>
            You scored {score}/{quizObj.length}
          </h4>
        )}
        {/* conditionally render check answer and paly again button */}
        {!gameCompleted ? (
          <button className="btn--check--answer" onClick={checkanswer}>
            Check answer
          </button>
        ) : (
          <button onClick={resetGame} className="btn--check--answer">
            Play again!
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
