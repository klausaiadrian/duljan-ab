'use client'

import { useState, useEffect, useCallback } from 'react'

// ==================== STYLES ====================
const styles = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#fff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    background: 'rgba(10,10,10,0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #27272a',
    padding: '16px 24px',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  headerInner: {
    maxWidth: 1400,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 16
  },
  logoIcon: {
    fontSize: 32
  },
  logoText: {
    margin: 0,
    fontSize: 24,
    fontWeight: 800,
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  logoSubtext: {
    fontSize: 12,
    color: '#71717a'
  },
  timeDisplay: {
    textAlign: 'right'
  },
  timeValue: {
    fontSize: 28,
    fontWeight: 700,
    fontFamily: 'monospace',
    color: '#fff'
  },
  timeLabel: {
    fontSize: 12,
    color: '#71717a'
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    background: 'rgba(72,187,120,0.15)',
    color: '#48bb78'
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#48bb78',
    animation: 'pulse 2s infinite'
  },
  tabsContainer: {
    background: 'rgba(22,22,22,0.8)',
    borderBottom: '1px solid #27272a',
    padding: '0 24px'
  },
  tabsInner: {
    maxWidth: 1400,
    margin: '0 auto',
    display: 'flex',
    gap: 4,
    overflowX: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none'
  },
  tab: {
    padding: '16px 20px',
    background: 'transparent',
    border: 'none',
    color: '#a1a1aa',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
    position: 'relative'
  },
  tabActive: {
    color: '#fff',
    fontWeight: 600
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
    borderRadius: '3px 3px 0 0'
  },
  content: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: 24
  },
  card: {
    background: '#161616',
    borderRadius: 16,
    padding: 24,
    border: '1px solid #27272a'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20
  },
  cardIcon: {
    fontSize: 24
  },
  cardTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
    color: '#fff'
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: 20
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 20
  },
  grid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 20
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    border: '3px solid #27272a',
    borderTop: '3px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
    gap: 16
  },
  errorBox: {
    background: 'rgba(245,101,101,0.1)',
    border: '1px solid rgba(245,101,101,0.3)',
    borderRadius: 12,
    padding: 24,
    textAlign: 'center',
    color: '#f56565'
  },
  button: {
    padding: '10px 20px',
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  buttonSecondary: {
    padding: '10px 20px',
    background: '#27272a',
    border: '1px solid #3f3f46',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer'
  },
  input: {
    width: '100%',
    padding: 12,
    background: '#0a0a0a',
    border: '1px solid #27272a',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    marginBottom: 12
  },
  select: {
    padding: 10,
    background: '#0a0a0a',
    border: '1px solid #27272a',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14
  },
  textarea: {
    width: '100%',
    padding: 12,
    background: '#0a0a0a',
    border: '1px solid #27272a',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    minHeight: 80,
    resize: 'vertical',
    marginBottom: 12,
    fontFamily: 'inherit'
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 600
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeader: {
    textAlign: 'left',
    padding: '12px 16px',
    color: '#71717a',
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    borderBottom: '1px solid #27272a'
  },
  tableCell: {
    padding: '14px 16px',
    borderBottom: '1px solid #27272a',
    fontSize: 14
  },
  scoreCircle: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 13,
    flexShrink: 0
  },
  footer: {
    marginTop: 40,
    paddingTop: 24,
    borderTop: '1px solid #27272a',
    textAlign: 'center',
    fontSize: 12,
    color: '#52525b'
  }
}

// ==================== TAB COMPONENTS ====================

// 🏠 ÖVERSIKT TAB
function OverviewTab({ data, loading, error, onRefresh }) {
  const { tasks, cronJobs, blocketDeals, activity } = data
  
  const stats = [
    { label: 'Active Tasks', value: tasks?.active?.length || 0, color: '#f56565', icon: '🔴' },
    { label: 'Cron Jobs', value: cronJobs?.length || 0, color: '#667eea', icon: '⏰' },
    { label: 'Blocket Deals', value: blocketDeals?.length || 0, color: '#48bb78', icon: '🔍' },
    { label: 'Completed', value: tasks?.done?.length || 0, color: '#38a169', icon: '✅' }
  ]
  
  const agents = [
    { name: 'Klaus', role: 'Strategy & Planning', model: 'Opus 4.6', status: 'active', icon: '🧠' },
    { name: 'Bosse', role: 'Development & Execution', model: 'Kimi K2.5', status: 'active', icon: '🔧' }
  ]
  
  const topDeal = blocketDeals?.[0]
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Quick Stats */}
      <div style={styles.grid4}>
        {stats.map((stat, i) => (
          <div key={i} style={{...styles.card, textAlign: 'center'}}>
            <div style={{fontSize: 36, fontWeight: 700, color: stat.color, marginBottom: 8}}>
              {stat.value}
            </div>
            <div style={{fontSize: 13, color: '#a1a1aa'}}>{stat.icon} {stat.label}</div>
          </div>
        ))}
      </div>
      
      <div style={styles.grid2}>
        {/* Agents Status */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>🤖</span>
            <h3 style={styles.cardTitle}>Active Agents</h3>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
            {agents.map((agent, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
                background: '#0a0a0a',
                borderRadius: 12,
                border: '1px solid #27272a'
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                  <span style={{fontSize: 28}}>{agent.icon}</span>
                  <div>
                    <div style={{fontWeight: 600, fontSize: 15}}>{agent.name}</div>
                    <div style={{fontSize: 12, color: '#71717a'}}>{agent.role}</div>
                    <div style={{fontSize: 11, color: '#667eea', marginTop: 2}}>{agent.model}</div>
                  </div>
                </div>
                <span style={{
                  ...styles.badge,
                  background: agent.status === 'active' ? 'rgba(72,187,120,0.15)' : 'rgba(237,137,54,0.15)',
                  color: agent.status === 'active' ? '#48bb78' : '#ed8936'
                }}>
                  <span style={{...styles.statusDot, background: agent.status === 'active' ? '#48bb78' : '#ed8936', animation: 'none'}} />
                  {agent.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* System Health */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>💓</span>
            <h3 style={styles.cardTitle}>System Health</h3>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            {[
              { label: 'OpenClaw Gateway', status: '✓ Online', color: '#48bb78' },
              { label: 'Cron Jobs', status: `${cronJobs?.length || 0} Active`, color: '#48bb78' },
              { label: 'Blocket Scraper', status: '✓ Running', color: '#48bb78' },
              { label: 'Task Queue', status: `${(tasks?.active?.length || 0) + (tasks?.nextUp?.length || 0)} Pending`, color: '#ed8936' }
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: i < 3 ? '1px solid #27272a' : 'none'
              }}>
                <span style={{color: '#a1a1aa', fontSize: 14}}>{item.label}</span>
                <span style={{color: item.color, fontWeight: 500, fontSize: 14}}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Best Blocket Deal */}
      {topDeal && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>🏆</span>
            <h3 style={styles.cardTitle}>Top Blocket Deal</h3>
          </div>
          <a href={topDeal.url} target="_blank" rel="noopener noreferrer" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: 16,
            background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)',
            borderRadius: 12,
            textDecoration: 'none',
            color: 'inherit',
            border: '1px solid rgba(102,126,234,0.2)'
          }}>
            <div style={{
              ...styles.scoreCircle,
              background: topDeal.score >= 90 ? 'linear-gradient(135deg, #48bb78, #38a169)' :
                        topDeal.score >= 70 ? 'linear-gradient(135deg, #667eea, #764ba2)' :
                        'linear-gradient(135deg, #ed8936, #dd6b20)',
              color: '#fff'
            }}>
              {topDeal.score}
            </div>
            <div style={{flex: 1, minWidth: 0}}>
              <div style={{fontWeight: 600, fontSize: 15, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                {topDeal.title}
              </div>
              <div style={{fontSize: 13, color: '#a1a1aa', display: 'flex', gap: 12}}>
                <span style={{color: '#48bb78', fontWeight: 600}}>{topDeal.price?.toLocaleString('sv-SE')} kr</span>
                <span>•</span>
                <span>{topDeal.location}</span>
                <span>•</span>
                <span>{topDeal.search}</span>
              </div>
            </div>
            <span style={{fontSize: 20}}>→</span>
          </a>
        </div>
      )}
      
      {/* Quick Links */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.cardIcon}>🔗</span>
          <h3 style={styles.cardTitle}>Quick Links</h3>
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 12}}>
          {[
            { label: 'GitHub Repository', url: 'https://github.com/klausaiadrian/duljan-ab' },
            { label: 'BOSSE-LEVERANSER (Drive)', url: 'https://drive.google.com/drive/folders/1eDD3HZvIsrv0xdwqRwnLzHayCK5szhmz' },
            { label: 'OpenClaw Docs', url: 'https://docs.openclaw.io' },
            { label: 'Duljan AB Home', url: '/' }
          ].map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{
              padding: '10px 16px',
              background: '#0a0a0a',
              border: '1px solid #27272a',
              borderRadius: 8,
              color: '#667eea',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 500,
              transition: 'all 0.2s'
            }} onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#667eea'
              e.currentTarget.style.background = 'rgba(102,126,234,0.1)'
            }} onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#27272a'
              e.currentTarget.style.background = '#0a0a0a'
            }}>
              {link.label} →
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

// 🔍 BLOCKET TAB
function BlocketTab({ data, loading, error, onRefresh }) {
  const [running, setRunning] = useState(false)
  const [runResult, setRunResult] = useState(null)
  
  const handleRunScraper = async () => {
    setRunning(true)
    setRunResult(null)
    try {
      const res = await fetch('/api/blocket/run', { method: 'POST' })
      const data = await res.json()
      setRunResult(data)
      if (data.success) onRefresh()
    } catch (err) {
      setRunResult({ success: false, error: err.message })
    } finally {
      setRunning(false)
    }
  }
  
  const deals = Array.isArray(data) ? data : data?.deals || []
  const lastUpdated = deals[0]?.scraped_at || data?.lastUpdated
  
  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.loadingSpinner} />
      <div style={{color: '#71717a'}}>Loading Blocket deals...</div>
    </div>
  )
  
  if (error) return (
    <div style={styles.errorBox}>
      <div style={{fontSize: 32, marginBottom: 8}}>⚠️</div>
      <div>Failed to load Blocket data</div>
      <div style={{fontSize: 12, marginTop: 8, opacity: 0.8}}>{error}</div>
    </div>
  )
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header with run button */}
      <div style={{...styles.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16}}>
        <div>
          <div style={{fontSize: 20, fontWeight: 700, marginBottom: 4}}>🔍 Blocket Deal Finder</div>
          <div style={{fontSize: 13, color: '#71717a'}}>
            {deals.length} deals found • Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString('sv-SE') : 'Unknown'}
          </div>
        </div>
        <button 
          onClick={handleRunScraper} 
          disabled={running}
          style={{...styles.button, opacity: running ? 0.7 : 1}}
        >
          {running ? '🔄 Running...' : '▶️ Run Scraper Now'}
        </button>
      </div>
      
      {/* Run result */}
      {runResult && (
        <div style={{
          padding: 16,
          borderRadius: 12,
          background: runResult.success ? 'rgba(72,187,120,0.1)' : 'rgba(245,101,101,0.1)',
          border: `1px solid ${runResult.success ? 'rgba(72,187,120,0.3)' : 'rgba(245,101,101,0.3)'}`,
          color: runResult.success ? '#48bb78' : '#f56565'
        }}>
          {runResult.success ? '✅ Scraper completed successfully!' : `❌ Error: ${runResult.error || runResult.message}`}
        </div>
      )}
      
      {/* Deals list */}
      <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
        {deals.map((deal, i) => (
          <a key={deal.id || i} href={deal.url} target="_blank" rel="noopener noreferrer" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: 16,
            background: '#161616',
            borderRadius: 12,
            border: '1px solid #27272a',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'all 0.2s'
          }} onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#667eea'
            e.currentTarget.style.transform = 'translateX(4px)'
          }} onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#27272a'
            e.currentTarget.style.transform = 'translateX(0)'
          }}>
            {/* Score */}
            <div style={{
              ...styles.scoreCircle,
              background: deal.score >= 90 ? 'linear-gradient(135deg, #48bb78, #38a169)' :
                        deal.score >= 70 ? 'linear-gradient(135deg, #667eea, #764ba2)' :
                        deal.score >= 50 ? 'linear-gradient(135deg, #ed8936, #dd6b20)' :
                        'linear-gradient(135deg, #718096, #4a5568)',
              color: '#fff'
            }}>
              {deal.score}
            </div>
            
            {/* Content */}
            <div style={{flex: 1, minWidth: 0}}>
              <div style={{fontWeight: 600, fontSize: 15, marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                {deal.title}
              </div>
              <div style={{fontSize: 13, color: '#a1a1aa', display: 'flex', gap: 12, flexWrap: 'wrap'}}>
                <span style={{color: '#48bb78', fontWeight: 600}}>
                  {typeof deal.price === 'number' ? deal.price.toLocaleString('sv-SE') : deal.price_text} kr
                </span>
                {deal.originalPrice && (
                  <span style={{textDecoration: 'line-through', opacity: 0.6}}>
                    {deal.originalPrice.toLocaleString('sv-SE')} kr
                  </span>
                )}
                <span>•</span>
                <span>{deal.location}</span>
                <span>•</span>
                <span>{deal.search}</span>
              </div>
            </div>
            
            {/* Arrow */}
            <span style={{fontSize: 20, color: '#667eea'}}>→</span>
          </a>
        ))}
      </div>
      
      {deals.length === 0 && (
        <div style={{textAlign: 'center', padding: 60, color: '#71717a'}}>
          <div style={{fontSize: 48, marginBottom: 16}}>📭</div>
          <div>No deals found. Run the scraper to fetch latest deals.</div>
        </div>
      )}
    </div>
  )
}

// 📰 X/TWITTER TAB
function TwitterTab({ data, loading, error }) {
  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.loadingSpinner} />
      <div style={{color: '#71717a'}}>Loading X/Twitter data...</div>
    </div>
  )
  
  if (error) return (
    <div style={styles.errorBox}>
      <div style={{fontSize: 32, marginBottom: 8}}>⚠️</div>
      <div>Failed to load X/Twitter data</div>
      <div style={{fontSize: 12, marginTop: 8, opacity: 0.8}}>{error}</div>
    </div>
  )
  
  const latest = data?.latest
  const stats = latest?.stats || { accountsScanned: 0, newTweets: 0 }
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.cardIcon}>📰</span>
          <h3 style={styles.cardTitle}>X/Twitter Monitor</h3>
        </div>
        <div style={{display: 'flex', gap: 20, flexWrap: 'wrap'}}>
          <div style={{textAlign: 'center', padding: '20px 40px', background: '#0a0a0a', borderRadius: 12}}>
            <div style={{fontSize: 36, fontWeight: 700, color: '#1da1f2'}}>{stats.accountsScanned}</div>
            <div style={{fontSize: 12, color: '#71717a', marginTop: 4}}>Accounts Monitored</div>
          </div>
          <div style={{textAlign: 'center', padding: '20px 40px', background: '#0a0a0a', borderRadius: 12}}>
            <div style={{fontSize: 36, fontWeight: 700, color: stats.newTweets > 0 ? '#48bb78' : '#71717a'}}>
              {stats.newTweets}
            </div>
            <div style={{fontSize: 12, color: '#71717a', marginTop: 4}}>New Tweets Today</div>
          </div>
          <div style={{textAlign: 'center', padding: '20px 40px', background: '#0a0a0a', borderRadius: 12}}>
            <div style={{fontSize: 36, fontWeight: 700, color: '#667eea'}}>{data?.totalReports || 0}</div>
            <div style={{fontSize: 12, color: '#71717a', marginTop: 4}}>Total Reports</div>
          </div>
        </div>
      </div>
      
      {/* Latest Report */}
      {latest && (
        <div style={styles.card}>
          <div style={{...styles.cardHeader, justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
              <span style={styles.cardIcon}>📝</span>
              <h3 style={styles.cardTitle}>Latest Report: {latest.date}</h3>
            </div>
            <span style={{...styles.badge, background: 'rgba(102,126,234,0.15)', color: '#667eea'}}>
              {latest.filename}
            </span>
          </div>
          <div style={{
            background: '#0a0a0a',
            borderRadius: 12,
            padding: 20,
            fontFamily: 'monospace',
            fontSize: 14,
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            color: '#e4e4e7'
          }}>
            {latest.content}
          </div>
        </div>
      )}
      
      {/* Report History */}
      {data?.reports?.length > 0 && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>📚</span>
            <h3 style={styles.cardTitle}>Report History</h3>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
            {data.reports.slice(0, 10).map((report, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                background: '#0a0a0a',
                borderRadius: 8
              }}>
                <span style={{fontSize: 14}}>{report.date}</span>
                <span style={{fontSize: 12, color: '#71717a', fontFamily: 'monospace'}}>{report.filename}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// 📋 TASKS TAB
function TasksTab({ data, loading, error, onRefresh }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', type: 'Development', spec: '', output: '', prio: 'MEDIUM' })
  const [adding, setAdding] = useState(false)
  
  const { active = [], nextUp = [], done = [] } = data || {}
  
  const handleAddTask = async (e) => {
    e.preventDefault()
    setAdding(true)
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      })
      if (res.ok) {
        setNewTask({ title: '', type: 'Development', spec: '', output: '', prio: 'MEDIUM' })
        setShowAddForm(false)
        onRefresh()
      }
    } catch (err) {
      console.error('Error adding task:', err)
    } finally {
      setAdding(false)
    }
  }
  
  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.loadingSpinner} />
      <div style={{color: '#71717a'}}>Loading tasks...</div>
    </div>
  )
  
  const TaskList = ({ tasks, color, label, icon }) => (
    <div style={{marginBottom: 24}}>
      <div style={{
        fontSize: 12,
        fontWeight: 700,
        textTransform: 'uppercase',
        color,
        marginBottom: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
        {icon} {label} ({tasks.length})
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
        {tasks.slice(0, 5).map((task, i) => (
          <div key={i} style={{
            padding: 14,
            background: 'rgba(0,0,0,0.3)',
            borderRadius: 10,
            borderLeft: `4px solid ${color}`,
            transition: 'all 0.2s'
          }}>
            <div style={{fontWeight: 600, fontSize: 14, marginBottom: 4}}>{task.title || task}</div>
            {task.spec && (
              <div style={{fontSize: 12, color: '#a1a1aa', marginTop: 4, lineHeight: 1.5}}>
                {task.spec.substring(0, 120)}{task.spec.length > 120 ? '...' : ''}
              </div>
            )}
            {task.prio && (
              <span style={{...styles.badge, background: `${color}20`, color, marginTop: 8, display: 'inline-flex'}}>
                {task.prio}
              </span>
            )}
            {task.date && (
              <div style={{fontSize: 11, color: '#71717a', marginTop: 6}}>{task.date}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header with add button */}
      <div style={{...styles.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16}}>
        <div>
          <div style={{fontSize: 20, fontWeight: 700, marginBottom: 4}}>📋 Task Queue</div>
          <div style={{fontSize: 13, color: '#71717a'}}>
            🔴 {active.length} Active • 🟡 {nextUp.length} Next Up • ✅ {done.length} Done
          </div>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={styles.button}
        >
          {showAddForm ? '✕ Cancel' : '+ Add Task'}
        </button>
      </div>
      
      {/* Add Task Form */}
      {showAddForm && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>➕</span>
            <h3 style={styles.cardTitle}>Add New Task</h3>
          </div>
          <form onSubmit={handleAddTask}>
            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={e => setNewTask({...newTask, title: e.target.value})}
              style={styles.input}
              required
            />
            <textarea
              placeholder="Description / Spec"
              value={newTask.spec}
              onChange={e => setNewTask({...newTask, spec: e.target.value})}
              style={styles.textarea}
              required
            />
            <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
              <select
                value={newTask.type}
                onChange={e => setNewTask({...newTask, type: e.target.value})}
                style={styles.select}
              >
                <option value="Development">Development</option>
                <option value="Content">Content</option>
                <option value="Research">Research</option>
                <option value="Design">Design</option>
              </select>
              <select
                value={newTask.prio}
                onChange={e => setNewTask({...newTask, prio: e.target.value})}
                style={styles.select}
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
              </select>
              <button type="submit" disabled={adding} style={{...styles.button, opacity: adding ? 0.7 : 1}}>
                {adding ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Task Lists */}
      <div style={styles.grid2}>
        <div style={styles.card}>
          <TaskList tasks={active} color="#f56565" label="Active" icon="🔴" />
          <TaskList tasks={nextUp} color="#ed8936" label="Next Up" icon="🟡" />
        </div>
        <div style={styles.card}>
          <TaskList tasks={done} color="#48bb78" label="Completed" icon="✅" />
        </div>
      </div>
    </div>
  )
}

// ⏰ CRON TAB
function CronTab({ data, loading, error }) {
  const jobs = data?.jobs || data || []
  
  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.loadingSpinner} />
      <div style={{color: '#71717a'}}>Loading cron jobs...</div>
    </div>
  )
  
  if (error) return (
    <div style={styles.errorBox}>
      <div style={{fontSize: 32, marginBottom: 8}}>⚠️</div>
      <div>Failed to load cron jobs</div>
      <div style={{fontSize: 12, marginTop: 8, opacity: 0.8}}>{error}</div>
    </div>
  )
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Stats */}
      <div style={styles.grid4}>
        <div style={{...styles.card, textAlign: 'center'}}>
          <div style={{fontSize: 36, fontWeight: 700, color: '#667eea'}}>{jobs.length}</div>
          <div style={{fontSize: 13, color: '#a1a1aa'}}>Total Jobs</div>
        </div>
        <div style={{...styles.card, textAlign: 'center'}}>
          <div style={{fontSize: 36, fontWeight: 700, color: '#48bb78'}}>
            {jobs.filter(j => j.status === 'active').length}
          </div>
          <div style={{fontSize: 13, color: '#a1a1aa'}}>Active</div>
        </div>
        <div style={{...styles.card, textAlign: 'center'}}>
          <div style={{fontSize: 36, fontWeight: 700, color: '#ed8936'}}>
            {jobs.filter(j => j.status === 'pending' || j.status === 'paused').length}
          </div>
          <div style={{fontSize: 13, color: '#a1a1aa'}}>Pending</div>
        </div>
        <div style={{...styles.card, textAlign: 'center'}}>
          <div style={{fontSize: 36, fontWeight: 700, color: '#a1a1aa'}}>
            {jobs.filter(j => j.status === 'error' || j.status === 'failed').length}
          </div>
          <div style={{fontSize: 13, color: '#a1a1aa'}}>Errors</div>
        </div>
      </div>
      
      {/* Jobs Table */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.cardIcon}>⏰</span>
          <h3 style={styles.cardTitle}>Scheduled Jobs</h3>
        </div>
        <div style={{overflowX: 'auto'}}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Job</th>
                <th style={styles.tableHeader}>Schedule</th>
                <th style={styles.tableHeader}>Last Run</th>
                <th style={styles.tableHeader}>Next Run</th>
                <th style={styles.tableHeader}>Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, i) => (
                <tr key={job.id || i}>
                  <td style={styles.tableCell}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                      <span style={{fontSize: 20}}>{job.name?.split(' ')[0] || '⏰'}</span>
                      <span style={{fontWeight: 500}}>{job.name?.replace(/^[^\s]+\s/, '') || job.id}</span>
                    </div>
                  </td>
                  <td style={{...styles.tableCell, fontFamily: 'monospace', fontSize: 12, color: '#a1a1aa'}}>
                    {job.schedule}
                  </td>
                  <td style={styles.tableCell}>
                    {job.lastRun ? new Date(job.lastRun).toLocaleString('sv-SE', {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'}) : '—'}
                  </td>
                  <td style={styles.tableCell}>
                    {job.nextRun ? new Date(job.nextRun).toLocaleString('sv-SE', {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'}) : '—'}
                  </td>
                  <td style={styles.tableCell}>
                    <span style={{
                      ...styles.badge,
                      background: job.status === 'active' ? 'rgba(72,187,120,0.15)' : 
                                job.status === 'error' ? 'rgba(245,101,101,0.15)' : 'rgba(237,137,54,0.15)',
                      color: job.status === 'active' ? '#48bb78' : 
                             job.status === 'error' ? '#f56565' : '#ed8936'
                    }}>
                      {job.status?.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {jobs.length === 0 && (
          <div style={{textAlign: 'center', padding: 40, color: '#71717a'}}>
            No cron jobs configured
          </div>
        )}
      </div>
    </div>
  )
}

// 📊 ACTIVITY TAB
function ActivityTab({ data, loading, error }) {
  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.loadingSpinner} />
      <div style={{color: '#71717a'}}>Loading activity log...</div>
    </div>
  )
  
  if (error) return (
    <div style={styles.errorBox}>
      <div style={{fontSize: 32, marginBottom: 8}}>⚠️</div>
      <div>Failed to load activity log</div>
      <div style={{fontSize: 12, marginTop: 8, opacity: 0.8}}>{error}</div>
    </div>
  )
  
  const events = data?.events || []
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={styles.card}>
        <div style={{...styles.cardHeader, justifyContent: 'space-between'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <span style={styles.cardIcon}>📊</span>
            <h3 style={styles.cardTitle}>Daily Activity Log</h3>
          </div>
          <span style={{...styles.badge, background: 'rgba(102,126,234,0.15)', color: '#667eea'}}>
            {data?.date || new Date().toISOString().split('T')[0]}
          </span>
        </div>
        <div style={{display: 'flex', gap: 16, flexWrap: 'wrap'}}>
          <div style={{padding: '12px 20px', background: '#0a0a0a', borderRadius: 10}}>
            <span style={{fontSize: 12, color: '#71717a'}}>Total Events: </span>
            <span style={{fontWeight: 600}}>{data?.totalEvents || events.length}</span>
          </div>
        </div>
      </div>
      
      {/* Events List */}
      <div style={styles.card}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          {events.map((event, i) => (
            <div key={i} style={{
              padding: 14,
              background: '#0a0a0a',
              borderRadius: 10,
              borderLeft: `3px solid ${
                event.type === 'completed' ? '#48bb78' :
                event.type === 'in-progress' ? '#ed8936' :
                event.type === 'planned' ? '#667eea' : '#71717a'
              }`
            }}>
              {event.section && (
                <div style={{fontSize: 10, color: '#667eea', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4}}>
                  {event.section}
                </div>
              )}
              <div style={{fontSize: 14, lineHeight: 1.5, color: '#e4e4e7'}}>{event.content}</div>
            </div>
          ))}
        </div>
        {events.length === 0 && (
          <div style={{textAlign: 'center', padding: 40, color: '#71717a'}}>
            No events recorded for this day
          </div>
        )}
      </div>
      
      {/* Raw Content (collapsible) */}
      {data?.content && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>📝</span>
            <h3 style={styles.cardTitle}>Raw Log</h3>
          </div>
          <pre style={{
            background: '#0a0a0a',
            borderRadius: 12,
            padding: 20,
            overflow: 'auto',
            fontSize: 12,
            lineHeight: 1.6,
            color: '#a1a1aa',
            maxHeight: 400
          }}>
            {data.content}
          </pre>
        </div>
      )}
    </div>
  )
}

// ==================== MAIN COMPONENT ====================

export default function MissionControl() {
  const [activeTab, setActiveTab] = useState('overview')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [nextHeartbeat, setNextHeartbeat] = useState(1800)
  
  // Data states
  const [tasks, setTasks] = useState({ active: [], nextUp: [], done: [] })
  const [cronJobs, setCronJobs] = useState([])
  const [blocketDeals, setBlocketDeals] = useState([])
  const [activity, setActivity] = useState(null)
  const [twitterData, setTwitterData] = useState(null)
  
  // Loading states
  const [loading, setLoading] = useState({
    tasks: true,
    cron: true,
    blocket: true,
    activity: true,
    twitter: true
  })
  
  // Error states
  const [errors, setErrors] = useState({})
  
  const tabs = [
    { id: 'overview', label: 'Översikt', icon: '🏠' },
    { id: 'blocket', label: 'Blocket', icon: '🔍' },
    { id: 'twitter', label: 'X/Twitter', icon: '📰' },
    { id: 'tasks', label: 'Tasks', icon: '📋' },
    { id: 'cron', label: 'Cron', icon: '⏰' },
    { id: 'activity', label: 'Aktivitet', icon: '📊' }
  ]
  
  // Fetch all data
  const fetchData = useCallback(async () => {
    const fetchWithError = async (url, key) => {
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setLoading(prev => ({ ...prev, [key]: false }))
        setErrors(prev => ({ ...prev, [key]: null }))
        return data
      } catch (err) {
        setLoading(prev => ({ ...prev, [key]: false }))
        setErrors(prev => ({ ...prev, [key]: err.message }))
        return null
      }
    }
    
    const [tasksData, cronData, blocketData, activityData, twitterData] = await Promise.all([
      fetchWithError('/api/tasks', 'tasks'),
      fetchWithError('/api/cron', 'cron'),
      fetchWithError('/api/blocket', 'blocket'),
      fetchWithError('/api/activity', 'activity'),
      fetchWithError('/api/twitter', 'twitter')
    ])
    
    if (tasksData) setTasks(tasksData)
    if (cronData) setCronJobs(cronData.jobs || cronData)
    if (blocketData) setBlocketDeals(blocketData.deals || blocketData)
    if (activityData) setActivity(activityData)
    if (twitterData) setTwitterData(twitterData)
  }, [])
  
  // Effects
  useEffect(() => {
    fetchData()
    
    // Time update
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000)
    
    // Heartbeat countdown
    const heartbeatInterval = setInterval(() => {
      setNextHeartbeat(prev => prev > 0 ? prev - 1 : 1800)
    }, 1000)
    
    // Auto-refresh data every 10 seconds
    const dataInterval = setInterval(fetchData, 10000)
    
    return () => {
      clearInterval(timeInterval)
      clearInterval(heartbeatInterval)
      clearInterval(dataInterval)
    }
  }, [fetchData])
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }
  
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const renderTab = () => {
    const tabData = {
      tasks, cronJobs, blocketDeals, activity, twitterData
    }
    
    switch (activeTab) {
      case 'overview':
        return <OverviewTab data={tabData} loading={false} error={null} onRefresh={fetchData} />
      case 'blocket':
        return <BlocketTab data={blocketDeals} loading={loading.blocket} error={errors.blocket} onRefresh={fetchData} />
      case 'twitter':
        return <TwitterTab data={twitterData} loading={loading.twitter} error={errors.twitter} />
      case 'tasks':
        return <TasksTab data={tasks} loading={loading.tasks} error={errors.tasks} onRefresh={fetchData} />
      case 'cron':
        return <CronTab data={cronJobs} loading={loading.cron} error={errors.cron} />
      case 'activity':
        return <ActivityTab data={activity} loading={loading.activity} error={errors.activity} />
      default:
        return null
    }
  }
  
  return (
    <div style={styles.container}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🚀</span>
            <div>
              <h1 style={styles.logoText}>MISSION CONTROL</h1>
              <div style={styles.logoSubtext}>Duljan AB Operations Center</div>
            </div>
          </div>
          
          <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
            <div style={styles.timeDisplay}>
              <div style={styles.timeValue}>{formatTime(currentTime)}</div>
              <div style={styles.timeLabel}>🫀 Next: {formatCountdown(nextHeartbeat)}</div>
            </div>
            <div style={styles.statusBadge}>
              <span style={styles.statusDot} />
              ONLINE
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div style={styles.tabsContainer}>
        <div style={styles.tabsInner}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.tab,
                ...(activeTab === tab.id ? styles.tabActive : {})
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {activeTab === tab.id && <div style={styles.tabIndicator} />}
            </button>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div style={styles.content}>
        {renderTab()}
      </div>
      
      {/* Footer */}
      <div style={styles.footer}>
        Duljan AB Mission Control v2.0 • Built with 🦞 OpenClaw • Auto-refresh every 10s
      </div>
    </div>
  )
}