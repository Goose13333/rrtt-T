const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('currentScore');
const highScoreEl = document.getElementById('highScore');
const overlay = document.getElementById('gameOverlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlaySubtitle = document.getElementById('overlaySubtitle');
const startBtn = document.getElementById('startBtn');

let highScore = Number(localStorage.getItem('mooseRunnerHigh')) || 0;
highScoreEl.textContent = String(highScore).padStart(4, '0');

let isRunning = false;
let score = 0;
let gameSpeed = 4.2;
let frameCount = 0;
let animationId;

let mushrooms = [];
let powerTimer = 0;
let nextMushroomScore = 150;

const player = {
  x: 70,
  y: 204,
  width: 46,
  height: 50,
  dy: 0,
  jumpForce: 13.5,
  gravity: 0.72,
  grounded: false,
  jumps: 0
};

const groundY = 254;
let obstacles = [];

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(freq, duration, type = 'square') {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function playPowerupSound() {
  playSound(523, 0.1, 'triangle');
  setTimeout(() => playSound(659, 0.1, 'triangle'), 80);
  setTimeout(() => playSound(784, 0.18, 'triangle'), 160);
}

function jump() {
  if (player.jumps < 2 && isRunning) {
    player.dy = -player.jumpForce;
    player.grounded = false;
    player.jumps++;
    playSound(player.jumps === 1 ? 460 : 620, 0.12);
  }
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault();
    if (!isRunning) {
      startGame();
    } else {
      jump();
    }
  }
});

canvas.addEventListener('pointerdown', () => {
  if (isRunning) jump();
});

function startGame() {
  isRunning = true;
  score = 0;
  gameSpeed = 4.2;
  frameCount = 0;
  obstacles = [];
  mushrooms = [];
  powerTimer = 0;
  nextMushroomScore = 150;
  player.y = groundY - player.height;
  player.dy = 0;
  player.grounded = true;
  player.jumps = 0;
  canvas.style.backgroundColor = '#111622';
  overlay.style.display = 'none';
  update();
}

function spawnObstacle() {
  const type = Math.random();

  if (type > 0.72 && score > 80) {
    obstacles.push({
      kind: 'bat',
      x: canvas.width + 20,
      y: groundY - 78,
      width: 38,
      height: 24
    });
  } else {
    const isTall = Math.random() > 0.5;
    obstacles.push({
      kind: 'rock',
      x: canvas.width + 20,
      y: groundY - (isTall ? 52 : 36),
      width: isTall ? 36 : 28,
      height: isTall ? 52 : 36
    });
  }
}

function drawPlayer() {
  const x = player.x;
  const y = player.y;
  const isPowered = powerTimer > 0;

  const bodyColor = isPowered && frameCount % 6 < 3 ? '#f59e0b' : '#78350f';
  const hornColor = isPowered ? '#fef08a' : '#e7e5e4';

  ctx.fillStyle = hornColor;
  ctx.fillRect(x + 24, y, 4, 14);
  ctx.fillRect(x + 19, y + 3, 14, 4);
  ctx.fillRect(x + 17, y, 4, 6);
  ctx.fillRect(x + 31, y + 1, 4, 6);

  ctx.fillStyle = bodyColor;
  ctx.fillRect(x + 6, y + 22, 26, 15);
  ctx.fillRect(x + 24, y + 14, 10, 12);
  ctx.fillRect(x + 2, y + 24, 4, 5);

  ctx.fillRect(x + 26, y + 11, 18, 11);
  ctx.fillRect(x + 36, y + 15, 10, 8);
  ctx.fillRect(x + 30, y + 22, 4, 5);

  ctx.fillStyle = isPowered ? '#ef4444' : '#ffffff';
  ctx.fillRect(x + 31, y + 13, 3, 3);

  ctx.fillStyle = '#451a03';
  if (!player.grounded) {
    ctx.fillRect(x + 8, y + 37, 4, 8);
    ctx.fillRect(x + 14, y + 37, 4, 6);
    ctx.fillRect(x + 24, y + 37, 4, 8);
    ctx.fillRect(x + 29, y + 37, 4, 6);
  } else {
    const step = Math.floor(frameCount / 7) % 2 === 0;
    ctx.fillRect(x + 8, y + 37, 4, step ? 13 : 8);
    ctx.fillRect(x + 14, y + 37, 4, step ? 8 : 13);
    ctx.fillRect(x + 24, y + 37, 4, step ? 8 : 13);
    ctx.fillRect(x + 29, y + 37, 4, step ? 13 : 8);
  }
}

function drawObstacle(obs) {
  const x = obs.x;
  const y = obs.y;

  if (obs.kind === 'rock') {
    ctx.fillStyle = '#475569';
    const steps = 7;
    const stepHeight = obs.height / steps;

    for (let i = 0; i < steps; i++) {
      const ratio = (i + 1) / steps;
      const rowWidth = obs.width * ratio;
      const rowX = x + (obs.width - rowWidth) / 2;
      ctx.fillRect(rowX, y + i * stepHeight, rowWidth, stepHeight + 1);
    }

    ctx.fillStyle = '#64748b';
    ctx.fillRect(x + obs.width / 2 - 2, y + 5, 3, obs.height - 7);
  } else {
    ctx.fillStyle = '#07090e';
    ctx.fillRect(x + 14, y + 8, 10, 12);
    ctx.fillRect(x + 14, y + 4, 3, 4);
    ctx.fillRect(x + 21, y + 4, 3, 4);

    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x + 15, y + 10, 2, 2);
    ctx.fillRect(x + 20, y + 10, 2, 2);

    ctx.fillStyle = '#1e293b';
    const flapUp = Math.floor(frameCount / 6) % 2 === 0;
    if (flapUp) {
      ctx.fillRect(x + 2, y + 2, 12, 6);
      ctx.fillRect(x + 24, y + 2, 12, 6);
    } else {
      ctx.fillRect(x + 2, y + 12, 12, 6);
      ctx.fillRect(x + 24, y + 12, 12, 6);
    }
  }
}

function drawMushroom(m) {
  const x = m.x;
  const y = m.y;

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(x + 9, y + 12, 8, 12);

  ctx.fillStyle = '#ef4444';
  ctx.fillRect(x + 2, y + 4, 22, 9);
  ctx.fillRect(x + 6, y, 14, 4);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 6, y + 6, 3, 3);
  ctx.fillRect(x + 13, y + 3, 3, 3);
  ctx.fillRect(x + 17, y + 8, 3, 3);
}

function update() {
  if (!isRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  frameCount++;

  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(canvas.width, groundY);
  ctx.stroke();

  ctx.fillStyle = '#1e293b';
  for (let i = 0; i < 8; i++) {
    const stoneX = ((i * 115 - frameCount * gameSpeed) % canvas.width + canvas.width) % canvas.width;
    ctx.fillRect(stoneX, groundY + 8 + (i % 3) * 6, 6, 3);
  }

  if (powerTimer > 0) {
    powerTimer--;
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(20, 16, (powerTimer / 360) * 160, 8);
    ctx.font = 'bold 14px monospace';
    ctx.fillText('🍄 ЯРОСТЬ + x2 ОЧКИ!', 190, 25);
  }

  player.dy += player.gravity;
  player.y += player.dy;

  if (player.y + player.height >= groundY) {
    player.y = groundY - player.height;
    player.dy = 0;
    player.grounded = true;
    player.jumps = 0;
  }

  drawPlayer();

  const spawnRate = Math.max(65, Math.floor(125 - gameSpeed * 3));
  if (frameCount % spawnRate === 0) {
    spawnObstacle();
  }

  if (score >= nextMushroomScore) {
    mushrooms.push({
      x: canvas.width + 80,
      y: groundY - 24,
      width: 26,
      height: 24
    });
    nextMushroomScore += Math.floor(160 + Math.random() * 110);
  }

  for (let i = mushrooms.length - 1; i >= 0; i--) {
    const m = mushrooms[i];
    m.x -= gameSpeed;
    drawMushroom(m);

    if (
      player.x < m.x + m.width &&
      player.x + player.width > m.x &&
      player.y < m.y + m.height &&
      player.y + player.height > m.y
    ) {
      score += 50;
      powerTimer = 360;
      playPowerupSound();
      mushrooms.splice(i, 1);
      continue;
    }

    if (m.x + m.width < 0) {
      mushrooms.splice(i, 1);
    }
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];
    obs.x -= gameSpeed;

    drawObstacle(obs);

    if (
      player.x + 8 < obs.x + obs.width - 4 &&
      player.x + player.width - 6 > obs.x + 4 &&
      player.y + 6 < obs.y + obs.height - 4 &&
      player.y + player.height - 4 > obs.y + 4
    ) {
      if (powerTimer > 0) {
        score += 25;
        playSound(280, 0.1);
        obstacles.splice(i, 1);
        continue;
      } else {
        gameOver();
        return;
      }
    }

    if (obs.x + obs.width < 0) {
      obstacles.splice(i, 1);
    }
  }

  if (frameCount % 5 === 0) {
    score += powerTimer > 0 ? 2 : 1;
    scoreEl.textContent = String(score).padStart(4, '0');

    if (score % 100 === 0) {
      gameSpeed += 0.25;
    }

    if (score % 600 === 300) {
      canvas.style.backgroundColor = '#1c1917';
    } else if (score % 600 === 0) {
      canvas.style.backgroundColor = '#111622';
    }
  }

  animationId = requestAnimationFrame(update);
}

function gameOver() {
  isRunning = false;
  cancelAnimationFrame(animationId);
  playSound(140, 0.35);

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('mooseRunnerHigh', highScore);
    highScoreEl.textContent = String(highScore).padStart(4, '0');
  }

  overlayTitle.textContent = 'ИГРА ОКОНЧЕНА!';
  overlaySubtitle.innerHTML = `Твой счёт: <strong>${score}</strong> • Рекорд: <strong>${highScore}</strong>`;
  startBtn.textContent = '↻ ЕЩЁ РАЗ';
  overlay.style.display = 'flex';
}
