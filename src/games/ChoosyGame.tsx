import { useState } from 'react'

interface ChoosyGameProps {
  onBack: () => void
}

interface TouchPoint {
  id: number
  x: number
  y: number
  color: string
}

const COLORS = ['#ff007f', '#00f3ff', '#ffe600', '#ff5722', '#9c27b0', '#4caf50']

export default function ChoosyGame({ onBack }: ChoosyGameProps) {
  const [step, setStep] = useState<'setup' | 'play'>('setup')
  const [playerName, setPlayerName] = useState('')
  const [players, setPlayers] = useState<string[]>([])
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([])
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null)

  const addPlayer = () => {
    if (playerName.trim() && !players.includes(playerName.trim())) {
      setPlayers([...players, playerName.trim()])
      setPlayerName('')
    }
  }

  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (step !== 'play') return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newPoint: TouchPoint = {
      id: Date.now() + Math.random(),
      x,
      y,
      color: COLORS[touchPoints.length % COLORS.length]
    }

    setTouchPoints([...touchPoints, newPoint])
  }

  const pickRandom = () => {
    if (players.length === 0) return
    const randomIndex = Math.floor(Math.random() * players.length)
    setSelectedWinner(players[randomIndex])
  }

  const resetGame = () => {
    setTouchPoints([])
    setSelectedWinner(null)
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '800px', marginBottom: '15px' }}>
        <button className="neon-button" onClick={onBack}>חזרה ללובי</button>
        <h2 style={{ color: '#00f3ff' }}>משחק שוואזי</h2>
      </div>

      {step === 'setup' && (
        <div style={{ width: '100%', maxWidth: '500px', textAlign: 'center', background: 'rgba(18, 18, 37, 0.8)', padding: '25px', borderRadius: '16px', border: '2px solid #00f3ff' }}>
          <h3 style={{ marginBottom: '15px' }}>הכנסת משתתפים</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input 
              type="text" 
              value={playerName} 
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="שם המשתתף"
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #00f3ff', background: '#05050d', color: '#fff', fontSize: '1rem' }}
            />
            <button className="neon-button" onClick={addPlayer}>הוסף</button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', minHeight: '50px' }}>
            {players.map((p, i) => (
              <span key={i} style={{ background: '#00f3ff', color: '#000', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold' }}>
                {p}
              </span>
            ))}
          </div>

          {players.length >= 2 && (
            <button className="neon-button" style={{ width: '100%', background: '#00f3ff', color: '#000' }} onClick={() => setStep('play')}>
              התחל משחק
            </button>
          )}
        </div>
      )}

      {step === 'play' && (
        <div style={{ width: '100%', height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
            <button className="neon-button" onClick={pickRandom}>בחר זוכה אקראי</button>
            <button className="neon-button" onClick={resetGame}>אפס לוח</button>
          </div>

          {selectedWinner && (
            <div style={{ padding: '10px 20px', background: '#ff007f', color: '#fff', borderRadius: '10px', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
              הנבחר: {selectedWinner}
            </div>
          )}

          {/* לוח תכלת גדול ללחיצות */}
          <div 
            onClick={handleScreenClick}
            style={{ 
              width: '100%', 
              maxWidth: '800px', 
              flex: 1, 
              backgroundColor: '#38bdf8', 
              borderRadius: '20px', 
              position: 'relative', 
              overflow: 'hidden', 
              cursor: 'pointer',
              boxShadow: '0 0 25px rgba(56, 189, 248, 0.5)'
            }}
          >
            {touchPoints.map((pt) => (
              <div 
                key={pt.id} 
                style={{ 
                  position: 'absolute', 
                  left: pt.x - 30, 
                  top: pt.y - 30, 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  backgroundColor: pt.color,
                  boxShadow: `0 0 20px ${pt.color}, 0 0 40px ${pt.color}`,
                  pointerEvents: 'none'
                }} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}