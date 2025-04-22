import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import type React from "react"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import { ChatbotWidget } from "@/components/chatbot-widget"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Deep Fake Detection - Protect Yourself from Digital Deception",
  description:
    "Our AI-powered platform detects deep fake images, phishing emails, fake audio, social media misinformation, and malicious URLs to keep you safe online.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          {children}
          <Toaster />
          <ChatbotWidget />
        </ThemeProvider>
      </body>
    </html>
  )
}
