"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import {
  Sparkles,
  Copy,
  Download,
  Share2,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Play,
  Trash2,
  Terminal,
} from "lucide-react"

interface ApiResult {
  workflow?: string
  error?: string
  raw?: string
}

const EXAMPLE_PROMPTS = [
  "Run AI code review on a GitHub pull request",
  "Post a Slack notification when a GitLab MR is created",
  "Clone a git repo, run tests, and post results to Slack",
  "Get diff from GitHub, analyze with AI, and post inline comments",
]

const MODELS = [
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash (Fast)" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro (High Quality)" },
  { id: "gemini-3.5-flash", name: "Gemini 3.5 Flash (Latest)" },
]

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash")
  const [stream, setStream] = useState(false)
  const [result, setResult] = useState<ApiResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalContent, setModalContent] = useState<React.ReactNode>(null)
  const [modalLoading, setModalLoading] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim() || !apiKey.trim()) {
      setResult({ error: "Please provide both a prompt and API key" })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      if (stream) {
        // Streaming response
        const res = await fetch("/api/generate-workflow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            apiKey,
            model: selectedModel,
            stream: true,
          }),
        })

        if (!res.ok) {
          try {
            const error = await res.json()
            setResult({ error: error.error || "Failed to generate workflow" })
          } catch {
            setResult({ error: "Failed to generate workflow" })
          }
          setLoading(false)
          return
        }

        try {
          const reader = res.body?.getReader()
          const decoder = new TextDecoder()
          let fullText = ""

          if (reader) {
            while (true) {
              const { done, value } = await reader.read()
              if (done) break
              const chunk = decoder.decode(value, { stream: true })
              fullText += chunk
              setResult({ workflow: fullText })
            }
          }

          // Try to parse and validate the final result
          try {
            let jsonText = fullText.trim()

            // Try to extract JSON from markdown code blocks first
            const jsonMatch = fullText.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
            if (jsonMatch) {
              jsonText = jsonMatch[1].trim()
            } else {
              // Try to find JSON object boundaries if no code blocks
              const firstBrace = fullText.indexOf("{")
              const lastBrace = fullText.lastIndexOf("}")
              if (
                firstBrace !== -1 &&
                lastBrace !== -1 &&
                lastBrace > firstBrace
              ) {
                jsonText = fullText.substring(firstBrace, lastBrace + 1)
              }
            }

            const workflow = JSON.parse(jsonText)

            if (workflow.name && Array.isArray(workflow.steps)) {
              setResult({ workflow: JSON.stringify(workflow, null, 2) })
            } else {
              setResult({ error: "Invalid workflow structure", raw: fullText })
            }
          } catch {
            setResult({
              error: "Failed to parse generated JSON",
              raw: fullText,
            })
          }
        } catch (streamError) {
          console.error("Streaming error:", streamError)
          setResult({ error: "Streaming failed. Try without streaming." })
        }
      } else {
        // Non-streaming response
        const res = await fetch("/api/generate-workflow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, apiKey, model: selectedModel }),
        })

        const data: ApiResult = await res.json()
        console.log("API response:", data)
        setResult(data)
      }
    } catch {
      setResult({ error: "Failed to reach generation API" })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (result?.workflow) {
      navigator.clipboard.writeText(result.workflow)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    if (result?.workflow) {
      const blob = new Blob([result.workflow], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "workflow.json"
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleShare = () => {
    if (result?.workflow) {
      const encoded = encodeURIComponent(result.workflow)
      const url = `${window.location.origin}/tools/generator?workflow=${encoded}`
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClearToken = () => {
    setApiKey("")
  }

  const handleValidate = async () => {
    if (!result?.workflow) return

    setModalLoading(true)
    setModalTitle("Validating Workflow...")
    setModalContent(
      <div className="flex items-center justify-center py-8">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
    setModalOpen(true)

    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflow: result.workflow }),
      })
      const data = await res.json()

      setModalTitle("Validation Result")
      setModalContent(
        <div className="space-y-4">
          <div
            className={`flex items-center gap-3 rounded-lg border p-4 ${
              data.error || data.valid === false
                ? "border-red-500/40 bg-red-500/5"
                : "border-green-500/40 bg-green-500/5"
            }`}
          >
            {data.error ? (
              <AlertCircle className="size-5 shrink-0 text-red-500" />
            ) : data.valid ? (
              <CheckCircle2 className="size-5 shrink-0 text-green-500" />
            ) : (
              <AlertCircle className="size-5 shrink-0 text-red-500" />
            )}
            <div>
              <p className="font-semibold text-sm">
                {data.error
                  ? data.fallback
                    ? "shiro not available"
                    : "Validation error"
                  : data.valid
                    ? "Workflow is valid"
                    : "Workflow has errors"}
              </p>
              {data.error && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {data.error}
                </p>
              )}
            </div>
          </div>
          {data.output && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Terminal className="size-3.5 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  shiro output
                </h3>
              </div>
              <div className="overflow-hidden rounded-lg border border-border bg-[var(--code-bg)]">
                <div className="border-b border-border/50 px-4 py-2 text-xs text-muted-foreground font-mono">
                  $ shiro validate -workflow workflow.json
                </div>
                <pre className="overflow-x-auto p-4 text-sm font-mono text-slate-300 whitespace-pre-wrap">
                  {data.output}
                </pre>
              </div>
            </div>
          )}
        </div>
      )
    } catch {
      setModalTitle("Error")
      setModalContent(
        <div className="flex items-center gap-3 rounded-lg border border-red-500/40 bg-red-500/5 p-4">
          <AlertCircle className="size-5 shrink-0 text-red-500" />
          <p className="font-semibold text-sm">
            Failed to reach validation API
          </p>
        </div>
      )
    } finally {
      setModalLoading(false)
    }
  }

  const handleDryRun = async () => {
    if (!result?.workflow) return

    setModalLoading(true)
    setModalTitle("Running Dry-Run...")
    setModalContent(
      <div className="flex items-center justify-center py-8">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
    setModalOpen(true)

    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflow: result.workflow }),
      })
      const data = await res.json()

      setModalTitle("Dry-Run Result")
      setModalContent(
        <div className="space-y-4">
          <div
            className={`flex items-center gap-3 rounded-lg border p-4 ${
              data.error || data.valid === false
                ? "border-red-500/40 bg-red-500/5"
                : "border-green-500/40 bg-green-500/5"
            }`}
          >
            {data.error ? (
              <AlertCircle className="size-5 shrink-0 text-red-500" />
            ) : data.valid ? (
              <CheckCircle2 className="size-5 shrink-0 text-green-500" />
            ) : (
              <AlertCircle className="size-5 shrink-0 text-red-500" />
            )}
            <div>
              <p className="font-semibold text-sm">
                {data.error
                  ? data.fallback
                    ? "shiro not available"
                    : "Dry-run failed"
                  : data.valid
                    ? "Dry-run successful"
                    : "Dry-run has errors"}
              </p>
              {data.error && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {data.error}
                </p>
              )}
            </div>
          </div>
          {data.output && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Terminal className="size-3.5 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  shiro output
                </h3>
              </div>
              <div className="overflow-hidden rounded-lg border border-border bg-[var(--code-bg)]">
                <div className="border-b border-border/50 px-4 py-2 text-xs text-muted-foreground font-mono">
                  $ shiro run -dry-run -workflow workflow.json
                </div>
                <pre className="overflow-x-auto p-4 text-sm font-mono text-slate-300 whitespace-pre-wrap">
                  {data.output}
                </pre>
              </div>
            </div>
          )}
        </div>
      )
    } catch {
      setModalTitle("Error")
      setModalContent(
        <div className="flex items-center gap-3 rounded-lg border border-red-500/40 bg-red-500/5 p-4">
          <AlertCircle className="size-5 shrink-0 text-red-500" />
          <p className="font-semibold text-sm">Failed to reach dry-run API</p>
        </div>
      )
    } finally {
      setModalLoading(false)
    }
  }

  const formatJson = (json: string) => {
    try {
      return JSON.stringify(JSON.parse(json), null, 2)
    } catch {
      return json
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-primary font-medium mb-2">
          <Sparkles className="size-4" />
          <span>Powered by Google Gemini</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          AI Workflow Generator
        </h1>
        <p className="text-muted-foreground">
          Describe your workflow in plain English and let AI generate valid
          Shiro workflow JSON.
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4 space-y-2">
        <div className="flex items-center gap-2 text-blue-500 text-sm font-medium">
          <AlertCircle className="size-4" />
          Privacy Notice
        </div>
        <p className="text-xs text-muted-foreground">
          Your Gemini API key is never stored on our servers. It is sent
          directly to Google&apos;s API and not persisted in your browser.
          You&apos;ll need to re-enter it on each visit.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <div className="space-y-4">
          {/* API Key Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Gemini API Key</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Gemini API key"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showApiKey ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {apiKey && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleClearToken}
                  title="Clear token"
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Model Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">AI Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stream Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="stream"
              checked={stream}
              onChange={(e) => setStream(e.target.checked)}
              className="rounded border-border"
            />
            <label htmlFor="stream" className="text-sm text-muted-foreground">
              Stream response (see generation in real-time)
            </label>
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Your Requirement</label>
              <select
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="text-xs text-muted-foreground bg-transparent border-none focus:outline-none cursor-pointer"
              >
                <option value="">Load example...</option>
                {EXAMPLE_PROMPTS.map((example, i) => (
                  <option key={i} value={example}>
                    {example}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want your workflow to do..."
              className="h-[300px] w-full rounded-lg border border-border bg-background p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim() || !apiKey.trim()}
            className="w-full gap-2 bg-primary text-primary-foreground hover:opacity-90"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {loading ? "Generating workflow..." : "Generate Workflow"}
          </Button>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          {!result && !loading && (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
              <Sparkles className="mb-3 size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Generated workflow JSON will appear here
              </p>
            </div>
          )}

          {loading && (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-lg border border-border p-8 text-center">
              <Loader2 className="mb-3 size-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Generating workflow with Gemini...
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Status */}
              {result.error ? (
                <div className="flex items-center gap-3 rounded-lg border border-red-500/40 bg-red-500/5 p-4">
                  <AlertCircle className="size-5 shrink-0 text-red-500" />
                  <div>
                    <p className="font-semibold text-sm">Generation failed</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {result.error}
                    </p>
                    {result.error.includes("high demand") && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Try switching to a different model or wait a moment.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-lg border border-green-500/40 bg-green-500/5 p-4">
                  <CheckCircle2 className="size-5 shrink-0 text-green-500" />
                  <p className="font-semibold text-sm">Workflow generated</p>
                </div>
              )}

              {/* JSON Output */}
              {result.workflow && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-3.5 text-muted-foreground" />
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        workflow.json
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className="gap-1.5"
                      >
                        {copied ? (
                          <CheckCircle2 className="size-3.5" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                        {copied ? "Copied" : "Copy"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        className="gap-1.5"
                      >
                        <Download className="size-3.5" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShare}
                        className="gap-1.5"
                      >
                        <Share2 className="size-3.5" />
                        Share
                      </Button>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-border bg-[var(--code-bg)]">
                    <pre className="overflow-x-auto p-4 text-sm font-mono text-slate-300 whitespace-pre-wrap">
                      {formatJson(result.workflow)}
                    </pre>
                  </div>

                  {/* Validate and Dry-Run Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleValidate}
                      disabled={modalLoading}
                      className="gap-1.5 flex-1"
                    >
                      <Play className="size-3.5" />
                      Validate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDryRun}
                      disabled={modalLoading}
                      className="gap-1.5 flex-1"
                    >
                      <Terminal className="size-3.5" />
                      Dry-Run
                    </Button>
                  </div>
                </div>
              )}

              {/* Raw output for debugging */}
              {result.raw && (
                <details className="rounded-lg border border-border">
                  <summary className="px-4 py-2 text-xs font-medium cursor-pointer hover:bg-muted/50">
                    Show raw response
                  </summary>
                  <pre className="p-4 text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                    {result.raw}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
      >
        {modalContent}
      </Modal>
    </div>
  )
}
