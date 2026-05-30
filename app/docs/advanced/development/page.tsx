import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Module Development - Shiro Documentation",
  description: "Build and publish Shiro-compatible modules",
}

function CodeBlock({
  children,
  language = "go",
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

function Step({
  n,
  title,
  children,
}: {
  n: number
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary mt-0.5">
        {n}
      </div>
      <div className="space-y-3 flex-1">
        <h3 className="font-semibold text-lg">{title}</h3>
        {children}
      </div>
    </div>
  )
}

export default function ModuleDevelopmentPage() {
  return (
    <div className="space-y-10">
      <div>
        <div className="text-sm font-medium text-primary mb-2">Advanced</div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Module Development
        </h1>
        <p className="text-xl text-muted-foreground">
          Build a Go module that compiles directly into Shiro. Modules implement
          a simple two-method interface and are registered via{" "}
          <code>shiro add module</code>.
        </p>
      </div>

      {/* Prerequisites */}
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold">Prerequisites</h2>
        <ul className="space-y-1 text-sm text-muted-foreground ml-2">
          <li>• Go 1.21+</li>
          <li>
            • <code className="text-xs text-primary">shiro</code> binary
            installed
          </li>
          <li>• GitHub repo for publishing (or local path for development)</li>
        </ul>
      </div>

      {/* Steps */}
      <div className="space-y-8">
        <Step n={1} title="Create the Go module">
          <CodeBlock language="bash">{`mkdir shiro-mymodule && cd shiro-mymodule
go mod init github.com/your-org/shiro-mymodule`}</CodeBlock>
        </Step>

        <Step n={2} title="Implement the Module interface">
          <p className="text-sm text-muted-foreground">
            Create{" "}
            <code className="text-xs text-primary">mymodule/mymodule.go</code>.
            Your struct must implement both{" "}
            <code className="text-xs text-primary">Run</code> and{" "}
            <code className="text-xs text-primary">Metadata</code>.
          </p>
          <CodeBlock language="go">{`package mymodule

import (
    "context"
    "fmt"
    "reflect"
)

// SchemaField mirrors modules.SchemaField — copy this to avoid importing
// shiro internal packages directly.
type SchemaField struct {
    Type        string      \`json:"type"\`
    Description string      \`json:"description"\`
    Required    bool        \`json:"required"\`
    Default     interface{} \`json:"default,omitempty"\`
}

type ModuleMetadata struct {
    Name         string                 \`json:"name"\`
    Description  string                 \`json:"description"\`
    InputSchema  map[string]SchemaField \`json:"input_schema"\`
    OutputSchema map[string]SchemaField \`json:"output_schema"\`
}

type MyModule struct{}

func NewMyModule() *MyModule { return &MyModule{} }

// Run is called by Shiro for each step. Extract config from the step,
// perform your logic, and return output as map[string]interface{}.
func (m *MyModule) Run(ctx context.Context, stepCtx interface{}, step interface{}) (map[string]interface{}, error) {
    cfg, err := extractConfig(step)
    if err != nil {
        return nil, err
    }

    input, _ := cfg["input"].(string)
    if input == "" {
        return nil, fmt.Errorf("input is required")
    }

    // ... your logic here ...
    result := "processed: " + input

    return map[string]interface{}{
        "result":  result,
        "success": true,
    }, nil
}

func (m *MyModule) Metadata() ModuleMetadata {
    return ModuleMetadata{
        Name:        "mymodule",
        Description: "Example custom module",
        InputSchema: map[string]SchemaField{
            "input": {Type: "string", Description: "Input value", Required: true},
        },
        OutputSchema: map[string]SchemaField{
            "result":  {Type: "string", Description: "Processed output"},
            "success": {Type: "boolean", Description: "Success flag"},
        },
    }
}

// extractConfig pulls Config from the Shiro workflow.Step via reflection.
// This avoids importing shiro's internal/workflow package.
func extractConfig(step interface{}) (map[string]interface{}, error) {
    if step == nil {
        return map[string]interface{}{}, nil
    }
    v := reflect.ValueOf(step)
    if v.Kind() == reflect.Ptr {
        if v.IsNil() {
            return map[string]interface{}{}, nil
        }
        v = v.Elem()
    }
    if v.Kind() == reflect.Struct {
        f := v.FieldByName("Config")
        if f.IsValid() && !f.IsNil() {
            if cfg, ok := f.Interface().(map[string]interface{}); ok {
                return cfg, nil
            }
        }
        return map[string]interface{}{}, nil
    }
    return nil, fmt.Errorf("unexpected step type %T", step)
}`}</CodeBlock>
        </Step>

        <Step n={3} title="Add a module.yaml">
          <CodeBlock language="module.yaml">{`name: mymodule
type: builtin
description: "Example custom module"
version: 1.0.0
source: https://github.com/your-org/shiro-mymodule
factory: NewMyModule`}</CodeBlock>
        </Step>

        <Step n={4} title="Push to GitHub and register">
          <CodeBlock language="bash">{`git push origin main

# In your project directory:
shiro add module github.com/your-org/shiro-mymodule`}</CodeBlock>
          <p className="text-sm text-muted-foreground">
            This adds an entry to{" "}
            <code className="text-xs">.shiro/modules/registry.yaml</code>.
          </p>
        </Step>

        <Step n={5} title="Rebuild Shiro">
          <CodeBlock language="bash">{`# Must be run from the shiro-automation source directory
shiro build`}</CodeBlock>
          <p className="text-sm text-muted-foreground">
            <code className="text-xs text-primary">shiro build</code>{" "}
            code-generates the registry import, runs{" "}
            <code className="text-xs">go mod tidy</code>, and recompiles the
            binary. After this, <code className="text-xs">mymodule</code> is
            available as a step type in all workflows.
          </p>
        </Step>

        <Step n={6} title="Use in a workflow">
          <CodeBlock language="json">{`{
  "id": "my_step",
  "type": "mymodule",
  "config": {
    "input": "hello from shiro"
  }
}`}</CodeBlock>
        </Step>
      </div>

      {/* Tips */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Tips</h2>
        <div className="space-y-3">
          {[
            {
              title: "Use reflection for config extraction",
              desc: "Copy the extractConfig helper from an existing module (e.g. jira-datacenter). Never import shiro internal packages — this creates a circular dependency.",
            },
            {
              title: "Return structured output",
              desc: "The map returned by Run() is available to downstream steps as {{steps.<id>.output.*}}. Use consistent key names.",
            },
            {
              title: "Handle context cancellation",
              desc: "Check ctx.Done() in long-running operations. Shiro may cancel the context on timeout or user interrupt.",
            },
            {
              title: "Test locally before building",
              desc: "Write unit tests for Run() directly. You can mock the step using a simple struct with a Config field.",
            },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="rounded-lg border border-border bg-card p-4 space-y-1"
            >
              <div className="font-medium text-sm">{title}</div>
              <div className="text-sm text-muted-foreground">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5 flex gap-4">
        <div className="text-2xl">📋</div>
        <div>
          <div className="font-medium mb-1">Full API reference</div>
          <p className="text-sm text-muted-foreground">
            See the{" "}
            <Link
              href="/docs/advanced/api"
              className="text-primary hover:underline"
            >
              API Contract
            </Link>{" "}
            for the complete <code className="text-xs">Module</code> interface,
            schema types, and subprocess/HTTP protocol specs.
          </p>
        </div>
      </div>
    </div>
  )
}
