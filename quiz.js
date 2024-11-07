let questions = [];
let currentQuestion = 0;
let score = 0;

async function fetchQuestions() {
    try {
        const response = await fetch("./quiz.json");
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

    // Embaralha as opções para cada pergunta
    const shuffledOptions = questions[currentQuestion].options
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    questionElement.innerText = questions[currentQuestion].question;
    optionButtons.forEach((button, index) => {
        button.innerText = shuffledOptions[index];
        button.style.backgroundColor = "#007bff";
        button.disabled = false;
        
        // Adiciona o evento de clique para verificar a resposta correta
        button.onclick = () => selectOption(button.innerText);
    });
}

function selectOption(selectedOptionText) {
    const question = questions[currentQuestion];
    const optionButtons = document.querySelectorAll(".option");

    // Verifica se a opção selecionada corresponde à resposta correta
    if (selectedOptionText === question.options[question.answer]) {
        score++;
        optionButtons.forEach(button => {
            if (button.innerText === selectedOptionText) {
                button.style.backgroundColor = "#28a745";  // Cor verde para resposta correta
            }
        });
    } else {
        optionButtons.forEach(button => {
            if (button.innerText === selectedOptionText) {
                button.style.backgroundColor = "#dc3545";  // Cor vermelha para resposta incorreta
            } else if (button.innerText === question.options[question.answer]) {
                button.style.backgroundColor = "#28a745";  // Cor verde para a resposta correta
            }
        });
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