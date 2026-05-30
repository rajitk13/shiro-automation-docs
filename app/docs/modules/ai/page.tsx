import { Metadata } from "next"

export const metadata: Metadata = {
  title: "ai.generate Module - Shiro Documentation",
  description: "AI text generation with multiple provider support",
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

export default function AIModulePage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-primary font-medium mb-2">
          Built-in Module
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">ai.generate</h1>
        <p className="text-xl text-muted-foreground">
          Generate text using AI models. Supports Ollama, OpenAI, and custom
          endpoints.
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
              <td className="py-3 font-mono text-accent">prompt</td>
              <td className="py-3">string</td>
              <td className="py-3">Yes</td>
              <td className="py-3">The prompt to send to the AI model</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">model</td>
              <td className="py-3">string</td>
              <td className="py-3">No</td>
              <td className="py-3">Model name (default: from config.yaml)</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">system_prompt</td>
              <td className="py-3">string</td>
              <td className="py-3">No</td>
              <td className="py-3">System instructions for the model</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">max_tokens</td>
              <td className="py-3">number</td>
              <td className="py-3">No</td>
              <td className="py-3">Max tokens in response</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Provider Configuration</h2>
        <p className="text-muted-foreground">
          Configure your AI provider in{" "}
          <code className="text-accent">.shiro/config.yaml</code>:
        </p>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Ollama (Local)</h3>
          <CodeBlock language="yaml">{`ai:
  provider: ollama
  model: llama3.2
  endpoint: http://localhost:11434`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">OpenAI</h3>
          <CodeBlock language="yaml">{`ai:
  provider: openai
  model: gpt-4o
  api_key: "{{env.OPENAI_API_KEY}}"`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Custom Endpoint</h3>
          <CodeBlock language="yaml">{`ai:
  provider: custom
  model: my-model
  endpoint: https://my-ai-api.example.com
  api_key: "{{env.CUSTOM_API_KEY}}"`}</CodeBlock>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Examples</h2>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Code Review</h3>
          <CodeBlock>{`{
  "id": "review",
  "type": "ai.generate",
  "config": {
    "system_prompt": "You are an expert code reviewer. Be concise and actionable.",
    "prompt": "Review this diff and identify issues:\\n{{steps.get_diff.diff}}",
    "model": "gpt-4o"
  },
  "depends_on": ["get_diff"]
}`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Commit Message Generation</h3>
          <CodeBlock>{`{
  "id": "gen_commit_msg",
  "type": "ai.generate",
  "config": {
    "prompt": "Write a conventional commit message for:\\n{{steps.get_diff.diff}}",
    "max_tokens": 100
  },
  "depends_on": ["get_diff"]
}`}</CodeBlock>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-2">Output</h2>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>
            <code className="text-accent">text</code> - Generated text response
          </li>
          <li>
            <code className="text-accent">model</code> - Model used
          </li>
          <li>
            <code className="text-accent">tokens_used</code> - Token count (if
            available)
          </li>
        </ul>
      </div>
    </div>
  )
}
