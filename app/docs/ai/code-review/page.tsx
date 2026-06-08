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
          Chain the{" "}
          <a
            href="/docs/modules/github"
            className="text-primary hover:underline"
          >
            <code>github</code>
          </a>{" "}
          module (or <code>git.diff</code>) and <code>ai.generate</code> to
          produce automated code reviews on every pull request — and post inline
          comments, PR summaries, Slack notifications, or Jira tickets.
        </p>
      </div>

      {/* How it works */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">How It Works</h2>
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            {
              step: "1",
              title: "Fetch the diff",
              desc: (
                <>
                  <a
                    href="/docs/modules/github"
                    className="text-primary hover:underline"
                  >
                    github.get_diff
                  </a>{" "}
                  fetches the PR diff via the GitHub API.
                </>
              ),
            },
            {
              step: "2",
              title: "Analyze with AI",
              desc: "ai.generate sends the diff to your model with a review prompt.",
            },
            {
              step: "3",
              title: "Post inline comments",
              desc: (
                <>
                  <a
                    href="/docs/modules/github"
                    className="text-primary hover:underline"
                  >
                    github.post_inline_comments
                  </a>{" "}
                  posts line-by-line feedback on the PR.
                </>
              ),
            },
            {
              step: "4",
              title: "Summarize",
              desc: (
                <>
                  <a
                    href="/docs/modules/github"
                    className="text-primary hover:underline"
                  >
                    github.post_comment
                  </a>{" "}
                  posts an overall review summary to the PR.
                </>
              ),
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

      {/* GitHub PR inline review */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          GitHub PR Review with Inline Comments
        </h2>
        <p className="text-muted-foreground">
          Full workflow: fetch diff → AI analysis → inline PR comments → summary
          comment.
        </p>
        <CodeBlock language="json">{`{
  "name": "github-code-review",
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
        "prompt": "Review this code diff:\\n\\n{{steps.get-diff.diff}}\\n\\nList issues with file path and line number. Format: 'path/to/file.go:42 - issue description'"
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
    },
    {
      "id": "post-summary",
      "type": "github",
      "depends_on": ["ai-review"],
      "config": {
        "operation": "post_comment",
        "body": "🤖 AI Review Complete\\n\\n{{steps.ai-review.content}}"
      }
    }
  ]
}`}</CodeBlock>

        <div className="rounded-lg border border-border bg-card p-5 space-y-2">
          <p className="font-semibold text-sm">
            Required environment variables
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-muted-foreground">
              <tbody>
                {[
                  [
                    "GITHUB_TOKEN",
                    "GitHub personal access token with repo and pull-requests write scope",
                  ],
                  ["GITHUB_REPOSITORY_OWNER", "Repository owner (e.g. myorg)"],
                  ["GITHUB_REPOSITORY", "Repository name (e.g. myorg/myrepo)"],
                  ["GITHUB_PR_NUMBER", "Pull request number"],
                  ["GITHUB_SHA", "Commit SHA to attach inline comments to"],
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
          <p className="text-xs text-muted-foreground pt-1">
            In GitHub Actions these are available automatically — pass them via
            the <code className="text-primary">env:</code> block.
          </p>
        </div>
      </div>

      {/* output_format reference */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Inline Comments: Text vs JSON Format
        </h2>
        <p className="text-muted-foreground">
          The <code className="text-accent">post_inline_comments</code>{" "}
          operation supports two input formats controlled by{" "}
          <code className="text-accent">output_format</code>.
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <div className="font-semibold text-sm">Text format (default)</div>
            <p className="text-xs text-muted-foreground">
              AI returns free-text. Shiro parses{" "}
              <code>file:line - comment</code> patterns automatically.
            </p>
            <CodeBlock language="json">{`{
  "id": "post-inline-comments",
  "type": "github",
  "config": {
    "operation": "post_inline_comments",
    "body": "{{steps.ai-review.content}}",
    "output_format": "text"
  }
}`}</CodeBlock>
            <p className="text-xs text-muted-foreground">
              Prompt the AI like:{" "}
              <em>
                &quot;Format each issue as: path/to/file.go:42 -
                description&quot;
              </em>
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <div className="font-semibold text-sm">JSON format</div>
            <p className="text-xs text-muted-foreground">
              AI returns a JSON array. Use <code>output_format: json</code> and
              pass structured output via <code>comments</code>.
            </p>
            <CodeBlock language="json">{`{
  "id": "post-inline-comments",
  "type": "github",
  "config": {
    "operation": "post_inline_comments",
    "output_format": "json",
    "comments": "{{steps.ai-review.json}}"
  }
}`}</CodeBlock>
            <p className="text-xs text-muted-foreground">
              Each comment object must have: <code>file</code>,{" "}
              <code>line</code>, <code>comment</code>.
            </p>
          </div>
        </div>
      </div>

      {/* ai.generate config reference */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          ai.generate Configuration Reference
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left font-semibold pr-4 w-52">
                  Field
                </th>
                <th className="py-2 text-left font-semibold pr-4 w-32">Type</th>
                <th className="py-2 text-left font-semibold pr-4 w-28">
                  Required
                </th>
                <th className="py-2 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-3 px-4">
                  <code className="text-xs text-primary">prompt</code>
                </td>
                <td className="py-3 px-4 text-xs">string</td>
                <td className="py-3 px-4 text-xs">Yes</td>
                <td className="py-3 px-4 text-xs">
                  The user prompt sent to the model. Supports variable
                  interpolation.
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4">
                  <code className="text-xs text-primary">model</code>
                </td>
                <td className="py-3 px-4 text-xs">string</td>
                <td className="py-3 px-4 text-xs">No</td>
                <td className="py-3 px-4 text-xs">
                  Model name. Must match a key in .shiro/config.yaml. Defaults
                  to the only configured model.
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4">
                  <code className="text-xs text-primary">provider</code>
                </td>
                <td className="py-3 px-4 text-xs">string</td>
                <td className="py-3 px-4 text-xs">No</td>
                <td className="py-3 px-4 text-xs">
                  Provider key from config.yaml. Auto-resolved if only one is
                  configured.
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4">
                  <code className="text-xs text-primary">system</code>
                </td>
                <td className="py-3 px-4 text-xs">string</td>
                <td className="py-3 px-4 text-xs">No</td>
                <td className="py-3 px-4 text-xs">
                  System prompt to set the model&apos;s persona or behavior.
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4">
                  <code className="text-xs text-primary">temperature</code>
                </td>
                <td className="py-3 px-4 text-xs">float</td>
                <td className="py-3 px-4 text-xs">No</td>
                <td className="py-3 px-4 text-xs">
                  Sampling temperature (0.0–1.0). Lower = more deterministic.
                  Default: model default.
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4">
                  <code className="text-xs text-primary">max_tokens</code>
                </td>
                <td className="py-3 px-4 text-xs">integer</td>
                <td className="py-3 px-4 text-xs">No</td>
                <td className="py-3 px-4 text-xs">
                  Maximum tokens in the response.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 space-y-2">
          <p className="font-semibold text-sm">ai.generate output variables</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-muted-foreground">
              <tbody>
                {[
                  [
                    "{{steps.STEP_ID.content}}",
                    "Raw text content from the model response",
                  ],
                  [
                    "{{steps.STEP_ID.usage.prompt_tokens}}",
                    "Number of prompt tokens used",
                  ],
                  [
                    "{{steps.STEP_ID.usage.completion_tokens}}",
                    "Number of completion tokens used",
                  ],
                  ["{{steps.STEP_ID.usage.total_tokens}}", "Total tokens used"],
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

      {/* With Slack notification */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Review + Slack Notification</h2>
        <CodeBlock language="json">{`{
  "name": "review-and-notify",
  "steps": [
    {
      "id": "get-diff",
      "type": "github",
      "config": { "operation": "get_diff" }
    },
    {
      "id": "ai-review",
      "type": "ai.generate",
      "depends_on": ["get-diff"],
      "config": {
        "system": "You are a senior engineer. Review for bugs and security issues. Output a brief summary with severity: LOW, MEDIUM, or HIGH.",
        "prompt": "Diff to review:\\n{{steps.get-diff.diff}}",
        "temperature": 0.1
      }
    },
    {
      "id": "notify",
      "type": "slack.notify",
      "depends_on": ["ai-review"],
      "config": {
        "webhook_url": "{{env.SLACK_WEBHOOK_URL}}",
        "message": ":robot_face: *AI Code Review*\\n{{steps.ai-review.content}}"
      }
    }
  ]
}`}</CodeBlock>
      </div>

      {/* GitHub Actions setup */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">GitHub Actions Setup</h2>
        <CodeBlock language="yaml">{`name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

jobs:
  code-review:
    runs-on: ubuntu-latest
    container:
      image: ghcr.io/rajitk13/shiro-automation:latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Run Shiro Code Review
        run: shiro run
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}
          GITHUB_REPOSITORY: \${{ github.repository }}
          GITHUB_REPOSITORY_OWNER: \${{ github.repository_owner }}
          GITHUB_PR_NUMBER: \${{ github.event.pull_request.number }}
          GITHUB_SHA: \${{ github.sha }}`}</CodeBlock>
      </div>

      {/* GitLab CI integration */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">GitLab CI Setup</h2>
        <CodeBlock language="yaml">{`ai-review:
  stage: review
  image: ghcr.io/rajitk13/shiro-automation:latest
  script:
    - shiro run
  variables:
    GITLAB_TOKEN: $GL_TOKEN
    OPENAI_API_KEY: $OPENAI_API_KEY
  only:
    - merge_requests`}</CodeBlock>
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
              title: "Use the file:line format for inline comments",
              desc: 'Ask the model to format each issue as: "path/to/file.go:42 - description". Shiro\'s text parser extracts these automatically.',
            },
            {
              title: "Use JSON format for structured downstream steps",
              desc: "If you need to pass review data to another step (e.g. Jira ticket creation), use output_format: json and json_schema to enforce structure.",
            },
            {
              title: "Enable deduplication",
              desc: "Set dedup: true on post_inline_comments to avoid re-posting the same comment on every push.",
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
