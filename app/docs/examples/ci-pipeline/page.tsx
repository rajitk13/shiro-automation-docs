import { Metadata } from "next"

export const metadata: Metadata = {
  title: "CI Pipeline - Shiro Examples",
  description: "Build, test, and deploy with a Shiro CI pipeline",
}

function CodeBlock({
  children,
  language = "bash",
  plain = false,
}: {
  children: string
  language?: string
  plain?: boolean
}) {
  if (plain) {
    return (
      <pre className="overflow-x-auto bg-[hsl(var(--code-bg))] p-4 text-sm">
        <code className="text-slate-300 font-mono whitespace-pre">
          {children}
        </code>
      </pre>
    )
  }
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

export default function CIPipelinePage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm font-medium text-primary mb-2">Examples</div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">CI Pipeline</h1>
        <p className="text-xl text-muted-foreground">
          A realistic build → test → deploy pipeline using shell commands and
          environment variables.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Overview</h2>
        <p className="text-muted-foreground">
          This example chains four steps — checkout, build, test, and deploy —
          using the{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
            shell
          </code>{" "}
          module. Steps run only when their dependencies succeed, giving you a
          safe, ordered pipeline.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Workflow File</h2>
        <CodeBlock language="json">{`{
  "name": "ci-pipeline",
  "description": "Build, test, and deploy",
  "inputs": {
    "environment": "staging",
    "image_tag": "{{env.COMMIT_SHA}}"
  },
  "steps": [
    {
      "id": "checkout",
      "type": "shell",
      "config": {
        "command": "git fetch --depth=1 && git checkout {{env.COMMIT_SHA}}"
      }
    },
    {
      "id": "build",
      "type": "shell",
      "config": {
        "command": "docker build -t myapp:{{inputs.image_tag}} .",
        "shell": "bash"
      },
      "depends_on": ["checkout"]
    },
    {
      "id": "test",
      "type": "shell",
      "config": {
        "command": "docker run --rm myapp:{{inputs.image_tag}} go test ./..."
      },
      "depends_on": ["build"]
    },
    {
      "id": "deploy",
      "type": "shell",
      "config": {
        "command": "kubectl set image deployment/myapp app=myapp:{{inputs.image_tag}} --namespace={{inputs.environment}}"
      },
      "depends_on": ["test"]
    }
  ]
}`}</CodeBlock>
      </div>

      <div className="space-y-5">
        <h2 className="text-2xl font-semibold">Add to your CI</h2>

        {/* GitLab */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
            <span className="rounded bg-orange-500/15 px-2 py-0.5 text-xs font-semibold text-orange-400">
              GitLab CI
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              .gitlab-ci.yml
            </span>
          </div>
          <CodeBlock language="yaml" plain>{`stages:
  - deploy

ci-pipeline:
  stage: deploy
  image: ghcr.io/rajitk13/shiro-automation:latest
  variables:
    GITLAB_TOKEN: $GL_TOKEN
  script:
    - shiro run
        -workflow .shiro/workflows/pipeline.json
        -config .shiro/config.yaml
        -state-store gitlab
  artifacts:
    paths:
      - .shiro/state/
    expire_in: 1 day
  only:
    - main
    - merge_requests`}</CodeBlock>
        </div>

        {/* GitHub Actions */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
            <span className="rounded bg-slate-500/15 px-2 py-0.5 text-xs font-semibold text-slate-400">
              GitHub Actions
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              .github/workflows/pipeline.yml
            </span>
          </div>
          <CodeBlock language="yaml" plain>{`name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:

jobs:
  pipeline:
    runs-on: ubuntu-latest
    container:
      image: ghcr.io/rajitk13/shiro-automation:latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Shiro pipeline
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          COMMIT_SHA: \${{ github.sha }}
        run: |
          shiro run \\
            -workflow .shiro/workflows/pipeline.json \\
            -config .shiro/config.yaml \\
            -state-store github

      - uses: actions/upload-artifact@v4
        with:
          name: shiro-state
          path: .shiro/state/`}</CodeBlock>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5 space-y-2">
        <p className="font-semibold text-sm">Tips</p>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li>
            • Use{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
              {"{{env.VAR}}"}
            </code>{" "}
            to inject CI environment variables safely
          </li>
          <li>
            • Add{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
              continue_on_error: true
            </code>{" "}
            to a step to keep the pipeline running even on failure
          </li>
          <li>
            • Parallel steps (no shared dependency) run concurrently
            automatically
          </li>
        </ul>
      </div>
    </div>
  )
}
