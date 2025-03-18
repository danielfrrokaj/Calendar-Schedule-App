import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata = {
  title: 'Course Schedule Calendar Generator',
  description: 'Generate ICS files from your course schedule',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-primary-dark min-h-screen text-primary-light`}>
        {children}
      </body>
    </html>
  )
}
