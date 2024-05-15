import { useEffect, useState } from 'react'
import './App.css'
import { Dice } from './Dice'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

function App() {

  const [start, setStart] = useState(false)
  const [dice, setDice] = useState(allNewdice())
  const [tenzies, setTenzies] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [duration, setDuration] = useState(0)
  const [input, setInput] = useState("")
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  useEffect(() => {
    const savedLeaderboard = localStorage.getItem('tenzies-leaderboard')
    if(savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard))
    }
  }, [])

  useEffect(() => {
    let interval;
    if(startTime && !tenzies) {
      interval = setInterval(() => {
        const currentTime = Date.now()
        setDuration(currentTime - startTime)
      }, 100)
    }
    return () => clearInterval(interval)
  }, [startTime, tenzies])

  const handleGameOver = () => {
    setInput("");
    
    const newPlayer = { name: input, duration };
    setLeaderboard(prevLeaderboard => [...prevLeaderboard, newPlayer]);
    localStorage.setItem('tenzies-leaderboard', JSON.stringify(leaderboard));
  }
  
  const startGame = () => {
    if(input !== "") {
      setStart(true)
      setStartTime(Date.now())
      setTenzies(false)
    }else {
      alert("Name is neccessary")
    }
  }

  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld);
    const firstValue = dice[0].value;
    const allEqual = dice.every(die => die.value === firstValue);
    if(allHeld && allEqual) {
      setTenzies(true)
      handleGameOver()
    }
  }, [dice])

  function generateDice() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewdice() {
    const diceArray = []
    for(let i = 0; i < 10; i++) {
      diceArray.push(generateDice())
    }
    return diceArray;
  }

  function rollDice() {
    if(!tenzies) {
      setDice(prevDice => 
        prevDice.map(die => {
          return die.isHeld ? die : generateDice()
        })
      )
    }else {
      setTenzies(false)
      setDice(allNewdice())
      setDuration(0)
      setStartTime(null)
      setStart(false)
      setShowLeaderboard(false)
    }
  }

  function holdDice(id) {
    setDice(prevDice => {
      return prevDice.map(die => {
        return die.id === id ? {...die, isHeld: !die.isHeld} : die
      })
    })
  }

  const diceElements = dice.map((die) => {
    return (
      <Dice 
        key={die.id}
        value={die.value}
        isHeld={die.isHeld}
        holdDice={() => holdDice(die.id)}
      />
    )
  })

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = ((time % 60000) / 1000).toFixed(2);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  return (
    <div className='card'>

      {tenzies && <Confetti />}

      <div className='card-text'>
        {!tenzies && 
          <div>
            <h1>Tenzies</h1>
            <p>Roll until all the dice are the same! Click each die to freeze it at its current value between rolls.  </p>
          </div>
        }
        {!startTime && !tenzies &&(
          <div className='info-div'>
            <input onChange={(e) => setInput(e.target.value)} type="text" placeholder='Your Name' value={input}/>
            <button onClick={startGame}>Start Game</button>
          </div>
        )}
      </div>

      {startTime && !tenzies && (<div>{formatTime(duration)}</div>)}

      {tenzies && (
        <div>
          <h2>Game Over!</h2>
          <p>Duration: {formatTime(duration)}</p>
        </div>
      )}

      {start && 
          <div className='die-container'>  
            <div className='die-grid'>
              {diceElements}
            </div>
            <button onClick={rollDice}>{tenzies === true ? "Reset" : "Roll"}</button>
          </div>
      }

      {tenzies && (
        <button className="leaderBtn" onClick={toggleLeaderboard}>
          {showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}
        </button>
      )}

      {showLeaderboard && (
        <div className="leaderboard">
          <h2>Leaderboard</h2>
          <ol>
            {leaderboard
              .map((player, index) => (
                <li key={index}>
                  {player.name} - {formatTime(player.duration)}
                </li>
              ))}
          </ol>
        </div>
      )}

    </div>
  )
}

export default App
