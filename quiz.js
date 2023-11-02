const questions = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    answer: 0
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Venus", "Jupiter"],
    answer: 1
  },
  {
    question: "What is the largest mammal?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    answer: 1
  },
  {
    question: "Which famous scientist developed the theory of relativity?",
    options: ["Isaac Newton", "Galileo Galilei", "Albert Einstein", "Nikola Tesla"],
    answer: 2
  },
  {
    question: "What is the smallest prime number?",
    options: ["1", "2", "3", "5"],
    answer: 1
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    answer: 3
  },
  {
    question: "What is the largest country in the world by land area?",
    options: ["Canada", "Russia", "United States", "China"],
    answer: 1
  },
  {
    question: "Who directed the movie 'Jurassic Park'?",
    options: ["Steven Spielberg", "James Cameron", "George Lucas", "Christopher Nolan"],
    answer: 0
  },
  {
    question: "What is the chemical symbol for the element gold?",
    options: ["Fe", "Au", "Ag", "Hg"],
    answer: 1
  },
  {
    question: "In which sport would you perform a slam dunk?",
    options: ["Soccer", "Basketball", "Tennis", "Golf"],
    answer: 1
  },
  {
    question: "Who was the first President of the United States?",
    options: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"],
    answer: 1
  },
  {
    question: "Who wrote the novel 'To Kill a Mockingbird'?",
    options: ["Charles Dickens", "Harper Lee", "Mark Twain", "F. Scott Fitzgerald"],
    answer: 1
  },
  {
    question: "Which band is known for their hit song 'Bohemian Rhapsody'?",
    options: ["Queen", "Pink Floyd", "Led Zeppelin", "The Beatles"],
    answer: 0
  },
  {
    question: "What is the largest species of shark?",
    options: ["Tiger Shark", "Whale Shark", "Hammerhead Shark", "Great White Shark"],
    answer: 3
  },
  {
    question: "Who painted the 'Mona Lisa'?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Michelangelo", "Leonardo da Vinci"],
    answer: 3
  },
  {
    question: "What does the acronym 'HTML' stand for in web development?",
    options: ["Hyperlinking Textual Markup Language", "HyperText Markup Language", "High-Level Text Markup Language", "Hyper Transfer Markup Language"],
    answer: 1
  }
];

let currentQuestions = [];
let currentQuestionIndex = 0;
let playerScore = 0;

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-btn");
const resultElement = document.getElementById("result");
const scoreElement = document.getElementById("score");

let highestScore = 0;
let highestScorePlayer = "";

const players = [];

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Select and shuffle 5 random questions from the allQuestions array
function selectRandomQuestions() {
  currentQuestions = [...questions]; // Create a copy of allQuestions
  shuffleArray(currentQuestions); // Shuffle the copy
  currentQuestions = currentQuestions.slice(0, 5); // Select the first 5 questions
}

// Function to show the current question
function showQuestion() {
  const currentQuestion = currentQuestions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;
  optionsElement.innerHTML = "";

  currentQuestion.options.forEach((option, index) => {
    const optionButton = document.createElement("button");
    optionButton.textContent = option;
    optionButton.addEventListener("click", () => checkAnswer(index));
    optionsElement.appendChild(optionButton);
  });
}

// Initialize the quiz by selecting and shuffling 5 random questions
selectRandomQuestions();
showQuestion();


function checkAnswer(selectedIndex) {
  const currentQuestion = currentQuestions[currentQuestionIndex]; // Use currentQuestions
  const selectedOption = currentQuestion.options[selectedIndex];
  
  optionsElement.innerHTML = ""; // Clear the options after an answer is selected
  
  if (selectedIndex === currentQuestion.answer) {
    playerScore++;
    displayFeedback(true);
  } else {                
    displayFeedback(false, currentQuestion.options[currentQuestion.answer]);
  }
  
  updateScore(playerScore); // Update the user's score in the HTML
  nextButton.style.display = "block"; // Show the "Next" button after an answer is selected
}


function displayFeedback(isCorrect, correctAnswer) {
  const feedbackElement = document.createElement("p");
  
  if (isCorrect) {
    feedbackElement.textContent = "Correct!";
  } else {
    feedbackElement.textContent = "Wrong! The correct answer was: " + correctAnswer;
  }
  optionsElement.appendChild(feedbackElement);
}

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;

  if (currentQuestionIndex < currentQuestions.length) {
    showQuestion();
    nextButton.style.display = "none";
  } else {
    showResult(); // Moved the showResult call here
  }
});

// Function to display fireworks
function displayFireworks() {
  const fireworksContainer = document.getElementById("fireworks");

  for (let i = 0; i < 100; i++) {
    const firework = document.createElement("div");
    firework.classList.add("firework");
    firework.style.left = Math.random() * 100 + "vw";
    fireworksContainer.appendChild(firework);

    // Remove the firework element after the animation
    firework.addEventListener("animationiteration", () => {
      firework.remove();
    });
  }
}

function displayBalloons() {
  const balloonsContainer = document.getElementById("balloons");

  for (let i = 0; i < 10; i++) {
    const balloon = document.createElement("div");
    balloon.classList.add("balloon");
    balloon.style.left = Math.random() * 100 + "vw";
    balloonsContainer.appendChild(balloon);

    // Remove the balloon element after a delay
    setTimeout(() => {
      balloon.remove();
    }, 10000); // Remove after 10 seconds
  }
}

function showResult() {
  questionElement.style.display = "none";
  optionsElement.style.display = "none";
  nextButton.style.display = "none";
  resultElement.style.display = "block";

  const resultText = `Quiz completed! Your score: ${playerScore}/${5}`;

  // Create and append elements for result and highest score information
  const resultTextElement = document.createElement("p");
  resultTextElement.textContent = resultText;
  resultElement.appendChild(resultTextElement);

  showPlayerInfo(user);

  if (playerScore === 5) {
    displayFireworks(); // Display fireworks when the player scores 5 points
    displayBalloons(); // Display balloons when the player scores 5 points
  }
}

function updateScore(Score) {
  scoreElement.textContent = `Score: ${Score}`;
}

function showPlayerInfo(user) {
  const playerInfoElement = document.createElement("p");
  playerInfoElement.textContent = `Player: ${user.username} | Score: ${playerScore}`;
  resultElement.appendChild(playerInfoElement);
}

function sendScoreToPython(playerScore) {
  fetch('/receive-score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ playerScore }),
  })
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error('Score not received.');
      }
    })
    .then((data) => {
      console.log(data); // This will log the response from the Python server
    })
    .catch((error) => {
      console.error(error);
    });
}

// Call this function to send the playerScore to the Python server when needed
sendScoreToPython(playerScore);

showQuestion(questions[currentQuestionIndex]);
