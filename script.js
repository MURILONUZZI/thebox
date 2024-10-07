const box = document.getElementById('box');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const gameContainer = document.getElementById('game-container');
const playButton = document.getElementById('play-button');
const restartButton = document.getElementById('restart-button');
const countdownElement = document.getElementById('countdown');
const nameInput = document.getElementById('name-input');
const rankingList = document.getElementById('ranking-list');
const progressBar = document.getElementById('progress-bar');
const instructionsButton = document.getElementById('instructions-button');
const instructions = document.getElementById('instructions');
const instructionsClose = document.getElementById('instructions-close');
const stats = document.getElementById('stats');
const statsContent = document.getElementById('stats-content');
const statsClose = document.getElementById('stats-close');
const finalScoreElement = document.getElementById('final-score');
const clicksPerSecondElement = document.getElementById('clicks-per-second');

// Variáveis globais
let score = 0;
let timeLeft = 30;
let gameInterval;
let isGameActive = false;
let clicks = 0;

// Sons
const clickSound = document.getElementById('click-sound');
const countdownSound = document.getElementById('countdown-sound');

// Função para atualizar o ranking
function updateRanking() {
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    rankingList.innerHTML = '';

    ranking.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.score} pontos`;
        rankingList.appendChild(li);
    });
}

// Função para iniciar o jogo
function startGame() {
    const playerName = nameInput.value.trim();
    if (playerName === '') {
        alert('Por favor, insira seu nome antes de começar o jogo.');
        return;
    }

    // Oculta o botão de play
    playButton.style.display = 'none';

    // Redefine as variáveis do jogo
    score = 0;
    timeLeft = 30;
    clicks = 0;
    isGameActive = true;

    // Atualiza a pontuação e o timer
    scoreElement.textContent = `Pontuação: ${score}`;
    timerElement.textContent = `Tempo: ${timeLeft}`;

    // Reseta a barra de progresso
    progressBar.style.width = '100%';

    // Inicia a contagem regressiva para início do jogo
    countdownElement.textContent = '3';
    countdownElement.style.display = 'block';

    countdownSound.play();
    setTimeout(() => {
        countdownElement.textContent = '2';
        countdownSound.play();
    }, 1000);
    setTimeout(() => {
        countdownElement.textContent = '1';
        countdownSound.play();
    }, 2000);
    setTimeout(() => {
        countdownElement.textContent = 'GO!';
        countdownSound.play();
        setTimeout(() => {
            countdownElement.style.display = 'none';
            box.style.display = 'block';
            moveBox();
            restartButton.style.display = 'inline-block';
            gameInterval = setInterval(updateTimer, 1000); // Inicia o cronômetro após a contagem regressiva
        }, 500);
    }, 3000);
}

// Função para atualizar o timer
function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timerElement.textContent = `Tempo: ${timeLeft}`;
        progressBar.style.width = `${(timeLeft / 30) * 100}%`;
    } else {
        endGame();
    }
}

// Função para mover a caixa para uma posição aleatória
function moveBox() {
    const containerRect = gameContainer.getBoundingClientRect();
    const boxSize = box.getBoundingClientRect();
    const maxLeft = containerRect.width - boxSize.width;
    const maxTop = containerRect.height - boxSize.height;

    const randomLeft = Math.floor(Math.random() * maxLeft);
    const randomTop = Math.floor(Math.random() * maxTop);

    box.style.left = `${randomLeft}px`;
    box.style.top = `${randomTop}px`;

    box.style.transform = 'scale(1.1)';
    setTimeout(() => {
        box.style.transform = 'scale(1)';
    }, 100);
}

// Função para finalizar o jogo
function endGame() {
    clearInterval(gameInterval);
    box.style.display = 'none';
    isGameActive = false;

    // Exibe as estatísticas
    stats.style.display = 'flex';
    finalScoreElement.textContent = `Pontuação Final: ${score}`;
    clicksPerSecondElement.textContent = `Cliques por Segundo: ${(clicks / 30).toFixed(2)}`;

    // Salva o ranking
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    const playerName = nameInput.value.trim();

    ranking.push({ name: playerName, score: score });
    ranking.sort((a, b) => b.score - a.score);
    if (ranking.length > 10) {
        ranking.pop();
    }
    localStorage.setItem('ranking', JSON.stringify(ranking));
    updateRanking();
}

// Função para manipular o clique na caixa
function handleBoxClick() {
    if (isGameActive) {
        score++;
        clicks++;
        scoreElement.textContent = `Pontuação: ${score}`;
        moveBox();

        // Reproduz o som do clique
        clickSound.currentTime = 0;
        clickSound.play();
    }
}

// Eventos de clique e toque
box.addEventListener('click', handleBoxClick);
box.addEventListener('touchstart', handleBoxClick);
playButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

// Fecha as instruções
instructionsClose.addEventListener('click', () => {
    instructions.style.display = 'none';
});

// Abre as instruções
instructionsButton.addEventListener('click', () => {
    instructions.style.display = 'flex';
});

// Fecha as estatísticas
statsClose.addEventListener('click', () => {
    stats.style.display = 'none';
});

// Atualiza o ranking ao carregar a página
updateRanking();
