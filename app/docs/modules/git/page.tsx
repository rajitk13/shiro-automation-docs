import { Metadata } from "next"

export const metadata: Metadata = {
  title: "git.diff Module - Shiro Documentation",
  description: "Git operations and diff generation in workflows",
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

export default function GitModulePage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-primary font-medium mb-2">
          Built-in Module
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">git.diff</h1>
        <p className="text-xl text-muted-foreground">
          Generate git diffs for AI code review workflows. Outputs diff text
          that can be passed to <code className="text-accent">ai.generate</code>
          .
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Configuration</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 text-left font-semibold">Parameter</th>
              <th className="py-2 text-left font-semibold">Type</th>
              <th className="py-2 text-left font-semibold">Required</th>
              <th className="py-2 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">operation</td>
              <td className="py-3">string</td>
              <td className="py-3">Yes</td>
              <td className="py-3">
                Operation type: <code>diff</code>, <code>log</code>,{" "}
                <code>show</code>
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">base_branch</td>
              <td className="py-3">string</td>
              <td className="py-3">No</td>
              <td className="py-3">Branch to diff against (default: main)</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">max_lines</td>
              <td className="py-3">number</td>
              <td className="py-3">No</td>
              <td className="py-3">
                Maximum diff lines to return (default: 500)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Examples</h2>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Generate PR Diff</h3>
          <CodeBlock>{`{
  "id": "get_diff",
  "type": "git.diff",
  "config": {
    "operation": "diff",
    "base_branch": "main",
    "max_lines": 300
  }
}`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Full AI Code Review Workflow</h3>
          <CodeBlock>{`{
  "name": "code-review",
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
      "id": "ai_review",
      "type": "ai.generate",
      "config": {
        "prompt": "Review this code diff and provide feedback:\\n{{steps.get_diff.diff}}",
        "model": "gpt-4"
      },
      "depends_on": ["get_diff"]
    },
    {
      "id": "notify",
      "type": "slack.notify",
      "config": {
        "webhook_url": "{{env.SLACK_WEBHOOK_URL}}",
        "message": "Code Review:\\n{{steps.ai_review.text}}"
      },
      "depends_on": ["ai_review"]
    }
  ]
}`}</CodeBlock>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-2">Output</h2>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>
            <code className="text-accent">diff</code> - The git diff text
          </li>
          <li>
            <code className="text-accent">files_changed</code> - Number of files
            changed
          </li>
          <li>
            <code className="text-accent">insertions</code> - Lines inserted
          </li>
          <li>
            <code className="text-accent">deletions</code> - Lines deleted
          </li>
        </ul>
      </div>
    </div>
  )
}
