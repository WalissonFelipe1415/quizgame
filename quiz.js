let questions = [];
let currentQuestion = 0;
let score = 0;
let shuffledOptions = [];

async function fetchQuestions() {
    try {
        const response = await fetch("./quiz.json");
        if (!response.ok) {
            throw new Error(`Erro ao buscar o arquivo: ${response.status}`);
        }

        const data = await response.json();
        console.log("Dados carregados com sucesso:", data);

        questions = shuffleArray(data);

        if (questions.length === 0) {
            throw new Error("Nenhuma pergunta encontrada.");
        }

        loadQuestion();
    } catch (error) {
        console.error("Erro ao carregar perguntas:", error);
        alert("Não foi possível carregar as perguntas. Verifique a URL e a conexão com a internet.");
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function loadQuestion() {
    if (currentQuestion >= questions.length) {
        showResults();
        return;
    }

    document.getElementById("nextBtn").disabled = true;

    const questionElement = document.getElementById("question");
    const optionButtons = document.querySelectorAll(".option");

    questionElement.innerText = `Pergunta ${currentQuestion + 1}: ${questions[currentQuestion].question}`;
    
    shuffledOptions = shuffleArray([...questions[currentQuestion].options]);
    const correctAnswerIndex = shuffledOptions.indexOf(questions[currentQuestion].options[questions[currentQuestion].answer]);

    optionButtons.forEach((button, index) => {
        button.innerText = shuffledOptions[index];
        button.style.backgroundColor = "#007bff";
        button.disabled = false;

        button.onclick = () => selectOption(index, correctAnswerIndex);
    });
}

function selectOption(selectedOption, correctAnswerIndex) {
    const optionButtons = document.querySelectorAll(".option");

    if (selectedOption === correctAnswerIndex) {
        score++;
        optionButtons[selectedOption].style.backgroundColor = "#28a745";
    } else {
        optionButtons[selectedOption].style.backgroundColor = "#dc3545";
        optionButtons[correctAnswerIndex].style.backgroundColor = "#28a745";
    }

    optionButtons.forEach(button => button.disabled = true);
    document.getElementById("nextBtn").disabled = false;
}

function nextQuestion() {
    currentQuestion++;
    loadQuestion();
}

function showResults() {
    const quizContainer = document.getElementById("quiz");
    quizContainer.innerHTML = `<h2>Você acertou ${score} de ${questions.length} perguntas!</h2>`;
    
    const restartButton = document.getElementById("restartBtn");
    restartButton.style.display = "block";
    restartButton.disabled = true;
    restartButton.classList.add("nextBtnStyle");

    let countdown = 10;
    restartButton.innerText = `Espere ${countdown} segundos para reiniciar...`;

    const countdownInterval = setInterval(() => {
        countdown--;
        restartButton.innerText = `Espere ${countdown} para reiniciar...`;
        
        if (countdown === 0) {
            clearInterval(countdownInterval);
            restartButton.disabled = false;
            restartButton.innerText = "Reiniciar";
        }
    }, 1000);
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;

    document.getElementById("restartBtn").style.display = "none";
    fetchQuestions();
}

// Inicia o quiz
fetchQuestions();
