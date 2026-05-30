import { Metadata } from "next"

export const metadata: Metadata = {
  title: "State Storage - Shiro Documentation",
  description: "Understanding workflow state persistence",
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

export default function StatePage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-primary font-medium mb-2">
          Core Concept
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          State Storage
        </h1>
        <p className="text-xl text-muted-foreground">
          Shiro can persist workflow state across runs, enabling pause/resume
          functionality and tracking execution history.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Storage Backends</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-2">Memory (Default)</h3>
            <p className="text-sm text-muted-foreground">
              State is stored in memory only. Lost when process exits. Good for
              testing and ephemeral workflows.
            </p>
            <CodeBlock>shiro run -state-store memory</CodeBlock>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-2">Filesystem</h3>
            <p className="text-sm text-muted-foreground">
              State persisted to local files. Good for local development and
              single-node deployments.
            </p>
            <CodeBlock>shiro run -state-store filesystem</CodeBlock>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-2">GitLab</h3>
            <p className="text-sm text-muted-foreground">
              State stored as GitLab CI artifacts. Perfect for GitLab CI/CD
              workflows with pause/resume.
            </p>
            <CodeBlock>shiro run -state-store gitlab</CodeBlock>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Resume Workflows</h2>
        <p className="text-muted-foreground">
          State storage enables pausing and resuming workflows:
        </p>
        <CodeBlock>{`# Initial run with fresh state
shiro run -state-store gitlab -fresh

# Resume from previous state (skip completed steps)
shiro run -state-store gitlab`}</CodeBlock>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-2">State Data</h2>
        <p className="text-muted-foreground mb-4">Stored state includes:</p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Completed step IDs and their outputs</li>
          <li>• Workflow inputs and variables</li>
          <li>• Execution timestamps</li>
          <li>• Error information (if any)</li>
        </ul>
      </div>
    </div>
  )
}
