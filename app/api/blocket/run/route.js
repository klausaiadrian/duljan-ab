import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

const BLOCKET_DIR = '/Users/duljan/.openclaw/workspace/projects/blocket'
const BLOCKET_SCRIPT = path.join(BLOCKET_DIR, 'blocket_pro.py')

export async function POST() {
  try {
    // Run the blocket scraper with timeout
    const { stdout, stderr } = await execAsync(
      `cd ${BLOCKET_DIR} && python3 ${BLOCKET_SCRIPT}`,
      { timeout: 120000, maxBuffer: 1024 * 1024 } // 2 min timeout, 1MB buffer
    )
    
    return NextResponse.json({
      success: true,
      message: 'Blocket scraper completed',
      output: stdout,
      errors: stderr || null,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    // Even if there's an error, the scraper might have produced results
    return NextResponse.json({
      success: error.killed ? false : true,
      message: error.killed ? 'Scraper timed out (2 min limit)' : 'Scraper completed with warnings',
      error: error.message,
      killed: error.killed || false,
      timestamp: new Date().toISOString()
    }, { status: error.killed ? 504 : 200 })
  }
}