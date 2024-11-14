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

    optionButtons.for