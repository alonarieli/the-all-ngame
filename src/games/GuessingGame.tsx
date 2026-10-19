import { useState } from 'react'

interface GuessingGameProps {
  onBack: () => void
}

const WORDS_LIST = ['מחשב', 'פיצה', 'חללית', 'ים', 'כלב', 'מטוס', 'טלפון', 'שוקולד']

export default function GuessingGame({ onBack }: GuessingGameProps) {
  const [step, setStep] = useState<'setup' | 'pass' | 'reveal'>('setup')
  const [playerName, setPlayerName] = useState('')
  const [players, setPlayers] = useState<string[]>([])
  
  const [secretWord, setSecretWord] = useState('')
  const [impostorIndex, setImpostorIndex] = useState(-1)
  const [currentIndex, setCurrentIndex] = useState(0)

  const addPlayer = () => {
    if (playerName.trim() && !players.includes(playerName.trim())) {
      setPlayers([...players, playerName.trim()])
      setPlayerName('')
    }
  }

  const startGame = () => {
    if (players.length < 3) return
    const randomWord = WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)]
    const randomImp = Math.floor(Math.random() * players.length)
    setSecretWord(randomWord)
    setImpostorIndex(randomImp)
    setCurrentIndex(0)
    setStep('pass')
  }

  const handleNext = () => {
    if (step === 'pass') {
      setStep('reveal')
    } else if (step === 'reveal') {
      if (currentIndex + 1 < players.length) {
        setCurrentIndex(currentIndex + 1)
        setStep('pass')
      } else {
        alert('כל השחקנים ראו את התפקיד! המשחק מתחיל.')
        setStep('setup')
      }
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '600px', marginBottom: '15px' }}>
        <button className="neon-button" onClick={onBack}>חזרה ללובי</button>
        <h2 style={{ color: '#ff007f' }}>משחק הניחושים</h2>
      </div>

      {step === 'setup' && (
        <div style={{ width: '100%', maxWidth: '500px', textAlign: 'center', background: 'rgba(18, 18, 37, 0.8)', padding: '25px', borderRadius: '16px', border: '2px solid #ff007f' }}>
          <h3 style={{ marginBottom: '15px' }}>הכנסת משתתפים (לפחות 3)</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input 
              type="text" 
              value={playerName} 
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="שם המשתתף"
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ff007f', background: '#05050d', color: '#fff', fontSize: '1rem' }}
            />
            <button className="neon-button" onClick={addPlayer}>הוסף</button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', minHeight: '50px' }}>
            {players.map((p, i) => (
              <span key={i} style={{ background: '#ff007f', color: '#fff', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold' }}>
                {p}
              </span>
            ))}
          </div>

          {players.length >= 3 && (
            <button className="neon-button" style={{ width: '100%', background: '#ff007f', color: '#fff' }} onClick={startGame}>
              התחל משחק
            </button>
          )}
        </div>
      )}

      {(step === 'pass' || step === 'reveal') && (
        <div 
          onClick={handleNext}
          style={{ 
            width: '100%', 
            maxWidth: '500px', 
            height: '400px', 
            background: 'rgba(18, 18, 37, 0.95)', 
            border: '3px solid #ff007f', 
            borderRadius: '20px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '30px',
            textAlign: 'center',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          {step === 'pass' && (
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>העבר את הטלפון ל:</h2>
              <h1 style={{ fontSize: '3rem', color: '#00f3ff', marginBottom: '30px' }}>{players[currentIndex]}</h1>
              <p style={{ color: '#aaa', fontSize: '1.2rem' }}>החלק ימינה / לחץ לצפייה</p>
            </div>
          )}

          {step === 'reveal' && (
            <div>
              <h3 style={{ color: '#aaa', marginBottom: '15px' }}>{players[currentIndex]}</h3>
              {currentIndex === impostorIndex ? (
                <h1 style={{ fontSize: '3.5rem', color: '#ff007f', fontWeight: '900' }}>אימפוסטר</h1>
              ) : (
                <div>
                  <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>המילה הסודית היא:</p>
                  <h1 style={{ fontSize: '3rem', color: '#00f3ff' }}>{secretWord}</h1>
                </div>
              )}
              <p style={{ color: '#aaa', marginTop: '40px', fontSize: '1rem' }}>החלק ימינה / לחץ להעברה להבא בתור</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}