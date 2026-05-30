import { Metadata } from "next"

export const metadata: Metadata = {
  title: "shiro run - Shiro Documentation",
  description: "Execute a workflow with the Shiro CLI",
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

export default function CliRunPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-primary font-medium mb-2">CLI Command</div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">shiro run</h1>
        <p className="text-xl text-muted-foreground">
          Execute a workflow. Auto-detects .shiro/workflow.json by default.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage</h2>
        <CodeBlock>{`shiro run [flags]
shiro run -workflow <path> [flags]`}</CodeBlock>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Flags</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 text-left font-semibold">Flag</th>
              <th className="py-2 text-left font-semibold">Default</th>
              <th className="py-2 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">-workflow</td>
              <td className="py-3">.shiro/workflow.json</td>
              <td className="py-3">Path to workflow JSON file</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">-config</td>
              <td className="py-3">.shiro/config.yaml</td>
              <td className="py-3">Path to config file</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">-shiro-dir</td>
              <td className="py-3">.shiro</td>
              <td className="py-3">Path to .shiro directory</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">-state-store</td>
              <td className="py-3">memory</td>
              <td className="py-3">
                State storage backend: memory, filesystem, gitlab
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">-fresh</td>
              <td className="py-3">false</td>
              <td className="py-3">Start fresh, ignore previous state</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">-dry-run</td>
              <td className="py-3">false</td>
              <td className="py-3">Validate workflow without executing</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Examples</h2>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Run Default Workflow</h3>
          <p className="text-sm text-muted-foreground">
            Auto-detects .shiro/workflow.json
          </p>
          <CodeBlock>{`shiro run`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Run Specific Workflow</h3>
          <CodeBlock>{`shiro run -workflow .shiro/workflows/deploy.json`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Run with Custom Config</h3>
          <CodeBlock>{`shiro run -config configs/production.yaml`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Dry Run Mode</h3>
          <p className="text-sm text-muted-foreground">
            Validate workflow without executing
          </p>
          <CodeBlock>{`shiro run -dry-run

# Output:
=== Dry Run Mode ===
Workflow will be validated but not executed
Workflow: my-workflow
Total Steps: 3

--- Execution Plan (DAG Order) ---
1. Step: step1
   Type: git.diff
   Config: 2 keys

2. Step: step2
   Type: ai.generate
   Depends On: [step1]`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">GitLab CI with State Storage</h3>
          <CodeBlock>{`shiro run -state-store gitlab -fresh`}</CodeBlock>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
        <p className="text-muted-foreground mb-4">
          Shiro automatically picks up common CI environment variables:
        </p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>
            <code className="text-accent">CI_PROJECT_ID</code> - GitLab project
            ID
          </li>
          <li>
            <code className="text-accent">CI_MERGE_REQUEST_IID</code> - Merge
            request IID
          </li>
          <li>
            <code className="text-accent">CI_COMMIT_SHA</code> - Commit SHA
          </li>
          <li>
            <code className="text-accent">CI_JOB_TOKEN</code> - GitLab CI job
            token
          </li>
          <li>
            <code className="text-accent">GITHUB_TOKEN</code> - GitHub token
          </li>
        </ul>
      </div>
    </div>
  )
}
