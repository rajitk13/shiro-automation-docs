import { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Code Review - Shiro Documentation",
  description: "Automate code reviews using AI in Shiro workflows",
}

function CodeBlock({
  children,
  language = "json",
}: {
  children: string
  language?: string
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-[hsl(var(--code-bg))]">
      <div className="flex items-center border-b border-border/50 px-4 py-2">
        <span className="text-xs text-muted-foreground font-mono">
          {language}
        </span>
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
    <div className="space-y-10">
      <div>
        <div className="text-sm font-medium text-primary mb-2">AI Features</div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          AI Code Review
        </h1>
        <p className="text-xl text-muted-foreground">
          Chain <code>git.diff</code> and <code>ai.generate</code> to produce
          automated code reviews on every merge request or push — and optionally
          post results to Slack, Jira, or GitLab.
        </p>
      </div>

      {/* How it works */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">How It Works</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Fetch the diff",
              desc: "git.diff reads the changes between branches or commits.",
            },
            {
              step: "2",
              title: "Generate review",
              desc: "ai.generate sends the diff to your configured model with a review prompt.",
            },
            {
              step: "3",
              title: "Act on results",
              desc: "Post to Slack, create a Jira ticket, or comment on a GitLab MR.",
            },
          ].map(({ step, title, desc }) => (
            <div
              key={step}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="text-2xl font-bold text-primary mb-2">{step}</div>
              <div className="font-medium mb-1">{title}</div>
              <div className="text-sm text-muted-foreground">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Basic example */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic Code Review Workflow</h2>
        <CodeBlock language="json">{`{
  "name": "ai-code-review",
  "steps": [
    {
      "id": "get_diff",
      "type": "git.diff",
      "config": {
        "operation": "diff",
        "base_branch": "main"
      }
    },
    {
      "id": "review",
      "type": "ai.generate",
      "config": {
        "model": "gpt-4o",
        "system": "You are a senior software engineer. Review the following git diff for bugs, security issues, and style problems. Be concise.",
        "prompt": "Review this diff:\\n\\n{{steps.get_diff.output.diff}}",
        "temperature": 0.2,
        "max_tokens": 1024
      },
      "depends_on": ["get_diff"]
    },
    {
      "id": "print_review",
      "type": "print",
      "config": {
        "message": "AI Review:\\n{{steps.review.output.content}}"
      },
      "depends_on": ["review"]
    }
  ]
}`}</CodeBlock>
      </div>

      {/* With Slack notification */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Review + Slack Notification</h2>
        <CodeBlock language="json">{`{
  "name": "review-and-notify",
  "steps": [
    {
      "id": "get_diff",
      "type": "git.diff",
      "config": {
        "operation": "diff",
        "base_branch": "main"
      }
    },
    {
      "id": "review",
      "type": "ai.generate",
      "config": {
        "model": "gpt-4o",
        "system": "You are a senior engineer. Review the diff for bugs and security issues. Output a brief summary with severity: LOW, MEDIUM, or HIGH.",
        "prompt": "Diff to review:\\n{{steps.get_diff.output.diff}}",
        "temperature": 0.1
      },
      "depends_on": ["get_diff"]
    },
    {
      "id": "notify",
      "type": "slack.notify",
      "config": {
        "channel": "#code-review",
        "message": ":robot_face: *AI Code Review*\\n{{steps.review.output.content}}"
      },
      "depends_on": ["review"]
    }
  ]
}`}</CodeBlock>
      </div>

      {/* With Jira */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Review + Jira Ticket</h2>
        <CodeBlock language="json">{`{
  "name": "review-and-jira",
  "steps": [
    {
      "id": "get_diff",
      "type": "git.diff",
      "config": { "operation": "diff", "base_branch": "main" }
    },
    {
      "id": "review",
      "type": "ai.generate",
      "config": {
        "model": "gpt-4o",
        "system": "Review this code diff. Output a JSON object with keys: summary (string), severity (LOW|MEDIUM|HIGH), issues (array of strings).",
        "prompt": "{{steps.get_diff.output.diff}}",
        "temperature": 0.1
      },
      "depends_on": ["get_diff"]
    },
    {
      "id": "create_ticket",
      "type": "jira",
      "config": {
        "operation": "create_issue",
        "project": "DEV",
        "summary": "Code Review: {{env.CI_COMMIT_SHORT_SHA}}",
        "description": "{{steps.review.output.content}}",
        "issue_type": "Task",
        "priority": "Medium"
      },
      "depends_on": ["review"]
    }
  ]
}`}</CodeBlock>
      </div>

      {/* GitLab CI integration */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Running in GitLab CI</h2>
        <CodeBlock language=".gitlab-ci.yml">{`ai-review:
  stage: review
  script:
    - shiro run -workflow .shiro/workflow.json
  variables:
    OPENAI_API_KEY: $OPENAI_API_KEY
  only:
    - merge_requests`}</CodeBlock>
        <p className="text-sm text-muted-foreground">
          Store <code className="text-xs text-primary">OPENAI_API_KEY</code> as
          a masked CI/CD variable in GitLab (
          <strong>Settings → CI/CD → Variables</strong>).
        </p>
      </div>

      {/* GitHub Actions integration */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Running in GitHub Actions</h2>
        <CodeBlock language="yaml">{`name: Code Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

jobs:
  code-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Run Shiro Code Review
        uses: rajitk13/shiro-automation@latest
        with:
          workflow: .shiro/workflows/github-code-review.json
          config: .shiro/config.yaml
        env:
          GITHUB_TOKEN: $\{\{ secrets.GITHUB_TOKEN \}\}
          OPENAI_API_KEY: $\{\{ secrets.OPENAI_API_KEY \}\}`}</CodeBlock>
        <p className="text-sm text-muted-foreground">
          Add <code className="text-xs text-primary">OPENAI_API_KEY</code> as a
          repository secret in GitHub (
          <strong>Settings → Secrets and variables → Actions</strong>).
        </p>
      </div>

      {/* Prompting tips */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Prompting Tips</h2>
        <div className="space-y-3">
          {[
            {
              title: "Use a strong system prompt",
              desc: 'Define the reviewer persona: "You are a senior security engineer..." gives much more focused output than a generic prompt.',
            },
            {
              title: "Keep temperature low",
              desc: "Use temperature: 0.1–0.3 for code review. Higher values produce creative but inconsistent feedback.",
            },
            {
              title: "Limit diff size",
              desc: "Very large diffs exhaust context windows. Use git.diff filters (e.g. exclude generated files) or chunk the review.",
            },
            {
              title: "Request structured output",
              desc: 'Ask the model to return JSON: "Output a JSON object with keys: summary, severity, issues". Pipe the output to other steps.',
            },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="flex gap-3 rounded-lg border border-border bg-card p-4"
            >
              <div className="mt-0.5 size-2 shrink-0 rounded-full bg-primary" />
              <div>
                <div className="text-sm font-medium mb-1">{title}</div>
                <div className="text-sm text-muted-foreground">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
