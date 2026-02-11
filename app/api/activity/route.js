import { NextResponse } from 'next/server'
import fs from 'fs/promises'

const ACTIVITY_FILE = '/Users/duljan/.openclaw/workspace/data/activity.json'

export async function GET() {
  try {
    const raw = await fs.readFile(ACTIVITY_FILE, 'utf-8')
    const events = JSON.parse(raw)
    return NextResponse.json({ events: events.slice(-50).reverse() })
  } catch (e) {
    return NextResponse.json({ events: [] })
  }
}
