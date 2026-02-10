export const metadata = {
  title: 'Duljan AB — AI-Powered Automation',
  description: 'Vi bygger AI-drivna verktyg och automationer som sparar tid och pengar.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body style={{ margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
