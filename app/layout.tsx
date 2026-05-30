import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const BASE_URL = "https://shiro-docs.rajit.cc"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Shiro Automation - Documentation",
    template: "%s | Shiro Docs",
  },
  description:
    "AI-Native CI Workflow Runtime. Portable workflow orchestration for CI/CD environments.",
  keywords: [
    "shiro",
    "automation",
    "CI/CD",
    "workflow",
    "AI",
    "GitLab",
    "GitHub",
    "documentation",
  ],
  authors: [{ name: "Shiro Automation" }],
  creator: "Shiro Automation",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Shiro Automation Docs",
    title: "Shiro Automation - Documentation",
    description:
      "AI-Native CI Workflow Runtime. Portable workflow orchestration for CI/CD environments.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Shiro Automation",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Shiro Automation - Documentation",
    description:
      "AI-Native CI Workflow Runtime. Portable workflow orchestration for CI/CD environments.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/icon.png",
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('shiro-theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
