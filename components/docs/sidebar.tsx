"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  ChevronRight,
  Rocket,
  BookOpen,
  Boxes,
  Terminal,
  Settings,
  Sparkles,
  GitBranch,
  Workflow,
  FileCode,
} from "lucide-react"

export interface NavItem {
  title: string
  href?: string
  items?: NavItem[]
  icon?: React.ReactNode
}

export const navItems: NavItem[] = [
  {
    title: "Getting Started",
    icon: <Rocket className="size-4" />,
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Quick Start", href: "/docs/quickstart" },
      { title: "Installation", href: "/docs/installation" },
    ],
  },
  {
    title: "Examples",
    icon: <FileCode className="size-4" />,
    items: [
      { title: "Hello World", href: "/docs/examples/hello-world" },
      { title: "CI Pipeline", href: "/docs/examples/ci-pipeline" },
      { title: "AI Code Review", href: "/docs/examples/ai-code-review" },
      {
        title: "Slack Notifications",
        href: "/docs/examples/slack-notifications",
      },
    ],
  },
  {
    title: "Core Concepts",
    icon: <BookOpen className="size-4" />,
    items: [
      { title: "Workflows", href: "/docs/concepts/workflows" },
      { title: "Modules", href: "/docs/concepts/modules" },
      { title: "DAG Execution", href: "/docs/concepts/dag" },
      { title: "State Storage", href: "/docs/concepts/state" },
      { title: "Variables", href: "/docs/concepts/variables" },
    ],
  },
  {
    title: "CLI Reference",
    icon: <Terminal className="size-4" />,
    items: [
      { title: "shiro init", href: "/docs/cli/init" },
      { title: "shiro run", href: "/docs/cli/run" },
      { title: "shiro validate", href: "/docs/cli/validate" },
      { title: "shiro data", href: "/docs/cli/data" },
    ],
  },
  {
    title: "Module Library",
    icon: <Boxes className="size-4" />,
    items: [
      { title: "print", href: "/docs/modules/print" },
      { title: "shell", href: "/docs/modules/shell" },
      { title: "slack.notify", href: "/docs/modules/slack" },
      { title: "git.diff", href: "/docs/modules/git" },
      { title: "gitlab", href: "/docs/modules/gitlab" },
      { title: "ai.generate", href: "/docs/modules/ai" },
      { title: "jira-datacenter", href: "/docs/modules/jira-datacenter" },
    ],
  },
  {
    title: "CI/CD Integration",
    icon: <GitBranch className="size-4" />,
    items: [
      { title: "GitLab CI", href: "/docs/cicd/gitlab" },
      { title: "GitHub Actions", href: "/docs/cicd/github" },
      { title: "Human-in-Loop", href: "/docs/cicd/approvals" },
    ],
  },
  {
    title: "AI Features",
    icon: <Sparkles className="size-4" />,
    items: [
      { title: "Configuration", href: "/docs/ai/configuration" },
      { title: "Code Review", href: "/docs/ai/code-review" },
      { title: "Providers", href: "/docs/ai/providers" },
    ],
  },
  {
    title: "Advanced",
    icon: <Settings className="size-4" />,
    items: [
      { title: "Custom Modules", href: "/docs/advanced/custom-modules" },
      { title: "Module Development", href: "/docs/advanced/development" },
      { title: "API Contract", href: "/docs/advanced/api" },
    ],
  },
  {
    title: "Tools",
    icon: <Workflow className="size-4" />,
    items: [
      { title: "Workflow Validator", href: "/tools/validator" },
      { title: "Workflow Preview", href: "/tools/preview" },
    ],
  },
]

function normalizePath(p: string) {
  return p.replace(/\/$/, "") || "/"
}

function NavItemComponent({
  item,
  depth = 0,
}: {
  item: NavItem
  depth?: number
}) {
  const pathname = usePathname()
  const norm = normalizePath(pathname)

  const isActive = (href: string | undefined) =>
    !!href && normalizePath(href) === norm

  const sectionHasActive = (items: NavItem[]): boolean =>
    items.some((sub) => isActive(sub.href))

  const [isOpen, setIsOpen] = React.useState(() =>
    item.items ? sectionHasActive(item.items) : false
  )

  React.useEffect(() => {
    if (item.items && sectionHasActive(item.items)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  if (item.items) {
    const active = sectionHasActive(item.items)
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger
          className={cn(
            "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors mt-4 first:mt-0",
            active
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            {item.icon}
            <span>{item.title}</span>
          </div>
          <ChevronRight
            className={cn(
              "size-3.5 transition-transform duration-200",
              isOpen && "rotate-90"
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-1 space-y-0.5">
            {item.items.map((subItem) => (
              <NavItemComponent
                key={subItem.title}
                item={subItem}
                depth={depth + 1}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  const active = isActive(item.href)

  return (
    <Link
      href={item.href || "#"}
      className={cn(
        "group flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-all border-l-2 pl-[9px]",
        active
          ? "bg-primary/10 text-primary font-medium border-primary"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground border-transparent"
      )}
    >
      {item.title}
    </Link>
  )
}

export function DocsSidebar() {
  return (
    <aside
      className="fixed left-0 top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-[17rem] flex-col border-r lg:flex"
      style={{
        backgroundColor: "hsl(var(--sidebar-bg))",
        borderColor: "hsl(var(--sidebar-border))",
      }}
    >
      <ScrollArea className="flex-1 px-3 py-4">
        <nav>
          {navItems.map((item) => (
            <NavItemComponent key={item.title} item={item} />
          ))}
        </nav>
      </ScrollArea>
    </aside>
  )
}
