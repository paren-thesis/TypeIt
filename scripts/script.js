// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameArea = document.getElementById('game-area');
const resultScreen = document.getElementById('result-screen');
const settingsScreen = document.getElementById('settings-screen');
const pauseScreen = document.getElementById('pause-screen');
const textDisplay = document.getElementById('text-display');
const inputField = document.getElementById('input-field');
const startBtn = document.getElementById('start-btn');
const settingsBtn = document.getElementById('settings-btn');
const pauseBtn = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');
const restartBtn = document.getElementById('restart-btn');
const quitBtn = document.getElementById('quit-btn');
const retryBtn = document.getElementById('retry-btn');
const nextLevelBtn = document.getElementById('next-level-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const backBtn = document.getElementById('back-btn');
const toggleTimeFormatBtn = document.getElementById('toggle-time-format');
const fingerGuidanceCheckbox = document.getElementById('finger-guidance');
const timerEnabledCheckbox = document.getElementById('timer-enabled');

// Stats Elements
const levelElement = document.getElementById('level');
const timeElement = document.getElementById('time');
const timeUnitElement = document.getElementById('time-unit');
const scoreElement = document.getElementById('score');
const accuracyElement = document.getElementById('accuracy');
const wpmElement = document.getElementById('wpm');

// Result Elements
const resultWpmElement = document.getElementById('result-wpm');
const resultAccuracyElement = document.getElementById('result-accuracy');
const resultScoreElement = document.getElementById('result-score');
const resultLevelElement = document.getElementById('result-level');

// Settings Elements
const difficultySelect = document.getElementById('difficulty');
const timeLimitInput = document.getElementById('time-limit');
const customTextArea = document.getElementById('custom-text');
const themeSelect = document.getElementById('theme');
const soundEnabledCheckbox = document.getElementById('sound-enabled');

// Audio Elements
const keystrokeSound = document.getElementById('keystroke-sound');
const errorSound = document.getElementById('error-sound');
const levelUpSound = document.getElementById('level-up-sound');
const gameOverSound = document.getElementById('game-over-sound');

// Game Variables
let level = 1;
let score = 0;
let timeLeft = 60;
let timerInterval;
let currentTextArray = [];
let currentWordIndex = 0;
let correctChars = 0;
let incorrectChars = 0;
let startTime;
let isGameActive = false;
let isPaused = false;
let pauseStartTime;
let elapsedTimePaused = 0;
let texts = {};
let currentTexts = [];
let isTimeInSeconds = true;
let showFingerGuidance = true;
let isTimerEnabled = true;

// Settings
let settings = {
    difficulty: 'medium',
    timeLimit: 60,
    customText: '',
    theme: 'dark',
    soundEnabled: true,
    fingerGuidance: true,
    timerEnabled: true
};

// Matrix animation variables
let matrixInterval;

// Finger guidance mapping
const fingerMapping = {
    // Left hand
    '`': 'left-pinky', '1': 'left-pinky', '!': 'left-pinky',
    'q': 'left-pinky', 'Q': 'left-pinky', 'a': 'left-pinky', 'A': 'left-pinky', 'z': 'left-pinky', 'Z': 'left-pinky',
    
    '2': 'left-ring', '@': 'left-ring',
    'w': 'left-ring', 'W': 'left-ring', 's': 'left-ring', 'S': 'left-ring', 'x': 'left-ring', 'X': 'left-ring',
    
    '3': 'left-middle', '#': 'left-middle',
    'e': 'left-middle', 'E': 'left-middle', 'd': 'left-middle', 'D': 'left-middle', 'c': 'left-middle', 'C': 'left-middle',
    
    '4': 'left-index', '5': 'left-index', '$': 'left-index', '%': 'left-index',
    'r': 'left-index', 'R': 'left-index', 't': 'left-index', 'T': 'left-index',
    'f': 'left-index', 'F': 'left-index', 'g': 'left-index', 'G': 'left-index',
    'v': 'left-index', 'V': 'left-index', 'b': 'left-index', 'B': 'left-index',
    
    // Right hand
    '6': 'right-index', '7': 'right-index', '^': 'right-index', '&': 'right-index',
    'y': 'right-index', 'Y': 'right-index', 'u': 'right-index', 'U': 'right-index',
    'h': 'right-index', 'H': 'right-index', 'j': 'right-index', 'J': 'right-index',
    'n': 'right-index', 'N': 'right-index', 'm': 'right-index', 'M': 'right-index',
    
    '8': 'right-middle', '*': 'right-middle',
    'i': 'right-middle', 'I': 'right-middle', 'k': 'right-middle', 'K': 'right-middle', ',': 'right-middle', '<': 'right-middle',
    
    '9': 'right-ring', '(': 'right-ring',
    'o': 'right-ring', 'O': 'right-ring', 'l': 'right-ring', 'L': 'right-ring', '.': 'right-ring', '>': 'right-ring',
    
    '0': 'right-pinky', ')': 'right-pinky', '-': 'right-pinky', '_': 'right-pinky', '=': 'right-pinky', '+': 'right-pinky',
    'p': 'right-pinky', 'P': 'right-pinky', '[': 'right-pinky', '{': 'right-pinky', ']': 'right-pinky', '}': 'right-pinky',
    '\\': 'right-pinky', '|': 'right-pinky', ';': 'right-pinky', ':': 'right-pinky', "'": 'right-pinky', '"': 'right-pinky',
    '/': 'right-pinky', '?': 'right-pinky',
    
    // Space bar
    ' ': 'thumb'
};

// Create a keyboard visual element
function createKeyboardVisual() {
    // Instead of creating a visual keyboard, just make sure the finger helper text element exists
    const fingerHelper = document.querySelector('.finger-helper');
    
    if (!fingerHelper) {
        // Create the finger helper text if it doesn't exist
        const helperText = document.createElement('p');
        helperText.className = 'finger-helper';
        helperText.style.display = settings.fingerGuidance ? 'block' : 'none';
        
        // Add it to the game area, before the input field
        const gameArea = document.getElementById('game-area');
        const inputField = document.getElementById('input-field');
        if (gameArea && inputField) {
            gameArea.insertBefore(helperText, inputField);
        }
    } else {
        // Update existing helper text visibility
        fingerHelper.style.display = settings.fingerGuidance ? 'block' : 'none';
    }
}

// Highlight the finger for the current character
function highlightFinger(char) {
    if (!settings.fingerGuidance) return;
    
    // Get the finger to use for this character
    const fingerToUse = fingerMapping[char] || '';
    
    // Display the finger name instead of highlighting visual fingers
    const fingerHelper = document.querySelector('.finger-helper');
    if (fingerHelper) {
        if (fingerToUse) {
            // Format the finger name for display (e.g., "left-pinky" -> "Left Pinky")
            const formattedFingerName = fingerToUse
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            
            fingerHelper.textContent = `Use your ${formattedFingerName} finger to type "${char}"`;
            fingerHelper.style.display = 'block';
        } else {
            fingerHelper.textContent = '';
            fingerHelper.style.display = 'none';
        }
    }
}

// Initialize the matrix animation
function initMatrixAnimation() {
    const matrixText = document.getElementById('matrix-text');
    if (!matrixText) return;
    
    const chars = '01';
    let content = '';
    
    // Generate random binary text
    for (let i = 0; i < 200; i++) {
        content += chars.charAt(Math.floor(Math.random() * chars.length));
        if (i % 8 === 0) content += ' ';
        if (i % 40 === 0) content += '\n';
    }
    
    matrixText.textContent = content;
    
    // Update every 2 seconds
    matrixInterval = setInterval(() => {
        let newContent = '';
        for (let i = 0; i < 200; i++) {
            newContent += chars.charAt(Math.floor(Math.random() * chars.length));
            if (i % 8 === 0) newContent += ' ';
            if (i % 40 === 0) newContent += '\n';
        }
        matrixText.textContent = newContent;
    }, 2000);
}

// Sound functions
function playSound(sound) {
    if (settings.soundEnabled && sound) {
        sound.currentTime = 0;
        sound.play().catch(error => console.error("Error playing sound:", error));
    }
}

// Load texts from JSON file
async function loadTextsFromJSON() {
    try {
        const response = await fetch('texts.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        texts = await response.json();
        initializeTexts();
    } catch (error) {
        console.error("Failed to load texts:", error);
        // Fallback to hardcoded texts if loading fails
        texts = {
            easy: [
                "The quick brown fox jumps over the lazy dog.",
                "Simple text for typing practice."
            ],
            medium: [
                "JavaScript is a programming language that enables interactive web pages.",
                "This is a medium difficulty text for your typing practice."
            ],
            hard: [
                "The synchronization of cryptocurrency mining algorithms necessitates extraordinary computational power.",
                "This is a challenging text to test your advanced typing skills."
            ]
        };
        initializeTexts();
    }
}

// Initialize the texts array based on difficulty
function initializeTexts() {
    currentTexts = [...(texts[settings.difficulty] || [])];
    
    if (settings.customText.trim() !== '') {
        const customTexts = settings.customText.split('\n').filter(text => text.trim() !== '');
        currentTexts = [...customTexts, ...currentTexts];
    }
    
    // Make sure we have texts
    if (currentTexts.length === 0) {
        currentTexts = ["No texts available for this difficulty level. Please try another difficulty or add custom text."];
    }
}

// Apply saved settings from local storage
function loadSettings() {
    const savedSettings = JSON.parse(localStorage.getItem('typeItSettings'));
    if (savedSettings) {
        settings = savedSettings;
        difficultySelect.value = settings.difficulty;
        timeLimitInput.value = settings.timeLimit;
        customTextArea.value = settings.customText;
        themeSelect.value = settings.theme;
        soundEnabledCheckbox.checked = settings.soundEnabled !== false; // Default to true if not specified
        
        // Set finger guidance and timer checkboxes if they exist
        if (fingerGuidanceCheckbox) {
            fingerGuidanceCheckbox.checked = settings.fingerGuidance !== false; // Default to true if not specified
        }
        
        if (timerEnabledCheckbox) {
            timerEnabledCheckbox.checked = settings.timerEnabled !== false; // Default to true if not specified
        }
        
        // Update timer display based on setting
        const timerDisplay = document.querySelector('.timer-display');
        if (timerDisplay) {
            timerDisplay.style.display = settings.timerEnabled ? 'flex' : 'none';
        }
        
        applyTheme(settings.theme);
    }
}

// Save settings to local storage
function saveSettings() {
    settings.difficulty = difficultySelect.value;
    settings.timeLimit = parseInt(timeLimitInput.value);
    settings.customText = customTextArea.value;
    settings.theme = themeSelect.value;
    settings.soundEnabled = soundEnabledCheckbox.checked;
    
    // Save finger guidance and timer settings if the checkboxes exist
    if (fingerGuidanceCheckbox) {
        settings.fingerGuidance = fingerGuidanceCheckbox.checked;
    }
    
    if (timerEnabledCheckbox) {
        settings.timerEnabled = timerEnabledCheckbox.checked;
    }
    
    localStorage.setItem('typeItSettings', JSON.stringify(settings));
    
    // Update finger guidance display
    const fingerHelper = document.querySelector('.finger-helper');
    if (fingerHelper) {
        fingerHelper.style.display = settings.fingerGuidance ? 'block' : 'none';
    }
    
    // Update timer display based on setting
    const timerDisplay = document.querySelector('.timer-display');
    if (timerDisplay) {
        timerDisplay.style.display = settings.timerEnabled ? 'flex' : 'none';
    }
    
    timeLeft = settings.timeLimit;
    timeElement.textContent = timeLeft;
    
    applyTheme(settings.theme);
    initializeTexts();
    
    // Return to start screen
    showScreen(startScreen);
}

// Apply theme
function applyTheme(theme) {
    document.body.classList.remove('dark-theme', 'light-theme', 'blue-theme', 'matrix-theme');
    document.body.classList.add(`${theme}-theme`);
}

// Show specific screen, hide others
function showScreen(screen) {
    startScreen.classList.remove('active');
    gameArea.classList.remove('active');
    resultScreen.classList.remove('active');
    settingsScreen.classList.remove('active');
    pauseScreen.classList.remove('active');
    
    screen.classList.add('active');
    if (screen === settingsScreen) {
        document.querySelector('.overlay').classList.add('active');
    } else {
        document.querySelector('.overlay').classList.remove('active');
    }
}

// Start game
function startGame() {
    level = 1;
    score = 0;
    correctChars = 0;
    incorrectChars = 0;
    timeLeft = settings.timeLimit;
    isPaused = false;
    elapsedTimePaused = 0;
    isTimeInSeconds = true;
    timeUnitElement.textContent = 's';
    
    updateStats();
    nextLevel();
    showScreen(gameArea);
    
    inputField.focus();
    isGameActive = true;
    
    // Start timer only if enabled
    startTime = new Date();
    if (settings.timerEnabled) {
        timerInterval = setInterval(updateTimer, 1000);
    }
    
    // Clear any existing matrix animation
    if (matrixInterval) {
        clearInterval(matrixInterval);
    }
}

// Pause the game
function pauseGame() {
    if (!isGameActive || isPaused) return;
    
    isPaused = true;
    pauseStartTime = new Date();
    clearInterval(timerInterval);
    showScreen(pauseScreen);
}

// Resume the game
function resumeGame() {
    if (!isGameActive || !isPaused) return;
    
    isPaused = false;
    elapsedTimePaused += (new Date() - pauseStartTime) / 1000;
    timerInterval = setInterval(updateTimer, 1000);
    showScreen(gameArea);
    inputField.focus();
}

// Quit the game
function quitGame() {
    clearInterval(timerInterval);
    isGameActive = false;
    isPaused = false;
    timeLeft = settings.timeLimit; // Reset timer to default
    timeElement.textContent = timeLeft;
    showScreen(startScreen);
}

// Update the timer
function updateTimer() {
    if (!settings.timerEnabled) return;
    
    timeLeft--;
    if (isTimeInSeconds) {
        timeElement.textContent = timeLeft;
    } else {
        timeElement.textContent = (timeLeft / 60).toFixed(2);
    }
    
    if (timeLeft <= 0) {
        endGame();
    }
    
    // Update WPM every second
    updateWPM();
}

// Toggle time format
function toggleTimeFormat() {
    isTimeInSeconds = !isTimeInSeconds;
    if (isTimeInSeconds) {
        timeUnitElement.textContent = 's';
        timeElement.textContent = timeLeft;
    } else {
        timeUnitElement.textContent = 'm';
        timeElement.textContent = (timeLeft / 60).toFixed(2);
    }
}

// Generate text for the current level
function generateText() {
    // Choose a random text from the array
    const randomIndex = Math.floor(Math.random() * currentTexts.length);
    let text = currentTexts[randomIndex];
    
    // Make the text more difficult based on level
    if (level > 3) {
        // Concatenate another random text
        const secondIndex = Math.floor(Math.random() * currentTexts.length);
        text += " " + currentTexts[secondIndex];
    }
    
    if (level > 6) {
        // Add special characters
        text = text.replace(/\. /g, ". $#@! ");
    }
    
    if (level > 9) {
        // Add numbers
        text = text.replace(/ /g, " 12345 ").trim();
    }
    
    return text;
}

// Display text on the screen
function displayText(text) {
    currentTextArray = text.split('');
    textDisplay.innerHTML = '';
    
    currentTextArray.forEach((char, index) => {
        const charSpan = document.createElement('span');
        charSpan.textContent = char;
        
        if (index === 0) {
            charSpan.classList.add('current');
            // Highlight the finger for the first character
            highlightFinger(char);
        }
        
        textDisplay.appendChild(charSpan);
    });
    
    currentWordIndex = 0;
    textDisplay.scrollTop = 0; // Reset scroll position
}

// Handle user input
function handleInput() {
    if (!isGameActive || isPaused) return;
    
    const textSpans = textDisplay.querySelectorAll('span');
    const typedChar = inputField.value.charAt(inputField.value.length - 1);
    
    if (currentWordIndex >= currentTextArray.length) return;
    
    const correctChar = currentTextArray[currentWordIndex];
    
    // Remove current class from previous character
    textSpans[currentWordIndex].classList.remove('current');
    
    // Check if the typed character is correct
    if (typedChar === correctChar) {
        textSpans[currentWordIndex].classList.add('correct');
        correctChars++;
        score += 1;
        playSound(keystrokeSound);
    } else {
        textSpans[currentWordIndex].classList.add('incorrect');
        incorrectChars++;
        score = Math.max(0, score - 1); // Avoid negative score
        playSound(errorSound);
    }
    
    currentWordIndex++;
    
    // If there are more characters to type, highlight the next one
    if (currentWordIndex < currentTextArray.length) {
        textSpans[currentWordIndex].classList.add('current');
        
        // Highlight the finger to use for the next character
        highlightFinger(currentTextArray[currentWordIndex]);
        
        // Scroll to make the current character visible
        const currentChar = textSpans[currentWordIndex];
        const offsetTop = currentChar.offsetTop;
        const offsetHeight = currentChar.offsetHeight;
        const displayHeight = textDisplay.clientHeight;
        if (offsetTop + offsetHeight > textDisplay.scrollTop + displayHeight) {
            textDisplay.scrollTop = offsetTop + offsetHeight - displayHeight;
        }
    } else {
        // Completed the text
        inputField.value = '';
        if (isGameActive) {
            score += Math.floor(level * 5); // Bonus for completing the text
            playSound(levelUpSound);
            nextLevel();
        }
    }
    
    // Update stats
    updateStats();
}

// Update game stats
function updateStats() {
    levelElement.textContent = level;
    scoreElement.textContent = score;
    
    // Calculate accuracy
    const totalChars = correctChars + incorrectChars;
    const accuracy = totalChars > 0 ? Math.floor((correctChars / totalChars) * 100) : 0;
    accuracyElement.textContent = accuracy;
    
    // Update WPM
    updateWPM();
}

// Calculate words per minute
function updateWPM() {
    if (correctChars === 0) {
        wpmElement.textContent = 0;
        return;
    }
    
    // Calculate time elapsed in minutes, accounting for paused time
    let timeElapsed;
    
    if (settings.timerEnabled) {
        timeElapsed = ((new Date() - startTime) / 60000) - (elapsedTimePaused / 60);
    } else {
        // If timer is disabled, use the time since the game started
        timeElapsed = ((new Date() - startTime) / 60000) - (elapsedTimePaused / 60);
    }
    
    const words = correctChars / 5; // A word is considered to be 5 characters on average
    const wpm = Math.floor(words / Math.max(timeElapsed, 0.01)); // Avoid division by zero
    
    wpmElement.textContent = wpm;
}

// Move to the next level
function nextLevel() {
    level++;
    const text = generateText();
    displayText(text);
    inputField.value = '';
    
    // Increase difficulty with level only if timer is enabled
    if (settings.timerEnabled) {
        timeLeft = Math.max(settings.timeLimit - (level * 2), 10); // Reduce time but not below 10s
        timeElement.textContent = timeLeft;
    }
}

// End the game
function endGame() {
    clearInterval(timerInterval);
    isGameActive = false;
    timeLeft = settings.timeLimit; // Reset timer to default
    timeElement.textContent = timeLeft;
    
    // Play game over sound
    playSound(gameOverSound);
    
    // Update result screen
    resultWpmElement.textContent = wpmElement.textContent;
    resultAccuracyElement.textContent = accuracyElement.textContent;
    resultScoreElement.textContent = score;
    resultLevelElement.textContent = level;
    
    showScreen(resultScreen);
    
    // Save high score
    const highScore = localStorage.getItem('typeItHighScore') || 0;
    if (score > highScore) {
        localStorage.setItem('typeItHighScore', score);
    }
}

// Toggle finger guidance
function toggleFingerGuidance() {
    settings.fingerGuidance = !settings.fingerGuidance;
    
    const fingerHelper = document.querySelector('.finger-helper');
    if (fingerHelper) {
        fingerHelper.style.display = settings.fingerGuidance ? 'block' : 'none';
    }
    
    // If turning on and there's a current character, show the finger guidance
    if (settings.fingerGuidance && currentWordIndex < currentTextArray.length) {
        highlightFinger(currentTextArray[currentWordIndex]);
    }
}

// Event Listeners
startBtn.addEventListener('click', startGame);
settingsBtn.addEventListener('click', () => showScreen(settingsScreen));
pauseBtn.addEventListener('click', pauseGame);
resumeBtn.addEventListener('click', resumeGame);
restartBtn.addEventListener('click', startGame);
quitBtn.addEventListener('click', quitGame);
retryBtn.addEventListener('click', startGame);
nextLevelBtn.addEventListener('click', startGame);
saveSettingsBtn.addEventListener('click', saveSettings);
backBtn.addEventListener('click', () => showScreen(startScreen));
toggleTimeFormatBtn.addEventListener('click', toggleTimeFormat);

// Finger guidance toggle
if (fingerGuidanceCheckbox) {
    fingerGuidanceCheckbox.addEventListener('change', () => {
        settings.fingerGuidance = fingerGuidanceCheckbox.checked;
        const fingerHelper = document.querySelector('.finger-helper');
        if (fingerHelper) {
            fingerHelper.style.display = settings.fingerGuidance ? 'block' : 'none';
            
            // If enabled and there's a current character, show guidance
            if (settings.fingerGuidance && isGameActive && currentWordIndex < currentTextArray.length) {
                highlightFinger(currentTextArray[currentWordIndex]);
            } else {
                fingerHelper.textContent = '';
            }
        }
    });
}

// Timer enabled toggle
if (timerEnabledCheckbox) {
    timerEnabledCheckbox.addEventListener('change', () => {
        settings.timerEnabled = timerEnabledCheckbox.checked;
        
        // Update timer display based on setting
        const timerDisplay = document.querySelector('.timer-display');
        if (timerDisplay) {
            timerDisplay.style.display = settings.timerEnabled ? 'flex' : 'none';
        }
        
        // If timer is disabled during an active game, clear the interval
        if (!settings.timerEnabled && isGameActive) {
            clearInterval(timerInterval);
        } else if (settings.timerEnabled && isGameActive && !isPaused) {
            // If timer is enabled during an active game, start the interval
            timerInterval = setInterval(updateTimer, 1000);
        }
    });
}

inputField.addEventListener('input', handleInput);

// Custom event listener for theme changes
themeSelect.addEventListener('change', () => {
    applyTheme(themeSelect.value);
});

// Handle key events
document.addEventListener('keydown', (e) => {
    // Allow Escape key to pause/resume the game
    if (e.key === 'Escape' && isGameActive) {
        if (isPaused) {
            resumeGame();
        } else {
            pauseGame();
        }
    }
});

// Initialize the game
window.addEventListener('DOMContentLoaded', async () => {
    // Initialize matrix animation
    initMatrixAnimation();
    
    // Create keyboard visual
    createKeyboardVisual();
    
    // Load texts from JSON file
    await loadTextsFromJSON();
    
    // Load settings
    loadSettings();
}); 