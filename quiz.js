let questions = [];
let currentQuestion = 0;
let score = 0;
let shuffledOptions = []; // Armazena as opções embaralhadas

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

        loadQuestion();  // Carrega a primeira pergunta
    } catch (error) {
        console.error("Erro ao carregar perguntas:", error);
        alert("Não foi possível carregar as perguntas. Verifique a URL e a conexão com a internet.");
    }
}

// Função para embaralhar o array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];  // Troca os elementos de lugar
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

    // Exibe a pergunta com a numeração
    questionElement.innerText = `Pergunta ${currentQuestion + 1}: ${questions[currentQuestion].question}`;
    
    // Embaralha as opções e armazena a posição correta
    shuffledOptions = shuffleArray([...questions[currentQuestion].options]);
    const correctAnswerIndex = shuffledOptions.indexOf(questions[currentQuestion].options[questions[currentQuestion].answer]);

    optionButtons.forEach((button, index) => {
        button.innerText = shuffledOptions[index];
        button.style.backgroundColor = "#007bff";
        button.disabled = false;

        // Adiciona o evento para identificar a resposta correta
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
}

// Inicia o quiz
fetchQuestions();