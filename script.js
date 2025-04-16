// script.js
const quizData = [
    {
      question: "What is the capital of Japan?",
      options: ["Tokyo", "Seoul", "Beijing", "Bangkok"],
      answer: "Tokyo"
    },
    {
      question: "Which language runs in the browser?",
      options: ["Java", "Python", "C++", "JavaScript"],
      answer: "JavaScript"
    },
    {
      question: "What does CSS stand for?",
      options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Code Styling Sheet"],
      answer: "Cascading Style Sheets"
    }
  ];
  
  const user = localStorage.getItem("quizUser");
  let score = 0;
  let currentIndex = 0;
  let startTime = Date.now();
  
  const welcomeText = document.getElementById("welcomeText");
  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");
  const confirmBtn = document.getElementById("confirmBtn");
  const nextBtn = document.getElementById("nextBtn");
  const timerEl = document.getElementById("timer");
  
  if (user && welcomeText) {
    welcomeText.textContent = `Hello, ${user}! Good luck!`;
  }
  
  let selectedOption = null;
  let countdown;
  let timeLeft = 10;
  
  function startTimer() {
    clearInterval(countdown);
    timeLeft = 10;
    timerEl.textContent = `Time Left: ${timeLeft}s`;
  
    countdown = setInterval(() => {
      timeLeft--;
      timerEl.textContent = `Time Left: ${timeLeft}s`;
  
      if (timeLeft <= 0) {
        clearInterval(countdown);
        confirmBtn.disabled = true;
        disableOptions();
        nextBtn.disabled = false;
      }
    }, 1000);
  }
  
  function disableOptions() {
    const buttons = document.querySelectorAll(".option-btn");
    buttons.forEach(btn => {
      btn.disabled = true;
      btn.style.opacity = 0.6;
    });
  }
  
  function loadQuestion() {
    clearInterval(countdown);
    nextBtn.disabled = true;
    confirmBtn.disabled = true;
    selectedOption = null;
  
    const current = quizData[currentIndex];
    questionEl.textContent = current.question;
    optionsEl.innerHTML = "";
  
    current.options.forEach(option => {
      const btn = document.createElement("button");
      btn.classList.add("option-btn");
      btn.textContent = option;
      btn.onclick = () => selectAnswer(btn, option);
      optionsEl.appendChild(btn);
    });
  
    startTimer();
  }
  
  function selectAnswer(btn, answer) {
    if (selectedOption) {
      selectedOption.classList.remove("selected");
    }
    selectedOption = btn;
    btn.classList.add("selected");
    confirmBtn.disabled = false;
  }
  
  confirmBtn.onclick = () => {
    clearInterval(countdown);
    const correctAnswer = quizData[currentIndex].answer;
    const isCorrect = selectedOption.textContent === correctAnswer;
  
    const allButtons = document.querySelectorAll(".option-btn");
    allButtons.forEach(btn => {
      btn.disabled = true;
      if (btn.textContent === correctAnswer) {
        btn.classList.add("correct");
      } else if (btn === selectedOption && !isCorrect) {
        btn.classList.add("wrong");
      }
    });
  
    if (isCorrect) score++;
    nextBtn.disabled = false;
  };
  
  nextBtn.onclick = () => {
    currentIndex++;
    if (currentIndex < quizData.length) {
      loadQuestion();
    } else {
      clearInterval(countdown);
      const endTime = Date.now();
      const timeTaken = Math.floor((endTime - startTime) / 1000);
  
      const users = JSON.parse(localStorage.getItem("quizResults") || "[]");
      users.push({ name: user, score: `${score}/${quizData.length}`, time: timeTaken });
      localStorage.setItem("quizResults", JSON.stringify(users));
  
      window.location.href = "result.html";
    }
  };
  
  if (questionEl) loadQuestion();
  