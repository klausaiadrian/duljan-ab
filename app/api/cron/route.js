import { NextResponse } from 'next/server'

const OPENCLAW_API_URL = 'http://localhost:18789/api/cron/jobs'
const OPENCLAW_TOKEN = 'edf9b343168f1d601ff481e2beea990856089497fd963f4e'

export async function GET() {
  try {
    const response = await fetch(OPENCLAW_API_URL, {
      headers: {
        'Authorization': `Bearer ${OPENCLAW_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    // Return mock data if API is unavailable
    return NextResponse.json({
      jobs: [
        {
          id: 'heartbeat',
          name: '🫀 Heartbeat',
          schedule: '*/30 * * * *',
          lastRun: '2026-02-10 20:30:00',
          status: 'active',
          nextRun: '2026-02-10 21:00:00'
        },
        {
          id: 'bosse-check',
          name: '🔧 Bosse Check',
          schedule: '0 */2 * * *',
          lastRun: '2026-02-10 18:00:00',
          status: 'active',
          nextRun: '2026-02-10 20:00:00'
        },
        {
          id: 'blocket-scrape',
          name: '🔍 Blocket Scraper',
          schedule: '0 9,15 * * *',
          lastRun: '2026-02-10 15:00:00',
          status: 'active',
          nextRun: '2026-02-11 09:00:00'
        },
        {
          id: 'daily-report',
          name: '📝 Daily Report',
          schedule: '0 8 * * *',
          lastRun: '2026-02-10 08:00:00',
          status: 'active',
          nextRun: '2026-02-11 08:00:00'
        }
      ],
      total: 4,
      active: 4,
      error: error.message
    })
  }
}
