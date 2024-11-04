/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const { useState, useEffect } = React;

// Initial list of words
const WORDS = ['javascript', 'react', 'coding', 'interface', 'function', 'variable', 'component', 'render', 'useState', 'props'];

/**
 * shuffle()
 * Shuffle the contents of an array or string.
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle(src) {
  const copy = [...src];
  const length = copy.length;
  for (let i = 0; i < length; i++) {
    const x = copy[i];
    const y = Math.floor(Math.random() * length);
    const z = copy[y];
    copy[i] = z;
    copy[y] = x;
  }
  return typeof src === 'string' ? copy.join('') : copy;
}

function ScrambleGame() {
  // Initial game state
  const initialGameState = {
    words: shuffle(WORDS),
    currentWordIndex: 0,
    points: 0,
    strikes: 0,
    passes: 3,
    maxStrikes: 3,
  };

  // Load from Local Storage if exists, else set to initial game state
  const [gameState, setGameState] = useState(() => {
    const savedState = localStorage.getItem('scrambleGameState');
    return savedState ? JSON.parse(savedState) : initialGameState;
  });

  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('scrambleGameState', JSON.stringify(gameState));
  }, [gameState]);

  // Reset game
  function resetGame() {
    setGameState(initialGameState);
    setGuess('');
    setMessage('');
    localStorage.removeItem('scrambleGameState');
  }

  // Get current scrambled word
  const currentWord = gameState.words[gameState.currentWordIndex];
  const scrambledWord = shuffle(currentWord);

  // Handle guess submission
  function handleGuess(e) {
    e.preventDefault();
    if (guess.toLowerCase() === currentWord) {
      setGameState(prevState => ({
        ...prevState,
        points: prevState.points + 1,
        currentWordIndex: prevState.currentWordIndex + 1,
      }));
      setMessage('Correct! Moving to the next word.');
    } else {
      setGameState(prevState => ({
        ...prevState,
        strikes: prevState.strikes + 1,
      }));
      setMessage('Incorrect! Try again.');
    }
    setGuess('');
  }

  // Handle pass button
  function handlePass() {
    if (gameState.passes > 0) {
      setGameState(prevState => ({
        ...prevState,
        passes: prevState.passes - 1,
        currentWordIndex: prevState.currentWordIndex + 1,
      }));
      setMessage('Pass used. Moving to the next word.');
    } else {
      setMessage('No passes remaining!');
    }
  }

  // Check if game is over
  const isGameOver = gameState.currentWordIndex >= gameState.words.length || gameState.strikes >= gameState.maxStrikes;

  return (
    <div>
      <h1>Scramble Game</h1>
      {isGameOver ? (
        <div>
          <h2>Game Over!</h2>
          <p>{gameState.strikes >= gameState.maxStrikes ? 'Too many strikes!' : 'Congratulations, you completed all words!'}</p>
          <p>Final Score: {gameState.points} points</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      ) : (
        <div>
          <p>Scrambled Word: {scrambledWord}</p>
          <p>Points: {gameState.points}</p>
          <p>Strikes: {gameState.strikes} / {gameState.maxStrikes}</p>
          <p>Passes: {gameState.passes}</p>
          <form onSubmit={handleGuess}>
            <input
              type="text"
              value={guess}
              onChange={e => setGuess(e.target.value)}
              placeholder="Your guess"
            />
            <button type="submit">Guess</button>
          </form>
          <button onClick={handlePass} disabled={gameState.passes <= 0}>Pass</button>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

// Render the game
ReactDOM.render(<ScrambleGame />, document.getElementById('root'));
