import { NextResponse } from 'next/server'
import fs from 'fs/promises'

const TASK_FILE = '/Users/duljan/.openclaw/workspace/TASK_QUEUE.md'

function parseTasks(content) {
  const sections = { active: [], nextUp: [], done: [] }
  let currentSection = null
  let currentTask = null

  for (const line of content.split('\n')) {
    const trimmed = line.trim()

    if (trimmed.startsWith('## ') && trimmed.includes('ACTIVE')) { if (currentTask && currentSection) sections[currentSection].push(currentTask); currentTask = null; currentSection = 'active' }
    else if (trimmed.startsWith('## ') && trimmed.includes('NEXT UP')) { if (currentTask && currentSection) sections[currentSection].push(currentTask); currentTask = null; currentSection = 'nextUp' }
    else if (trimmed.startsWith('## ') && trimmed.includes('DONE')) { if (currentTask && currentSection) sections[currentSection].push(currentTask); currentTask = null; currentSection = 'done' }
    else if (trimmed.startsWith('### ') && currentSection) {
      if (currentTask) {
        sections[currentSection].push(currentTask)
      }
      currentTask = {
        name: trimmed.replace(/^###\s*/, '').replace(/^✅\s*/, '').replace(/\s*—\s*\d{4}.*$/, ''),
        type: null, prio: null, spec: null, done: trimmed.includes('✅')
      }
    } else if (currentTask && trimmed.startsWith('- **Typ:**')) {
      currentTask.type = trimmed.replace('- **Typ:**', '').trim()
    } else if (currentTask && trimmed.startsWith('- **Prio:**')) {
      currentTask.prio = trimmed.replace('- **Prio:**', '').trim()
    } else if (currentTask && trimmed.startsWith('- **Spec:**')) {
      currentTask.spec = trimmed.replace('- **Spec:**', '').trim()
    }
  }
  if (currentTask && currentSection) {
    sections[currentSection].push(currentTask)
  }

  return sections
}

export async function GET() {
  try {
    const content = await fs.readFile(TASK_FILE, 'utf-8')
    const tasks = parseTasks(content)
    // Only return last 5 done
    tasks.done = tasks.done.slice(0, 5)
    return NextResponse.json(tasks)
  } catch (e) {
    return NextResponse.json({ active: [], nextUp: [], done: [], error: e.message })
  }
}

export async function POST(req) {
  try {
    const { name, description, prio } = await req.json()
    if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })

    let content = await fs.readFile(TASK_FILE, 'utf-8')

    const entry = `\n### ${name}\n- **Typ:** General\n- **Spec:** ${description || 'Ingen beskrivning'}\n- **Output:** Rapport + filer\n- **Prio:** ${prio || 'MEDIUM'}\n`

    // Insert after NEXT UP header
    const nextUpIdx = content.indexOf('## 🟡 NEXT UP')
    if (nextUpIdx !== -1) {
      const afterHeader = content.indexOf('\n', nextUpIdx) + 1
      content = content.slice(0, afterHeader) + entry + content.slice(afterHeader)
    } else {
      content += entry
    }

    await fs.writeFile(TASK_FILE, content)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
