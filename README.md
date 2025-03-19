# TypeIt - Typing Game

A web-based typing game to improve your typing skills with customizable settings, progressive difficulty levels, and a nerdy dark mode interface.

## Features

- **Multiple Difficulty Levels**: Easy, Medium, and Hard text options
- **Progressive Challenge**: Game gets more difficult as you level up
- **Real-time Stats**: Monitor your WPM (Words Per Minute), accuracy, and score
- **Customizable Settings**:
  - Difficulty selection
  - Time limit adjustment
  - Custom text input
  - Theme options (Light, Dark, Blue, Matrix)
  - Sound effects toggle
- **Pause Functionality**: Pause and resume your typing session at any time
- **Sound Effects**: Audio feedback for keystrokes, errors, level completion, and game over
- **Nerdy Dark Mode**: Matrix-inspired dark theme with cool visual effects
- **Local Storage**: Saves your settings and high score
- **Dynamic Text Loading**: Texts loaded from external JSON file for easy customization

## How to Play

1. Click "Start Game" to begin typing
2. Type the displayed text as quickly and accurately as possible
3. Each correct character increases your score
4. Each incorrect character decreases your score
5. Complete the text to move to the next level
6. The time limit decreases with each level, increasing the challenge
7. Game ends when the time runs out
8. Press ESC or click the pause button to pause the game

## Customize Your Experience

- **Custom Text**: Add your own text in the settings to practice specific phrases or words
- **Time Limit**: Adjust the timer for longer or shorter sessions
- **Visual Theme**: Choose from Light, Dark, Blue, or Matrix themes
- **Sound Effects**: Enable or disable sound effects based on your preference

## Technologies Used

- HTML5
- CSS3 (with CSS Variables for theming)
- JavaScript (Vanilla JS, no frameworks)
- LocalStorage API for saving settings
- Fetch API for loading JSON data

## Adding Sound Effects

1. Add your own sound files to the `sounds` folder
2. Make sure they are named:
   - `keystroke.mp3`: Played when a correct key is pressed
   - `error.mp3`: Played when an incorrect key is pressed
   - `level-up.mp3`: Played when completing a text and moving to the next level
   - `game-over.mp3`: Played when the game ends

## Customizing Text

The game loads texts from the `texts.json` file. You can modify this file to add your own typing challenges:

```json
{
  "easy": [
    "Your easy text here."
  ],
  "medium": [
    "Your medium difficulty text here."
  ],
  "hard": [
    "Your challenging text here."
  ]
}
```

## Getting Started

1. Clone or download this repository
2. Add sound files to the `sounds` folder (optional)
3. Open `index.html` in a web browser
4. Click "Start Game" to begin or customize your settings first

## Tips for Improving Your Typing Skills

- Focus on accuracy first, then speed
- Start with easier levels and gradually move up
- Practice regularly for best results
- Use custom text to target specific challenges you face
- Pay attention to your posture and hand position

## License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

---

Created to help improve typing skills through interactive practice with a nerdy twist. 