import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Quick Start - Shiro Documentation",
  description: "Add Shiro to GitLab CI or GitHub Actions in 3 steps",
}

function CodeBlock({
  children,
  language = "bash",
  plain = false,
}: {
  children: string
  language?: string
  plain?: boolean
}) {
  if (plain) {
    return (
      <pre className="overflow-x-auto bg-[hsl(var(--code-bg))] p-4 text-sm">
        <code className="text-slate-300 font-mono whitespace-pre">
          {children}
        </code>
      </pre>
    )
  }
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
    <div className="space-y-10">
      {/* Hero */}
      <div className="pb-6 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            CI-First
          </span>
          <span className="text-xs text-muted-foreground">
            GitLab CI · GitHub Actions
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Quick Start</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Shiro runs <strong>inside your existing CI runner</strong> as a Docker
          image. No new infrastructure. No agents. Just add three files and
          push.
        </p>
      </div>

      {/* CI Steps */}
      <div className="space-y-8">
        {/* Step 1 */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              1
            </span>
            Create your workflow file
          </h2>
          <p className="text-muted-foreground text-sm sm:pl-10">
            Save as{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              .shiro/workflows/my-workflow.json
            </code>
          </p>
          <div className="sm:pl-10">
            <CodeBlock language="json">{`{
  "name": "my-workflow",
  "steps": [
    {
      "id": "build",
      "type": "shell",
      "config": { "command": "echo Building..." }
    },
    {
      "id": "test",
      "type": "shell",
      "config": { "command": "echo Running tests..." },
      "depends_on": ["build"]
    }
  ]
}`}</CodeBlock>
          </div>
        </div>

        {/* Step 2 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              2
            </span>
            Add Shiro to your CI
          </h2>

          {/* GitLab */}
          <div className="sm:ml-10 rounded-lg border border-border overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
              <span className="rounded bg-orange-500/15 px-2 py-0.5 text-xs font-semibold text-orange-400">
                GitLab CI
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                .gitlab-ci.yml
              </span>
            </div>
            <CodeBlock language="yaml" plain>{`stages:
  - run

shiro:
  stage: run
  image: ghcr.io/rajitk13/shiro-automation:latest
  variables:
    GITLAB_TOKEN: $GL_TOKEN
  script:
    - shiro run
        -workflow .shiro/workflows/my-workflow.json
        -state-store gitlab
  artifacts:
    paths:
      - .shiro/state/
    expire_in: 1 day`}</CodeBlock>
          </div>

          {/* GitHub Actions */}
          <div className="sm:ml-10 rounded-lg border border-border overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
              <span className="rounded bg-slate-500/15 px-2 py-0.5 text-xs font-semibold text-slate-400">
                GitHub Actions
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                .github/workflows/shiro.yml
              </span>
            </div>
            <CodeBlock language="yaml" plain>{`name: Shiro

on: [push, pull_request]

jobs:
  run:
    runs-on: ubuntu-latest
    container:
      image: ghcr.io/rajitk13/shiro-automation:latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          shiro run \\
            -workflow .shiro/workflows/my-workflow.json \\
            -state-store github
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`}</CodeBlock>
          </div>
        </div>

        {/* Step 3 */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              3
            </span>
            Commit and push
          </h2>
          <div className="sm:pl-10">
            <CodeBlock>{`git add .shiro/ .gitlab-ci.yml   # or .github/
git commit -m "add shiro workflow"
git push`}</CodeBlock>
            <p className="mt-3 text-sm text-muted-foreground">
              Shiro runs automatically on the next pipeline trigger. Check the
              CI job logs for output.
            </p>
          </div>
        </div>
      </div>

      {/* Divider: local dev */}
      <div className="border-t border-border pt-8 space-y-4">
        <h2 className="text-xl font-semibold text-muted-foreground">
          Testing locally?
        </h2>
        <p className="text-sm text-muted-foreground">
          Run the same workflow on your machine before pushing:
        </p>
        <CodeBlock>{`# Via Docker (mirrors CI exactly)
docker run --rm -v $(pwd):/workspace -w /workspace \\
  ghcr.io/rajitk13/shiro-automation:latest \\
  shiro run -workflow .shiro/workflows/my-workflow.json

# Or install the binary
curl -sSL https://raw.githubusercontent.com/rajitk13/shiro-automation/master/scripts/install-auto.sh | bash
shiro run -workflow .shiro/workflows/my-workflow.json`}</CodeBlock>
      </div>

      {/* What's next */}
      <div className="rounded-lg border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-6">
        <h2 className="text-xl font-semibold mb-4">What&apos;s Next?</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/docs/examples/ai-code-review" className="group">
            <div className="rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50">
              <h3 className="font-semibold mb-1 group-hover:text-primary text-sm">
                AI Code Review Example
              </h3>
              <p className="text-xs text-muted-foreground">
                Full GitLab + GitHub example with AI review and Slack notify
              </p>
            </div>
          </Link>
          <Link href="/docs/cicd/gitlab" className="group">
            <div className="rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50">
              <h3 className="font-semibold mb-1 group-hover:text-primary text-sm">
                CI/CD Integration Guide
              </h3>
              <p className="text-xs text-muted-foreground">
                Advanced GitLab CI and GitHub Actions patterns
              </p>
            </div>
          </Link>
          <Link href="/docs/concepts/workflows" className="group">
            <div className="rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50">
              <h3 className="font-semibold mb-1 group-hover:text-primary text-sm">
                Workflow Reference
              </h3>
              <p className="text-xs text-muted-foreground">
                Steps, dependencies, inputs, state and variables
              </p>
            </div>
          </Link>
          <Link href="/docs/modules/shell" className="group">
            <div className="rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50">
              <h3 className="font-semibold mb-1 group-hover:text-primary text-sm">
                Module Library
              </h3>
              <p className="text-xs text-muted-foreground">
                shell, slack, git, gitlab, ai.generate and more
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
