import { Metadata } from "next"

export const metadata: Metadata = {
  title: "GitHub Actions - Shiro Documentation",
  description: "Integrate Shiro with GitHub Actions",
}

function CodeBlock({
  children,
  language = "yaml",
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
        <code className="text-slate-300 font-mono whitespace-pre">
          {children}
        </code>
      </pre>
    </div>
  )
}

export default function GitHubActionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-primary font-medium mb-2">
          CI/CD Integration
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          GitHub Actions
        </h1>
        <p className="text-xl text-muted-foreground">
          Run Shiro workflows in GitHub Actions for PR reviews, deployments, and
          automation.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic Setup</h2>
        <p className="text-muted-foreground">
          Create a workflow file in{" "}
          <code className="text-accent">.github/workflows/</code>:
        </p>
        <CodeBlock>{`.github/workflows/shiro.yml

name: Shiro Workflow

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  run-workflow:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install Shiro
        run: |
          curl -LO https://github.com/rajitk13/shiro-automation/releases/latest/download/shiro-linux-amd64
          chmod +x shiro-linux-amd64
          sudo mv shiro-linux-amd64 /usr/local/bin/shiro

      - name: Run Workflow
        env:
          GITHUB_TOKEN: ${"{{ secrets.GITHUB_TOKEN }}"}
        run: shiro run`}</CodeBlock>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">AI PR Review</h2>
        <p className="text-muted-foreground">
          Automatically review pull requests with AI:
        </p>
        <CodeBlock>{`.github/workflows/ai-review.yml

name: AI PR Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install Shiro
        run: |
          curl -LO https://github.com/rajitk13/shiro-automation/releases/latest/download/shiro-linux-amd64
          chmod +x shiro-linux-amd64
          sudo mv shiro-linux-amd64 /usr/local/bin/shiro

      - name: Run AI Review
        env:
          GITHUB_TOKEN: ${"{{ secrets.GITHUB_TOKEN }}"}
          OPENAI_API_KEY: ${"{{ secrets.OPENAI_API_KEY }}"}
          SLACK_WEBHOOK_URL: ${"{{ secrets.SLACK_WEBHOOK_URL }}"}
        run: shiro run -workflow .shiro/workflows/code-review.json`}</CodeBlock>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">With State Storage</h2>
        <p className="text-muted-foreground">
          Use filesystem state store with artifacts:
        </p>
        <CodeBlock>{`- name: Run Workflow
  run: shiro run -state-store filesystem

- name: Upload State
  uses: actions/upload-artifact@v4
  with:
    name: workflow-state
    path: .shiro/state/`}</CodeBlock>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-2">GitHub vs GitLab State</h2>
        <p className="text-muted-foreground">
          Note: The <code className="text-accent">gitlab</code> state store is
          GitLab-specific. For GitHub Actions, use{" "}
          <code className="text-accent">filesystem</code> with artifacts or{" "}
          <code className="text-accent">memory</code> for ephemeral workflows.
        </p>
      </div>
    </div>
  )
}
