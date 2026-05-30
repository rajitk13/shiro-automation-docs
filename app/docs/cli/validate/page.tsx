import { Metadata } from "next"

export const metadata: Metadata = {
  title: "shiro validate - Shiro Documentation",
  description: "Validate workflow JSON and CI configuration",
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

export default function ValidateCommandPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-primary font-medium mb-2">CLI Command</div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          shiro validate
        </h1>
        <p className="text-xl text-muted-foreground">
          Validate workflow JSON structure and cross-check against CI
          configuration.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage</h2>
        <CodeBlock>{`shiro validate -workflow <path> [-ci <path>]`}</CodeBlock>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Flags</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 text-left font-semibold">Flag</th>
              <th className="py-2 text-left font-semibold">Required</th>
              <th className="py-2 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">-workflow</td>
              <td className="py-3">Yes</td>
              <td className="py-3">Path to workflow JSON file</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">-ci</td>
              <td className="py-3">No</td>
              <td className="py-3">
                Path to CI config (.gitlab-ci.yml or .github/workflows/)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Examples</h2>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Validate Workflow Only</h3>
          <CodeBlock>{`shiro validate -workflow .shiro/workflow.json`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Validate with GitLab CI</h3>
          <CodeBlock>{`shiro validate -workflow .shiro/workflow.json -ci .gitlab-ci.yml`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Validate with GitHub Actions</h3>
          <CodeBlock>{`shiro validate -workflow .shiro/workflow.json -ci .github/workflows/deploy.yml`}</CodeBlock>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-2">CI Checks</h2>
        <p className="text-muted-foreground mb-4">
          The --ci flag performs cross-checks to catch common misconfigurations:
        </p>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div>
            <strong className="text-foreground">GitLab CI:</strong>
            <ul className="ml-4 mt-1 space-y-1">
              <li>
                • Pause steps require when: manual resume job with needs:
                dependency
              </li>
              <li>
                • Jobs using -state-store gitlab must expose .shiro/ as artifact
              </li>
              <li>
                • Initial jobs should use -fresh flag, resume jobs should not
              </li>
            </ul>
          </div>
          <div>
            <strong className="text-foreground">GitHub Actions:</strong>
            <ul className="ml-4 mt-1 space-y-1">
              <li>• Pause steps should use environment protection rules</li>
              <li>
                • -state-store gitlab is GitLab-specific — use filesystem with
                artifacts
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
