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
        <h2 className="text-2xl font-semibold">Official GitHub Action</h2>
        <p className="text-muted-foreground">
          Use the official Shiro GitHub Action — no manual install needed:
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

      - name: Run Shiro Workflow
        uses: rajitk13/shiro-automation@master
        env:
          GITHUB_TOKEN: ${"{{ secrets.GITHUB_TOKEN }}"}`}</CodeBlock>

        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-base font-semibold mb-3">Action Inputs</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left font-semibold">Input</th>
                <th className="py-2 text-left font-semibold">Default</th>
                <th className="py-2 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                [
                  "workflow",
                  ".shiro/workflow.json",
                  "Path to workflow JSON file",
                ],
                ["config", ".shiro/config.yaml", "Path to config YAML file"],
                ["shiro-dir", ".shiro", "Path to .shiro directory"],
                [
                  "state-store",
                  "memory",
                  "State storage backend (memory, filesystem)",
                ],
                ["fresh", "false", "Start fresh, ignore existing state"],
                [
                  "dry-run",
                  "false",
                  "Dry-run mode, validate without executing",
                ],
              ].map(([input, def, desc]) => (
                <tr key={input} className="border-b border-border/50">
                  <td className="py-2 px-4 font-mono text-accent">{input}</td>
                  <td className="py-2 px-4 font-mono text-xs">{def}</td>
                  <td className="py-2 px-4">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">AI PR Review</h2>
        <p className="text-muted-foreground">
          Automatically review pull requests with AI using{" "}
          <code className="text-accent">get_diff</code> and the GitHub Action:
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

      - name: Run AI Review
        uses: rajitk13/shiro-automation@master
        with:
          workflow: .shiro/workflows/code-review.json
        env:
          GITHUB_TOKEN: ${"{{ secrets.GITHUB_TOKEN }}"}
          OPENAI_API_KEY: ${"{{ secrets.OPENAI_API_KEY }}"}`}</CodeBlock>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Manual Install (Advanced)</h2>
        <p className="text-muted-foreground">
          If you need more control, install Shiro manually with architecture
          detection:
        </p>
        <CodeBlock>{`- name: Install Shiro
  run: |
    ARCH=$(uname -m)
    [ "$ARCH" = "x86_64" ] && ARCH="amd64"
    [ "$ARCH" = "aarch64" ] && ARCH="arm64"
    OS=$(uname -s | tr '[:upper:]' '[:lower:]')
    curl -LO "https://github.com/rajitk13/shiro-automation/releases/latest/download/shiro-\${OS}-\${ARCH}"
    chmod +x "shiro-\${OS}-\${ARCH}"
    sudo mv "shiro-\${OS}-\${ARCH}" /usr/local/bin/shiro

- name: Run Workflow
  env:
    GITHUB_TOKEN: ${"{{ secrets.GITHUB_TOKEN }}"}
  run: shiro run`}</CodeBlock>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">With State Storage</h2>
        <p className="text-muted-foreground">
          Use filesystem state store with artifacts:
        </p>
        <CodeBlock>{`- name: Run Shiro Workflow
  uses: rajitk13/shiro-automation@master
  with:
    state-store: filesystem
  env:
    GITHUB_TOKEN: ${"{{ secrets.GITHUB_TOKEN }}"}

- name: Upload State
  uses: actions/upload-artifact@v4
  with:
    name: workflow-state
    path: .shiro/state/`}</CodeBlock>
      </div>

      {/* GitHub module reference */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">GitHub Module Reference</h2>
        <p className="text-muted-foreground">
          The built-in <code className="text-accent">github</code> module
          supports three operations, all resolved from environment variables
          automatically.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left font-semibold pr-4 w-48">
                  Operation
                </th>
                <th className="py-2 text-left font-semibold pr-4">
                  Required config fields
                </th>
                <th className="py-2 text-left font-semibold">Output</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground text-xs">
              {[
                ["get_diff", "none", "diff (string)"],
                ["post_comment", "body (string)", "success, message"],
                [
                  "post_inline_comments",
                  "body or comments, output_format, dedup",
                  "success, posted_count, skipped_count",
                ],
              ].map(([op, config, output]) => (
                <tr key={op} className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code className="text-primary">{op}</code>
                  </td>
                  <td className="py-3 px-4">{config}</td>
                  <td className="py-3 px-4">{output}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 space-y-2">
          <p className="font-semibold text-sm">
            Required environment variables (all operations)
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-muted-foreground">
              <tbody>
                {[
                  [
                    "GITHUB_TOKEN",
                    "GitHub token with repo and pull-requests write scope",
                  ],
                  ["GITHUB_REPOSITORY_OWNER", "Repository owner"],
                  ["GITHUB_REPOSITORY", "Full repository name (owner/repo)"],
                  ["GITHUB_PR_NUMBER", "Pull request number (post operations)"],
                  [
                    "GITHUB_SHA",
                    "Commit SHA — required for post_inline_comments",
                  ],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b border-border/50">
                    <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">
                      {k}
                    </td>
                    <td className="py-2 px-4">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* post_inline_comments config */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">post_inline_comments Config</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left font-semibold pr-4 w-40">
                  Field
                </th>
                <th className="py-2 text-left font-semibold pr-4 w-20">
                  Required
                </th>
                <th className="py-2 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground text-xs">
              {[
                [
                  "output_format",
                  "No",
                  "text (default) or json. Controls how comments are parsed from the AI output.",
                ],
                [
                  "body",
                  "text mode",
                  "Raw AI text output. Shiro parses file:line - comment patterns.",
                ],
                [
                  "comments",
                  "json mode",
                  "JSON array of {file, line, comment} objects from {{steps.STEP_ID.json}}.",
                ],
                [
                  "dedup",
                  "No",
                  "Boolean. Default true. Skips comments already posted on the PR.",
                ],
                [
                  "commit_id",
                  "No",
                  "Override commit SHA. Defaults to GITHUB_SHA env var.",
                ],
              ].map(([field, req, desc]) => (
                <tr key={field} className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code className="text-primary">{field}</code>
                  </td>
                  <td className="py-3 px-4">{req}</td>
                  <td className="py-3 px-4">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
