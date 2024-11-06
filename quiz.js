let questions = [];
let currentQuestion = 0;
let score = 0;

async function fetchQuestions() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/WalissonFelipe1415/quizgame/main/quiz.json");

        if (!response.ok) {
            throw new Error(`Erro ao buscar o arquivo: ${response.status}`);
        }

        const data = await response.json();
        console.log("Dados carregados com sucesso:", data);

        questions = data;

        if (questions.length === 0) {
            throw new Error("Nenhuma pergunta encontrada.");
        }

        loadQuestion();  // Carrega a primeira pergunta
    } catch (error) {
        console.error("Erro ao carregar perguntas:", error);
        alert("Não foi possível carregar as perguntas. Verifique a URL e a conexão com a internet.");
    }
}

function loadQuestion() {
    if (currentQuestion >= questions.length) {
        showResults();
        return;
    }

    document.getElementById("nextBtn").disabled = true;

    const questionElement = document.getElementById("question");
    const optionButtons = document.querySelectorAll(".option");

    questionElement.innerText = questions[currentQuestion].question;
    optionButtons.forEach((button, index) => {
        button.innerText = questions[currentQuestion].options[index];
        button.style.backgroundColor = "#007bff";
        button.disabled = false;
    });
}

function selectOption(selectedOption) {
    const question = questions[currentQuestion];
    const optionButtons = document.querySelectorAll(".option");

    if (selectedOption === question.answer) {
        score++;
        optionButtons[selectedOption].style.backgroundColor = "#28a745";
    } else {
        optionButtons[selectedOption].style.backgroundColor = "#dc3545";
        optionButtons[question.answer].style.backgroundColor = "#28a745";
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
}

// Inicia o quiz
fetchQuestions();
