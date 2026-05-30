import { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Code Review - Shiro Examples",
  description: "Automated AI-powered code review with Shiro",
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
          Automatically review pull request diffs using an AI model and post
          feedback to Slack.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Overview</h2>
        <p className="text-muted-foreground">
          This workflow chains three steps: get the git diff, send it to an AI
          model for review, then post the result to a Slack channel. It uses the{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
            git.diff
          </code>
          ,{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
            ai.generate
          </code>
          , and{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
            slack.notify
          </code>{" "}
          modules.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">AI Config</h2>
        <p className="text-muted-foreground">
          Save as{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
            .shiro/config.yaml
          </code>
          :
        </p>
        <CodeBlock language="yaml">{`models:
  - name: reviewer
    provider: openai
    model: gpt-4o-mini
    base_url: https://api.openai.com/v1
    api_key: "{{env.OPENAI_API_KEY}}"
    default: true`}</CodeBlock>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Workflow File</h2>
        <CodeBlock language="json">{`{
  "name": "ai-code-review",
  "description": "Review PR diff with AI and notify Slack",
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
        "message": "AI Code Review for {{env.CI_COMMIT_REF_NAME}}:\\n{{steps.review.output}}"
      },
      "depends_on": ["review"]
    }
  ]
}`}</CodeBlock>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Run in GitLab CI</h2>
        <CodeBlock language="yaml">{`code-review:
  stage: review
  script:
    - docker run --rm
        -v $PWD:/workspace -w /workspace
        -e OPENAI_API_KEY=$OPENAI_API_KEY
        -e SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL
        -e CI_COMMIT_SHA=$CI_COMMIT_SHA
        -e CI_COMMIT_REF_NAME=$CI_COMMIT_REF_NAME
        -e CI_MERGE_REQUEST_TARGET_BRANCH_NAME=$CI_MERGE_REQUEST_TARGET_BRANCH_NAME
        ghcr.io/rajitk13/shiro-automation:latest
        shiro run
  only:
    - merge_requests`}</CodeBlock>
      </div>

      <div className="rounded-lg border border-border bg-card p-5 space-y-2">
        <p className="font-semibold text-sm">Using Ollama (local model)</p>
        <p className="text-sm text-muted-foreground mb-3">
          Swap the provider to run reviews locally without an API key:
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
