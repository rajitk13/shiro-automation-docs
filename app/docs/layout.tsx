import Link from "next/link"
import { DocsSidebar } from "@/components/docs/sidebar"
import { DocsHeader } from "@/components/docs/header"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <DocsHeader />
      <div className="flex flex-1">
        <DocsSidebar />
        <main className="flex-1 min-w-0 lg:pl-[17rem]">
          <div className="docs-content mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
            {children}
          </div>
          <footer className="mx-auto max-w-5xl border-t border-border px-4 py-5 sm:px-6 lg:px-10">
            <div className="flex flex-col items-center gap-3 text-xs text-muted-foreground sm:flex-row sm:justify-between">
              <span>© {new Date().getFullYear()} Shiro Automation</span>
              <div className="flex items-center gap-4">
                <Link
                  href="https://github.com/rajitk13/shiro-automation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  GitHub
                </Link>
                <Link
                  href="https://shiro-automation.rajit.cc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Main Site
                </Link>
                <Link
                  href="https://github.com/rajitk13/shiro-automation/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Changelog
                </Link>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
