"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, Sun, Moon } from "lucide-react"
import { navItems, NavItem } from "./sidebar"
import { useTheme } from "@/components/ThemeProvider"

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false)
  }, [pathname])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="size-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-72 bg-background p-0 flex flex-col"
      >
        <div className="flex h-14 shrink-0 items-center border-b border-border px-4">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/logo.png"
              alt="Shiro"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-semibold">Shiro</span>
          </Link>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto py-4 px-3">
          <nav className="space-y-4">
            {navItems.map((section: NavItem) => (
              <div key={section.title}>
                <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </h4>
                <div className="space-y-1">
                  {section.items?.map((item: NavItem) => (
                    <Link
                      key={item.href}
                      href={item.href || "#"}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                        pathname.replace(/\/$/, "") ===
                          (item.href || "").replace(/\/$/, "")
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-card hover:text-foreground"
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-foreground"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  )
}

export function DocsHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="flex h-14 items-center px-4 lg:px-6">
        <MobileNav />
        <div className="flex flex-1 items-center justify-between gap-4">
          <Link href="/docs" className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="Shiro"
              width={26}
              height={26}
              className="rounded-md"
            />
            <span className="font-semibold text-sm tracking-tight">Shiro</span>
            <span className="hidden text-xs font-medium text-muted-foreground lg:inline px-1.5 py-0.5 rounded bg-muted">
              docs
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground hidden sm:flex"
            >
              <Search className="size-4" />
              <span className="sr-only">Search</span>
            </Button>
            <ThemeToggle />
            <Link
              href="https://github.com/rajitk13/shiro-automation"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <GitHubIcon className="size-4" />
                <span className="sr-only">GitHub</span>
              </Button>
            </Link>
            <Link
              href="https://shiro-automation.rajit.cc"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors ml-1"
            >
              shiro-automation.rajit.cc ↗
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
