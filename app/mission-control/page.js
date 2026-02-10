'use client'

import { useState, useEffect } from 'react'

// Card Component
function Card({ title, children, icon, style = {} }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      borderRadius: 16,
      padding: 24,
      border: '1px solid rgba(255,255,255,0.08)',
      ...style
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 24 }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#fff' }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

// Status Badge Component
function StatusBadge({ status, children }) {
  const colors = {
    online: '#48bb78',
    offline: '#f56565',
    active: '#48bb78',
    pending: '#ed8936',
    completed: '#4299e1'
  }
  
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 12px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      background: `${colors[status] || colors.online}20`,
      color: colors[status] || colors.online,
    }}>
      <span style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: colors[status] || colors.online,
        animation: status === 'online' || status === 'active' ? 'pulse 2s infinite' : 'none'
      }} />
      {children}
    </span>
  )
}

// Main Dashboard Component
export default function MissionControl() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [tasks, setTasks] = useState({ active: [], nextUp: [], done: [] })
  const [cronJobs, setCronJobs] = useState([])
  const [blocketDeals, setBlocketDeals] = useState([])
  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState({ title: '', type: 'Development', spec: '', output: '', prio: 'MEDIUM' })
  const [showAddForm, setShowAddForm] = useState(false)
  const [nextHeartbeat, setNextHeartbeat] = useState(1800) // 30 min in seconds

  // Fetch all data
  const fetchData = async () => {
    try {
      const [tasksRes, cronRes, blocketRes, activityRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/cron'),
        fetch('/api/blocket'),
        fetch('/api/activity')
      ])
      
      const tasksData = await tasksRes.json()
      const cronData = await cronRes.json()
      const blocketData = await blocketRes.json()
      const activityData = await activityRes.json()
      
      setTasks(tasksData)
      setCronJobs(cronData.jobs || [])
      setBlocketDeals(blocketData.deals || [])
      setActivity(activityData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Add new task
  const addTask = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      })
      
      if (res.ok) {
        setNewTask({ title: '', type: 'Development', spec: '', output: '', prio: 'MEDIUM' })
        setShowAddForm(false)
        fetchData()
      }
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  // Effects
  useEffect(() => {
    fetchData()
    
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    // Update heartbeat countdown
    const heartbeatInterval = setInterval(() => {
      setNextHeartbeat(prev => prev > 0 ? prev - 1 : 1800)
    }, 1000)
    
    // Refresh data every 30 seconds
    const dataInterval = setInterval(fetchData, 30000)
    
    return () => {
      clearInterval(timeInterval)
      clearInterval(heartbeatInterval)
      clearInterval(dataInterval)
    }
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }
  
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      
      {/* Header */}
      <div style={{
        background: 'rgba(10,10,10,0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 32 }}>🚀</span>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 800,
                background: 'linear-gradient(90deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                MISSION CONTROL
              </h1>
              <div style={{ fontSize: 12, color: '#718096' }}>Duljan AB Operations Center</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'monospace' }}>
                {formatTime(currentTime)}
              </div>
              <div style={{ fontSize: 12, color: '#718096' }}>
                🫀 Next heartbeat: {formatCountdown(nextHeartbeat)}
              </div>
            </div>
            <StatusBadge status="online">SYSTEM ONLINE</StatusBadge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: 24 }}>
        
        {/* Top Row - Status Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 20,
          marginBottom: 24
        }}>
          <Card title="Active Agents" icon="🤖" style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>🧠 Klaus (Opus 4.6)</span>
                <StatusBadge status="active">ACTIVE</StatusBadge>
              </div>
              <div style={{ fontSize: 12, color: '#718096' }}>Strategy &amp; Planning</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <span>🔧 Bosse (Kimi K2.5)</span>
                <StatusBadge status="active">ACTIVE</StatusBadge>
              </div>
              <div style={{ fontSize: 12, color: '#718096' }}>Development &amp; Execution</div>
            </div>
          </Card>
          
          <Card title="System Health" icon="💓">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#a0aec0' }}>OpenClaw Gateway</span>
                <span style={{ color: '#48bb78' }}>✓ Online</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#a0aec0' }}>Cron Jobs</span>
                <span style={{ color: '#48bb78' }}>{cronJobs.length} Active</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#a0aec0' }}>Blocket Scraper</span>
                <span style={{ color: '#48bb78' }}>✓ Running</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#a0aec0' }}>Task Queue</span>
                <span style={{ color: '#ed8936' }}>{tasks.active.length + tasks.nextUp.length} Pending</span>
              </div>
            </div>
          </Card>
          
          <Card title="Today's Stats" icon="📊">
            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#667eea' }}>{tasks.done.length}</div>
                <div style={{ fontSize: 12, color: '#718096' }}>Completed</div>
              </div>
              <div>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#ed8936' }}>{tasks.active.length}</div>
                <div style={{ fontSize: 12, color: '#718096' }}>Active</div>
              </div>
              <div>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#48bb78' }}>{blocketDeals.length}</div>
                <div style={{ fontSize: 12, color: '#718096' }}>Deals</div>
              </div>
            </div>
          </Card>
          
          <Card title="Quick Links" icon="🔗">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="https://github.com/klausaiadrian/duljan-ab" target="_blank" rel="noopener noreferrer"
                style={{ color: '#667eea', textDecoration: 'none', fontSize: 14 }}>
                → GitHub Repository
              </a>
              <a href="https://drive.google.com/drive/folders/1eDD3HZvIsrv0xdwqRwnLzHayCK5szhmz" target="_blank" rel="noopener noreferrer"
                style={{ color: '#667eea', textDecoration: 'none', fontSize: 14 }}>
                → BOSSE-LEVERANSER (Drive)
              </a>
              <a href="https://docs.openclaw.io" target="_blank" rel="noopener noreferrer"
                style={{ color: '#667eea', textDecoration: 'none', fontSize: 14 }}>
                → OpenClaw Docs
              </a>
              <a href="/" style={{ color: '#667eea', textDecoration: 'none', fontSize: 14 }}>
                → Duljan AB Home
              </a>
            </div>
          </Card>
        </div>

        {/* Middle Row - Task Queue & Blocket */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: 20,
          marginBottom: 24
        }}>
          {/* Task Queue */}
          <Card title="Task Queue" icon="📋" style={{ minHeight: 400 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <span style={{ fontSize: 12, color: '#f56565' }}>🔴 {tasks.active.length} Active</span>
                <span style={{ fontSize: 12, color: '#ed8936' }}>🟡 {tasks.nextUp.length} Next Up</span>
                <span style={{ fontSize: 12, color: '#48bb78' }}>✅ {tasks.done.length} Done</span>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                style={{
                  padding: '6px 16px',
                  background: 'linear-gradient(90deg, #667eea, #764ba2)',
                  border: 'none',
                  borderRadius: 6,
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                + Add Task
              </button>
            </div>
            
            {/* Add Task Form */}
            {showAddForm && (
              <form onSubmit={addTask} style={{ marginBottom: 16, padding: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  style={{
                    width: '100%',
                    padding: 8,
                    marginBottom: 8,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 4,
                    color: '#fff',
                    fontSize: 14
                  }}
                  required
                />
                <textarea
                  placeholder="Description / Spec"
                  value={newTask.spec}
                  onChange={(e) => setNewTask({...newTask, spec: e.target.value})}
                  style={{
                    width: '100%',
                    padding: 8,
                    marginBottom: 8,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 4,
                    color: '#fff',
                    fontSize: 14,
                    minHeight: 60,
                    resize: 'vertical'
                  }}
                  required
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <select
                    value={newTask.type}
                    onChange={(e) => setNewTask({...newTask, type: e.target.value})}
                    style={{
                      padding: 8,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 4,
                      color: '#fff',
                      fontSize: 14
                    }}
                  >
                    <option value="Development">Development</option>
                    <option value="Content">Content</option>
                    <option value="Research">Research</option>
                    <option value="Design">Design</option>
                  </select>
                  <select
                    value={newTask.prio}
                    onChange={(e) => setNewTask({...newTask, prio: e.target.value})}
                    style={{
                      padding: 8,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 4,
                      color: '#fff',
                      fontSize: 14
                    }}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                  <button
                    type="submit"
                    style={{
                      padding: '8px 16px',
                      background: '#48bb78',
                      border: 'none',
                      borderRadius: 4,
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Add
                  </button>
                </div>
              </form>
            )}
            
            {/* Active Tasks */}
            {tasks.active.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: '#f56565', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>
                  🔴 Active
                </div>
                {tasks.active.slice(0, 3).map((task, i) => (
                  <div key={i} style={{
                    padding: 12,
                    background: 'rgba(245,101,101,0.1)',
                    borderRadius: 8,
                    marginBottom: 8,
                    borderLeft: '3px solid #f56565'
                  }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{task.title}</div>
                    {task.spec && <div style={{ fontSize: 12, color: '#a0aec0', marginTop: 4 }}>{task.spec.substring(0, 100)}...</div>}
                  </div>
                ))}
              </div>
            )}
            
            {/* Next Up Tasks */}
            {tasks.nextUp.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: '#ed8936', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>
                  🟡 Next Up
                </div>
                {tasks.nextUp.slice(0, 3).map((task, i) => (
                  <div key={i} style={{
                    padding: 10,
                    background: 'rgba(237,137,54,0.1)',
                    borderRadius: 8,
                    marginBottom: 6,
                    borderLeft: '3px solid #ed8936'
                  }}>
                    <div style={{ fontSize: 13 }}>{task.title}</div>
                    {task.prio && <span style={{ fontSize: 10, color: '#ed8936' }}>{task.prio}</span>}
                  </div>
                ))}
              </div>
            )}
            
            {/* Recent Done */}
            {tasks.done.length > 0 && (
              <div>
                <div style={{ fontSize: 12, color: '#48bb78', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>
                  ✅ Recently Completed
                </div>
                {tasks.done.slice(0, 3).map((task, i) => (
                  <div key={i} style={{
                    padding: 8,
                    background: 'rgba(72,187,120,0.1)',
                    borderRadius: 6,
                    marginBottom: 4,
                    fontSize: 12,
                    color: '#a0aec0',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>{task.title}</span>
                    {task.date && <span style={{ fontSize: 10, color: '#48bb78' }}>{task.date}</span>}
                  </div>
                ))}
              </div>
            )}
          </Card>
          
          {/* Blocket Leaderboard */}
          <Card title="Blocket Deals" icon="🔍" style={{ minHeight: 400 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#718096' }}>
                Top 5 deals from latest scrape • {blocketDeals.length} total
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {blocketDeals.slice(0, 5).map((deal, i) => (
                <a
                  key={deal.id || i}
                  href={deal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: 12,
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: 8,
                    textDecoration: 'none',
                    color: 'inherit',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(102,126,234,0.1)'
                    e.currentTarget.style.borderColor = 'rgba(102,126,234,0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                  }}
                >
                  {/* Score */}
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: deal.score >= 90 ? 'linear-gradient(135deg, #48bb78, #38a169)' :
                               deal.score >= 80 ? 'linear-gradient(135deg, #ed8936, #dd6b20)' :
                               'linear-gradient(135deg, #667eea, #764ba2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 12,
                    flexShrink: 0
                  }}>
                    {deal.score}
                  </div>
                  
                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 14,
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {deal.title}
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: 12, color: '#718096' }}>
                      <span style={{ color: '#48bb78', fontWeight: 600 }}>
                        {deal.price?.toLocaleString('sv-SE')} kr
                      </span>
                      {deal.originalPrice && (
                        <span style={{ textDecoration: 'line-through' }}>
                          {deal.originalPrice.toLocaleString('sv-SE')} kr
                        </span>
                      )}
                      <span>•</span>
                      <span>{deal.location}</span>
                      <span>•</span>
                      <span>{deal.category}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            
            {blocketDeals.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: '#718096' }}>
                No deals found. The scraper may still be running.
              </div>
            )}
          </Card>
        </div>

        {/* Bottom Row - Cron Jobs & Activity */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: 20
        }}>
          {/* Cron Jobs */}
          <Card title="Cron Jobs" icon="⏰">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {cronJobs.map((job, i) => (
                <div key={job.id || i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 12,
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 20 }}>{job.name?.split(' ')[0] || '⏰'}</span>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>
                        {job.name?.replace(/^[^\s]+\s/, '') || job.id}
                      </div>
                      <div style={{ fontSize: 11, color: '#718096', fontFamily: 'monospace' }}>
                        {job.schedule}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <StatusBadge status={job.status === 'active' ? 'active' : 'pending'}>
                      {job.status?.toUpperCase()}
                    </StatusBadge>
                    <div style={{ fontSize: 10, color: '#718096', marginTop: 4 }}>
                      Last: {job.lastRun?.split(' ')[1] || '—'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {cronJobs.length === 0 && (
              <div style={{ textAlign: 'center', padding: 20, color: '#718096' }}>
                No cron jobs configured
              </div>
            )}
          </Card>
          
          {/* Daily Activity */}
          <Card title="Daily Activity" icon="📊">
            {activity ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{activity.date}</span>
                  <span style={{ fontSize: 12, color: '#718096' }}>{activity.totalEvents} events</span>
                </div>
                
                <div style={{
                  maxHeight: 280,
                  overflow: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}>
                  {activity.events?.map((event, i) => (
                    <div key={i} style={{
                      padding: 10,
                      background: event.type === 'completed' ? 'rgba(72,187,120,0.1)' :
                                 event.type === 'in-progress' ? 'rgba(237,137,54,0.1)' :
                                 'rgba(255,255,255,0.03)',
                      borderRadius: 6,
                      borderLeft: `3px solid ${
                        event.type === 'completed' ? '#48bb78' :
                        event.type === 'in-progress' ? '#ed8936' :
                        '#667eea'
                      }`,
                      fontSize: 12
                    }}>
                      {event.section && (
                        <div style={{ fontSize: 10, color: '#667eea', marginBottom: 2 }}>
                          {event.section}
                        </div>
                      )}
                      <div style={{ color: '#e2e8f0' }}>{event.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 40, color: '#718096' }}>
                {loading ? 'Loading activity...' : 'No activity log found'}
              </div>
            )}
          </Card>
        </div>
        
        {/* Footer */}
        <div style={{
          marginTop: 32,
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center',
          fontSize: 12,
          color: '#4a5568'
        }}>
          Duljan AB Mission Control • Built with 🦞 OpenClaw • Auto-refreshes every 30s
        </div>
      </div>
    </div>
  )
}
