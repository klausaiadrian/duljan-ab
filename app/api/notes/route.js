import { NextResponse } from 'next/server'
import fs from 'fs/promises'

const NOTES_FILE = '/Users/duljan/.openclaw/workspace/data/notes.json'

async function readNotes() {
  try {
    const raw = await fs.readFile(NOTES_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch { return [] }
}

async function writeNotes(notes) {
  await fs.writeFile(NOTES_FILE, JSON.stringify(notes, null, 2))
}

export async function GET() {
  const notes = await readNotes()
  return NextResponse.json({ notes })
}

export async function POST(req) {
  try {
    const { from, text } = await req.json()
    if (!text) return NextResponse.json({ error: 'text required' }, { status: 400 })
    const notes = await readNotes()
    notes.push({ ts: new Date().toISOString(), from: from || 'Adrian', text, seen: false })
    await writeNotes(notes)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const { index } = await req.json()
    const notes = await readNotes()
    if (index >= 0 && index < notes.length) {
      notes[index].seen = true
      await writeNotes(notes)
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
