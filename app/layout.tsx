import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const mont = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pencil',
  description: 'Collaborative drawing app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={mont.className}>{children}</body>
    </html>
  )
}
