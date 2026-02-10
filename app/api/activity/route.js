import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const MEMORY_DIR = '/Users/duljan/.openclaw/workspace/memory'

export async function GET() {
  try {
    // Get today's and yesterday's date
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    
    // Try to read today's log first, fallback to yesterday
    let content = null
    let date = today
    
    try {
      content = await fs.readFile(path.join(MEMORY_DIR, `${today}.md`), 'utf-8')
    } catch (e) {
      try {
        content = await fs.readFile(path.join(MEMORY_DIR, `${yesterday}.md`), 'utf-8')
        date = yesterday
      } catch (e2) {
        // List available memory files
        const files = await fs.readdir(MEMORY_DIR)
        const mdFiles = files.filter(f => f.endsWith('.md') && f.match(/^\d{4}-\d{2}-\d{2}\.md$/))
          .sort().reverse()
        
        if (mdFiles.length > 0) {
          content = await fs.readFile(path.join(MEMORY_DIR, mdFiles[0]), 'utf-8')
          date = mdFiles[0].replace('.md', '')
        }
      }
    }
    
    if (!content) {
      throw new Error('No activity logs found')
    }
    
    // Parse the activity log
    const lines = content.split('\n')
    const events = []
    let currentSection = null
    
    for (const line of lines) {
      const trimmed = line.trim()
      
      // Section headers
      if (trimmed.startsWith('## ')) {
        currentSection = trimmed.replace('## ', '')
        continue
      }
      
      // Event entries (bullet points with emojis or timestamps)
      if (trimmed.startsWith('- ') || trimmed.startsWith('✅') || trimmed.match(/^\d{2}:\d{2}/)) {
        events.push({
          section: currentSection,
          content: trimmed.replace(/^- /, '').replace(/^✅\s*/, ''),
          type: trimmed.includes('✅') ? 'completed' : 
                trimmed.includes('🔨') ? 'in-progress' :
                trimmed.includes('📋') ? 'planned' : 'note',
          raw: trimmed
        })
      }
    }
    
    return NextResponse.json({
      date,
      content,
      events: events.slice(0, 20), // First 20 events
      totalEvents: events.length
    })
  } catch (error) {
    return NextResponse.json(
      { date: null, content: null, events: [], error: error.message },
      { status: 500 }
    )
  }
}
