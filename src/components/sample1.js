import React from "react";
import { v4 as uuidv4 } from "uuid";
import Question from "./Question";

export default function QuizPage() {
  const [questions, setQuestions] = React.useState([]);
  const [gameCompleted, setGameCompleted] = React.useState(false);
  const [score, setScore] = React.useState(0);

  function extendAnswerObj(answer, isCorrect) {
    return {
      id: uuidv4(),
      text: answer,
      selected: false,
      isCorrect: isCorrect,
    };
  }

  React.useEffect(() => {
    async function fetchQuestions() {
      const response = await fetch("https://opentdb.com/api.php?amount=10");
      const data = await response.json();

      const results = data.results.map((result, index) => {
        const answers = result.incorrect_answers.map((answer) => {
          return extendAnswerObj(answer, false);
        });

        answers.push(extendAnswerObj(result.correct_answer, true));

        // shuffle answers
        answers.sort(() => 0.5 - Math.random());

        return {
          id: uuidv4(),
          question: result.question,
          answers: answers,
        };
      });

      setQuestions(results);
    }

    fetchQuestions();
  }, []);

  function updateQuestionAnswers(questionId, answerId) {
    if (gameCompleted) return;

    setQuestions((prevQuestions) => {
      return prevQuestions.map((prevQuestion) => {
        if (questionId !== prevQuestion.id) {
          return { ...prevQuestion };
        }

        return {
          ...prevQuestion,
          answers: prevQuestion.answers.map((answer) => {
            return {
              ...answer,
              selected: answer.id === answerId,
            };
          }),
        };
      });
    });
  }

  function checkAnswers() {
    setScore(
      questions.filter((question) => {
        return (
          question.answers.findIndex((answer) => {
            return answer.selected && answer.isCorrect;
          }) !== -1
        );
      }).length
    );

    setGameCompleted(true);
  }

  const questionEls = questions.map((question) => (
    <Question
      key={question.id}
      id={question.id}
      updateQuestionAnswers={updateQuestionAnswers}
      answers={question.answers}
      question={question.question}
    />
  ));

  return (
    <main>
      <div className="quiz-page-container">
        {questionEls}
        {gameCompleted && (
          <p>
            You scored {score}/{questions.length} correct answers
          </p>
        )}
        {questions.length > 0 && (
          <button
            onClick={checkAnswers}
            className="btn btn-check-answers"
            disabled={gameCompleted}
          >
            Check answers
          </button>
        )}
      </div>
      <img className="splash-img-top-right" src="../img/blob-yellow.png" />
      <img className="splash-img-bottom-left" src="../img/blob-blue.png" />
    </main>
  );
}
