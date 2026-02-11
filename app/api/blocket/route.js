import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const BLOCKET_DIR = '/Users/duljan/.openclaw/workspace/projects/blocket'
const LEADERBOARD_FILE = path.join(BLOCKET_DIR, 'blocket_leaderboard.json')
const ALL_LISTINGS_FILE = path.join(BLOCKET_DIR, 'blocket_all_listings.json')
const SEEN_FILE = path.join(BLOCKET_DIR, 'blocket_seen_listings.json')

export async function GET() {
  try {
    // Read leaderboard
    let leaderboard = []
    try {
      const data = await fs.readFile(LEADERBOARD_FILE, 'utf-8')
      leaderboard = JSON.parse(data)
    } catch (e) {
      leaderboard = []
    }

    // Read latest listings
    let latest = []
    try {
      const files = await fs.readdir(BLOCKET_DIR)
      const jsonFiles = files
        .filter(f => f.startsWith('blocket_listings_') && f.endsWith('.json'))
        .sort()
        .reverse()
      
      if (jsonFiles.length > 0) {
        const latestFile = path.join(BLOCKET_DIR, jsonFiles[0])
        const data = await fs.readFile(latestFile, 'utf-8')
        latest = JSON.parse(data)
      }
    } catch (e) {
      latest = []
    }

    // Read seen listings count
    let seenCount = 0
    try {
      const data = await fs.readFile(SEEN_FILE, 'utf-8')
      const seen = JSON.parse(data)
      seenCount = seen.length
    } catch (e) {
      seenCount = 0
    }

    // Get last scrape time from latest file
    let lastScrape = null
    try {
      const files = await fs.readdir(BLOCKET_DIR)
      const jsonFiles = files
        .filter(f => f.startsWith('blocket_listings_') && f.endsWith('.json'))
        .sort()
        .reverse()
      if (jsonFiles.length > 0) {
        const match = jsonFiles[0].match(/(\d{8})_(\d{6})/)
        if (match) {
          const [_, date, time] = match
          const year = date.slice(0, 4)
          const month = date.slice(4, 6)
          const day = date.slice(6, 8)
          const hour = time.slice(0, 2)
          const min = time.slice(2, 4)
          lastScrape = `${year}-${month}-${day}T${hour}:${min}:00`
        }
      }
    } catch (e) {
      lastScrape = null
    }

    return NextResponse.json({
      leaderboard: leaderboard.slice(0, 20),
      latest: latest.slice(0, 50),
      stats: {
        totalTracked: seenCount,
        topDeals: leaderboard.length,
        lastScrape
      }
    })
  } catch (e) {
    return NextResponse.json({ 
      leaderboard: [], 
      latest: [], 
      stats: { totalTracked: 0, topDeals: 0, lastScrape: null },
      error: e.message 
    })
  }
}
