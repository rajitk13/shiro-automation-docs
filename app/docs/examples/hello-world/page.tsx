import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Hello World - Shiro Examples",
  description: "Your first Shiro workflow",
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

export default function HelloWorldPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm font-medium text-primary mb-2">Examples</div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Hello World</h1>
        <p className="text-xl text-muted-foreground">
          The simplest possible Shiro workflow — a great starting point to
          understand the structure.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Overview</h2>
        <p className="text-muted-foreground">
          This example prints two messages in sequence using the built-in{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
            print
          </code>{" "}
          module. It demonstrates basic workflow structure, step sequencing, and
          DAG-based dependency ordering.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Workflow File</h2>
        <p className="text-muted-foreground">
          Save as{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
            .shiro/workflow.json
          </code>
          :
        </p>
        <CodeBlock language="json">{`{
  "name": "hello-world",
  "description": "My first Shiro workflow",
  "steps": [
    {
      "id": "greeting",
      "type": "print",
      "config": {
        "message": "Hello from Shiro!",
        "level": "info"
      }
    },
    {
      "id": "done",
      "type": "print",
      "config": {
        "message": "Workflow completed successfully.",
        "level": "info"
      },
      "depends_on": ["greeting"]
    }
  ]
}`}</CodeBlock>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Run It</h2>
        <CodeBlock>{`# Via Docker (recommended)
docker run --rm -v $(pwd):/workspace -w /workspace \\
  ghcr.io/rajitk13/shiro-automation:latest shiro run

# Or with a local binary
shiro run`}</CodeBlock>

        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-semibold mb-2">Expected output</p>
          <CodeBlock language="text">{`[Shiro] Loaded workflow: hello-world
[Shiro] Starting workflow: hello-world
[Shiro] Step greeting completed: true
[Shiro] Step done completed: true
=== Workflow Results ===
Step: greeting  ✓
Step: done      ✓`}</CodeBlock>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Key Concepts</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>
            • <strong>id</strong> — unique identifier for each step, used in{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
              depends_on
            </code>
          </li>
          <li>
            • <strong>type</strong> — the module to run (
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
              print
            </code>
            ,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
              shell
            </code>
            , etc.)
          </li>
          <li>
            • <strong>config</strong> — module-specific input parameters
          </li>
          <li>
            • <strong>depends_on</strong> — ensures{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
              done
            </code>{" "}
            runs only after{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
              greeting
            </code>{" "}
            succeeds
          </li>
        </ul>
      </div>
    </div>
  )
}
