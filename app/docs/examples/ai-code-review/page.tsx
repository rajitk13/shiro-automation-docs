import { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Code Review - Shiro Examples",
  description: "Automated AI-powered code review with Shiro",
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
        <code className="text-slate-300 font-mono whitespace-pre">
          {children}
        </code>
      </pre>
    </div>
  )
}

export default function AICodeReviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm font-medium text-primary mb-2">Examples</div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          AI Code Review
        </h1>
        <p className="text-xl text-muted-foreground">
          Drop Shiro into your pipeline as a CI image and get AI-powered code
          review on every merge request — no extra infra needed.
        </p>
      </div>

      {/* Step 1 */}
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold">1. Workflow file</h2>
        <p className="text-sm text-muted-foreground">
          Save as{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono">
            .shiro/workflows/code-review.json
          </code>
        </p>
        <CodeBlock language="json">{`{
  "name": "code-review",
  "steps": [
    {
      "id": "get_diff",
      "type": "git.diff",
      "config": {
        "base": "{{env.CI_MERGE_REQUEST_TARGET_BRANCH_NAME}}",
        "head": "{{env.CI_COMMIT_SHA}}"
      }
    },
    {
      "id": "review",
      "type": "ai.generate",
      "config": {
        "prompt": "You are a senior engineer. Review this diff for bugs, security issues, and style problems. Be concise.\\n\\nDiff:\\n{{steps.get_diff.stdout}}",
        "model": "reviewer"
      },
      "depends_on": ["get_diff"]
    },
    {
      "id": "notify",
      "type": "slack.notify",
      "config": {
        "webhook_url": "{{env.SLACK_WEBHOOK_URL}}",
        "message": "AI Review for *{{env.CI_COMMIT_REF_NAME}}*:\\n{{steps.review.output}}"
      },
      "depends_on": ["review"]
    }
  ]
}`}</CodeBlock>
      </div>

      {/* Step 2 */}
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold">2. AI config</h2>
        <p className="text-sm text-muted-foreground">
          Save as{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono">
            .shiro/config.yaml
          </code>
        </p>
        <CodeBlock language="yaml">{`models:
  - name: reviewer
    provider: openai
    model: gpt-4o-mini
    base_url: https://api.openai.com/v1
    api_key: "{{env.OPENAI_API_KEY}}"
    default: true`}</CodeBlock>
      </div>

      {/* Step 3 — split by CI platform */}
      <div className="space-y-5">
        <h2 className="text-2xl font-semibold">3. Add to your CI</h2>

        {/* GitLab */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
            <span className="rounded bg-orange-500/15 px-2 py-0.5 text-xs font-semibold text-orange-400">
              GitLab CI
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              .gitlab-ci.yml
            </span>
          </div>
          <CodeBlock language="yaml" plain>{`stages:
  - review

code-review:
  stage: review
  image: ghcr.io/rajitk13/shiro-automation:latest
  variables:
    GITLAB_TOKEN: $GL_TOKEN
  script:
    - cat .shiro/workflows/code-review.json
    - shiro run
        -workflow .shiro/workflows/code-review.json
        -config .shiro/config.yaml
        -state-store gitlab
  artifacts:
    paths:
      - .shiro/state/
    expire_in: 1 day
  only:
    - merge_requests`}</CodeBlock>
        </div>

        {/* GitHub Actions */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
            <span className="rounded bg-slate-500/15 px-2 py-0.5 text-xs font-semibold text-slate-400">
              GitHub Actions
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              .github/workflows/code-review.yml
            </span>
          </div>
          <CodeBlock language="yaml" plain>{`name: AI Code Review

on:
  pull_request:

jobs:
  review:
    runs-on: ubuntu-latest
    container:
      image: ghcr.io/rajitk13/shiro-automation:latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Shiro review
        env:
          OPENAI_API_KEY: \${{ secrets.OPENAI_API_KEY }}
          SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK_URL }}
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: |
          shiro run \\
            -workflow .shiro/workflows/code-review.json \\
            -config .shiro/config.yaml \\
            -state-store github

      - uses: actions/upload-artifact@v4
        with:
          name: shiro-state
          path: .shiro/state/`}</CodeBlock>
        </div>
      </div>

      {/* Ollama callout */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-3">
        <p className="font-semibold text-sm">Using Ollama instead of OpenAI</p>
        <p className="text-sm text-muted-foreground">
          Swap the model config — no API key needed:
        </p>
        <CodeBlock language="yaml">{`models:
  - name: reviewer
    provider: ollama
    model: llama3
    base_url: http://localhost:11434
    default: true`}</CodeBlock>
      </div>
    </div>
  )
}
