import { useState } from 'react'

function App() {
  const [resource, setResource] = useState(0)

  return (
    <main className="page-shell">
      <section className="game-card">
        <p className="eyebrow">AI GAME STUDIO</p>
        <h1>הפרויקט שלי</h1>
        <p className="intro">
          זאת גרסת ההתחלה. במהלך השנה תהפכו אותה למשחק או לאפליקציה משלכם.
        </p>

        <div className="resource-box">
          <span>משאב ראשון</span>
          <strong>{resource}</strong>
        </div>

        <button onClick={() => setResource((current) => current + 1)}>
          בצעו פעולה ראשונה
        </button>

        <p className="hint">
          המשימה הראשונה שלכם: לשנות את המסך הזה כך שיתאים לרעיון שלכם.
        </p>
      </section>
    </main>
  )
}

export default App
