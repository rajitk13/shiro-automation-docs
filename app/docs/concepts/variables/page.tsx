import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Variables - Shiro Documentation",
  description: "Understanding variable resolution and templating",
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

export default function VariablesPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-primary font-medium mb-2">
          Core Concept
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Variables</h1>
        <p className="text-xl text-muted-foreground">
          Shiro supports template-based variable resolution using double curly
          braces syntax: {"{{variable}}"}
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Variable Types</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 text-left font-semibold">Syntax</th>
              <th className="py-2 text-left font-semibold">Source</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">
                {"{{inputs.name}}"}
              </td>
              <td className="py-3">Workflow inputs</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">
                {"{{env.VAR_NAME}}"}
              </td>
              <td className="py-3">Environment variables</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">
                {"{{steps.step_id.output}}"}
              </td>
              <td className="py-3">Step output</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">{"{{data.key}}"}</td>
              <td className="py-3">Data store values</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Examples</h2>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Workflow Inputs</h3>
          <CodeBlock>{`{
  "inputs": {
    "environment": "staging",
    "version": "1.0.0"
  },
  "steps": [
    {
      "id": "deploy",
      "type": "shell",
      "config": {
        "command": "deploy --env {{inputs.environment}} --version {{inputs.version}}"
      }
    }
  ]
}`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Environment Variables</h3>
          <CodeBlock>{`{
  "id": "slack_notify",
  "type": "slack.notify",
  "config": {
    "webhook_url": "{{env.SLACK_WEBHOOK_URL}}",
    "channel": "{{env.SLACK_CHANNEL}}",
    "message": "Build {{env.CI_COMMIT_SHA}} completed"
  }
}`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Step Outputs</h3>
          <CodeBlock>{`{
  "steps": [
    {
      "id": "get_version",
      "type": "shell",
      "config": {
        "command": "cat package.json | jq -r .version"
      }
    },
    {
      "id": "tag_release",
      "type": "shell",
      "config": {
        "command": "git tag v{{steps.get_version.stdout}}"
      },
      "depends_on": ["get_version"]
    }
  ]
}`}</CodeBlock>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-2">Common CI Variables</h2>
        <p className="text-muted-foreground mb-4">
          Automatically available in CI environments:
        </p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>
            <code className="text-accent">{"{{env.CI_PROJECT_ID}}"}</code> -
            GitLab project ID
          </li>
          <li>
            <code className="text-accent">{"{{env.CI_COMMIT_SHA}}"}</code> -
            Commit SHA
          </li>
          <li>
            <code className="text-accent">{"{{env.CI_COMMIT_REF_NAME}}"}</code>{" "}
            - Branch name
          </li>
          <li>
            <code className="text-accent">
              {"{{env.CI_MERGE_REQUEST_IID}}"}
            </code>{" "}
            - MR number
          </li>
        </ul>
      </div>
    </div>
  )
}
