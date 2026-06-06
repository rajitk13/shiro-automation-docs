import { Metadata } from "next"

export const metadata: Metadata = {
  title: "github Module - Shiro Documentation",
  description: "GitHub API operations in workflows",
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

export default function GitHubModulePage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-primary font-medium mb-2">
          Built-in Module
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">github</h1>
        <p className="text-xl text-muted-foreground">
          Interact with the GitHub API — post PR comments, inline code review
          comments, manage pull requests.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Operations</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 text-left font-semibold">Operation</th>
              <th className="py-2 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">get_diff</td>
              <td className="py-3">
                Get the diff for a pull request via GitHub API
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">post_comment</td>
              <td className="py-3">Post a general comment on a pull request</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">
                post_inline_comments
              </td>
              <td className="py-3">
                Post inline line comments on a pull request
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Config Options</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 text-left font-semibold">Field</th>
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
                Operation to perform: get_diff, post_comment, or
                post_inline_comments
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">body</td>
              <td className="py-3">string</td>
              <td className="py-3">No</td>
              <td className="py-3">
                Comment body (for post_comment and post_inline_comments with
                text format)
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">comments</td>
              <td className="py-3">array</td>
              <td className="py-3">No</td>
              <td className="py-3">
                Array of comment objects (for post_inline_comments with JSON
                format)
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">output_format</td>
              <td className="py-3">string</td>
              <td className="py-3">No</td>
              <td className="py-3">
                Output format for post_inline_comments: json or text (default:
                text)
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">dedup</td>
              <td className="py-3">boolean</td>
              <td className="py-3">No</td>
              <td className="py-3">
                Enable deduplication for post_inline_comments (default: true)
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">commit_id</td>
              <td className="py-3">string</td>
              <td className="py-3">No</td>
              <td className="py-3">
                Commit SHA for review comments (defaults to GITHUB_SHA)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Output Fields</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 text-left font-semibold">Field</th>
              <th className="py-2 text-left font-semibold">Type</th>
              <th className="py-2 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">success</td>
              <td className="py-3">boolean</td>
              <td className="py-3">Whether the operation succeeded</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">diff</td>
              <td className="py-3">string</td>
              <td className="py-3">PR diff content (for get_diff)</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">message</td>
              <td className="py-3">string</td>
              <td className="py-3">Status message</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">posted_count</td>
              <td className="py-3">integer</td>
              <td className="py-3">
                Number of comments posted (for post_inline_comments)
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">skipped_count</td>
              <td className="py-3">integer</td>
              <td className="py-3">
                Number of comments skipped due to deduplication (for
                post_inline_comments)
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">comments</td>
              <td className="py-3">array</td>
              <td className="py-3">
                Array of posted comments (for post_inline_comments)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Examples</h2>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Get PR Diff</h3>
          <CodeBlock>{`{
  "id": "get-diff",
  "type": "github",
  "config": {
    "operation": "get_diff"
  }
}`}</CodeBlock>
          <p className="text-sm text-muted-foreground">
            Output is available as{" "}
            <code className="text-xs">{"{{steps.get-diff.diff}}"}</code> for use
            in subsequent AI steps.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Post General PR Comment</h3>
          <CodeBlock>{`{
  "id": "post_review",
  "type": "github",
  "depends_on": ["ai_review"],
  "config": {
    "operation": "post_comment",
    "body": "{{steps.ai_review.content}}"
  }
}`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">
            Post Inline Comments (Text Format)
          </h3>
          <CodeBlock>{`{
  "id": "post_inline_comments",
  "type": "github",
  "depends_on": ["ai_review"],
  "config": {
    "operation": "post_inline_comments",
    "body": "{{steps.ai_review.content}}",
    "output_format": "text",
    "dedup": true
  }
}`}</CodeBlock>
          <p className="text-sm text-muted-foreground">
            AI prompt for text format:{" "}
            <code className="text-xs">
              Review this code diff and provide comments in format:
              &apos;path/to/file.go:42 - issue description&apos;
            </code>
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">
            Post Inline Comments (JSON Format)
          </h3>
          <CodeBlock>{`{
  "id": "post_inline_comments",
  "type": "github",
  "depends_on": ["ai_review"],
  "config": {
    "operation": "post_inline_comments",
    "comments": "{{steps.ai_review.comments}}",
    "output_format": "json",
    "dedup": true
  }
}`}</CodeBlock>
          <p className="text-sm text-muted-foreground">
            AI prompt for JSON format: Return JSON array with file, line, and
            comment fields
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Environment Variables</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 text-left font-semibold">Variable</th>
              <th className="py-2 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">GITHUB_TOKEN</td>
              <td className="py-3">
                GitHub authentication token (required for API calls)
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">GITHUB_REPOSITORY</td>
              <td className="py-3">
                Repository name in format owner/repo (auto-set in GitHub
                Actions)
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">
                GITHUB_REPOSITORY_OWNER
              </td>
              <td className="py-3">
                Repository owner (auto-set in GitHub Actions)
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">GITHUB_PR_NUMBER</td>
              <td className="py-3">
                Pull request number (auto-set in GitHub Actions for PR events)
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">GITHUB_SHA</td>
              <td className="py-3">Commit SHA (auto-set in GitHub Actions)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-2">Authentication</h2>
        <p className="text-muted-foreground mb-2">
          Use <code className="text-accent">GITHUB_TOKEN</code> which is
          automatically available in GitHub Actions:
        </p>
        <CodeBlock language="yaml">{`env:
  GITHUB_TOKEN: $\{\{ secrets.GITHUB_TOKEN \}\}`}</CodeBlock>
      </div>
    </div>
  )
}
