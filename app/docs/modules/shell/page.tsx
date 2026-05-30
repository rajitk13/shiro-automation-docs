import { Metadata } from "next"

export const metadata: Metadata = {
  title: "shell Module - Shiro Documentation",
  description: "Execute shell commands and scripts in workflows",
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

export default function ShellModulePage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-primary font-medium mb-2">
          Built-in Module
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">shell</h1>
        <p className="text-xl text-muted-foreground">
          Execute shell commands and scripts in your workflows with configurable
          timeouts and environment variables.
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
              <td className="py-3 font-mono text-accent">command</td>
              <td className="py-3">string</td>
              <td className="py-3">Conditional*</td>
              <td className="py-3">Single command to execute</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">script</td>
              <td className="py-3">array</td>
              <td className="py-3">Conditional*</td>
              <td className="py-3">Multi-line script as array of strings</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">shell</td>
              <td className="py-3">string</td>
              <td className="py-3">No</td>
              <td className="py-3">
                Shell to use: bash, sh, zsh (default: bash)
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">working_dir</td>
              <td className="py-3">string</td>
              <td className="py-3">No</td>
              <td className="py-3">Working directory for execution</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">env</td>
              <td className="py-3">object</td>
              <td className="py-3">No</td>
              <td className="py-3">Environment variables</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">timeout</td>
              <td className="py-3">string</td>
              <td className="py-3">No</td>
              <td className="py-3">
                Timeout (e.g., &apos;5m&apos;, &apos;30s&apos;) (default: 5m)
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">capture_output</td>
              <td className="py-3">boolean</td>
              <td className="py-3">No</td>
              <td className="py-3">Capture stdout/stderr (default: true)</td>
            </tr>
          </tbody>
        </table>
        <p className="text-sm text-muted-foreground">
          * Either command or script is required
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Examples</h2>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Single Command</h3>
          <CodeBlock>{`{
  "id": "check_node",
  "type": "shell",
  "config": {
    "command": "node --version",
    "shell": "bash"
  }
}`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Multi-line Script</h3>
          <CodeBlock>{`{
  "id": "build_app",
  "type": "shell",
  "config": {
    "script": [
      "echo 'Starting build...'",
      "npm ci",
      "npm run build",
      "echo 'Build complete!'"
    ],
    "working_dir": "./app",
    "timeout": "10m"
  }
}`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">With Environment Variables</h3>
          <CodeBlock>{`{
  "id": "deploy",
  "type": "shell",
  "config": {
    "command": "kubectl apply -f deployment.yaml",
    "env": {
      "KUBECONFIG": "{{env.KUBECONFIG_PATH}}",
      "NAMESPACE": "production"
    },
    "timeout": "2m"
  }
}`}</CodeBlock>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-2">Output</h2>
        <p className="text-muted-foreground mb-4">
          The shell module captures and returns:
        </p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>
            <code className="text-accent">stdout</code> - Standard output from
            command
          </li>
          <li>
            <code className="text-accent">stderr</code> - Standard error (if
            any)
          </li>
          <li>
            <code className="text-accent">exit_code</code> - Exit code (0 =
            success)
          </li>
        </ul>
      </div>
    </div>
  )
}
