import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Quick Start - Shiro Documentation",
  description: "Get started with Shiro Automation in under 5 minutes",
}

function CodeBlock({
  children,
  language = "bash",
}: {
  children: string
  language?: string
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-[hsl(var(--code-bg))]">
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2">
        <span className="text-xs text-muted-foreground">{language}</span>
      </div>
      <pre className="overflow-x-auto p-4 text-sm">
        <code className="text-slate-300 font-mono">{children}</code>
      </pre>
    </div>
  )
}

export default function QuickstartPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Quick Start</h1>
        <p className="text-xl text-muted-foreground">
          Get up and running with Shiro in under 5 minutes.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              1
            </span>
            Install Shiro
          </h2>
          <p className="text-muted-foreground">
            Download and install Shiro using the auto-detect script, or download
            a pre-built binary.
          </p>
          <CodeBlock>{`# Auto-detect and install (Recommended)
curl -sSL https://raw.githubusercontent.com/rajitk13/shiro-automation/master/scripts/install-auto.sh | bash

# Or download manually for your platform
curl -LO https://github.com/rajitk13/shiro-automation/releases/latest/download/shiro-darwin-arm64
chmod +x shiro-darwin-arm64
sudo mv shiro-darwin-arm64 /usr/local/bin/shiro`}</CodeBlock>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              2
            </span>
            Initialize Your Project
          </h2>
          <p className="text-muted-foreground">
            Run shiro init to create the .shiro folder structure with example
            workflows.
          </p>
          <CodeBlock>{`# Navigate to your project
cd your-project

# Initialize Shiro
shiro init

# Output:
# ✓ Created .shiro/workflow.json
# ✓ Created .shiro/config.yaml
# ✓ Initialized module registry
# ✓ Updated .gitignore`}</CodeBlock>
          <p className="text-sm text-muted-foreground">This creates:</p>
          <CodeBlock language="text">{`.shiro/
├── workflow.json          # Your workflow definition
├── config.yaml           # AI model configuration
├── modules/
│   └── registry.yaml     # Module registry
└── workflows/            # Additional workflows`}</CodeBlock>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              3
            </span>
            Run Your First Workflow
          </h2>
          <p className="text-muted-foreground">
            shiro run auto-detects .shiro/workflow.json and executes it.
          </p>
          <CodeBlock>{`# Run the default workflow
shiro run

# Output:
# [Shiro] Loaded workflow: example-workflow
# [Shiro] Starting workflow: example-workflow
# [Shiro] Step step1 completed: true
# === Workflow Results ===
# Step: step1
#   Success: true
#   Output: { "level": "info", "message": "Hello from Shiro!" }`}</CodeBlock>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              4
            </span>
            Add a Module
          </h2>
          <p className="text-muted-foreground">
            Extend Shiro with modules from the GitHub marketplace.
          </p>
          <CodeBlock>{`# Search for modules
shiro search module slack

# Add a module
shiro add module slack

# Or add from GitHub URL
shiro add module github.com/user/custom-module`}</CodeBlock>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-6">
        <h2 className="text-xl font-semibold mb-2">What&apos;s Next?</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/docs/concepts/workflows" className="group">
            <div className="rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50">
              <h3 className="font-semibold mb-1 group-hover:text-primary">
                Learn Workflows
              </h3>
              <p className="text-sm text-muted-foreground">
                Understand workflow structure and configuration
              </p>
            </div>
          </Link>
          <Link href="/docs/modules/print" className="group">
            <div className="rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50">
              <h3 className="font-semibold mb-1 group-hover:text-primary">
                Explore Modules
              </h3>
              <p className="text-sm text-muted-foreground">
                Discover built-in and external modules
              </p>
            </div>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Example Workflow</h2>
        <p className="text-muted-foreground">
          Here&apos;s a simple workflow that prints messages:
        </p>
        <CodeBlock language="json">{`{
  "name": "hello-world",
  "steps": [
    {
      "id": "greeting",
      "type": "print",
      "config": {
        "message": "Hello from Shiro!",
        "level": "info"
      }
    },
    {
      "id": "status",
      "type": "print",
      "config": {
        "message": "Workflow completed successfully",
        "level": "info"
      },
      "depends_on": ["greeting"]
    }
  ]
}`}</CodeBlock>
      </div>
    </div>
  )
}
