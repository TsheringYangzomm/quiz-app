// Quiz questions by category
const quizQuestions = {
  math: [
    { question: "What is 2 + 2?", options: ["2", "3", "4", "5"], answer: "4" },
    { question: "What is 5 * 3?", options: ["8", "15", "10", "20"], answer: "15" },
    { question: "What is 10 / 2?", options: ["5", "7", "8", "12"], answer: "5" },
    { question: "What is 15 - 7?", options: ["5", "8", "6", "9"], answer: "8" },
    { question: "What is 6 * 6?", options: ["30", "36", "40", "42"], answer: "36" }
  ],
  science: [
    { question: "What planet is known as the Red Planet?", options: ["Earth", "Venus", "Mars", "Jupiter"], answer: "Mars" },
    { question: "Water boils at what temperature in Celsius?", options: ["90", "95", "100", "110"], answer: "100" },
    { question: "What is the chemical symbol for water?", options: ["O2", "H2O", "CO2", "H2"], answer: "H2O" },
    { question: "Which gas do plants absorb?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], answer: "Carbon Dioxide" },
    { question: "What is the speed of light?", options: ["300,000 km/s", "400,000 km/s", "200,000 km/s", "500,000 km/s"], answer: "300,000 km/s" }
  ],
  it: [
    { question: "What does 'HTTP' stand for?", options: ["Hyper Text Transfer Protocol", "Hyper Tool Transfer Protocol", "HyperText Transport Protocol", "None of the above"], answer: "Hyper Text Transfer Protocol" },
    { question: "Main language for Android apps?", options: ["Swift", "Java", "Python", "C#"], answer: "Java" },
    { question: "Which of these is an OS?", options: ["Ubuntu", "Python", "HTML", "JavaScript"], answer: "Ubuntu" },
    { question: "Who developed Java?", options: ["Microsoft", "Apple", "Sun Microsystems", "Google"], answer: "Sun Microsystems" },
    { question: "Full form of CSS?", options: ["Cascading Style Sheets", "Cascading Script Sheets", "Computer Style Sheets", "Central Style Sheets"], answer: "Cascading Style Sheets" }
  ]
};

// Global variables
let quizData = [];
let currentIndex = 0;
let score = 0;
let selectedOption = null;
let countdown;
let timeLeft = 10;
let startTime = Date.now();
const user = localStorage.getItem("quizUser") || "Guest";

// DOM Elements
const welcomeText = document.getElementById("welcomeText");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const timerEl = document.getElementById("timer");
const categoryTitle = document.getElementById("categoryTitle");

// Display welcome text if element exists
if (welcomeText) welcomeText.textContent = `Hello, ${user}! Good luck!`;

// Load quiz question
function loadQuestion() {
  clearInterval(countdown);
  nextBtn.disabled = true;
  selectedOption = null;

  const category = localStorage.getItem("selectedCategory");
  quizData = quizQuestions[category];

  if (categoryTitle) {
    categoryTitle.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} Quiz`;
  }

  if (currentIndex >= quizData.length) {
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    const results = JSON.parse(localStorage.getItem("quizResults") || "[]");
    results.push({ name: user, score: `${score}/${quizData.length}`, time: timeTaken });
    localStorage.setItem("quizResults", JSON.stringify(results));
    window.location.href = "result.html";
    return;
  }

  const current = quizData[currentIndex];
  questionEl.textContent = `Q${currentIndex + 1}: ${current.question}`;
  optionsEl.innerHTML = "";

  current.options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = option;
    btn.onclick = () => selectAnswer(btn, current.answer);
    optionsEl.appendChild(btn);
  });

  updateProgress();
  startTimer();
}

function selectAnswer(btn, correctAnswer) {
  if (selectedOption) selectedOption.classList.remove("selected");
  selectedOption = btn;
  btn.classList.add("selected");

  // Disable all buttons
  document.querySelectorAll(".option-btn").forEach(button => {
    button.disabled = true;
  });

  if (btn.textContent === correctAnswer) {
    score++;
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
  }

  nextBtn.disabled = false;
}

function startTimer() {
  timeLeft = 10;
  timerEl.textContent = `Time Left: ${timeLeft}s`;
  countdown = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(countdown);
      disableOptions();
      nextBtn.disabled = false;
    }
  }, 1000);
}

function disableOptions() {
  document.querySelectorAll(".option-btn").forEach(btn => {
    btn.disabled = true;
    btn.style.opacity = 0.6;
  });
}

function updateProgress() {
  const progressPercent = ((currentIndex + 1) / quizData.length) * 100;
  const progressFill = document.getElementById("progress-fill");
  const progressText = document.getElementById("progress-text");
  if (progressFill && progressText) {
    progressFill.style.width = `${progressPercent}%`;
    progressText.textContent = `${currentIndex + 1} / ${quizData.length}`;
  }
}

// Handle next question
nextBtn.onclick = function () {
  currentIndex++;
  loadQuestion();
};

// Auto-load if on quiz page
if (questionEl) {
  loadQuestion();
}
// 🌙 Dark Mode Toggle Logic
const darkToggle = document.getElementById("darkModeToggle");
const overlay = document.querySelector(".overlay");
const body = document.body;

// Load saved mode from localStorage
const savedMode = localStorage.getItem("darkMode");
if (savedMode === "enabled") {
  body.classList.add("dark-mode");
  if (overlay) overlay.style.display = "block";
  if (darkToggle) darkToggle.checked = true;
}

// Toggle dark mode on checkbox click
if (darkToggle) {
  darkToggle.addEventListener("change", () => {
    if (darkToggle.checked) {
      body.classList.add("dark-mode");
      if (overlay) overlay.style.display = "block";
      localStorage.setItem("darkMode", "enabled");
    } else {
      body.classList.remove("dark-mode");
      if (overlay) overlay.style.display = "none";
      localStorage.setItem("darkMode", "disabled");
    }
  });
}


// After finishing a category (in `loadQuestion()` or when a user completes a category):
function markCategoryAsCompleted(category) {
  const completedCategories = JSON.parse(localStorage.getItem("completedCategories") || "[]");
  if (!completedCategories.includes(category)) {
    completedCategories.push(category);
    localStorage.setItem("completedCategories", JSON.stringify(completedCategories));
  }
}

if (currentIndex >= quizData.length) {
  markCategoryAsCompleted(category); // Mark the current category as completed
  // Continue with result saving...
}

function downloadCertificate() {
  const doc = new jsPDF();
  doc.text("Certificate of Completion", 20, 20);
  doc.text(`Congratulations, ${user}!`, 20, 30);
  doc.text("You have completed all the quiz categories.", 20, 40);
  doc.save("certificate.pdf");
}
