import { useState, useEffect } from 'react'
import WheelGame from './games/WheelGame'
import GuessingGame from './games/GuessingGame'
import ChoosyGame from './games/ChoosyGame'
import MemarGame from './games/MemarGame'

type Page = 'lobby' | 'friends' | 'profile' | 'wheel' | 'guessing' | 'choosy' | 'memar'

interface Friend {
  id: string
  code: string
  name: string
  status: 'online' | 'offline'
}

interface Message {
  senderCode: string
  text: string
  time: string
}

function AvatarGraphics({ type }: { type: string }) {
  const size = 120

  if (type === 'panda') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="20" cy="25" r="14" fill="#111" />
        <circle cx="80" cy="25" r="14" fill="#111" />
        <circle cx="50" cy="55" r="38" fill="#fff" stroke="#111" strokeWidth="3" />
        <ellipse cx="35" cy="50" rx="10" ry="14" fill="#111" />
        <ellipse cx="65" cy="50" rx="10" ry="14" fill="#111" />
        <circle cx="35" cy="48" r="4" fill="#fff" />
        <circle cx="65" cy="48" r="4" fill="#fff" />
        <polygon points="45,64 55,64 50,70" fill="#111" />
      </svg>
    )
  }

  if (type === 'frog') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="30" cy="28" r="16" fill="#00ff66" />
        <circle cx="70" cy="28" r="16" fill="#00ff66" />
        <circle cx="30" cy="28" r="8" fill="#fff" />
        <circle cx="70" cy="28" r="8" fill="#fff" />
        <circle cx="30" cy="28" r="4" fill="#000" />
        <circle cx="70" cy="28" r="4" fill="#000" />
        <ellipse cx="50" cy="60" rx="42" ry="32" fill="#00ff66" />
        <path d="M 30 68 Q 50 82 70 68" stroke="#005511" strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'tiger') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="55" r="40" fill="#ff7700" />
        <polygon points="15,20 30,40 10,45" fill="#ff7700" />
        <polygon points="85,20 70,40 90,45" fill="#ff7700" />
        <ellipse cx="35" cy="50" rx="7" ry="10" fill="#fff" />
        <ellipse cx="65" cy="50" rx="7" ry="10" fill="#fff" />
        <circle cx="35" cy="50" r="3" fill="#000" />
        <circle cx="65" cy="50" r="3" fill="#000" />
        <polygon points="45,62 55,62 50,68" fill="#000" />
        <path d="M 50 20 L 50 35 M 35 25 L 42 33 M 65 25 L 58 33" stroke="#000" strokeWidth="3" />
      </svg>
    )
  }

  if (type === 'unicorn') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <polygon points="50,5 43,35 57,35" fill="#ff00ff" stroke="#00f3ff" strokeWidth="2" />
        <ellipse cx="50" cy="60" rx="36" ry="32" fill="#ffffff" />
        <polygon points="25,30 35,45 20,48" fill="#ffffff" />
        <polygon points="75,30 65,45 80,48" fill="#ffffff" />
        <circle cx="38" cy="55" r="5" fill="#00f3ff" />
        <circle cx="62" cy="55" r="5" fill="#00f3ff" />
        <path d="M 40 72 Q 50 80 60 72" stroke="#ff00ff" strokeWidth="3" fill="none" />
      </svg>
    )
  }

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <ellipse cx="50" cy="58" rx="34" ry="34" fill="#8b4513" />
      <polygon points="25,25 35,45 18,45" fill="#8b4513" />
      <polygon points="75,25 65,45 82,45" fill="#8b4513" />
      <ellipse cx="50" cy="70" rx="20" ry="14" fill="#d2b48c" />
      <circle cx="36" cy="52" r="5" fill="#000" />
      <circle cx="64" cy="52" r="5" fill="#000" />
      <circle cx="43" cy="68" r="3" fill="#000" />
      <circle cx="57" cy="68" r="3" fill="#000" />
    </svg>
  )
}

const AVATARS = [
  { id: 'panda', name: 'פנדה' },
  { id: 'frog', name: 'צפרדע' },
  { id: 'tiger', name: 'נמר' },
  { id: 'unicorn', name: 'חד קרן' },
  { id: 'horse', name: 'סוס' },
]

// פונקציה ליצירת קוד בן 4 תווים (אותיות באנגלית + ספרות)
function generateUserCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('lobby')
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0])
  const [userCode] = useState(() => generateUserCode())

  // ניהול חברים וצ'אט
  const [friendCodeInput, setFriendCodeInput] = useState('')
  const [friendsList, setFriendsList] = useState<Friend[]>([])
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [chatInput, setChatInput] = useState('')

  const handleAddFriend = () => {
    const cleanCode = friendCodeInput.trim().toUpperCase()
    if (cleanCode.length !== 4) {
      alert('קוד חבר חייב להכיל בדיוק 4 תווים')
      return
    }
    if (cleanCode === userCode) {
      alert('אינך יכול להוסיף את הקוד של עצמך')
      return
    }
    if (friendsList.some(f => f.code === cleanCode)) {
      alert('חבר זה כבר קיים ברשימה')
      return
    }

    const newFriend: Friend = {
      id: Date.now().toString(),
      code: cleanCode,
      name: `משתמש ${cleanCode}`,
      status: 'online'
    }

    setFriendsList([...friendsList, newFriend])
    setFriendCodeInput('')
  }

  const handleSendMessage = () => {
    if (!selectedFriend || !chatInput.trim()) return

    const newMessage: Message = {
      senderCode: userCode,
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const friendCode = selectedFriend.code
    setMessages(prev => ({
      ...prev,
      [friendCode]: [...(prev[friendCode] || []), newMessage]
    }))

    setChatInput('')
  }

  return (
    <main style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#05050d',
      color: '#fff',
      fontFamily: 'system-ui, sans-serif',
      direction: 'rtl',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .neon-title {
          font-size: 3rem;
          font-weight: 900;
          text-align: center;
          color: #fff;
          text-shadow: 0 0 10px #00f3ff, 0 0 20px #00f3ff, 0 0 40px #00f3ff;
          letter-spacing: 2px;
        }

        .neon-button {
          background: rgba(0, 0, 0, 0.5);
          color: #00f3ff;
          border: 2px solid #00f3ff;
          padding: 10px 24px;
          border-radius: 10px;
          font-weight: bold;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          box-shadow: 0 0 10px rgba(0, 243, 255, 0.3);
        }

        .neon-button:hover {
          background: #00f3ff;
          color: #000;
          box-shadow: 0 0 25px #00f3ff;
        }

        .game-grid-btn {
          background: rgba(18, 18, 37, 0.8);
          border: 2px solid #ff007f;
          color: #ff007f;
          padding: 20px;
          border-radius: 16px;
          cursor: pointer;
          text-align: center;
          font-size: 1.5rem;
          font-weight: bold;
          transition: all 0.2s ease-in-out;
          box-shadow: 0 0 15px rgba(255, 0, 127, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .game-grid-btn:hover {
          background: #ff007f;
          color: #fff;
          box-shadow: 0 0 30px #ff007f;
          transform: scale(1.03);
        }

        .user-code-badge {
          background: rgba(0, 243, 255, 0.15);
          border: 2px solid #00f3ff;
          padding: 6px 16px;
          border-radius: 20px;
          font-weight: bold;
          color: #00f3ff;
          letter-spacing: 2px;
          font-size: 1.1rem;
          box-shadow: 0 0 10px rgba(0, 243, 255, 0.3);
        }

        .avatar-display-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,243,255,0.15) 0%, rgba(0,0,0,0) 70%);
          border: 3px solid #00f3ff;
          box-shadow: 0 0 30px #00f3ff, inset 0 0 20px #00f3ff;
          width: 170px;
          height: 170px;
          margin: 10px auto;
        }
      `}</style>

      {/* תפריט ניווט עליון כולל הצגת הקוד האישי */}
      <header style={{ 
        width: '100%',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '15px 30px',
        borderBottom: '1px solid rgba(0, 243, 255, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            className="neon-button"
            onClick={() => setCurrentPage('lobby')}
            style={{ borderColor: currentPage === 'lobby' ? '#00f3ff' : '#444', color: currentPage === 'lobby' ? '#00f3ff' : '#777' }}
          >
            לובי ראשי
          </button>
          
          {/* הקוד האישי של המשתמש */}
          <div className="user-code-badge">
            קוד אישי: {userCode}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            className="neon-button"
            onClick={() => setCurrentPage('friends')}
            style={{ borderColor: currentPage === 'friends' ? '#00f3ff' : '#444', color: currentPage === 'friends' ? '#00f3ff' : '#777' }}
          >
            חברים
          </button>
          <button 
            className="neon-button"
            onClick={() => setCurrentPage('profile')}
            style={{ borderColor: currentPage === 'profile' ? '#00f3ff' : '#444', color: currentPage === 'profile' ? '#00f3ff' : '#777' }}
          >
            פרופיל
          </button>
        </div>
      </header>

      {/* גוף העמוד */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px',
        width: '100%',
        overflowY: 'auto'
      }}>
        {currentPage === 'lobby' && (
          <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h1 className="neon-title">לובי המשחקים</h1>

            {/* דמות החיה במרכז הלובי */}
            <div className="avatar-display-container">
              <AvatarGraphics type={selectedAvatar.id} />
              <span style={{ marginTop: '8px', fontWeight: 'bold', color: '#00f3ff', fontSize: '1.1rem' }}>
                {selectedAvatar.name}
              </span>
            </div>

            <p style={{ textAlign: 'center', color: '#888', fontSize: '1.2rem' }}>בחרו משחק להתחלה:</p>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '20px'
            }}>
              <button className="game-grid-btn" onClick={() => setCurrentPage('wheel')}>
                גלגל
              </button>

              <button className="game-grid-btn" onClick={() => setCurrentPage('guessing')}>
                ניחושים
              </button>

              <button className="game-grid-btn" onClick={() => setCurrentPage('choosy')}>
                שוואזי
              </button>

              <button className="game-grid-btn" onClick={() => setCurrentPage('memar')}>
                מימר
              </button>
            </div>
          </div>
        )}

        {/* מסך חברים וצ'אט */}
        {currentPage === 'friends' && (
          <div style={{ width: '100%', maxWidth: '800px', height: '80vh', display: 'flex', flexDirection: 'column' }}>
            <h2 className="neon-title" style={{ fontSize: '2.2rem', marginBottom: '15px' }}>ניהול חברים</h2>

            {/* אזור הוספת חבר לפי קוד */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', background: 'rgba(18, 18, 37, 0.8)', padding: '15px', borderRadius: '12px', border: '1px solid #00f3ff' }}>
              <input 
                type="text" 
                maxLength={4}
                value={friendCodeInput}
                onChange={(e) => setFriendCodeInput(e.target.value.toUpperCase())}
                placeholder="הכנס קוד חבר (4 תווים)"
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #00f3ff', background: '#05050d', color: '#fff', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}
              />
              <button className="neon-button" onClick={handleAddFriend}>הוסף חבר</button>
            </div>

            {/* אזור רשימת חברים וצ'אט פנימי */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px', flex: 1, minHeight: '0' }}>
              {/* רשימת החברים */}
              <div style={{ background: 'rgba(18, 18, 37, 0.8)', padding: '15px', borderRadius: '12px', border: '1px solid #ff007f', overflowY: 'auto' }}>
                <h3 style={{ color: '#ff007f', marginBottom: '10px', fontSize: '1.1rem' }}>רשימת חברים</h3>
                {friendsList.length === 0 ? (
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>טרם הוספת חברים. הוסף חבר בעזרת הקוד שלו.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {friendsList.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setSelectedFriend(f)}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: selectedFriend?.code === f.code ? '2px solid #00f3ff' : '1px solid #333',
                          background: selectedFriend?.code === f.code ? 'rgba(0, 243, 255, 0.15)' : '#05050d',
                          color: '#fff',
                          cursor: 'pointer',
                          textAlign: 'right',
                          fontWeight: 'bold'
                        }}
                      >
                        <div>{f.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#00f3ff' }}>קוד: {f.code}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* חלון צ'אט */}
              <div style={{ background: 'rgba(18, 18, 37, 0.8)', padding: '15px', borderRadius: '12px', border: '1px solid #00f3ff', display: 'flex', flexDirection: 'column' }}>
                {selectedFriend ? (
                  <>
                    <h3 style={{ color: '#00f3ff', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '8px' }}>
                      שיחה עם {selectedFriend.name} ({selectedFriend.code})
                    </h3>

                    {/* הודעות צ'אט */}
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '10px' }}>
                      {(messages[selectedFriend.code] || []).map((msg, index) => (
                        <div 
                          key={index}
                          style={{
                            alignSelf: msg.senderCode === userCode ? 'flex-end' : 'flex-start',
                            background: msg.senderCode === userCode ? '#00f3ff' : '#ff007f',
                            color: msg.senderCode === userCode ? '#000' : '#fff',
                            padding: '8px 14px',
                            borderRadius: '12px',
                            maxWidth: '75%',
                            fontWeight: 'bold'
                          }}
                        >
                          <div>{msg.text}</div>
                          <div style={{ fontSize: '0.7rem', opacity: 0.8, textAlign: 'left', marginTop: '2px' }}>{msg.time}</div>
                        </div>
                      ))}
                    </div>

                    {/* קלט שליחת הודעה */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="כתוב הודעה לחבר..."
                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #00f3ff', background: '#05050d', color: '#fff' }}
                      />
                      <button className="neon-button" onClick={handleSendMessage}>שלח</button>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                    בחר חבר מהרשימה כדי להתחיל להתכתב
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* מסך פרופיל */}
        {currentPage === 'profile' && (
          <div style={{ width: '100%', maxWidth: '700px', textAlign: 'center' }}>
            <h2 className="neon-title" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>בחירת דמות</h2>
            <p style={{ color: '#00f3ff', fontSize: '1.2rem', marginBottom: '20px' }}>הקוד האישי שלך: {userCode}</p>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '20px',
              marginBottom: '30px'
            }}>
              {AVATARS.map((avatar) => (
                <div
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar)}
                  style={{
                    background: selectedAvatar.id === avatar.id ? 'rgba(0, 243, 255, 0.2)' : 'rgba(18, 18, 37, 0.6)',
                    border: selectedAvatar.id === avatar.id ? '3px solid #00f3ff' : '1px solid #333',
                    borderRadius: '16px',
                    padding: '15px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: selectedAvatar.id === avatar.id ? '0 0 20px #00f3ff' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <AvatarGraphics type={avatar.id} />
                  <span style={{ marginTop: '10px', fontWeight: 'bold', fontSize: '1.1rem' }}>{avatar.name}</span>
                </div>
              ))}
            </div>

            <button className="neon-button" onClick={() => setCurrentPage('lobby')} style={{ width: '100%', padding: '15px' }}>
              אישור וחזרה ללובי
            </button>
          </div>
        )}

        {/* טעינת המשחקים */}
        {currentPage === 'wheel' && <WheelGame onBack={() => setCurrentPage('lobby')} />}
        {currentPage === 'guessing' && <GuessingGame onBack={() => setCurrentPage('lobby')} />}
        {currentPage === 'choosy' && <ChoosyGame onBack={() => setCurrentPage('lobby')} />}
        {currentPage === 'memar' && <MemarGame onBack={() => setCurrentPage('lobby')} />}
      </div>
    </main>
  )
}