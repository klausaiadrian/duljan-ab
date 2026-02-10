import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const X_REPORTS_DIR = '/Users/duljan/.openclaw/workspace/projects/x_reports'

export async function GET() {
  try {
    // List all report files
    const files = await fs.readdir(X_REPORTS_DIR)
    const reportFiles = files
      .filter(f => f.startsWith('report_') && f.endsWith('.md'))
      .sort()
      .reverse()
    
    if (reportFiles.length === 0) {
      return NextResponse.json({
        reports: [],
        latest: null,
        message: 'No X/Twitter reports found'
      })
    }
    
    // Read the latest report
    const latestFile = reportFiles[0]
    const latestPath = path.join(X_REPORTS_DIR, latestFile)
    const latestContent = await fs.readFile(latestPath, 'utf-8')
    
    // Parse the report
    const lines = latestContent.split('\n')
    const dateMatch = latestFile.match(/report_(\d{4})(\d{2})(\d{2})\.md/)
    const reportDate = dateMatch 
      ? `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`
      : latestFile
    
    // Extract stats and mentions
    const stats = {
      accountsScanned: 0,
      newTweets: 0,
      mentions: []
    }
    
    for (const line of lines) {
      const accountsMatch = line.match(/(\d+)\s+konton/i) || line.match(/(\d+)\s+accounts/i)
      if (accountsMatch) {
        stats.accountsScanned = parseInt(accountsMatch[1])
      }
      
      const tweetsMatch = line.match(/(\d+)\s+nya/i) || line.match(/(\d+)\s+new/i)
      if (tweetsMatch) {
        stats.newTweets = parseInt(tweetsMatch[1])
      }
    }
    
    return NextResponse.json({
      reports: reportFiles.map(f => ({
        filename: f,
        date: f.match(/report_(\d{4})(\d{2})(\d{2})\.md/) 
          ? `${f.match(/report_(\d{4})(\d{2})(\d{2})\.md/)[1]}-${f.match(/report_(\d{4})(\d{2})(\d{2})\.md/)[2]}-${f.match(/report_(\d{4})(\d{2})(\d{2})\.md/)[3]}`
          : f
      })),
      latest: {
        date: reportDate,
        filename: latestFile,
        content: latestContent,
        stats,
        raw: lines
      },
      totalReports: reportFiles.length
    })
  } catch (error) {
    return NextResponse.json(
      { 
        reports: [],
        latest: null,
        error: error.message 
      },
      { status: 500 }
    )
  }
}