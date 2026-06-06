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
        <h2 className="text-2xl font-semibold">
          AI PR Review with Inline Comments
        </h2>
        <p className="text-muted-foreground">
          Automatically review pull requests with AI and post inline comments:
        </p>
        <CodeBlock>{`.github/workflows/ai-review.yml

name: AI PR Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

jobs:
  ai-review:
    runs-on: ubuntu-latest
    container:
      image: ghcr.io/rajitk13/shiro-automation:latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Run AI Review
        env:
          GITHUB_TOKEN: ${"{{ secrets.GITHUB_TOKEN }}"}
          GEMINI_API_KEY: ${"{{ secrets.GEMINI_API_KEY }}"}
          GITHUB_REPOSITORY: ${"{{ github.repository }}"}
          GITHUB_REPOSITORY_OWNER: ${"{{ github.repository_owner }}"}
          GITHUB_PR_NUMBER: ${"{{ github.event.pull_request.number }}"}
          GITHUB_SHA: ${"{{ github.sha }}"}
        run: shiro run`}</CodeBlock>
        <p className="text-muted-foreground mt-4">
          The workflow uses the built-in{" "}
          <code className="text-accent">github</code> module which includes:
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
          <li>
            <code className="text-accent">get_diff</code> - Fetch PR diff via
            GitHub API
          </li>
          <li>
            <code className="text-accent">post_comment</code> - Post general PR
            comments
          </li>
          <li>
            <code className="text-accent">post_inline_comments</code> - Post
            line-by-line review comments
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Example Workflow</h2>
        <p className="text-muted-foreground">
          Example <code className="text-accent">.shiro/workflow.json</code> for
          AI code review:
        </p>
        <CodeBlock language="json">{`{
  "name": "github-code-review",
  "description": "AI-powered GitHub PR code review",
  "steps": [
    {
      "id": "get-diff",
      "type": "github",
      "config": {
        "operation": "get_diff"
      }
    },
    {
      "id": "ai-review",
      "type": "ai.generate",
      "depends_on": ["get-diff"],
      "config": {
        "prompt": "Review this code diff:\\n\\n{{steps.get-diff.diff}}\\n\\nProvide free text comments with file path and line number for each issue found in format: 'path/to/file.go:42 - issue description'"
      }
    },
    {
      "id": "post-inline-comments",
      "type": "github",
      "depends_on": ["ai-review"],
      "config": {
        "operation": "post_inline_comments",
        "body": "{{steps.ai-review.content}}",
        "output_format": "text",
        "dedup": true
      }
    }
  ]
}`}</CodeBlock>
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
