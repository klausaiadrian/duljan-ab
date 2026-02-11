import { NextResponse } from 'next/server'
import fs from 'fs/promises'

const STATUS_FILE = '/Users/duljan/.openclaw/workspace/data/status.json'

export async function GET() {
  try {
    const raw = await fs.readFile(STATUS_FILE, 'utf-8')
    return NextResponse.json(JSON.parse(raw))
  } catch (e) {
    return NextResponse.json({ state: 'offline', task: null, since: null, subAgents: [] })
  }
}
