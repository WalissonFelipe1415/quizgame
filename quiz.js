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

        // Embaralha as perguntas e seleciona apenas as primeiras 10
        questions = shuffleArray(data).slice(0, 10);

        if (questions.length === 0) {
            throw new Error("Nenhuma pergunta encontrada.");
        }

        loadQuestion();
    } catch (error) {
        const questionElement = document.getElementById("question");
        console.error("Erro ao carregar perguntas:", error);
        alert("Não foi possível carregar as perguntas. Verifique a URL e a conexão com a internet.");
        questionElement.innerText = `Não foi possível carregar as perguntas. Verifique a URL e a conexão com a internet.`;
        
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

    const labels = ['a', 'b', 'c', 'd']; // Adiciona os rótulos das opções

    optionButtons.forEach((button, index) => {
        button.innerText = `${labels[index]}) ${shuffledOptions[index]}`; // Inclui o rótulo antes do texto
        button.style.backgroundColor = "#007bff";
        optionButtons[correctAnswerIndex].style.border = "#0054ab";
        button.disabled = false;
        button.onclick = () => selectOption(index, correctAnswerIndex);
    });
}

function selectOption(selectedOption, correctAnswerIndex) {
    const optionButtons = document.querySelectorAll(".option");

    if (selectedOption === correctAnswerIndex) {
        score++;
        optionButtons[selectedOption].style.backgroundColor = "#28a745";
        optionButtons[correctAnswerIndex].style.border = "#0054ab";
    } else {
        optionButtons[selectedOption].style.backgroundColor = "#dc3545";
        optionButtons[selectedOption].style.border = "#ab0000";
        optionButtons[correctAnswerIndex].style.backgroundColor = "#28a745";
        optionButtons[correctAnswerIndex].style.border = "#0054ab";
    }

    optionButtons.forEach(button => button.disabled = true);
    document.getElementById("nextBtn").disabled = false;
}

function nextQuestion() {
    currentQuestion++;
    loadQuestion();
}
function restartQuiz() {
    currentQuestion = 0;
    score = 0;

    document.getElementById("restartBtn").style.display = "none";
    fetchQuestions();
}
function showResults() {
    const quizContainer = document.getElementById("quiz");
    quizContainer.innerHTML = `<h2>Você acertou ${score} de ${questions.length} perguntas!</h2>`;
    document.getElementById("restartBtn").style.display = "block";  // Exibe o botão de reiniciar
}

// Inicia o quiz
fetchQuestions();
