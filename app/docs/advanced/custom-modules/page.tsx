import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Custom Modules - Shiro Documentation",
  description: "Add external and custom modules to Shiro",
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
      <div className="flex items-center border-b border-border/50 px-4 py-2">
        <span className="text-xs text-muted-foreground font-mono">
          {language}
        </span>
      </div>
      <pre className="overflow-x-auto p-4 text-sm">
        <code className="text-slate-300 font-mono whitespace-pre">
          {children}
        </code>
      </pre>
    </div>
  )
}

export default function CustomModulesPage() {
  return (
    <div className="space-y-10">
      <div>
        <div className="text-sm font-medium text-primary mb-2">Advanced</div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Custom Modules
        </h1>
        <p className="text-xl text-muted-foreground">
          Shiro supports three ways to extend it with custom modules:
          compiled-in Go modules, subprocess binaries, and HTTP microservices.
        </p>
      </div>

      {/* Module types overview */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Module Types</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              type: "builtin",
              title: "Compiled-in",
              desc: "Go modules compiled directly into the shiro binary via shiro add module + shiro build. Best performance.",
            },
            {
              type: "subprocess",
              title: "Subprocess Binary",
              desc: "External binary on PATH (shiro-<name>) or in .shiro/plugins/. Communicates via stdin/stdout JSON.",
            },
            {
              type: "http",
              title: "HTTP Microservice",
              desc: "Any HTTP server that implements the Shiro module API. Language-agnostic — Python, Node, Rust, etc.",
            },
          ].map(({ type, title, desc }) => (
            <div
              key={type}
              className="rounded-lg border border-border bg-card p-4 space-y-2"
            >
              <code className="text-xs text-primary">{type}</code>
              <div className="font-medium">{title}</div>
              <div className="text-sm text-muted-foreground">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Compiled-in Go module */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Compiled-in Go Module</h2>
        <p className="text-muted-foreground">
          Use <code className="text-primary text-xs">shiro add module</code> to
          register a Go module from GitHub, then{" "}
          <code className="text-primary text-xs">shiro build</code> to recompile
          the binary.
        </p>
        <CodeBlock language="bash">{`# Register the module (adds to .shiro/modules/registry.yaml)
shiro add module github.com/your-org/your-shiro-module

# Rebuild shiro with the new module compiled in
shiro build`}</CodeBlock>
        <p className="text-sm text-muted-foreground">
          <code className="text-xs text-primary">shiro build</code>{" "}
          auto-generates the registry import in{" "}
          <code className="text-xs">internal/cli/registry.go</code>, runs{" "}
          <code className="text-xs">go mod tidy</code>, and recompiles.
        </p>

        <h3 className="text-lg font-semibold mt-4">Registry entry format</h3>
        <CodeBlock language=".shiro/modules/registry.yaml">{`modules:
  your-module:
    name: your-module
    type: builtin
    package: github.com/your-org/your-shiro-module
    factory: NewYourModule
    version: "1.0.0"
    description: "Description of your module"
    source: https://github.com/your-org/your-shiro-module`}</CodeBlock>
      </div>

      {/* Subprocess module */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Subprocess Binary Module</h2>
        <p className="text-muted-foreground">
          Drop any executable named{" "}
          <code className="text-primary text-xs">shiro-&lt;name&gt;</code> into{" "}
          <code className="text-primary text-xs">.shiro/plugins/</code> or
          anywhere on <code className="text-xs">PATH</code>. Shiro discovers and
          registers it automatically at startup.
        </p>
        <CodeBlock language="bash">{`# Place binary in plugins dir
cp ./shiro-mymodule .shiro/plugins/
chmod +x .shiro/plugins/shiro-mymodule

# Or install to PATH
sudo cp ./shiro-mymodule /usr/local/bin/
chmod +x /usr/local/bin/shiro-mymodule`}</CodeBlock>

        <p className="text-muted-foreground">
          The binary communicates via stdin/stdout JSON:
        </p>
        <CodeBlock language="json">{`// Shiro sends to stdin:
{
  "action": "your_operation",
  "config": { "key": "value" },
  "context": { "steps": { ... } }
}

// Binary responds on stdout:
{
  "output": { "result": "...", "success": true },
  "error": ""
}`}</CodeBlock>

        <p className="text-muted-foreground">
          For metadata, respond to{" "}
          <code className="text-primary text-xs">
            {'"action": "__metadata__"'}
          </code>
          :
        </p>
        <CodeBlock language="json">{`// Shiro sends: {"action": "__metadata__"}
// Binary responds:
{
  "name": "mymodule",
  "description": "Does something useful",
  "input_schema": {
    "key": { "type": "string", "description": "...", "required": true }
  },
  "output_schema": {
    "result": { "type": "string", "description": "..." }
  }
}`}</CodeBlock>
      </div>

      {/* HTTP module */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">HTTP Microservice Module</h2>
        <p className="text-muted-foreground">
          Register any HTTP server as a module in the registry. Shiro will POST
          step configs to it.
        </p>
        <CodeBlock language=".shiro/modules/registry.yaml">{`modules:
  my-http-module:
    name: my-http-module
    type: http
    endpoint: http://localhost:8080
    description: "My HTTP module"`}</CodeBlock>

        <p className="text-muted-foreground text-sm">
          The service must implement two endpoints — see the{" "}
          <a href="/docs/advanced/api" className="text-primary hover:underline">
            API Contract
          </a>{" "}
          for the full spec.
        </p>
      </div>

      {/* Using in a workflow */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Using Custom Modules in Workflows
        </h2>
        <p className="text-muted-foreground">
          Once registered, custom modules are referenced by name in{" "}
          <code className="text-primary text-xs">type</code> just like built-in
          modules.
        </p>
        <CodeBlock language="json">{`{
  "id": "my_step",
  "type": "your-module",
  "config": {
    "key": "value"
  }
}`}</CodeBlock>
      </div>

      <div className="rounded-lg border border-border bg-card p-5 flex gap-4">
        <div className="text-2xl">📖</div>
        <div>
          <div className="font-medium mb-1">
            Want to build a module from scratch?
          </div>
          <p className="text-sm text-muted-foreground">
            See the{" "}
            <Link
              href="/docs/advanced/development"
              className="text-primary hover:underline"
            >
              Module Development
            </Link>{" "}
            guide for a step-by-step walkthrough, and the{" "}
            <Link
              href="/docs/advanced/api"
              className="text-primary hover:underline"
            >
              API Contract
            </Link>{" "}
            for the exact Go interface.
          </p>
        </div>
      </div>
    </div>
  )
}
