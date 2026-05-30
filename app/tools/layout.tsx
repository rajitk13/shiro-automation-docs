import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Shiro"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-bold text-lg">Shiro</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/docs"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Documentation
            </Link>
            <Link
              href="/tools/validator"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Tools
            </Link>
            <Button size="sm" asChild>
              <Link href="/docs/quickstart">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-8">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-auto">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Shiro"
                width={24}
                height={24}
                className="rounded"
              />
              <span className="text-sm font-medium">Shiro Automation</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Shiro Automation. Open source on{" "}
              <Link
                href="https://github.com/rajitk13/shiro-automation"
                className="text-primary hover:underline"
                target="_blank"
              >
                GitHub
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
