import { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  Zap,
  Boxes,
  Sparkles,
  Terminal,
  GitBranch,
  BookOpen,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Introduction - Shiro Documentation",
  description:
    "Get started with Shiro Automation - AI-Native CI Workflow Runtime",
}

export default function DocsPage() {
  return (
    <div className="space-y-10">
      {/* Welcome header */}
      <div className="pb-6 border-b border-border">
        <div className="text-sm font-medium text-primary mb-3">
          Shiro Automation v1.0
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Welcome to Shiro Docs
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Shiro is a portable, zero-infrastructure workflow runtime for CI/CD
          environments with AI-native capabilities. Single binary. No servers.
          Runs inside your existing CI.
        </p>
      </div>

      {/* Quick nav cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/docs/quickstart"
          className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/50 hover:bg-card/80"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="size-4 text-primary" />
            <span className="font-semibold text-sm">Quick Start</span>
            <ArrowRight className="size-3 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
          </div>
          <p className="text-xs text-muted-foreground">
            Install Shiro and run your first workflow in 5 minutes
          </p>
        </Link>
        <Link
          href="/docs/concepts/workflows"
          className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/50 hover:bg-card/80"
        >
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="size-4 text-primary" />
            <span className="font-semibold text-sm">Core Concepts</span>
            <ArrowRight className="size-3 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
          </div>
          <p className="text-xs text-muted-foreground">
            Learn workflows, DAG execution, modules and state storage
          </p>
        </Link>
        <Link
          href="/docs/cli/run"
          className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/50 hover:bg-card/80"
        >
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="size-4 text-primary" />
            <span className="font-semibold text-sm">CLI Reference</span>
            <ArrowRight className="size-3 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
          </div>
          <p className="text-xs text-muted-foreground">
            Full reference for shiro init, run, validate, and data
          </p>
        </Link>
        <Link
          href="/docs/modules/print"
          className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/50 hover:bg-card/80"
        >
          <div className="flex items-center gap-2 mb-2">
            <Boxes className="size-4 text-primary" />
            <span className="font-semibold text-sm">Module Library</span>
            <ArrowRight className="size-3 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
          </div>
          <p className="text-xs text-muted-foreground">
            Built-in modules: print, shell, slack, git, gitlab, ai
          </p>
        </Link>
        <Link
          href="/docs/cicd/gitlab"
          className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/50 hover:bg-card/80"
        >
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="size-4 text-primary" />
            <span className="font-semibold text-sm">CI/CD Integration</span>
            <ArrowRight className="size-3 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
          </div>
          <p className="text-xs text-muted-foreground">
            GitLab CI, GitHub Actions and human-in-loop approvals
          </p>
        </Link>
        <Link
          href="/tools/validator"
          className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/50 hover:bg-card/80"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="size-4 text-primary" />
            <span className="font-semibold text-sm">Workflow Validator</span>
            <ArrowRight className="size-3 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
          </div>
          <p className="text-xs text-muted-foreground">
            Interactive browser-based workflow JSON validator
          </p>
        </Link>
      </div>

      {/* What is Shiro */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">What is Shiro?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Shiro is a production-ready Go-based workflow runtime designed to run
          inside existing CI runners (GitLab, Jenkins, GitHub Actions,
          Kubernetes Jobs). It executes ephemeral workflows with DAG-based
          scheduling, supports reusable modules and integrations, and enables
          AI-assisted workflows with multiple provider support including Ollama,
          OpenAI, and custom endpoints.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Key Features</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>
              <strong>Simplified CLI</strong> — Intuitive commands with
              auto-detection (shiro init, shiro run, shiro add module)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>
              <strong>Portable Runtime</strong> — Single binary that runs in any
              CI environment
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>
              <strong>DAG Execution</strong> — Topological sorting with
              dependency management
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>
              <strong>Module System</strong> — Pluggable architecture with
              GitHub marketplace integration
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>
              <strong>Auto-Discovery</strong> — Search and install modules from
              official GitHub repository
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>
              <strong>AI Providers</strong> — Support for Ollama, OpenAI, and
              custom endpoints
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>
              <strong>State Storage</strong> — Modular backends (GitLab
              artifacts, filesystem, memory)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>
              <strong>Human-in-Loop</strong> — GitLab-native manual approval
              workflows with Slack notifications
            </span>
          </li>
        </ul>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-2">Quick Start</h2>
        <p className="text-muted-foreground mb-4">
          Get up and running with Shiro in under 5 minutes.
        </p>
        <Link
          href="/docs/quickstart"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Get Started
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Architecture Overview
        </h2>
        <pre className="rounded-lg bg-[hsl(var(--code-bg))] border border-border p-4 overflow-x-auto">
          <code className="text-sm text-slate-300 font-mono">
            {`Trigger Adapters (GitLab/Jenkins/GitHub)
              ↓
      Workflow Runtime (Go)
              ↓
         DAG Executor
              ↓
      Module/Plugin System
              ↓
    AI / Integrations / Compute`}
          </code>
        </pre>
      </div>
    </div>
  )
}
