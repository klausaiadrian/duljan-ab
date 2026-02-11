'use client'

import { useState, useEffect, useCallback } from 'react'

// ==================== HELPERS ====================
function timeAgo(ts) {
  if (!ts) return ''
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just nu'
  if (mins < 60) return `${mins}m sedan`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ${mins % 60}m sedan`
  return `${Math.floor(hrs / 24)}d sedan`
}

function typeIcon(type) {
  const map = { task: '📋', delegation: '🤝', agent: '🤖', completed: '✅', error: '❌', note: '📝', info: 'ℹ️' }
  return map[type] || '•'
}

function stateColor(state) {
  if (state === 'working') return '#48bb78'
  if (state === 'idle') return '#ecc94b'
  return '#f56565'
}

function stateLabel(state) {
  if (state === 'working') return 'WORKING'
  if (state === 'idle') return 'IDLE'
  return 'OFFLINE'
}

function getScoreEmoji(score) {
  if (score >= 80) return '🔥🔥🔥'
  if (score >= 65) return '🔥🔥'
  if (score >= 50) return '🔥'
  if (score >= 35) return '👍'
  return '😐'
}

function getScoreColor(score) {
  if (score >= 80) return '#f56565'
  if (score >= 65) return '#ed8936'
  if (score >= 50) return '#ecc94b'
  if (score >= 35) return '#48bb78'
  return '#71717a'
}

function getRecommendation(score) {
  if (score >= 80) return '🥇 KÖP NU!'
  if (score >= 65) return '🥈 Utmärkt val'
  if (score >= 50) return '🥉 Bra val'
  if (score >= 35) return '👍 OK'
  return '⚠️ Inte optimal'
}

// ==================== COMPONENT ====================
export default function MissionControl() {
  const [status, setStatus] = useState({ state: 'offline', task: null, since: null, subAgents: [] })
  const [activity, setActivity] = useState([])
  const [tasks, setTasks] = useState({ active: [], nextUp: [], done: [] })
  const [notes, setNotes] = useState([])
  const [feed, setFeed] = useState({ posts: [] })
  const [blocket, setBlocket] = useState({ leaderboard: [], latest: [], stats: {} })
  const [noteText, setNoteText] = useState('')
  const [taskName, setTaskName] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [now, setNow] = useState(new Date())
  const [tab, setTab] = useState('overview')

  const fetchAll = useCallback(async () => {
    try {
      const [sRes, aRes, tRes, nRes, fRes, bRes] = await Promise.all([
        fetch('/api/status').then(r => r.json()).catch(() => ({})),
        fetch('/api/activity').then(r => r.json()).catch(() => ({ events: [] })),
        fetch('/api/tasks').then(r => r.json()).catch(() => ({ active: [], nextUp: [], done: [] })),
        fetch('/api/notes').then(r => r.json()).catch(() => ({ notes: [] })),
        fetch('/api/feed').then(r => r.json()).catch(() => ({ posts: [] })),
        fetch('/api/blocket').then(r => r.json()).catch(() => ({ leaderboard: [], latest: [], stats: {} }))
      ])
      setStatus(sRes)
      setActivity(aRes.events || [])
      setTasks(tRes)
      setNotes(nRes.notes || [])
      setFeed(fRes)
      setBlocket(bRes)
    } catch (e) { console.error('Fetch error:', e) }
  }, [])

  useEffect(() => {
    fetchAll()
    const i = setInterval(fetchAll, 5000)
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => { clearInterval(i); clearInterval(t) }
  }, [fetchAll])

  const addNote = async () => {
    if (!noteText.trim()) return
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'Adrian', text: noteText.trim() })
    })
    setNoteText('')
    fetchAll()
  }

  const addTask = async () => {
    if (!taskName.trim()) return
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: taskName.trim(), description: taskDesc.trim(), prio: 'HIGH' })
    })
    setTaskName('')
    setTaskDesc('')
    fetchAll()
  }

  const sc = stateColor(status.state)

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e4e4e7', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace' }}>
      {/* HEADER */}
      <header style={{ background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid #27272a', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 28 }}>🧠</span>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, background: 'linear-gradient(90deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Mission Control</h1>
              <span style={{ fontSize: 11, color: '#71717a' }}>Duljan AB</span>
            </div>
          </div>

          {/* STATUS BADGE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 20, background: `${sc}15`, border: `1px solid ${sc}33` }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: sc, boxShadow: `0 0 8px ${sc}`, animation: status.state === 'working' ? 'pulse 2s infinite' : 'none' }} />
              <span style={{ color: sc, fontWeight: 700, fontSize: 13 }}>{stateLabel(status.state)}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'monospace', color: '#fff' }}>
                {now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div style={{ fontSize: 11, color: '#71717a' }}>{now.toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
            </div>
          </div>
        </div>
      </header>

      {/* CURRENT TASK BAR */}
      {status.task && (
        <div style={{ background: '#111', borderBottom: '1px solid #27272a', padding: '10px 24px' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
            <span>🔨</span>
            <span style={{ color: '#a78bfa', fontWeight: 600 }}>Klaus jobbar med:</span>
            <span style={{ color: '#e4e4e7' }}>{status.task}</span>
            {status.since && <span style={{ color: '#71717a', marginLeft: 'auto' }}>{timeAgo(status.since)}</span>}
          </div>
          {status.subAgents?.length > 0 && (
            <div style={{ maxWidth: 1400, margin: '4px auto 0', display: 'flex', gap: 12, fontSize: 12 }}>
              {status.subAgents.map((a, i) => (
                <span key={i} style={{ color: '#71717a' }}>🤖 {a.name}: {a.task} ({a.state})</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TABS */}
      <div style={{ background: '#111', borderBottom: '1px solid #27272a', padding: '0 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', gap: 4 }}>
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'tasks', label: '📋 Tasks' },
            { id: 'blocket', label: '🔍 Blocket' },
            { id: 'feed', label: '🐦 X/Twitter' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '14px 20px', background: 'transparent', border: 'none', borderBottom: tab === t.id ? '2px solid #667eea' : '2px solid transparent',
              color: tab === t.id ? '#fff' : '#71717a', fontSize: 14, fontWeight: tab === t.id ? 600 : 400, cursor: 'pointer'
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main style={{ maxWidth: 1400, margin: '0 auto', padding: 24 }}>

        {/* ====== OVERVIEW TAB ====== */}
        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>

            {/* ACTIVITY LOG */}
            <div style={{ background: '#111', borderRadius: 12, border: '1px solid #27272a', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #27272a', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📜</span>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Activity Log</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: '#71717a' }}>{activity.length} events</span>
              </div>
              <div style={{ maxHeight: 500, overflowY: 'auto', padding: '8px 0' }}>
                {activity.length === 0 && <div style={{ padding: 18, color: '#52525b', textAlign: 'center' }}>No activity yet</div>}
                {activity.map((e, i) => (
                  <div key={i} style={{ padding: '8px 18px', borderBottom: '1px solid #1a1a1a', fontSize: 13, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span>{typeIcon(e.type)}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#d4d4d8' }}>{e.action}</div>
                      <div style={{ color: '#52525b', fontSize: 11, marginTop: 2 }}>{e.actor} · {timeAgo(e.ts)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TASK SUMMARY */}
            <div style={{ background: '#111', borderRadius: 12, border: '1px solid #27272a', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #27272a', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📋</span>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Tasks</span>
              </div>
              <div style={{ padding: 18 }}>
                {/* Active */}
                {tasks.active?.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: '#f56565', fontWeight: 700, marginBottom: 8 }}>🔴 ACTIVE</div>
                    {tasks.active.map((t, i) => (
                      <div key={i} style={{ padding: '8px 12px', background: '#1a1a1a', borderRadius: 8, marginBottom: 6, fontSize: 13 }}>
                        <div style={{ fontWeight: 600 }}>{t.name}</div>
                        {t.type && <span style={{ fontSize: 11, color: '#71717a' }}>{t.type}</span>}
                      </div>
                    ))}
                  </div>
                )}
                {/* Next Up */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: '#ecc94b', fontWeight: 700, marginBottom: 8 }}>🟡 NEXT UP</div>
                  {tasks.nextUp?.length === 0 && <div style={{ color: '#52525b', fontSize: 12 }}>Empty</div>}
                  {tasks.nextUp?.map((t, i) => (
                    <div key={i} style={{ padding: '8px 12px', background: '#1a1a1a', borderRadius: 8, marginBottom: 6, fontSize: 13 }}>
                      <div style={{ fontWeight: 600 }}>{t.name}</div>
                      {t.prio && <span style={{ fontSize: 11, color: t.prio === 'HIGH' ? '#f56565' : '#71717a', fontWeight: 600 }}>{t.prio}</span>}
                    </div>
                  ))}
                </div>
                {/* Done */}
                <div>
                  <div style={{ fontSize: 11, color: '#48bb78', fontWeight: 700, marginBottom: 8 }}>✅ DONE (senaste)</div>
                  {tasks.done?.slice(0, 3).map((t, i) => (
                    <div key={i} style={{ padding: '6px 12px', fontSize: 12, color: '#52525b' }}>✅ {t.name}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* NOTES PANEL */}
            <div style={{ background: '#111', borderRadius: 12, border: '1px solid #27272a', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #27272a', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>💬</span>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Notes till Klaus</span>
              </div>
              {/* Input */}
              <div style={{ padding: '12px 18px', borderBottom: '1px solid #1a1a1a', display: 'flex', gap: 8 }}>
                <input
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addNote()}
                  placeholder="Skriv en note till Klaus..."
                  style={{ flex: 1, background: '#1a1a1a', border: '1px solid #27272a', borderRadius: 8, padding: '8px 12px', color: '#e4e4e7', fontSize: 13, outline: 'none' }}
                />
                <button onClick={addNote} style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: 8, padding: '8px 16px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Skicka</button>
              </div>
              {/* Notes list */}
              <div style={{ maxHeight: 380, overflowY: 'auto', padding: '8px 0' }}>
                {notes.length === 0 && <div style={{ padding: 18, color: '#52525b', textAlign: 'center', fontSize: 13 }}>Inga noter ännu. Skriv något till Klaus!</div>}
                {[...notes].reverse().map((n, i) => (
                  <div key={i} style={{ padding: '8px 18px', borderBottom: '1px solid #1a1a1a', opacity: n.seen ? 0.5 : 1 }}>
                    <div style={{ fontSize: 13, color: '#d4d4d8' }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: '#52525b', marginTop: 2 }}>
                      {n.from} · {timeAgo(n.ts)}
                      {n.seen && <span style={{ marginLeft: 8, color: '#48bb78' }}>✓ Sedd</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ====== TASKS TAB ====== */}
        {tab === 'tasks' && (
          <div>
            {/* Add Task Form */}
            <div style={{ background: '#111', borderRadius: 12, border: '1px solid #27272a', padding: 18, marginBottom: 20, display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, color: '#71717a', display: 'block', marginBottom: 4 }}>Task Name</label>
                <input value={taskName} onChange={e => setTaskName(e.target.value)} placeholder="Namn på task..."
                  style={{ width: '100%', background: '#1a1a1a', border: '1px solid #27272a', borderRadius: 8, padding: '8px 12px', color: '#e4e4e7', fontSize: 13, outline: 'none' }} />
              </div>
              <div style={{ flex: 2 }}>
                <label style={{ fontSize: 11, color: '#71717a', display: 'block', marginBottom: 4 }}>Beskrivning</label>
                <input value={taskDesc} onChange={e => setTaskDesc(e.target.value)} placeholder="Vad ska göras..."
                  style={{ width: '100%', background: '#1a1a1a', border: '1px solid #27272a', borderRadius: 8, padding: '8px 12px', color: '#e4e4e7', fontSize: 13, outline: 'none' }} />
              </div>
              <button onClick={addTask} style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: 8, padding: '10px 24px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>+ Add Task</button>
            </div>

            {/* Kanban */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
              {/* Active */}
              <div style={{ background: '#111', borderRadius: 12, border: '1px solid #27272a' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #27272a', fontSize: 14, fontWeight: 700, color: '#f56565' }}>🔴 Active ({tasks.active?.length || 0})</div>
                <div style={{ padding: 12 }}>
                  {tasks.active?.length === 0 && <div style={{ color: '#52525b', textAlign: 'center', padding: 20, fontSize: 13 }}>Ingen aktiv task</div>}
                  {tasks.active?.map((t, i) => (
                    <div key={i} style={{ padding: 14, background: '#1a1a1a', borderRadius: 10, marginBottom: 8, borderLeft: '3px solid #f56565' }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                      {t.spec && <div style={{ fontSize: 12, color: '#71717a', marginTop: 4 }}>{t.spec}</div>}
                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        {t.type && <span style={{ fontSize: 10, background: '#27272a', padding: '2px 8px', borderRadius: 10, color: '#a1a1aa' }}>{t.type}</span>}
                        {t.prio && <span style={{ fontSize: 10, background: t.prio === 'HIGH' ? '#f5656533' : '#27272a', padding: '2px 8px', borderRadius: 10, color: t.prio === 'HIGH' ? '#f56565' : '#a1a1aa' }}>{t.prio}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Next Up */}
              <div style={{ background: '#111', borderRadius: 12, border: '1px solid #27272a' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #27272a', fontSize: 14, fontWeight: 700, color: '#ecc94b' }}>🟡 Next Up ({tasks.nextUp?.length || 0})</div>
                <div style={{ padding: 12 }}>
                  {tasks.nextUp?.length === 0 && <div style={{ color: '#52525b', textAlign: 'center', padding: 20, fontSize: 13 }}>Kön är tom</div>}
                  {tasks.nextUp?.map((t, i) => (
                    <div key={i} style={{ padding: 14, background: '#1a1a1a', borderRadius: 10, marginBottom: 8, borderLeft: '3px solid #ecc94b' }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                      {t.spec && <div style={{ fontSize: 12, color: '#71717a', marginTop: 4 }}>{t.spec}</div>}
                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        {t.type && <span style={{ fontSize: 10, background: '#27272a', padding: '2px 8px', borderRadius: 10, color: '#a1a1aa' }}>{t.type}</span>}
                        {t.prio && <span style={{ fontSize: 10, background: t.prio === 'HIGH' ? '#f5656533' : '#27272a', padding: '2px 8px', borderRadius: 10, color: t.prio === 'HIGH' ? '#f56565' : '#a1a1aa' }}>{t.prio}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Done */}
              <div style={{ background: '#111', borderRadius: 12, border: '1px solid #27272a' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #27272a', fontSize: 14, fontWeight: 700, color: '#48bb78' }}>✅ Done ({tasks.done?.length || 0})</div>
                <div style={{ padding: 12 }}>
                  {tasks.done?.map((t, i) => (
                    <div key={i} style={{ padding: 12, background: '#1a1a1a', borderRadius: 10, marginBottom: 8, borderLeft: '3px solid #48bb78', opacity: 0.7 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{t.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====== BLOCKET TAB ====== */}
        {tab === 'blocket' && (
          <div>
            {/* Stats Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
              <div style={{ background: '#111', borderRadius: 12, border: '1px solid #27272a', padding: 18 }}>
                <div style={{ fontSize: 11, color: '#71717a', marginBottom: 4 }}>📊 Totalt bevakade</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>{blocket.stats?.totalTracked || 0}</div>
              </div>
              <div style={{ background: '#111', borderRadius: 12, border: '1px solid #27272a', padding: 18 }}>
                <div style={{ fontSize: 11, color: '#71717a', marginBottom: 4 }}>🏆 Top deals</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#ecc94b' }}>{blocket.stats?.topDeals || 0}</div>
              </div>
              <div style={{ background: '#111', borderRadius: 12, border: '1px solid #27272a', padding: 18 }}>
                <div style={{ fontSize: 11, color: '#71717a', marginBottom: 4 }}>🔥 Score 50+</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#f56565' }}>
                  {blocket.leaderboard?.filter(d => d.score >= 50).length || 0}
                </div>
              </div>
              <div style={{ background: '#111', borderRadius: 12, border: '1px solid #27272a', padding: 18 }}>
                <div style={{ fontSize: 11, color: '#71717a', marginBottom: 4 }}>⏰ Senast uppdaterad</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>
                  {blocket.stats?.lastScrape ? timeAgo(blocket.stats.lastScrape) : 'Aldrig'}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* LEADERBOARD */}
              <div style={{ background: '#111', borderRadius: 12, border: '1px solid #27272a', overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #27272a', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🏆</span>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>Top 20 Leaderboard</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: '#71717a' }}>Bästa deals just nu</span>
                </div>
                <div style={{ maxHeight: 600, overflowY: 'auto' }}>
                  {blocket.leaderboard?.length === 0 && (
                    <div style={{ padding: 40, color: '#52525b', textAlign: 'center' }}>
                      <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                      <div>Inga deals hittade ännu</div>
                    </div>
                  )}
                  {blocket.leaderboard?.map((deal, i) => (
                    <div key={deal.id || i} style={{ 
                      padding: '12px 18px', 
                      borderBottom: '1px solid #1a1a1a',
                      background: i < 3 ? 'rgba(102, 126, 234, 0.05)' : 'transparent'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                        <span style={{ 
                          fontSize: 14, 
                          fontWeight: 700, 
                          color: i < 3 ? '#ecc94b' : '#71717a',
                          minWidth: 24
                        }}>#{i + 1}</span>
                        <span style={{ fontSize: 16 }}>{getScoreEmoji(deal.score)}</span>
                        <span style={{ 
                          fontSize: 20, 
                          fontWeight: 700, 
                          color: getScoreColor(deal.score),
                          fontFamily: 'monospace'
                        }}>{deal.score}</span>
                        <span style={{ marginLeft: 'auto', fontSize: 14, fontWeight: 600, color: '#fff' }}>{deal.price_text}</span>
                      </div>
                      <div style={{ fontSize: 13, color: '#d4d4d8', marginBottom: 4, lineHeight: 1.4 }}>{deal.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12 }}>
                        <span style={{ color: '#71717a' }}>📍 {deal.location}</span>
                        <span style={{ color: getScoreColor(deal.score) }}>{getRecommendation(deal.score)}</span>
                        <a 
                          href={deal.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ marginLeft: 'auto', color: '#667eea', textDecoration: 'none' }}
                        >
                          Öppna →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LATEST LISTINGS */}
              <div style={{ background: '#111', borderRadius: 12, border: '1px solid #27272a', overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #27272a', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🆕</span>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>Senaste annonserna</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: '#71717a' }}>{blocket.latest?.length || 0} st</span>
                </div>
                <div style={{ maxHeight: 600, overflowY: 'auto' }}>
                  {blocket.latest?.length === 0 && (
                    <div style={{ padding: 40, color: '#52525b', textAlign: 'center' }}>
                      <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
                      <div>Inga nya annonser</div>
                    </div>
                  )}
                  {blocket.latest?.slice(0, 30).map((deal, i) => (
                    <div key={deal.id || i} style={{ padding: '10px 18px', borderBottom: '1px solid #1a1a1a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 14 }}>{getScoreEmoji(deal.score)}</span>
                        <span style={{ 
                          fontSize: 14, 
                          fontWeight: 600, 
                          color: getScoreColor(deal.score),
                          fontFamily: 'monospace'
                        }}>{deal.score}</span>
                        <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 600, color: '#fff' }}>{deal.price_text}</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#a1a1aa', marginBottom: 2 }}>{deal.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                        <span style={{ color: '#52525b' }}>📍 {deal.location}</span>
                        <span style={{ color: '#52525b' }}>🔍 {deal.search}</span>
                        <a 
                          href={deal.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ marginLeft: 'auto', color: '#667eea', textDecoration: 'none' }}
                        >
                          Visa →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====== FEED TAB ====== */}
        {tab === 'feed' && (
          <div style={{ background: '#111', borderRadius: 12, border: '1px solid #27272a' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #27272a', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🐦</span>
              <span style={{ fontWeight: 700, fontSize: 15 }}>X/Twitter Feed</span>
              {feed.lastFetch && <span style={{ marginLeft: 'auto', fontSize: 11, color: '#71717a' }}>Updated {timeAgo(feed.lastFetch)}</span>}
            </div>
            <div style={{ padding: 18 }}>
              {(!feed.posts || feed.posts.length === 0) && (
                <div style={{ textAlign: 'center', padding: 40, color: '#52525b' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🐦</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#71717a' }}>Ingen feed-data ännu</div>
                  <div style={{ fontSize: 13, marginTop: 8 }}>Klaus hämtar AI/OpenClaw-tweets och visar dem här</div>
                </div>
              )}
              {feed.posts?.map((p, i) => (
                <div key={i} style={{ padding: 14, borderBottom: '1px solid #1a1a1a' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#a78bfa' }}>@{p.author}</span>
                    <span style={{ fontSize: 11, color: '#52525b' }}>{timeAgo(p.ts)}</span>
                  </div>
                  <div style={{ fontSize: 14, color: '#d4d4d8', lineHeight: 1.5 }}>{p.text}</div>
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#667eea', textDecoration: 'none', marginTop: 6, display: 'inline-block' }}>🔗 Visa på X</a>}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* PULSE ANIMATION */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
