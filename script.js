
let titleText = document.createElement('h1');
titleText.innerHTML = 'Vanilla JS SHOOTING GAME';
titleText.className = 'title-text';
document.body.appendChild(titleText);

let container = document.createElement('div');
container.className = 'container';
document.body.appendChild(container);

let canvas = document.createElement('canvas');
canvas.className = 'canvas';
canvas.width = 400;
canvas.height = 600;
container.appendChild(canvas);

let ctx = canvas.getContext('2d'); // 그려주는 역할

let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage, livesImage;

let lives = 3;
let gameOver = false;
let score = 0;
let startButton;

let spaceshipX = canvas.width / 2 - 15;
let spaceshipY = canvas.height - 30;

let bulletList = [];
function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = spaceshipX + 7.5;
    this.y = spaceshipY;
    this.alive = true;

    bulletList.push(this);
  };

  this.update = function () {
    this.y -= 7;
  };

  this.checkHit = function () {
    for (let i = 0; i < enemyList.length; i++) {
      if (this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x + 64) {
        score++;
        this.alive = false;
        enemyList.splice(i, 1);
      }
    }
  };
}

function generateRandomValue(min, max) {
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNum;
}

let enemyList = [];
function Enemy() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = generateRandomValue(0, canvas.width - 64);
    this.y = 0;

    enemyList.push(this);
  };

  this.update = function () {
    this.y += 4; // 우주선 내려오는 속도

    // 목숨 3개
    if (this.y >= canvas.height - 64) {
      lives -= 1;
      enemyList.splice(enemyList.indexOf(this), 1);
      if (lives === 0) {
        gameOver = true;
        sessionStorage.setItem('score', score);
      }
    }
  };
}

function createEnemy() {
  const interval = setInterval(function () {
    if (!gameOver) {
      let e = new Enemy();
      e.init();
    } else {
      clearInterval(interval);
    }
  }, 1000);
}

function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src = 'images/background.jpg';

  spaceshipImage = new Image();
  spaceshipImage.src = 'images/space-fighter.png';

  bulletImage = new Image();
  bulletImage.src = 'images/bullet.png';

  enemyImage = new Image();
  enemyImage.src = 'images/ufo.png';

  gameOverImage = new Image();
  gameOverImage.src = 'images/game-over.png';

  livesImage = new Image();
  livesImage.src = 'images/heart.png';
}

let keysDown = {};
function setUpKeyboardListener() {
  document.addEventListener('keydown', function (e) {
    keysDown[e.keyCode] = true;
  });
  document.addEventListener('keyup', function (e) {
    delete keysDown[e.keyCode];

    if (e.keyCode === 32) {
      createBullet();
    }
  });
}

function createBullet() {
  let b = new Bullet();
  b.init();
}

function update() {
  if (39 in keysDown) {
    spaceshipX += 5; // 오른쪽
  } else if (37 in keysDown) {
    spaceshipX -= 5; // 왼쪽
  } else if (38 in keysDown) {
    spaceshipY -= 5; // 위
  } else if (40 in keysDown) {
    spaceshipY += 5; // 아래
  }

  if (spaceshipX <= 0) {
    spaceshipX = 0;
  } else if (spaceshipX >= canvas.width - 30) {
    spaceshipX = canvas.width - 30;
  }

  if (spaceshipY <= 0) {
    spaceshipY = 0;
  } else if (spaceshipY >= canvas.height - 30) {
    spaceshipY = canvas.height - 30;
  }

  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }

  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update();
  }
}

function StartButton() {
  startButton = document.createElement('button');
  container.appendChild(startButton);

  startButton.innerText = 'Start Game';
  startButton.className = 'start-button';

  startButton.addEventListener('click', function () {
    resetGame();
    createEnemy();
    main();
  });
}

function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
  ctx.fillText(`Score: ${score}`, 20, 40);
  ctx.font = '20px Arial';

  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  }

  for (let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
  }

  for (let i = 0; i < lives; i++) {
    ctx.drawImage(livesImage, 20 + (i * 30), 50);
  }

  if (gameOver) {
    ctx.drawImage(gameOverImage, 10, 100, 380, 300);
    ctx.fillText(`Score: ${score}`, 160, 420);
    ctx.fillText(`Previous Score: ${sessionStorage.getItem('score') || 0}`, 125, 460);
    startButton.style.display = 'block'
  }
}

function resetGame() {
  lives = 3;
  score = 0;
  gameOver = false;
  enemyList = [];
  bulletList = [];
  spaceshipX = canvas.width / 2 - 15;
  spaceshipY = canvas.height - 30;

  startButton.style.display = 'none';
}

function main() {
  if (!gameOver) {
    update();
    render();
    requestAnimationFrame(main);
  }
}

loadImage();
setUpKeyboardListener();
createEnemy();
StartButton();
