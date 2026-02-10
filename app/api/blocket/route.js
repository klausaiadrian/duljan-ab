import { NextResponse } from 'next/server'
import fs from 'fs/promises'

const LEADERBOARD_PATH = '/Users/duljan/.openclaw/workspace/projects/blocket/leaderboard.json'

export async function GET() {
  try {
    const content = await fs.readFile(LEADERBOARD_PATH, 'utf-8')
    const data = JSON.parse(content)
    return NextResponse.json(data)
  } catch (error) {
    // Return mock data if file doesn't exist
    return NextResponse.json({
      deals: [
        {
          id: 'mock-1',
          title: 'MacBook Pro 14" M3 Pro 18GB RAM 512GB SSD',
          price: 18900,
          originalPrice: 24995,
          score: 94,
          location: 'Stockholm',
          category: 'Datorer',
          url: 'https://blocket.se',
          image: null,
          postedAt: '2026-02-10 18:30'
        },
        {
          id: 'mock-2',
          title: 'iPhone 15 Pro 256GB Natural Titanium',
          price: 8900,
          originalPrice: 12995,
          score: 91,
          location: 'Göteborg',
          category: 'Telefoner',
          url: 'https://blocket.se',
          image: null,
          postedAt: '2026-02-10 17:45'
        },
        {
          id: 'mock-3',
          title: 'Sony A7IV + 24-70mm f/2.8 GM II',
          price: 42000,
          originalPrice: 58995,
          score: 89,
          location: 'Malmö',
          category: 'Foto',
          url: 'https://blocket.se',
          image: null,
          postedAt: '2026-02-10 16:20'
        },
        {
          id: 'mock-4',
          title: 'Samsung 49" Odyssey G9 240Hz Curved',
          price: 7500,
          originalPrice: 13995,
          score: 87,
          location: 'Uppsala',
          category: 'Datorer',
          url: 'https://blocket.se',
          image: null,
          postedAt: '2026-02-10 15:10'
        },
        {
          id: 'mock-5',
          title: 'iPad Pro 12.9" M2 256GB WiFi + 5G',
          price: 8200,
          originalPrice: 13995,
          score: 85,
          location: 'Linköping',
          category: 'Surfplattor',
          url: 'https://blocket.se',
          image: null,
          postedAt: '2026-02-10 14:55'
        }
      ],
      lastUpdated: new Date().toISOString(),
      totalDeals: 5,
      error: error.message
    })
  }
}
