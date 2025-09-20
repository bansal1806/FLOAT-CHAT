import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FloatChat - AI-Powered Ocean Data Discovery',
  description: 'Revolutionary AI-powered conversational interface for ARGO ocean data discovery and visualization. Explore ocean data through natural language, AR/VR, and advanced analytics.',
  keywords: 'ocean data, ARGO floats, AI, AR/VR, oceanography, climate science, data visualization',
  authors: [{ name: 'FloatChat Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'FloatChat - AI-Powered Ocean Data Discovery',
    description: 'Revolutionary ocean data platform with AI, AR/VR, and real-time analytics',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FloatChat - AI-Powered Ocean Data Discovery',
    description: 'Revolutionary ocean data platform with AI, AR/VR, and real-time analytics',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.className} bg-gradient-deep min-h-screen`}>
        <div className="relative min-h-screen">
          {/* Background ocean particles */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-ocean-400 rounded-full floating-particle opacity-60"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-ocean-300 rounded-full floating-particle opacity-40" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-ocean-500 rounded-full floating-particle opacity-50" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-ocean-400 rounded-full floating-particle opacity-60" style={{animationDelay: '3s'}}></div>
          </div>
          
          {/* Main content */}
          <main className="relative z-10">
            {children}
          </main>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid #0ea5e9',
              },
            }}
          />
        </div>
      </body>
    </html>
  )
}
