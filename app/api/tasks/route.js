import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const TASK_QUEUE_PATH = '/Users/duljan/.openclaw/workspace/TASK_QUEUE.md'

function parseTaskQueue(content) {
  const sections = {
    active: [],
    nextUp: [],
    done: []
  }
  
  let currentSection = null
  let currentTask = null
  const lines = content.split('\n')
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Detect sections
    if (line.includes('## 🔴 ACTIVE')) {
      currentSection = 'active'
      continue
    }
    if (line.includes('## 🟡 NEXT UP')) {
      currentSection = 'nextUp'
      continue
    }
    if (line.includes('## ✅ DONE')) {
      currentSection = 'done'
      continue
    }
    
    if (!currentSection) continue
    
    // Parse tasks (headers starting with ###)
    if (line.startsWith('### ')) {
      if (currentTask) {
        sections[currentSection].push(currentTask)
      }
      currentTask = {
        title: line.replace('### ', '').replace(/\s*[-–—]\s*.+$/, '').trim(),
        subtitle: line.match(/[-–—]\s*(.+)$/)?.[1] || '',
        details: [],
        date: null,
        raw: line
      }
      continue
    }
    
    // Parse task details (bullet points under tasks)
    if (currentTask && line.trim().startsWith('-')) {
      const cleanLine = line.trim().replace(/^- \*\*/, '').replace(/\*\*/g, '').trim()
      if (cleanLine.includes('**Typ:**')) {
        currentTask.type = cleanLine.split('**Typ:**')[1]?.trim()
      } else if (cleanLine.includes('**Spec:**')) {
        currentTask.spec = cleanLine.split('**Spec:**')[1]?.trim()
      } else if (cleanLine.includes('**Output:**')) {
        currentTask.output = cleanLine.split('**Output:**')[1]?.trim()
      } else if (cleanLine.includes('**Prio:**')) {
        currentTask.prio = cleanLine.split('**Prio:**')[1]?.trim()
      } else if (line.includes('Rapport:') || line.includes('Filer:') || line.includes('Innehåll:')) {
        currentTask.details.push(line.trim())
      } else {
        currentTask.details.push(line.trim())
      }
    }
    
    // Parse dates for done tasks
    if (currentTask && line.match(/^\d{4}-\d{2}-\d{2}$/)) {
      currentTask.date = line.trim()
    }
    
    // Parse done task markers
    if (line.includes('✅') && currentTask) {
      const dateMatch = line.match(/—\s*(\d{4}-\d{2}-\d{2})/)
      if (dateMatch) {
        currentTask.date = dateMatch[1]
      }
    }
  }
  
  if (currentTask) {
    sections[currentSection].push(currentTask)
  }
  
  return sections
}

export async function GET() {
  try {
    const content = await fs.readFile(TASK_QUEUE_PATH, 'utf-8')
    const tasks = parseTaskQueue(content)
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json(
      { active: [], nextUp: [], done: [], error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { title, type, spec, output, prio = 'MEDIUM' } = body
    
    if (!title || !type || !spec) {
      return NextResponse.json(
        { error: 'Missing required fields: title, type, spec' },
        { status: 400 }
      )
    }
    
    const content = await fs.readFile(TASK_QUEUE_PATH, 'utf-8')
    const lines = content.split('\n')
    
    // Find NEXT UP section and first task
    let nextUpIndex = -1
    let firstTaskIndex = -1
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('## 🟡 NEXT UP')) {
        nextUpIndex = i
      }
      if (nextUpIndex > -1 && lines[i].startsWith('### ') && firstTaskIndex === -1) {
        firstTaskIndex = i
        break
      }
    }
    
    // Generate task number
    const taskNum = content.match(/Task (\d+):/g)?.length + 1 || 21
    
    // Format new task
    const newTask = `### ${taskNum}. ${title}
- **Typ:** ${type}
- **Spec:** ${spec}
- **Output:** ${output || 'Rapport + filer'}
- **Prio:** ${prio}
`
    
    // Insert before first task or at end of NEXT UP
    if (firstTaskIndex > -1) {
      lines.splice(firstTaskIndex, 0, newTask)
    } else if (nextUpIndex > -1) {
      lines.splice(nextUpIndex + 1, 0, newTask)
    }
    
    await fs.writeFile(TASK_QUEUE_PATH, lines.join('\n'), 'utf-8')
    
    return NextResponse.json({ success: true, taskNum })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
