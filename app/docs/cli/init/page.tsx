import { Metadata } from "next"

export const metadata: Metadata = {
  title: "shiro init - Shiro Documentation",
  description: "Initialize a new Shiro project with templates",
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

export default function InitCommandPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-primary font-medium mb-2">CLI Command</div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">shiro init</h1>
        <p className="text-xl text-muted-foreground">
          Initialize a new Shiro project in the current directory. Creates the
          .shiro folder structure.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage</h2>
        <CodeBlock>{`shiro init [flags]
shiro init -template <name> [flags]`}</CodeBlock>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Flags</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 text-left font-semibold">Flag</th>
              <th className="py-2 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">-template</td>
              <td className="py-3">Template to use (code-review)</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">-i</td>
              <td className="py-3">Interactive config setup</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">-d</td>
              <td className="py-3">Direct config mode (pass config values)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Examples</h2>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Basic Init</h3>
          <CodeBlock>{`shiro init

# Output:
# Created directory: .shiro
# Created directory: .shiro/workflows
# Created directory: modules
# Created workflow: .shiro/workflow.json
# Created config: .shiro/config.yaml
# Initialized module registry
# Updated .gitignore`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Code Review Template</h3>
          <p className="text-muted-foreground">
            Initialize with AI-powered code review workflow:
          </p>
          <CodeBlock>{`# Interactive mode
shiro init -template code-review -i

# Direct config mode
shiro init -template code-review -d provider=openai -d api_key=sk-... -d model=gpt-4`}</CodeBlock>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-2">Created Structure</h2>
        <CodeBlock language="text">{`.shiro/
├── workflow.json          # Default workflow
├── config.yaml           # AI/model configuration
├── modules/
│   └── registry.yaml     # Module registry
└── workflows/            # Additional workflows`}</CodeBlock>
      </div>
    </div>
  )
}
