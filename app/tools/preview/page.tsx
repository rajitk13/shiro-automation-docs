"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Loader2,
  Terminal,
  Eye,
} from "lucide-react"

interface ApiResult {
  valid?: boolean
  output?: string
  error?: string
  fallback?: boolean
}

const EXAMPLE_WORKFLOW = JSON.stringify(
  {
    name: "example-workflow",
    description: "Example workflow with print module",
    steps: [
      {
        id: "step1",
        type: "print",
        config: { message: "Hello from Shiro!", level: "info" },
      },
      {
        id: "step2",
        type: "print",
        config: { message: "Step 2 executed", level: "info" },
        depends_on: ["step1"],
      },
    ],
  },
  null,
  2
)

export default function PreviewPage() {
  const [json, setJson] = useState(EXAMPLE_WORKFLOW)
  const [result, setResult] = useState<ApiResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handlePreview = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflow: json }),
      })
      const data: ApiResult = await res.json()
      setResult(data)
    } catch {
      setResult({ error: "Failed to reach preview API", fallback: true })
    } finally {
      setLoading(false)
    }
  }

  const statusColor =
    result?.error || result?.valid === false
      ? "border-red-500/40 bg-red-500/5"
      : "border-green-500/40 bg-green-500/5"

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-primary font-medium mb-2">
          <Eye className="size-4" />
          <span>
            Powered by <code className="text-xs">shiro run -dry-run</code>
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Workflow Preview
        </h1>
        <p className="text-muted-foreground">
          Paste your workflow JSON below to preview the execution plan without
          actually running it. This shows the DAG order, step types, environment
          variables, and state store configuration.
        </p>
      </div>

      <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
        <div className="flex items-center gap-2 text-blue-500 text-sm font-medium mb-2">
          <AlertTriangle className="size-4" />
          Dry-Run Mode
        </div>
        <p className="text-xs text-muted-foreground">
          This tool runs <code className="text-xs">shiro run -dry-run</code>{" "}
          which validates your workflow and shows the execution plan, but does
          not execute any modules. Use this to debug workflow configuration and
          understand execution order before running.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">workflow.json</label>
            <button
              onClick={() => setJson(EXAMPLE_WORKFLOW)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Load example
            </button>
          </div>
          <div className="relative overflow-hidden rounded-lg border border-border bg-[var(--code-bg)]">
            <div className="flex items-center gap-1.5 border-b border-border/50 px-4 py-2">
              <span className="size-2.5 rounded-full bg-red-500/70" />
              <span className="size-2.5 rounded-full bg-yellow-500/70" />
              <span className="size-2.5 rounded-full bg-green-500/70" />
              <span className="ml-2 text-xs text-muted-foreground font-mono">
                workflow.json
              </span>
            </div>
            <textarea
              value={json}
              onChange={(e) => setJson(e.target.value)}
              className="h-[460px] w-full bg-transparent p-4 font-mono text-sm text-slate-300 focus:outline-none resize-none"
              placeholder="Paste your workflow JSON here..."
              spellCheck={false}
            />
          </div>
          <Button
            onClick={handlePreview}
            disabled={loading}
            className="w-full gap-2 bg-primary text-primary-foreground hover:opacity-90"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Play className="size-4" />
            )}
            {loading ? "Running dry-run..." : "Run dry-run preview"}
          </Button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {!result && !loading && (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
              <Eye className="mb-3 size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Output from <code className="text-xs">shiro run -dry-run</code>{" "}
                will appear here
              </p>
            </div>
          )}

          {loading && (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-lg border border-border p-8 text-center">
              <Loader2 className="mb-3 size-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Running dry-run preview...
              </p>
            </div>
          )}

          {result && (
            <>
              {/* Status badge */}
              <div
                className={`flex items-center gap-3 rounded-lg border p-4 ${statusColor}`}
              >
                {result.error ? (
                  <XCircle className="size-5 shrink-0 text-red-500" />
                ) : result.valid ? (
                  <CheckCircle2 className="size-5 shrink-0 text-green-500" />
                ) : (
                  <XCircle className="size-5 shrink-0 text-red-500" />
                )}
                <div>
                  <p className="font-semibold text-sm">
                    {result.error
                      ? result.fallback
                        ? "shiro not available"
                        : "Preview error"
                      : result.valid
                        ? "Workflow preview ready"
                        : "Workflow has errors"}
                  </p>
                  {result.error && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {result.error}
                    </p>
                  )}
                </div>
              </div>

              {/* shiro not in PATH notice */}
              {result.fallback && (
                <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-yellow-500 text-sm font-medium">
                    <AlertTriangle className="size-4" />
                    shiro binary not found in PATH
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Install Shiro so the server can run dry-run preview:
                  </p>
                  <pre className="text-xs bg-[var(--code-bg)] rounded p-3 text-slate-300 overflow-x-auto">
                    <code>{`curl -LO https://github.com/rajitk13/shiro-automation/releases/latest/download/shiro-$(uname -s | tr '[:upper:]' '[:lower:]')-amd64\nchmod +x shiro-* && sudo mv shiro-* /usr/local/bin/shiro`}</code>
                  </pre>
                </div>
              )}

              {/* Raw shiro output */}
              {result.output && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="size-3.5 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      dry-run output
                    </h3>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-border bg-[var(--code-bg)]">
                    <div className="border-b border-border/50 px-4 py-2 text-xs text-muted-foreground font-mono">
                      $ shiro run -dry-run -workflow workflow.json
                    </div>
                    <pre className="overflow-x-auto p-4 text-sm font-mono text-slate-300 whitespace-pre-wrap">
                      {result.output}
                    </pre>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
