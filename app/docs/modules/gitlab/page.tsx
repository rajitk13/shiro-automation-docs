import { Metadata } from "next"

export const metadata: Metadata = {
  title: "gitlab Module - Shiro Documentation",
  description: "GitLab API operations in workflows",
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

export default function GitLabModulePage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-primary font-medium mb-2">
          Built-in Module
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">gitlab</h1>
        <p className="text-xl text-muted-foreground">
          Interact with the GitLab API — post MR comments, update pipelines,
          manage issues.
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
              <td className="py-3 font-mono text-accent">post_comment</td>
              <td className="py-3">
                Post a general comment on a merge request
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">
                post_inline_comments
              </td>
              <td className="py-3">
                Post inline line comments on a merge request
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">get_commit_info</td>
              <td className="py-3">Get commit details</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">get_user_info</td>
              <td className="py-3">Get user information</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">
                get_mr_participants
              </td>
              <td className="py-3">Get merge request participants</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">get_files_changed</td>
              <td className="py-3">Get list of changed files in MR</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Examples</h2>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Post AI Review as MR Comment</h3>
          <CodeBlock>{`{
  "id": "post_review",
  "type": "gitlab",
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
  "type": "gitlab",
  "depends_on": ["ai_review"],
  "config": {
    "operation": "post_inline_comments",
    "body": "{{steps.ai_review.content}}",
    "output_format": "text",
    "api_type": "discussions",
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
  "type": "gitlab",
  "depends_on": ["ai_review"],
  "config": {
    "operation": "post_inline_comments",
    "comments": "{{steps.ai_review.comments}}",
    "output_format": "json",
    "api_type": "discussions",
    "dedup": true
  }
}`}</CodeBlock>
          <p className="text-sm text-muted-foreground">
            AI prompt for JSON format: Return JSON array with file, line, and
            comment fields
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-2">Authentication</h2>
        <p className="text-muted-foreground mb-2">
          Use <code className="text-accent">CI_JOB_TOKEN</code> which is
          automatically available in GitLab CI:
        </p>
        <CodeBlock language="yaml">{`variables:
  GITLAB_TOKEN: $CI_JOB_TOKEN`}</CodeBlock>
      </div>
    </div>
  )
}
