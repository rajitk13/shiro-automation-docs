import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Workflows - Shiro Documentation",
  description: "Understanding workflow structure and configuration",
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

export default function WorkflowsPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-primary font-medium mb-2">
          Core Concept
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Workflows</h1>
        <p className="text-xl text-muted-foreground">
          Workflows are JSON files that define a series of steps to execute,
          their dependencies, and configurations.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Structure</h2>
        <p className="text-muted-foreground">
          A workflow consists of a name, optional inputs, and an array of steps.
        </p>
        <CodeBlock>{`{
  "name": "my-workflow",
  "description": "Optional description",
  "inputs": {
    "param1": "default_value",
    "param2": "{{env.ENV_VAR}}"
  },
  "steps": [
    {
      "id": "step1",
      "type": "module.type",
      "config": {},
      "depends_on": []
    }
  ]
}`}</CodeBlock>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Step Properties</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 text-left font-semibold">Property</th>
              <th className="py-2 text-left font-semibold">Required</th>
              <th className="py-2 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">id</td>
              <td className="py-3">Yes</td>
              <td className="py-3">Unique identifier for the step</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">type</td>
              <td className="py-3">Yes</td>
              <td className="py-3">Module type (e.g., print, slack.notify)</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">config</td>
              <td className="py-3">Yes</td>
              <td className="py-3">Module-specific configuration object</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">depends_on</td>
              <td className="py-3">No</td>
              <td className="py-3">Array of step IDs this step depends on</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">pause</td>
              <td className="py-3">No</td>
              <td className="py-3">
                Pause workflow after this step (for approvals)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Complete Example</h2>
        <CodeBlock>{`{
  "name": "deploy-pipeline",
  "description": "Build, test, and deploy application",
  "inputs": {
    "environment": "staging",
    "version": "{{env.COMMIT_SHA}}"
  },
  "steps": [
    {
      "id": "checkout",
      "type": "git.diff",
      "config": {
        "operation": "diff"
      }
    },
    {
      "id": "build",
      "type": "shell",
      "config": {
        "command": "docker build -t app:{{inputs.version}} ."
      },
      "depends_on": ["checkout"]
    },
    {
      "id": "test",
      "type": "shell",
      "config": {
        "command": "npm test"
      },
      "depends_on": ["build"]
    },
    {
      "id": "deploy",
      "type": "shell",
      "config": {
        "command": "kubectl apply -f k8s/"
      },
      "depends_on": ["test"]
    },
    {
      "id": "notify",
      "type": "slack.notify",
      "config": {
        "webhook_url": "{{env.SLACK_WEBHOOK}}",
        "message": "Deployed {{inputs.version}} to {{inputs.environment}}"
      },
      "depends_on": ["deploy"]
    }
  ]
}`}</CodeBlock>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-2">Best Practices</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Use descriptive step IDs (kebab-case or snake_case)</li>
          <li>• Keep workflows focused on a single purpose</li>
          <li>• Use inputs for values that change between runs</li>
          <li>
            • Define dependencies explicitly rather than relying on step order
          </li>
          <li>• Store workflows in version control</li>
        </ul>
      </div>
    </div>
  )
}
