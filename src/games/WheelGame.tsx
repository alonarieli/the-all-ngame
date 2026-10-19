import { useState } from 'react'

interface WheelGameProps {
  onBack: () => void
}

const COLORS = ['#ff007f', '#00f3ff', '#ffe600', '#ff5722', '#9c27b0', '#4caf50', '#e91e63', '#00bcd4']

export default function WheelGame({ onBack }: WheelGameProps) {
  const [step, setStep] = useState<'setup' | 'play'>('setup')
  const [playerName, setPlayerName] = useState('')
  const [players, setPlayers] = useState<string[]>([])
  const [eliminatedPlayer, setEliminatedPlayer] = useState<string | null>(null)
  
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)

  const addPlayer = () => {
    if (playerName.trim() && !players.includes(playerName.trim())) {
      setPlayers([...players, playerName.trim()])
      setPlayerName('')
    }
  }

  const spinWheel = () => {
    if (isSpinning || players.length <= 1) return

    setIsSpinning(true)
    setEliminatedPlayer(null)

    const extraSpins = 5 + Math.floor(Math.random() * 5)
    const randomDegree = Math.floor(Math.random() * 360)
    const totalRotation = rotation + extraSpins * 360 + randomDegree

    setRotation(totalRotation)

    setTimeout(() => {
      setIsSpinning(false)
      const sliceAngle = 360 / players.length
      const normalizedDegree = (360 - (totalRotation % 360)) % 360
      const selectedIndex = Math.floor(normalizedDegree / sliceAngle)
      
      const removed = players[selectedIndex]
      setEliminatedPlayer(removed)
      setPlayers(players.filter((_, i) => i !== selectedIndex))
    }, 3000)
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '600px', marginBottom: '15px' }}>
        <button className="neon-button" onClick={onBack}>חזרה ללובי</button>
        <h2 style={{ color: '#00f3ff' }}>משחק הגלגל</h2>
      </div>

      {step === 'setup' && (
        <div style={{ width: '100%', maxWidth: '500px', textAlign: 'center', background: 'rgba(18, 18, 37, 0.8)', padding: '25px', borderRadius: '16px', border: '2px solid #00f3ff' }}>
          <h3 style={{ marginBottom: '15px' }}>הכנסת משתתפים (לפחות 2)</h3>
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
              התחל סיבוב גלגל
            </button>
          )}
        </div>
      )}

      {step === 'play' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          {players.length === 1 ? (
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <h1 style={{ fontSize: '3rem', color: '#00f3ff', marginBottom: '20px' }}>המנצח הגדול: {players[0]}</h1>
              <button className="neon-button" onClick={() => { setStep('setup'); setPlayers([]); }}>משחק חדש</button>
            </div>
          ) : (
            <>
              {eliminatedPlayer && (
                <div style={{ padding: '10px 20px', background: '#ff007f', color: '#fff', borderRadius: '10px', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '15px' }}>
                  יצא מהמשחק: {eliminatedPlayer}
                </div>
              )}

              <div style={{ position: 'relative', width: '320px', height: '320px', margin: '20px 0' }}>
                {/* חץ הצבעה בצד ימין */}
                <div style={{ 
                  position: 'absolute', 
                  right: '-15px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  width: '0', 
                  height: '0', 
                  borderTop: '15px solid transparent', 
                  borderBottom: '15px solid transparent', 
                  borderRight: '30px solid #ff007f', 
                  zIndex: 10 
                }} />

                {/* הגלגל המסתובב */}
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '50%', 
                  border: '4px solid #00f3ff', 
                  boxShadow: '0 0 20px #00f3ff', 
                  overflow: 'hidden', 
                  position: 'relative', 
                  transform: `rotate(${rotation}deg)`, 
                  transition: isSpinning ? 'transform 3s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none' 
                }}>
                  {players.map((p, i) => {
                    const sliceAngle = 360 / players.length
                    const angle = i * sliceAngle
                    return (
                      <div key={i} style={{ 
                        position: 'absolute', 
                        width: '50%', 
                        height: '50%', 
                        top: '0', 
                        right: '0', 
                        transformOrigin: '0% 100%', 
                        transform: `rotate(${angle}deg)`, 
                        background: COLORS[i % COLORS.length], 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        border: '1px solid rgba(0,0,0,0.2)' 
                      }}>
                        <span style={{ 
                          transform: 'rotate(45deg)', 
                          color: '#000', 
                          fontWeight: 'bold', 
                          fontSize: '0.9rem', 
                          paddingLeft: '20px' 
                        }}>
                          {p}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <button className="neon-button" onClick={spinWheel} disabled={isSpinning} style={{ marginTop: '15px' }}>
                {isSpinning ? 'מסתובב...' : 'סובב לפסילת משתתף'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}