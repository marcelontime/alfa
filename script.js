// script.js

const animals = [
  { name: 'LEAO', image: 'images/leao.png' },
  { name: 'GATO', image: 'images/gato.png' },
  { name: 'ZEBRA', image: 'images/zebra.png' },
  { name: 'COBRA', image: 'images/cobra.png' },
  { name: 'PANDA', image: 'images/panda.png' },
  { name: 'CACHORRO', image: 'images/cachorro.png' },
  { name: 'GORILA', image: 'images/gorila.png' },
  { name: 'TIGRE', image: 'images/tigre.png' },
  { name: 'CANGURU', image: 'images/canguru.png' },
  { name: 'GIRAFA', image: 'images/girafa.png' },
  { name: 'ELEFANTE', image: 'images/elefante.png' },
  { name: 'RINOCERONTE', image: 'images/rinoceronte.png' },
  { name: 'GUEPARDO', image: 'images/guepardo.png' }
];

let currentAnimalIndex = 0;
let guessedLetters = [];

window.onload = function() {
  startGame();
};

function startGame() {
  loadAnimal(currentAnimalIndex);
  createKeyboard();
}

function loadAnimal(index) {
  const animal = animals[index];
  guessedLetters = Array(animal.name.length).fill('_');

  // Update the image
  const animalImage = document.getElementById('animal-image');
  animalImage.src = animal.image;

  // Display letters with transparent overlay
  displayLetters(animal.name);
}

function displayLetters(name) {
  const letterDisplay = document.getElementById('letter-display');
  letterDisplay.innerHTML = '';

  for (let i = 0; i < name.length; i++) {
    const letterSlot = document.createElement('div');
    letterSlot.classList.add('letter-slot');

    // Transparent letter overlay
    const transparentLetter = document.createElement('div');
    transparentLetter.classList.add('transparent-letter');
    transparentLetter.textContent = name[i];

    // Placeholder for guessed letter
    const guessedLetter = document.createElement('div');
    guessedLetter.classList.add('guessed-letter');
    guessedLetter.id = `letter-${i}`;

    letterSlot.appendChild(transparentLetter);
    letterSlot.appendChild(guessedLetter);
    letterDisplay.appendChild(letterSlot);
  }
}

function createKeyboard() {
  const keyboard = document.getElementById('keyboard');
  keyboard.innerHTML = '';

  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    const button = document.createElement('button');
    button.textContent = letter;
    button.id = `key-${letter}`;
    button.addEventListener('click', () => handleLetterClick(letter));
    keyboard.appendChild(button);
  }
}

function getRandomSound(folder) {
  const sounds = {
    correct: ['correct.mp3', 'correct2.mp3', 'correct3.mp3', 'correct4.mp3'],
    incorrect: ['incorrect.mp3', 'incorrect1.mp3', 'incorrect2.mp3', 'incorrect3.mp3'],
  };
  const soundList = sounds[folder];
  const randomIndex = Math.floor(Math.random() * soundList.length);
  return `sounds/${folder}/${soundList[randomIndex]}`;
}

function handleLetterClick(letter) {
  const animal = animals[currentAnimalIndex];
  const keyboardButton = document.getElementById(`key-${letter}`);
  keyboardButton.disabled = true;
  keyboardButton.classList.add('disabled');

  if (animal.name.includes(letter)) {
    // Play a random correct sound
    const correctSound = new Audio(getRandomSound('correct'));
    correctSound.play();

    // Correct guess
    for (let i = 0; i < animal.name.length; i++) {
      if (animal.name[i] === letter) {
        const letterSpan = document.getElementById(`letter-${i}`);
        letterSpan.textContent = letter;

        // Play correct letter animation
        letterSpan.classList.add('correct-letter-animation');
        setTimeout(() => {
          letterSpan.classList.remove('correct-letter-animation');
        }, 500);

        // Add sparkle effect
        createSparkle(letterSpan);

        guessedLetters[i] = letter;
      }
    }

    // Check if the word is fully guessed
    if (guessedLetters.join('') === animal.name) {
      // Play celebration animation
      playCelebrationAnimation();

      // Launch rocket and then show message
      launchRocket(() => {
        showMessage('Great job!', () => {
          moveToNextAnimal();
        });
      });
    }
  } else {
    // Play a random incorrect sound
    const incorrectSound = new Audio(getRandomSound('incorrect'));
    incorrectSound.play();

    // Incorrect guess, shake the screen
    shakeScreen();
  }
}

function createSparkle(element) {
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';
  element.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 1000);
}

function shakeScreen() {
  const gameContainer = document.getElementById('game-container');
  gameContainer.classList.add('shake');

  setTimeout(() => {
    gameContainer.classList.remove('shake');
  }, 500);
}

function launchRocket(callback) {
  const rocket = document.createElement('div');
  rocket.className = 'rocket';
  const celebrationContainer = document.getElementById('celebration-container');
  celebrationContainer.appendChild(rocket);
  
  // Wait for the rocket animation to complete
  setTimeout(() => {
    rocket.remove();
    if (callback) callback();
  }, 2000);
}

function playCelebrationAnimation() {
  // Use confetti.js for celebration
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#bb0000', '#ffffff'],
  });
}

function moveToNextAnimal() {
  currentAnimalIndex++;
  if (currentAnimalIndex < animals.length) {
    loadAnimal(currentAnimalIndex);
    resetKeyboard();
  } else {
    // Show final message
    showMessage('Congratulations! You completed the level!', () => {
      // Implement logic for the next level or ending the game
    });
  }
}

function resetKeyboard() {
  const buttons = document.querySelectorAll('#keyboard button');
  buttons.forEach(button => {
    button.disabled = false;
    button.classList.remove('disabled');
  });
}

function showMessage(message, callback) {
  const messageOverlay = document.getElementById('message-overlay');
  messageOverlay.textContent = message;
  messageOverlay.classList.add('show');

  setTimeout(() => {
    messageOverlay.classList.remove('show');
    if (callback) callback();
  }, 2000); // Display the message for 2 seconds
}
