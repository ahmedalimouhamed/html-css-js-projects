const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");

const quizQuestions = [
    {
        question: "What is the capital of France?",
        answers: [
            { text: "Paris", correct: true },
            { text: "London", correct: false },
            { text: "Berlin", correct: false },
            { text: "Madrid", correct: false }
        ]
    },

    {
        question: "Which planet is known as the Red Planet?",
        answers: [
            { text: "Mars", correct: true },
            { text: "Venus", correct: false },
            { text: "Earth", correct: false },
            { text: "Jupiter", correct: false }
        ]
    },

    {
        question: "What is the largest ocean on Earth?",
        answers: [
            { text: "Atlantic Ocean", correct: false },
            { text: "Indian Ocean", correct: false },
            { text: "Arctic Ocean", correct: false },
            { text: "Pacific Ocean", correct: true }
        ]
    },

    {
        question: "Which of these is NOT a programming language?",
        answers: [
            { text: "Java", correct: false },
            { text: "Python", correct: false },
            { text: "Banana", correct: true },
            { text: "JavaScript", correct: false }
        ]
    }, 

    {
        question: "What is the chimical symbol for the gold?",
        answers: [
            { text: "Au", correct: true },
            { text: "Ag", correct: false },
            { text: "Fe", correct: false },
            { text: "Hg", correct: false }
        ]
    }
];

let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;

totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

startButton.addEventListener('click', startQuiz);
restartButton.addEventListener('click', restartQuiz);

function startQuiz(){
    currentQuestionIndex = 0;
    score  = 0;
    scoreSpan.textContent = score;

    startScreen.classList.remove("active");
    quizScreen.classList.add('active');

    showQuestion();
}

function showQuestion(){
    answersDisabled = false;

    const currentQuestion = quizQuestions[currentQuestionIndex];
    currentQuestionSpan.textContent = currentQuestionIndex + 1;

    const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
    progressBar.style.width = progressPercent + "%";

    questionText.textContent = currentQuestion.question;

    answersContainer.innerHTML = "";

    currentQuestion.answers.forEach((answer) => {
        const button = document.createElement('button');
        button.textContent = answer.text;
        button.classList.add('answer-btn');
        button.dataset.correct = answer.correct;
        button.addEventListener('click', selectAnswer);
        answersContainer.appendChild(button);
    })
}

function selectAnswer(e){
    if(answersDisabled) return;
    
    answersDisabled = true;
    
    const selectedButton = e.target;
    console.log(selectedButton);
    const isCorrect = selectedButton.dataset.correct === "true";

    Array.from(answersContainer.children).forEach(button => {
        if(button.dataset.correct === "true"){
            button.classList.add('correct');
        }else{
            button.classList.add('incorrect');
        }
    })

    if(isCorrect){
        score++;
        scoreSpan.textContent = score;
    }

    setTimeout(() => {
        currentQuestionIndex++;

        if(currentQuestionIndex < quizQuestions.length){
            showQuestion();
        }else{
            showResults();
        }
    }, 1000);
}

function showResults(){
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');

    finalScoreSpan.textContent = score;
    const percentage = (score / quizQuestions.length) * 100;

    if(percentage === 100){
        resultMessage.textContent = "Perfect! you're genius!";
    }else if(percentage >= 80){
        resultMessage.textContent = "Great job! You did well!";
    }else if(percentage >= 50){
        resultMessage.textContent = "Not bad! You can do better!";
    }else{
        resultMessage.textContent = "Keep it up! You can do better next time!";
    }
    
}

function restartQuiz(){
    resultScreen.classList.remove('active');
    startQuiz();
}
