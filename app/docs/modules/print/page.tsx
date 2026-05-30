import { Metadata } from "next"

export const metadata: Metadata = {
  title: "print Module - Shiro Documentation",
  description: "Print output to console with configurable log levels",
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

export default function PrintModulePage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-primary font-medium mb-2">
          Built-in Module
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">print</h1>
        <p className="text-xl text-muted-foreground">
          Prints output to console with optional log levels and colors.
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
              <td className="py-3 font-mono text-accent">message</td>
              <td className="py-3">string</td>
              <td className="py-3">Yes</td>
              <td className="py-3">Message to print</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">level</td>
              <td className="py-3">string</td>
              <td className="py-3">No</td>
              <td className="py-3">
                Log level: info, debug, error, warning (default: info)
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">format</td>
              <td className="py-3">string</td>
              <td className="py-3">No</td>
              <td className="py-3">
                Output format: text, json (default: text)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Log Level Colors</h2>
        <div className="grid gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
            <code className="text-sm font-mono">info</code>
            <span className="text-sm text-muted-foreground">Green</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-block w-3 h-3 rounded-full bg-gray-500"></span>
            <code className="text-sm font-mono">debug</code>
            <span className="text-sm text-muted-foreground">Gray</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
            <code className="text-sm font-mono">error</code>
            <span className="text-sm text-muted-foreground">Red</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
            <code className="text-sm font-mono">warning</code>
            <span className="text-sm text-muted-foreground">Yellow</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Examples</h2>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Basic Info Message</h3>
          <CodeBlock>{`{
  "id": "log_output",
  "type": "print",
  "config": {
    "message": "Workflow started successfully",
    "level": "info"
  }
}`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Debug with Variable</h3>
          <CodeBlock>{`{
  "id": "debug_vars",
  "type": "print",
  "config": {
    "message": "Environment: {{env.CI_ENVIRONMENT_NAME}}",
    "level": "debug"
  }
}`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Error Message</h3>
          <CodeBlock>{`{
  "id": "error_step",
  "type": "print",
  "config": {
    "message": "Deployment failed: {{steps.deploy.error}}",
    "level": "error"
  },
  "depends_on": ["deploy"]
}`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">JSON Format Output</h3>
          <CodeBlock>{`{
  "id": "json_output",
  "type": "print",
  "config": {
    "message": "{\"status\": \"complete\", \"steps\": 5}",
    "level": "info",
    "format": "json"
  }
}`}</CodeBlock>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-2">
          Complete Workflow Example
        </h2>
        <CodeBlock>{`{
  "name": "print-demo",
  "steps": [
    {
      "id": "start",
      "type": "print",
      "config": {
        "message": "Starting workflow...",
        "level": "info"
      }
    },
    {
      "id": "debug_info",
      "type": "print",
      "config": {
        "message": "Debug: CI_PROJECT_ID = {{env.CI_PROJECT_ID}}",
        "level": "debug"
      },
      "depends_on": ["start"]
    },
    {
      "id": "warning_check",
      "type": "print",
      "config": {
        "message": "Warning: Skipping tests in production mode",
        "level": "warning"
      },
      "depends_on": ["debug_info"]
    },
    {
      "id": "complete",
      "type": "print",
      "config": {
        "message": "Workflow completed!",
        "level": "info"
      },
      "depends_on": ["warning_check"]
    }
  ]
}`}</CodeBlock>
      </div>
    </div>
  )
}
