import { NextResponse } from 'next/server'
import fs from 'fs/promises'

const FEED_FILE = '/Users/duljan/.openclaw/workspace/data/x_feed.json'

export async function GET() {
  try {
    const raw = await fs.readFile(FEED_FILE, 'utf-8')
    return NextResponse.json(JSON.parse(raw))
  } catch (e) {
    return NextResponse.json({ posts: [], lastFetch: null })
  }
}
