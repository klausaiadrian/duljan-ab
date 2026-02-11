export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)', color: '#fff' }}>
      {/* Hero */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🏢</div>
        <h1 style={{ fontSize: 48, fontWeight: 800, margin: '0 0 16px', background: 'linear-gradient(90deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Duljan AB
        </h1>
        <p style={{ fontSize: 22, color: '#c0c8d8', margin: '0 0 12px', lineHeight: 1.6, fontWeight: 500 }}>
          Sveriges första AI Automation Studio
        </p>
        <p style={{ fontSize: 16, color: '#8090a8', margin: '0 0 48px', lineHeight: 1.6 }}>
          Vi bygger, säljer och driftar AI-automationer med OpenClaw — så att du kan fokusera på det som räknas.
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginBottom: 64, flexWrap: 'wrap' }}>
          {[
            { num: '23+', label: 'Tasks levererade' },
            { num: '10+', label: 'Skills byggda' },
            { num: '6', label: 'Automationer live' },
            { num: '2', label: 'AI-agenter' },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#667eea' }}>{s.num}</div>
              <div style={{ fontSize: 14, color: '#718096' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Services */}
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Tjänster</h2>
        <p style={{ fontSize: 14, color: '#718096', marginBottom: 32 }}>Vi löser problem du inte visste att du hade</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 64, textAlign: 'left' }}>
          {[
            { icon: '🚀', title: 'OpenClaw Setup', desc: 'Komplett setup av din AI-agent — från installation till dagliga automationer. Du är igång på en dag.', tag: 'Populärast' },
            { icon: '🔒', title: 'Säker AI för Företag', desc: 'Docker-sandbox, VPN-skydd, API-limiter och säkerhetsgranskade skills. Enterprise-grade.', tag: 'Ny' },
            { icon: '📝', title: 'Content Repurposing', desc: 'En bloggpost → 5 tweets, LinkedIn-post, newsletter och YouTube Short. Automatiskt.', tag: null },
            { icon: '🔍', title: 'SEO Audit & Automation', desc: 'AI-driven SEO-analys med handlingsbara rekommendationer. Automatiska rapporter.', tag: null },
            { icon: '📊', title: 'Brand Monitoring', desc: 'Bevaka vad folk säger om ditt varumärke på X, Reddit och HN. Dagliga rapporter med sentiment.', tag: null },
            { icon: '💼', title: 'Svenska Business Tools', desc: 'Fakturering, momsberäkning och affärsdokument — anpassat för svenska företag.', tag: 'Unikt' },
          ].map((s) => (
            <div key={s.title} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 24, border: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
              {s.tag && <span style={{ position: 'absolute', top: 12, right: 12, background: s.tag === 'Populärast' ? 'linear-gradient(90deg, #667eea, #764ba2)' : s.tag === 'Ny' ? '#22c55e' : '#eab308', color: '#fff', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6 }}>{s.tag}</span>}
              <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: 14, color: '#718096', lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* OpenClaw Skills */}
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>OpenClaw Skills</h2>
        <p style={{ fontSize: 14, color: '#718096', marginBottom: 32 }}>Installera direkt via ClawHub — verifierade, säkerhetsgranskade, open source</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 64, textAlign: 'left' }}>
          {[
            { name: 'Swedish Business Tools', desc: 'Fakturering & affärsverktyg', status: '✅ Redo' },
            { name: 'Invoice Generator', desc: 'Professionella fakturor', status: '✅ Redo' },
            { name: 'SEO Audit Tool', desc: 'Komplett SEO-analys', status: '✅ Redo' },
            { name: 'Content Repurposer', desc: 'Blog → Social media', status: '🔨 Byggs' },
            { name: 'Brand Monitor', desc: 'Social listening', status: '🔨 Byggs' },
            { name: 'Blocket Alert', desc: 'Deal-finder automation', status: '🔨 Byggs' },
          ].map((s) => (
            <div key={s.name} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 10, padding: '16px 20px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: '#718096', marginBottom: 8 }}>{s.desc}</div>
              <div style={{ fontSize: 11, color: s.status.includes('✅') ? '#22c55e' : '#eab308' }}>{s.status}</div>
            </div>
          ))}
        </div>

        {/* Team */}
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32 }}>Teamet</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', marginBottom: 64 }}>
          {[
            { emoji: '👤', name: 'Adrian', role: 'VD & Grundare', desc: 'Vision, beslut och den mänskliga touchen' },
            { emoji: '🧠', name: 'Klaus', role: 'AI-Strateg', desc: 'Claude Opus 4.6 — planerar och koordinerar' },
            { emoji: '🔧', name: 'Bosse', role: 'AI-Utvecklare', desc: 'Kimi K2.5 — kodar och levererar' },
          ].map((m) => (
            <div key={m.name} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '32px 24px', width: 220, border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{m.emoji}</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{m.name}</div>
              <div style={{ fontSize: 14, color: '#667eea', marginBottom: 8 }}>{m.role}</div>
              <div style={{ fontSize: 13, color: '#718096' }}>{m.desc}</div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 48, flexWrap: 'wrap' }}>
          {[
            '🔒 Säkerhetsgranskade skills',
            '🇸🇪 Byggda i Sverige',
            '📖 100% Open Source',
          ].map((b) => (
            <div key={b} style={{ fontSize: 13, color: '#8090a8', background: 'rgba(102,126,234,0.1)', padding: '8px 16px', borderRadius: 20, border: '1px solid rgba(102,126,234,0.2)' }}>
              {b}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 48, flexWrap: 'wrap' }}>
          <a href="https://github.com/klausaiadrian/duljan-ab" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(90deg, #667eea, #764ba2)', borderRadius: 8, color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 16 }}>
            GitHub →
          </a>
          <a href="mailto:duljanab@gmail.com"
            style={{ display: 'inline-block', padding: '14px 32px', background: 'transparent', borderRadius: 8, color: '#667eea', textDecoration: 'none', fontWeight: 600, fontSize: 16, border: '1px solid #667eea' }}>
            Kontakta oss
          </a>
        </div>

        {/* Footer */}
        <div style={{ fontSize: 13, color: '#4a5568', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24 }}>
          © 2026 Duljan AB — Sveriges första AI Automation Studio — Built with 🦞 OpenClaw
        </div>
      </div>
    </div>
  )
}
