import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Modules - Shiro Documentation",
  description: "Understanding the module system and types",
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

export default function ModulesPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-primary font-medium mb-2">
          Core Concept
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Modules</h1>
        <p className="text-xl text-muted-foreground">
          Modules are reusable components that perform specific actions in
          workflows. Shiro supports built-in, HTTP, and subprocess modules.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Module Types</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-2">Built-in Modules</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Compiled into the main Shiro binary. No additional setup required.
            </p>
            <ul className="text-sm text-muted-foreground">
              <li>
                • <code className="text-accent">print</code> - Console output
              </li>
              <li>
                • <code className="text-accent">shell</code> - Shell command
                execution
              </li>
              <li>
                • <code className="text-accent">slack.notify</code> - Slack
                notifications
              </li>
              <li>
                • <code className="text-accent">git.diff</code> - Git operations
              </li>
              <li>
                • <code className="text-accent">github</code> - GitHub API
                operations (PR diffs, comments, inline reviews)
              </li>
              <li>
                • <code className="text-accent">gitlab</code> - GitLab API
                operations
              </li>
              <li>
                • <code className="text-accent">ai.generate</code> - AI text
                generation
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-2">HTTP Modules</h3>
            <p className="text-sm text-muted-foreground mb-2">
              External services that communicate via HTTP API. Must implement
              the module API contract.
            </p>
            <p className="text-sm text-muted-foreground">
              Example: Jira integration module running as a separate HTTP
              service.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-2">Subprocess Modules</h3>
            <p className="text-sm text-muted-foreground mb-2">
              External binaries executed as subprocesses. Can be pre-compiled or
              run via go run.
            </p>
            <p className="text-sm text-muted-foreground">
              Auto-detected execution mode based on module.yaml configuration.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Module Registry</h2>
        <p className="text-muted-foreground">
          Modules are registered in{" "}
          <code className="text-accent">.shiro/modules/registry.yaml</code>:
        </p>
        <CodeBlock language="yaml">{`modules:
  slack:
    name: "Slack Notifications"
    type: "builtin"
    description: "Send notifications to Slack"
    version: "1.0.0"
  
  jira:
    name: "Jira Integration"
    type: "http"
    endpoints:
      - http://localhost:8080
    config: ".shiro/modules/jira/config.yaml"
    version: "1.0.0"
    
  custom-tool:
    name: "Custom Tool"
    type: "subprocess"
    source: "github.com/user/custom-tool"
    version: "1.0.0"`}</CodeBlock>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Managing Modules</h2>
        <CodeBlock language="bash">{`# List installed modules
shiro module list

# Add a module
shiro add module slack

# Add from GitHub
shiro add module github.com/user/custom-module

# Search for modules
shiro search module jira

# Remove a module
shiro remove module jira`}</CodeBlock>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-2">HTTP Module API Contract</h2>
        <p className="text-muted-foreground mb-4">
          HTTP modules must implement these endpoints:
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <code className="text-accent">POST /execute</code> - Execute the
            module with step configuration
          </li>
          <li>
            <code className="text-accent">GET /metadata</code> - Return module
            metadata and schemas
          </li>
          <li>
            <code className="text-accent">GET /health</code> - Health check
            endpoint
          </li>
        </ul>
      </div>
    </div>
  )
}
