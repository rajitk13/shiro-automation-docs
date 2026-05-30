import { Metadata } from "next"

export const metadata: Metadata = {
  title: "DAG Execution - Shiro Documentation",
  description: "Understanding Directed Acyclic Graph execution",
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

export default function DagPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-primary font-medium mb-2">
          Core Concept
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          DAG Execution
        </h1>
        <p className="text-xl text-muted-foreground">
          Shiro uses topological sorting to execute workflows as a Directed
          Acyclic Graph (DAG), automatically determining the optimal execution
          order.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">How It Works</h2>
        <ol className="space-y-3 text-muted-foreground">
          <li>
            <strong>1. Parse Dependencies</strong> - Shiro reads the{" "}
            <code className="text-accent">depends_on</code> array from each step
          </li>
          <li>
            <strong>2. Build Graph</strong> - Creates a directed graph of step
            dependencies
          </li>
          <li>
            <strong>3. Topological Sort</strong> - Orders steps so dependencies
            execute first
          </li>
          <li>
            <strong>4. Execute</strong> - Runs steps in order, tracking outputs
            for dependent steps
          </li>
        </ol>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Example</h2>
        <CodeBlock>{`{
  "steps": [
    { "id": "checkout", "type": "git.diff", "config": {} },
    { "id": "lint", "type": "shell", "config": {}, "depends_on": ["checkout"] },
    { "id": "test", "type": "shell", "config": {}, "depends_on": ["lint"] },
    { "id": "build", "type": "shell", "config": {}, "depends_on": ["test"] },
    { "id": "deploy", "type": "shell", "config": {}, "depends_on": ["build"] },
    { "id": "notify", "type": "slack.notify", "config": {}, "depends_on": ["deploy"] }
  ]
}`}</CodeBlock>
        <p className="text-muted-foreground">
          Execution order: checkout → lint → test → build → deploy → notify
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Parallel Execution</h2>
        <p className="text-muted-foreground">
          Steps with no dependencies between them can execute in parallel:
        </p>
        <CodeBlock>{`{
  "steps": [
    { "id": "checkout", "type": "git.diff", "config": {} },
    { "id": "lint", "type": "shell", "config": {}, "depends_on": ["checkout"] },
    { "id": "test-unit", "type": "shell", "config": {}, "depends_on": ["lint"] },
    { "id": "test-integration", "type": "shell", "config": {}, "depends_on": ["lint"] },
    { "id": "build", "type": "shell", "config": {}, "depends_on": ["test-unit", "test-integration"] }
  ]
}`}</CodeBlock>
        <p className="text-muted-foreground">
          Execution: checkout → lint → (test-unit ∥ test-integration) → build
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-2">Rules</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Workflows must not contain circular dependencies</li>
          <li>• All dependencies must exist as step IDs</li>
          <li>• Steps with no dependencies execute first</li>
          <li>• A step only executes after all its dependencies succeed</li>
        </ul>
      </div>
    </div>
  )
}
