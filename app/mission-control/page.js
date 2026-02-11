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

// ==================== MARKET INTELLIGENCE DATA ====================
const marketData = {
  community: {
    githubStars: 184000,
    githubForks: 30900,
    githubIssues: 3023,
    clawhubSkills: 5705,
    totalDatapoints: 67,
    researchDate: '2026-02-11',
    sentiment: 'bullish',
    topSources: ['GitHub', 'Reddit', 'Hacker News', 'ClawHub']
  },
  topUseCases: [
    { id: 1, name: 'Content Repurposing', revenue: '$600-1200/mån', demand: '🔥🔥🔥', difficulty: 'Medium', description: 'Blogg → X + LinkedIn + newsletter automation' },
    { id: 2, name: 'Setup-as-a-Service', revenue: '$50-200 + $50/mån', demand: '🔥🔥🔥', difficulty: 'Low', description: 'Fiverr-gig: From Install to Useful på 30 min' },
    { id: 3, name: 'WhatsApp Business Automation', revenue: '$400-800/mån', demand: '🔥🔥🔥', difficulty: 'Medium', description: 'Moltflow-ekosystem för business automation' },
    { id: 4, name: 'Säkerhetsgranskning', revenue: '$100-500', demand: '🔥🔥', difficulty: 'High', description: 'Audit av skills för malware/clickfix' },
    { id: 5, name: 'Claw Tasks AI', revenue: '$500-1000/mån', demand: '🔥🔥', difficulty: 'Medium', description: 'Agent tar bounties autonomt (50 bounties, 28 completed)' },
    { id: 6, name: 'DevOps Automation', revenue: '$1000-3000/mån', demand: '🔥🔥', difficulty: 'High', description: 'Portainer, K8s, AWS automation för tech-företag' },
    { id: 7, name: 'Research-as-a-Service', revenue: '$300-600/mån', demand: '🔥🔥', difficulty: 'Low', description: 'Automatiserad research med 253+ research-skills' },
    { id: 8, name: 'Swedish Business Tools', revenue: '$200-500/mån', demand: '🔥', difficulty: 'Low', description: 'Enda svenska skillen = 0 konkurrens' },
    { id: 9, name: 'Siri/iMessage Integration', revenue: '$100-300', demand: '🔥', difficulty: 'Low', description: 'Röststyrd OpenClaw via Siri' },
    { id: 10, name: 'AGENTS.md Workshops', revenue: '$200-500', demand: '🔥', difficulty: 'Low', description: 'Dokumentation-driven utveckling för team' }
  ],
  marketGaps: [
    { id: 1, name: 'Setup → Useful Bryggan', problem: '90% fastnar vid setup', solution: 'Fiverr + YouTube-tutorial + Starter Pack', priority: '🔴 HÖG', potential: '💰💰' },
    { id: 2, name: 'Modellval-förvirring', problem: 'Billiga modeller funkar inte', solution: 'Cost vs Performance Guide', priority: '🟡 MED', potential: '📈' },
    { id: 3, name: 'Säkra Skills', problem: '341 skills hade malware', solution: 'Duljan Verified™ - granskade skills', priority: '🔴 HÖG', potential: '💰💰' },
    { id: 4, name: 'Content Repurposing', problem: 'Alla vill producera content', solution: 'Content Repurposer skill', priority: '🔴 HÖG', potential: '💰💰💰' },
    { id: 5, name: 'Agent-ekonomin', problem: 'Få vet om Claw Tasks', solution: 'First-to-market content + koppla agent', priority: '🔴 HÖG', potential: '💰💰💰' },
    { id: 6, name: 'Icke-engelska marknader', problem: 'Nästan alla skills är engelska', solution: 'Nordic Business Bundle', priority: '🟢 LÅG', potential: '💰' }
  ],
  competitors: [
    { name: 'Markaicode', focus: 'Content repurposing', strength: 'Etablerad, $600-1200/mån', weakness: 'Ingen nordisk närvaro', threat: 'Medium' },
    { name: 'memU bot', focus: 'Säkerhetsarkitektur', strength: 'Bättre minneshantering', weakness: 'Mindre community', threat: 'Low' },
    { name: 'PAIO', focus: 'Personal AI Operator', strength: 'BYOK (Bring Your Own Key)', weakness: 'Mindre känd', threat: 'Low' },
    { name: 'Claude Cowork', focus: 'Samarbete', strength: 'Strängare säkerhet', weakness: 'Mindre agentic', threat: 'Medium' },
    { name: 'Openwork.bot', focus: 'Agent-jobbmarknad', strength: '500 jobb, $OW token', weakness: '12 aktiva tvister', threat: 'Low' }
  ]
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
            { id: 'market', label: '🔍 Market Intelligence' },
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

        {/* ====== MARKET INTELLIGENCE TAB ====== */}
        {tab === 'market' && (
          <div>
            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
              <div style={{ background: '#111', borderRadius: 12, border: '1px solid #27272a', padding: 18 }}>
                <div style={{ fontSize: 11, color: '#71717a', marginBottom: 4 }}>⭐ GitHub Stars</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>184k</div>
                <div style={{ fontSize: 12, color: '#48bb78', marginTop: 4 }}>↗ Snabbast växande</div>
              </div>
              <div style={{ background: '#111', borderRadius: 12, border: '1px solid #27272a', padding: 18 }}>
                <div style={{ fontSize: 11, color: '#71717a', marginBottom: 4 }}>🧰 ClawHub Skills</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#ecc94b' }}>5,705+</div>
                <div style={{ fontSize: 12, color: '#ecc94b', marginTop: 4 }}>Community-built</div>
              </div>
              <div style={{ background: '#111', borderRadius: 12, border: '1px solid #27272a', padding: 18 }}>
                <div style={{ fontSize: 11, color: '#71717a', marginBottom: 4 }}>📊 Research Datapunkter</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#667eea' }}>67</div>
                <div style={{ fontSize: 12, color: '#71717a', marginTop: 4 }}>2026-02-11</div>
              </div>
              <div style={{ background: '#111', borderRadius: 12, border: '1px solid #27272a', padding: 18 }}>
                <div style={{ fontSize: 11, color: '#71717a', marginBottom: 4 }}>💰 Est. Månadspotential</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#48bb78' }}>5k+ kr</div>
                <div style={{ fontSize: 12, color: '#48bb78', marginTop: 4 }}>Vid 2026-08-09</div>
              </div>
            </div>

            {/* Main Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* LEFT COLUMN */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                
                {/* Community Pulse */}
                <div style={{ background: '#111', borderRadius: 12, border: '1px solid #27272a', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: '1px solid #27272a', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>💓</span>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>Community Pulse</span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: '#48bb78', background: '#48bb7822', padding: '2px 8px', borderRadius: 10 }}>BULLISH</span>
                  </div>
                  <div style={{ padding: 18 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                      <div style={{ background: '#1a1a1a', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: '#71717a' }}>GitHub Forks</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>30.9k</div>
                      </div>
                      <div style={{ background: '#1a1a1a', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: '#71717a' }}>Öppna Issues</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#f56565' }}>3,023</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: '#d4d4d8', lineHeight: 1.6, marginBottom: 12 }}>
                      <strong>🔥 Heta trender:</strong> Kostnadsoptimering (MiniMax, DeepSeek), säkerhetsmedvetenhet efter 341 malware-skills, och setup-tjänster i bristområde.
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {['Säkerhet', 'Setup', 'Kostnader', 'Skills', 'Bounties'].map(tag => (
                        <span key={tag} style={{ fontSize: 11, background: '#27272a', padding: '4px 10px', borderRadius: 10, color: '#a1a1aa' }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Use Cases */}
                <div style={{ background: '#111', borderRadius: 12, border: '1px solid #27272a', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: '1px solid #27272a', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>🚀</span>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>Top 10 Use Cases</span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: '#71717a' }}>Efter potential</span>
                  </div>
                  <div style={{ maxHeight: 500, overflowY: 'auto' }}>
                    {marketData.topUseCases.map((useCase, i) => (
                      <div key={useCase.id} style={{ padding: '12px 18px', borderBottom: '1px solid #1a1a1a', background: i < 3 ? 'rgba(102, 126, 234, 0.05)' : 'transparent' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: i < 3 ? '#ecc94b' : '#71717a', minWidth: 20 }}>#{i + 1}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{useCase.name}</span>
                          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#48bb78', fontWeight: 600 }}>{useCase.revenue}</span>
                        </div>
                        <div style={{ fontSize: 12, color: '#a1a1aa', marginLeft: 30 }}>{useCase.description}</div>
                        <div style={{ display: 'flex', gap: 8, marginLeft: 30, marginTop: 6 }}>
                          <span style={{ fontSize: 10, color: '#ecc94b' }}>{useCase.demand} Efterfrågan</span>
                          <span style={{ fontSize: 10, color: '#71717a' }}>• Svårighet: {useCase.difficulty}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Duljan Flywheel */}
                <div style={{ background: '#111', borderRadius: 12, border: '1px solid #27272a', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: '1px solid #27272a', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>⚙️</span>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>Duljan Flywheel</span>
                  </div>
                  <div style={{ padding: 24 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      {/* Flywheel Steps */}
                      <div style={{ 
                        background: 'linear-gradient(135deg, #667eea22, #764ba222)', 
                        border: '1px solid #667eea44', 
                        borderRadius: 12, 
                        padding: '16px 24px',
                        width: '100%',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: 24, marginBottom: 4 }}>📝</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#667eea' }}>CONTENT</div>
                        <div style={{ fontSize: 11, color: '#a1a1aa' }}>YouTube, X, LinkedIn</div>
                      </div>
                      
                      <div style={{ fontSize: 20, color: '#667eea' }}>↓</div>
                      
                      <div style={{ 
                        background: 'linear-gradient(135deg, #764ba222, #667eea22)', 
                        border: '1px solid #764ba244', 
                        borderRadius: 12, 
                        padding: '16px 24px',
                        width: '100%',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: 24, marginBottom: 4 }}>🧰</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#764ba2' }}>SKILLS</div>
                        <div style={{ fontSize: 11, color: '#a1a1aa' }}>ClawHub, GitHub</div>
                      </div>
                      
                      <div style={{ fontSize: 20, color: '#764ba2' }}>↓</div>
                      
                      <div style={{ 
                        background: 'linear-gradient(135deg, #667eea22, #764ba222)', 
                        border: '1px solid #667eea44', 
                        borderRadius: 12, 
                        padding: '16px 24px',
                        width: '100%',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: 24, marginBottom: 4 }}>💼</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#667eea' }}>FREELANCE</div>
                        <div style={{ fontSize: 11, color: '#a1a1aa' }}>Fiverr, Upwork</div>
                      </div>
                      
                      <div style={{ fontSize: 20, color: '#667eea' }}>↓</div>
                      
                      <div style={{ 
                        background: 'linear-gradient(135deg, #764ba222, #667eea22)', 
                        border: '1px solid #764ba244', 
                        borderRadius: 12, 
                        padding: '16px 24px',
                        width: '100%',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: 24, marginBottom: 4 }}>🤖</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#764ba2' }}>AUTOMATION</div>
                        <div style={{ fontSize: 11, color: '#a1a1aa' }}>Claw Tasks AI, bots</div>
                      </div>
                      
                      <div style={{ fontSize: 20, color: '#764ba2' }}>↺</div>
                      <div style={{ fontSize: 12, color: '#71717a', fontStyle: 'italic' }}>Frigör tid → mer content</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                
                {/* Market Gaps */}
                <div style={{ background: '#111', borderRadius: 12, border: '1px solid #27272a', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: '1px solid #27272a', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>🎯</span>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>Marknadsluckor</span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: '#71717a' }}>6 gaps identifierade</span>
                  </div>
                  <div style={{ maxHeight: 550, overflowY: 'auto' }}>
                    {marketData.marketGaps.map((gap) => (
                      <div key={gap.id} style={{ padding: '14px 18px', borderBottom: '1px solid #1a1a1a' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={{ fontSize: 14 }}>{gap.priority === '🔴 HÖG' ? '🔴' : gap.priority === '🟡 MED' ? '🟡' : '🟢'}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{gap.name}</span>
                          <span style={{ marginLeft: 'auto', fontSize: 12 }}>{gap.potential}</span>
                        </div>
                        <div style={{ marginLeft: 22 }}>
                          <div style={{ fontSize: 12, color: '#f56565', marginBottom: 4 }}>❌ {gap.problem}</div>
                          <div style={{ fontSize: 12, color: '#48bb78' }}>✅ {gap.solution}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competitor Watch */}
                <div style={{ background: '#111', borderRadius: 12, border: '1px solid #27272a', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: '1px solid #27272a', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>👁️</span>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>Competitor Watch</span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: '#71717a' }}>5 aktörer</span>
                  </div>
                  <div>
                    {marketData.competitors.map((comp, i) => (
                      <div key={i} style={{ padding: '14px 18px', borderBottom: '1px solid #1a1a1a' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{comp.name}</span>
                          <span style={{ 
                            marginLeft: 'auto', 
                            fontSize: 11, 
                            padding: '2px 8px', 
                            borderRadius: 10,
                            background: comp.threat === 'Medium' ? '#ecc94b22' : '#48bb7822',
                            color: comp.threat === 'Medium' ? '#ecc94b' : '#48bb78'
                          }}>{comp.threat} threat</span>
                        </div>
                        <div style={{ fontSize: 11, color: '#a1a1aa', marginBottom: 4 }}>Focus: {comp.focus}</div>
                        <div style={{ fontSize: 12, color: '#48bb78', marginBottom: 2 }}>✓ {comp.strength}</div>
                        <div style={{ fontSize: 12, color: '#f56565' }}>✗ {comp.weakness}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue Streams Summary */}
                <div style={{ background: '#111', borderRadius: 12, border: '1px solid #27272a', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: '1px solid #27272a', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>💰</span>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>Intäktsströmmar</span>
                  </div>
                  <div style={{ padding: 18 }}>
                    {[
                      { name: 'ClawHub Skills', type: 'Passiv', timeline: 'Nu', potential: '500-1000 kr/mån' },
                      { name: 'Fiverr/Upwork', type: 'Aktiv', timeline: '1-2 veckor', potential: '1500-2500 kr/mån' },
                      { name: 'Claw Tasks AI', type: 'Semi-passiv', timeline: '2-3 veckor', potential: '500-1000 kr/mån' },
                      { name: 'YouTube AdSense', type: 'Passiv', timeline: '3-6 mån', potential: '500-1500 kr/mån' },
                      { name: 'Managed Services', type: 'Aktiv', timeline: '1-3 mån', potential: '2000-5000 kr/mån' }
                    ].map((stream, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: i < 4 ? '1px solid #1a1a1a' : 'none' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{stream.name}</div>
                          <div style={{ fontSize: 11, color: '#71717a' }}>{stream.type} • {stream.timeline}</div>
                        </div>
                        <div style={{ fontSize: 12, color: '#48bb78', fontWeight: 600 }}>{stream.potential}</div>
                      </div>
                    ))}
                    <div style={{ marginTop: 16, padding: 12, background: '#48bb7811', borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: 12, color: '#71717a' }}>Totalt mål</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#48bb78' }}>5,000+ kr/mån</div>
                      <div style={{ fontSize: 11, color: '#71717a' }}>vid 2026-08-09</div>
                    </div>
                  </div>
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
