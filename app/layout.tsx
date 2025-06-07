import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'College Finder',
  description: 'Created by Anshika',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
