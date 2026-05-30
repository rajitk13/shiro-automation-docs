import { Metadata } from "next"

export const metadata: Metadata = {
  title: "shiro data - Shiro Documentation",
  description: "Manage workflow data with key-value storage",
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

export default function DataCommandPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-primary font-medium mb-2">CLI Command</div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">shiro data</h1>
        <p className="text-xl text-muted-foreground">
          Manage workflow data with key-value storage. Set, get, delete, and
          list data across workflow executions.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Subcommands</h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">shiro data set</h3>
            <p className="text-muted-foreground">
              Store a key-value pair in the data store.
            </p>
            <CodeBlock>{`shiro data set <key> <value> [flags]

# Examples
shiro data set build_status success
shiro data set deploy_version "v1.2.3" -namespace production
shiro data set temp_token abc123 -ttl 1h`}</CodeBlock>
            <table className="w-full text-sm mt-4">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 text-left font-semibold">Flag</th>
                  <th className="py-2 text-left font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-3 font-mono text-accent">-namespace</td>
                  <td className="py-3">Namespace for the key</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 font-mono text-accent">-ttl</td>
                  <td className="py-3">
                    Time-to-live (e.g., &apos;24h&apos;, &apos;1h30m&apos;)
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 font-mono text-accent">-state-store</td>
                  <td className="py-3">
                    State store type (memory, filesystem, gitlab)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">shiro data get</h3>
            <p className="text-muted-foreground">
              Retrieve a value from the data store.
            </p>
            <CodeBlock>{`shiro data get <key> [flags]

# Examples
shiro data get build_status
shiro data get deploy_version -namespace production`}</CodeBlock>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">shiro data delete</h3>
            <p className="text-muted-foreground">
              Delete a key from the data store.
            </p>
            <CodeBlock>{`shiro data delete <key> [flags]

# Examples
shiro data delete temp_token
shiro data delete old_data -namespace staging`}</CodeBlock>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">shiro data list</h3>
            <p className="text-muted-foreground">
              List all keys in the data store.
            </p>
            <CodeBlock>{`shiro data list [flags]

# Examples
shiro data list
shiro data list -namespace production`}</CodeBlock>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-2">Using Data in Workflows</h2>
        <p className="text-muted-foreground mb-4">
          Access stored data in workflows using the template syntax:
        </p>
        <CodeBlock language="json">{`{
  "id": "check_status",
  "type": "print",
  "config": {
    "message": "Build status: {{data.build_status}}"
  }
}`}</CodeBlock>
      </div>
    </div>
  )
}
