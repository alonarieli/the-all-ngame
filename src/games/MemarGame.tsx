import { useState, useEffect } from 'react'

interface MemarGameProps {
  onBack: () => void
}

// מאגר תמונות הממים האייקוניות מגוגל
const MEME_IMAGES = [
  'https://i.imgflip.com/566746159.jpg', // John Pork Is Calling
  'https://i.kym-cdn.com/entries/icons/original/000/048/318/six_seven_kid.jpg', // Kid doing Six Seven / 67 Kid
  'https://i.imgflip.com/1ur9b0.jpg', // Distracted Boyfriend
  'https://i.imgflip.com/1g8my4.jpg', // Drake Hotline Bling
  'https://i.kym-cdn.com/entries/icons/original/000/037/715/gigachad.jpg', // GigaChad
  'https://i.kym-cdn.com/entries/icons/original/000/049/220/chill_guy_meme.jpg', // Chill Guy
  'https://i.imgflip.com/26am.jpg', // Success Kid
  'https://i.imgflip.com/1bh3.jpg', // Doge
  'https://i.imgflip.com/1tl71a.jpg', // Mocking Spongebob
  'https://i.imgflip.com/261o3j.jpg', // Change My Mind
  'https://i.imgflip.com/289v0p.jpg', // Woman Yelling at Cat
  'https://i.imgflip.com/1bhk.jpg', // Disaster Girl
  'https://i.imgflip.com/1ih10o.jpg', // Roll Safe
  'https://i.imgflip.com/9ehk.jpg', // Ancient Aliens
  'https://i.imgflip.com/1jwh.jpg', // Futurama Fry
  'https://i.imgflip.com/1g8n0w.jpg', // Two Buttons
  'https://i.imgflip.com/1c1uej.jpg', // Evil Kermit
  'https://i.imgflip.com/2hg2.jpg', // Grumpy Cat
  'https://i.imgflip.com/1h7in3.jpg', // Expanding Brain
  'https://i.imgflip.com/264wdb.jpg', // Is This a Pigeon
  'https://i.imgflip.com/23ls.jpg', // One Does Not Simply
  'https://i.imgflip.com/345v97.jpg', // Bernie Sanders Asking
  'https://i.imgflip.com/2fm6x.jpg', // Surprised Pikachu
  'https://i.imgflip.com/3v22p0.jpg', // Buff Doge vs Cheems
  'https://i.imgflip.com/1wz1x.jpg', // Pepe The Frog
  'https://i.imgflip.com/2gnj0w.jpg', // Spider-Man Pointing
  'https://i.imgflip.com/392epq.jpg', // Always Has Been
  'https://i.imgflip.com/1otk96.jpg', // Fine Dog In Fire
  'https://i.imgflip.com/1e121.jpg', // First World Problems
  'https://i.imgflip.com/1bgw.jpg'   // Bad Luck Brian
]

interface MemeSubmission {
  player: string
  imageUrl: string
  text: string
  score: number
}

// מחולל קוד לובי בן 4 תווים
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export default function MemarGame({ onBack }: MemarGameProps) {
  const [step, setStep] = useState<'mode' | 'setup' | 'join' | 'create' | 'rate' | 'results'>('mode')
  
  // נתוני חדר ומשתמש
  const [roomCode, setRoomCode] = useState('')
  const [inputRoomCode, setInputRoomCode] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [players, setPlayers] = useState<string[]>([])
  const [isHost, setIsHost] = useState(false)

  // נתוני יצירת מים
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [swapsLeft, setSwapsLeft] = useState(3)
  const [captionText, setCaptionText] = useState('')
  const [submissions, setSubmissions] = useState<MemeSubmission[]>([])
  
  // נתוני דירוג
  const [rateIndex, setRateIndex] = useState(0)

  // בחירת תמונה רנדומלית ראשונית
  const getRandomImage = () => Math.floor(Math.random() * MEME_IMAGES.length)

  // יצירת לובי חדש כמארח
  const handleCreateRoom = () => {
    if (!playerName.trim()) return
    const newCode = generateRoomCode()
    setRoomCode(newCode)
    setPlayers([playerName.trim()])
    setIsHost(true)
    setStep('setup')
  }

  // הצטרפות ללובי קים בעזרת קוד
  const handleJoinRoom = () => {
    if (!playerName.trim() || !inputRoomCode.trim()) return
    const code = inputRoomCode.trim().toUpperCase()
    setRoomCode(code)
    setIsHost(false)
    
    // סנכרון הדמיה עם הלובי
    const existingPlayers = JSON.parse(localStorage.getItem(`room_${code}`) || '[]')
    const updatedPlayers = [...new Set([...existingPlayers, playerName.trim()])]
    localStorage.setItem(`room_${code}`, JSON.stringify(updatedPlayers))
    setPlayers(updatedPlayers)
    
    setStep('setup')
  }

  const addLocalPlayer = () => {
    if (playerName.trim() && !players.includes(playerName.trim())) {
      const updated = [...players, playerName.trim()]
      setPlayers(updated)
      if (roomCode) {
        localStorage.setItem(`room_${roomCode}`, JSON.stringify(updated))
      }
      setPlayerName('')
    }
  }

  const startGame = () => {
    if (players.length < 2) return
    setCurrentImageIndex(getRandomImage())
    setSwapsLeft(3)
    setCaptionText('')
    setStep('create')
  }

  // החלפת תמונה (עד 3 פעמים)
  const handleSwapImage = () => {
    if (swapsLeft > 0) {
      setCurrentImageIndex(getRandomImage())
      setSwapsLeft(swapsLeft - 1)
    }
  }

  const submitCaption = () => {
    if (!captionText.trim()) return

    const newSub: MemeSubmission = {
      player: playerName || players[0] || 'שחקן',
      imageUrl: MEME_IMAGES[currentImageIndex],
      text: captionText.trim(),
      score: 0
    }

    const updatedSubs = [...submissions, newSub]
    setSubmissions(updatedSubs)
    setCaptionText('')

    // מעבר לשלב הדירוג
    setRateIndex(0)
    setStep('rate')
  }

  const addRating = (rating: number) => {
    const updated = [...submissions]
    if (updated[rateIndex]) {
      updated[rateIndex].score += rating
    }
    setSubmissions(updated)

    if (rateIndex + 1 < submissions.length) {
      setRateIndex(rateIndex + 1)
    } else {
      setStep('results')
    }
  }

  const resetGame = () => {
    setPlayers([])
    setSubmissions([])
    setStep('mode')
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff', direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '600px', marginBottom: '15px' }}>
        <button className="neon-button" onClick={onBack}>חזרה ללובי</button>
        <h2 style={{ color: '#ff007f' }}>משחק מימר</h2>
      </div>

      {/* שלב 0: בחירת מצב התחלה - יצירת לובי או הצטרפות */}
      {step === 'mode' && (
        <div style={{ width: '100%', maxWidth: '500px', textAlign: 'center', background: 'rgba(18, 18, 37, 0.85)', padding: '25px', borderRadius: '16px', border: '2px solid #00f3ff' }}>
          <h2 style={{ color: '#00f3ff', marginBottom: '20px' }}>בחירת מצב משחק</h2>
          
          <input 
            type="text" 
            value={playerName} 
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="הכנס את השם שלך"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #00f3ff', background: '#05050d', color: '#fff', fontSize: '1rem', marginBottom: '20px' }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="neon-button" style={{ width: '100%', padding: '14px' }} onClick={handleCreateRoom}>
              צור לובי חדש
            </button>
            <button className="neon-button" style={{ width: '100%', padding: '14px', borderColor: '#ff007f', color: '#ff007f' }} onClick={() => setStep('join')}>
              הצטרף ללובי קיים עם קוד
            </button>
          </div>
        </div>
      )}

      {/* שלב הצטרפות ללובי קיים */}
      {step === 'join' && (
        <div style={{ width: '100%', maxWidth: '500px', textAlign: 'center', background: 'rgba(18, 18, 37, 0.85)', padding: '25px', borderRadius: '16px', border: '2px solid #ff007f' }}>
          <h2 style={{ color: '#ff007f', marginBottom: '20px' }}>הצטרפות ללובי</h2>
          
          <input 
            type="text" 
            value={playerName} 
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="השם שלך"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ff007f', background: '#05050d', color: '#fff', fontSize: '1rem', marginBottom: '15px' }}
          />

          <input 
            type="text" 
            maxLength={4}
            value={inputRoomCode} 
            onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
            placeholder="קוד הלובי (4 תווים)"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ff007f', background: '#05050d', color: '#fff', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px' }}
          />

          <button className="neon-button" style={{ width: '100%', padding: '14px' }} onClick={handleJoinRoom}>
            אישור והצטרפות
          </button>
        </div>
      )}

      {/* שלב 1: מסך הלובי - הצגת קוד החדר ומשתתפים */}
      {step === 'setup' && (
        <div style={{ width: '100%', maxWidth: '500px', textAlign: 'center', background: 'rgba(18, 18, 37, 0.85)', padding: '25px', borderRadius: '16px', border: '2px solid #00f3ff' }}>
          <h3 style={{ color: '#00f3ff', marginBottom: '10px' }}>קוד הלובי שלך:</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#00f3ff', letterSpacing: '4px', marginBottom: '20px', textShadow: '0 0 15px #00f3ff' }}>
            {roomCode}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input 
              type="text" 
              value={playerName} 
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="הוסף שם משתתף נוסף"
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #00f3ff', background: '#05050d', color: '#fff', fontSize: '1rem' }}
            />
            <button className="neon-button" onClick={addLocalPlayer}>הוסף</button>
          </div>

          <p style={{ color: '#aaa', marginBottom: '10px' }}>משתתפים בחדר:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', minHeight: '40px', justifyContent: 'center' }}>
            {players.map((p, i) => (
              <span key={i} style={{ background: '#00f3ff', color: '#000', padding: '6px 14px', borderRadius: '20px', fontWeight: 'bold' }}>
                {p}
              </span>
            ))}
          </div>

          {players.length >= 1 && (
            <button className="neon-button" style={{ width: '100%', background: '#00f3ff', color: '#000', padding: '14px' }} onClick={startGame}>
              התחל יצירת מימ
            </button>
          )}
        </div>
      )}

      {/* שלב 2: יצירת מימ פרטית במכשיר השחקן */}
      {step === 'create' && (
        <div style={{ width: '100%', maxWidth: '500px', textAlign: 'center', background: 'rgba(18, 18, 37, 0.85)', padding: '25px', borderRadius: '16px', border: '2px solid #ff007f' }}>
          <h2 style={{ color: '#ff007f', marginBottom: '5px' }}>הכנת מימ פרטי</h2>
          <p style={{ color: '#aaa', marginBottom: '15px' }}>כתוב כותרת מצחיקה מעל התמונה:</p>

          <div style={{ position: 'relative', width: '100%', height: '280px', borderRadius: '12px', overflow: 'hidden', marginBottom: '15px', border: '2px solid #ff007f' }}>
            <img src={MEME_IMAGES[currentImageIndex]} alt="Meme" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {captionText && (
              <div style={{ 
                position: 'absolute', 
                top: '15px', 
                left: '0', 
                width: '100%', 
                padding: '0 10px',
                color: '#fff', 
                fontWeight: '900', 
                fontSize: '1.5rem', 
                textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
                textAlign: 'center',
                wordBreak: 'break-word'
              }}>
                {captionText}
              </div>
            )}
          </div>

          {/* כפתור החלפת תמונה - עד 3 פעמים */}
          <button 
            className="neon-button" 
            onClick={handleSwapImage}
            disabled={swapsLeft === 0}
            style={{ width: '100%', marginBottom: '15px', borderColor: swapsLeft > 0 ? '#00f3ff' : '#444', color: swapsLeft > 0 ? '#00f3ff' : '#666' }}
          >
            החלק/החליף תמונה (נותרו {swapsLeft} החלפות)
          </button>

          <input 
            type="text" 
            value={captionText} 
            onChange={(e) => setCaptionText(e.target.value)}
            placeholder="כתוב כותרת למים כאן..."
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ff007f', background: '#05050d', color: '#fff', fontSize: '1.1rem', marginBottom: '15px' }}
          />

          <button className="neon-button" style={{ width: '100%', padding: '14px' }} onClick={submitCaption}>
            אישור ושליחה לדירוג
          </button>
        </div>
      )}

      {/* שלב 3: דירוג הממים של כולם */}
      {step === 'rate' && (
        <div style={{ width: '100%', maxWidth: '500px', textAlign: 'center', background: 'rgba(18, 18, 37, 0.85)', padding: '25px', borderRadius: '16px', border: '2px solid #00f3ff' }}>
          <h2 style={{ color: '#00f3ff', marginBottom: '5px' }}>דירוג הממים</h2>
          <p style={{ color: '#aaa', marginBottom: '15px' }}>המימר של: {submissions[rateIndex]?.player || 'משתתף'}</p>

          {submissions[rateIndex] && (
            <div style={{ position: 'relative', width: '100%', height: '280px', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', border: '2px solid #00f3ff' }}>
              <img src={submissions[rateIndex].imageUrl} alt="Meme To Rate" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ 
                position: 'absolute', 
                top: '15px', 
                left: '0', 
                width: '100%', 
                padding: '0 10px',
                color: '#fff', 
                fontWeight: '900', 
                fontSize: '1.5rem', 
                textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
                textAlign: 'center',
                wordBreak: 'break-word'
              }}>
                {submissions[rateIndex].text}
              </div>
            </div>
          )}

          <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>דרגו מ-1 (הכי גרוע) עד 5 (הכי טוב):</p>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5].map((num) => (
              <button 
                key={num} 
                className="neon-button" 
                style={{ fontSize: '1.2rem', padding: '10px 18px', background: '#121225' }}
                onClick={() => addRating(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* שלב 4: תוצאות ודירוג נקודות */}
      {step === 'results' && (
        <div style={{ width: '100%', maxWidth: '500px', textAlign: 'center', background: 'rgba(18, 18, 37, 0.85)', padding: '25px', borderRadius: '16px', border: '2px solid #00f3ff' }}>
          <h1 style={{ color: '#00f3ff', marginBottom: '20px', fontSize: '2rem' }}>לוח התוצאות הסופי</h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '25px' }}>
            {[...submissions].sort((a, b) => b.score - a.score).map((sub, i) => (
              <div 
                key={i} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px 20px', 
                  background: i === 0 ? 'rgba(0, 243, 255, 0.2)' : '#05050d', 
                  border: i === 0 ? '2px solid #00f3ff' : '1px solid #333', 
                  borderRadius: '10px',
                  fontWeight: 'bold'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>#{i + 1} {sub.player}</span>
                <span style={{ fontSize: '1.3rem', color: '#00f3ff' }}>{sub.score} נקודות</span>
              </div>
            ))}
          </div>

          <button className="neon-button" style={{ width: '100%', padding: '14px' }} onClick={resetGame}>
            משחק חדש
          </button>
        </div>
      )}
    </div>
  )
}