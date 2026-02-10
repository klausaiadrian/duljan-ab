export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)', color: '#fff' }}>
      {/* Hero */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🏢</div>
        <h1 style={{ fontSize: 48, fontWeight: 800, margin: '0 0 16px', background: 'linear-gradient(90deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Duljan AB
        </h1>
        <p style={{ fontSize: 20, color: '#a0aec0', margin: '0 0 48px', lineHeight: 1.6 }}>
          AI-drivna verktyg och automationer — byggda med OpenClaw
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginBottom: 64, flexWrap: 'wrap' }}>
          {[
            { num: '10+', label: 'Skills byggda' },
            { num: '3', label: 'Automationer' },
            { num: '2', label: 'AI-agenter' },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#667eea' }}>{s.num}</div>
              <div style={{ fontSize: 14, color: '#718096' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Team */}
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32 }}>Teamet</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', marginBottom: 64 }}>
          {[
            { emoji: '👤', name: 'Adrian', role: 'VD & Grundare', desc: 'Vision och beslut' },
            { emoji: '🧠', name: 'Klaus', role: 'AI-Strateg', desc: 'Claude Opus 4.6' },
            { emoji: '🔧', name: 'Bosse', role: 'AI-Utvecklare', desc: 'Kimi K2.5' },
          ].map((m) => (
            <div key={m.name} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '32px 24px', width: 200, border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{m.emoji}</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{m.name}</div>
              <div style={{ fontSize: 14, color: '#667eea', marginBottom: 8 }}>{m.role}</div>
              <div style={{ fontSize: 13, color: '#718096' }}>{m.desc}</div>
            </div>
          ))}
        </div>

        {/* Services */}
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32 }}>Vad vi bygger</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 64, textAlign: 'left' }}>
          {[
            { icon: '🦞', title: 'OpenClaw Skills', desc: '10+ publicerade skills för AI-automation' },
            { icon: '🤖', title: 'AI-Agenter', desc: 'Autonoma agenter som jobbar dygnet runt' },
            { icon: '🔍', title: 'Web Scraping', desc: 'Automatisk bevakning av marknader och trender' },
            { icon: '📊', title: 'Business Tools', desc: 'SEO, fakturering, content-planering' },
          ].map((s) => (
            <div key={s.title} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: 14, color: '#718096', lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginBottom: 48 }}>
          <a href="https://github.com/klausaiadrian/duljan-ab" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(90deg, #667eea, #764ba2)', borderRadius: 8, color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 16 }}>
            Se vårt arbete på GitHub →
          </a>
        </div>

        {/* Footer */}
        <div style={{ fontSize: 13, color: '#4a5568', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24 }}>
          © 2026 Duljan AB — Built with 🦞 OpenClaw
        </div>
      </div>
    </div>
  )
}
