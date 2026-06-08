import { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Configuration - Shiro Documentation",
  description: "Configure AI providers and models for Shiro workflows",
}

function CodeBlock({
  children,
  language = "yaml",
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

export default function AIConfigurationPage() {
  return (
    <div className="space-y-10">
      <div>
        <div className="text-sm font-medium text-primary mb-2">AI Features</div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          AI Configuration
        </h1>
        <p className="text-xl text-muted-foreground">
          Shiro resolves AI providers from <code>.shiro/config.yaml</code>.
          Configure any OpenAI-compatible API or a local Ollama instance.
        </p>
      </div>

      {/* Config file location */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Config File</h2>
        <p className="text-muted-foreground">
          Shiro looks for AI config in this priority order:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-2">
          <li>
            <code className="text-primary text-xs">.shiro/config.yaml</code> —
            project-local config (recommended)
          </li>
          <li>
            <code className="text-primary text-xs">configs/models.yaml</code> —
            repo-level fallback
          </li>
        </ol>
        <p className="text-sm text-muted-foreground">
          Run <code className="text-primary text-xs">shiro init</code> to create
          the <code className="text-xs">.shiro/</code> directory.
        </p>
      </div>

      {/* Full config example */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Full Example</h2>
        <CodeBlock language=".shiro/config.yaml">{`models:
  # Ollama — local model, no API key required
  codellama:
    provider: ollama
    model: codellama:34b
    base_url: http://localhost:11434

  llama3:
    provider: ollama
    model: llama3:8b
    base_url: http://localhost:11434

  # OpenAI
  gpt-4:
    provider: openai
    model: gpt-4
    base_url: https://api.openai.com/v1
    api_key: "{{env.OPENAI_API_KEY}}"

  # Any OpenAI-compatible endpoint (vLLM, LM Studio, etc.)
  custom-llm:
    provider: openai
    model: custom-model
    base_url: http://localhost:8000/v1
    api_key: "sk-custom-key"

  # Fully env-driven (good for CI)
  openai-custom:
    provider: openai
    model: "{{env.OPENAI_CUSTOM_MODEL}}"
    base_url: "{{env.OPENAI_CUSTOM_BASE_URL}}"
    api_key: "{{env.OPENAI_CUSTOM_API_KEY}}"`}</CodeBlock>
      </div>

      {/* Model config fields */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Model Fields</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left font-semibold pr-4 w-52">
                  Field
                </th>
                <th className="py-2 text-left font-semibold pr-4 w-32">Type</th>
                <th className="py-2 text-left font-semibold pr-4 w-28">
                  Required
                </th>
                <th className="py-2 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                ["provider", "string", "Yes", "openai or ollama"],
                [
                  "model",
                  "string",
                  "Yes",
                  "Model name (e.g. gpt-4o, llama3:8b, codellama:34b)",
                ],
                [
                  "base_url",
                  "string",
                  "No",
                  "Override the API base URL. Defaults to https://api.openai.com/v1 or http://localhost:11434",
                ],
                [
                  "api_key",
                  "string",
                  "openai only",
                  "Bearer token for the API. Use {{env.VAR}} to read from environment",
                ],
                [
                  "timeout",
                  "number",
                  "No",
                  "Request timeout in seconds. Default: 30",
                ],
                [
                  "skip_tls_verify",
                  "boolean",
                  "No",
                  "Skip TLS certificate verification for self-signed certs",
                ],
              ].map(([field, type_, req, desc]) => (
                <tr key={field} className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code className="text-xs text-primary">{field}</code>
                  </td>
                  <td className="py-3 px-4 text-xs">{type_}</td>
                  <td className="py-3 px-4 text-xs">{req}</td>
                  <td className="py-3 px-4">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Environment variables */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Environment Variable Interpolation
        </h2>
        <p className="text-muted-foreground">
          Any config value wrapped in{" "}
          <code className="text-primary text-xs">{"{{env.VAR}}"}</code> is
          resolved from the environment at runtime. Shiro logs resolution
          attempts but never prints values.
        </p>
        <CodeBlock language="yaml">{`api_key: "{{env.OPENAI_API_KEY}}"
model: "{{env.MY_MODEL}}"
base_url: "{{env.LLM_ENDPOINT}}"`}</CodeBlock>
        <p className="text-sm text-muted-foreground">
          If a referenced variable is not set, Shiro logs a warning and uses an
          empty string — which will cause the provider to fail at request time.
        </p>
      </div>

      {/* Referencing a model in a workflow step */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Using a Model in a Workflow</h2>
        <p className="text-muted-foreground">
          Reference any configured model name via the{" "}
          <code className="text-primary text-xs">model</code> field in an{" "}
          <code className="text-primary text-xs">ai.generate</code> step.
        </p>
        <CodeBlock language="json">{`{
  "id": "summarize",
  "type": "ai.generate",
  "config": {
    "model": "gpt-4",
    "prompt": "Summarize the following diff:\\n{{steps.diff.output.diff}}",
    "system": "You are a senior software engineer reviewing code.",
    "temperature": 0.3,
    "max_tokens": 512
  }
}`}</CodeBlock>
        <p className="text-sm text-muted-foreground">
          The <code className="text-primary text-xs">model</code> value must
          match a key in the <code className="text-xs">models:</code> section of
          your config file.
        </p>
      </div>

      {/* Default provider */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Default Provider Resolution</h2>
        <p className="text-muted-foreground">
          If <code className="text-primary text-xs">provider</code> is omitted
          from a step config, Shiro resolves the provider in this order:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-2">
          <li>
            A provider named{" "}
            <code className="text-xs text-primary">default</code> in the config
          </li>
          <li>The only configured provider (if exactly one is defined)</li>
          <li>
            Falls back to <code className="text-xs text-primary">default</code>{" "}
            — which errors if it does not exist
          </li>
        </ol>
      </div>
    </div>
  )
}
