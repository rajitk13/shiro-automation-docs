import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "AI Providers - Shiro Documentation",
  description: "OpenAI-compatible and Ollama AI providers for Shiro",
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

function ProviderCard({
  name,
  badge,
  children,
}: {
  name: string
  badge: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold">{name}</h3>
        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      </div>
      {children}
    </div>
  )
}

export default function AIProvidersPage() {
  return (
    <div className="space-y-10">
      <div>
        <div className="text-sm font-medium text-primary mb-2">AI Features</div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">AI Providers</h1>
        <p className="text-xl text-muted-foreground">
          Shiro ships two built-in provider implementations:{" "}
          <strong>OpenAI-compatible</strong> (cloud or self-hosted) and{" "}
          <strong>Ollama</strong> (local models). Both implement the same{" "}
          <code>Provider</code> interface so they are interchangeable in
          workflow steps.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* OpenAI */}
        <ProviderCard name="openai" badge="cloud / self-hosted">
          <p className="text-sm text-muted-foreground">
            Any API that speaks the OpenAI{" "}
            <code className="text-xs text-primary">/v1/chat/completions</code>{" "}
            protocol — OpenAI, Azure OpenAI, vLLM, LM Studio, Groq, Together AI,
            etc.
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              • Requires <code className="text-xs text-primary">api_key</code>
            </li>
            <li>
              • Default base URL:{" "}
              <code className="text-xs">https://api.openai.com/v1</code>
            </li>
            <li>• Supports custom headers</li>
            <li>
              • Optional{" "}
              <code className="text-xs text-primary">skip_tls_verify</code> for
              self-signed certs
            </li>
            <li>• Streaming supported</li>
          </ul>
        </ProviderCard>

        {/* Ollama */}
        <ProviderCard name="ollama" badge="local">
          <p className="text-sm text-muted-foreground">
            Local model server via{" "}
            <a
              href="https://ollama.ai"
              target="_blank"
              className="text-primary hover:underline"
            >
              Ollama
            </a>
            . No API key required — ideal for air-gapped or private
            environments.
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              • No <code className="text-xs text-primary">api_key</code> needed
            </li>
            <li>
              • Default base URL:{" "}
              <code className="text-xs">http://localhost:11434</code>
            </li>
            <li>
              • Uses <code className="text-xs">/api/chat</code> endpoint
            </li>
            <li>• Streaming supported</li>
            <li>
              • Pull models with{" "}
              <code className="text-xs">ollama pull &lt;model&gt;</code>
            </li>
          </ul>
        </ProviderCard>
      </div>

      {/* OpenAI config */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">OpenAI Provider Config</h2>
        <CodeBlock language=".shiro/config.yaml">{`models:
  gpt-4o:
    provider: openai
    model: gpt-4o
    base_url: https://api.openai.com/v1
    api_key: "{{env.OPENAI_API_KEY}}"
    timeout: 60

  # Azure OpenAI
  azure-gpt4:
    provider: openai
    model: gpt-4
    base_url: https://YOUR_RESOURCE.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT
    api_key: "{{env.AZURE_OPENAI_KEY}}"

  # vLLM / LM Studio / Groq etc.
  groq-llama:
    provider: openai
    model: llama3-8b-8192
    base_url: https://api.groq.com/openai/v1
    api_key: "{{env.GROQ_API_KEY}}"`}</CodeBlock>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left font-semibold pr-4 w-36">
                  Field
                </th>
                <th className="py-2 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                [
                  "model",
                  "Model name as accepted by the API (e.g. gpt-4o, gpt-4-turbo)",
                ],
                [
                  "base_url",
                  "Override endpoint. Default: https://api.openai.com/v1",
                ],
                ["api_key", "Bearer token sent as Authorization header"],
                ["timeout", "Request timeout in seconds (default: 30)"],
                [
                  "skip_tls_verify",
                  "Disable TLS cert check — useful for internal servers with self-signed certs",
                ],
                ["headers", "Map of extra HTTP headers to include in requests"],
              ].map(([f, d]) => (
                <tr key={f} className="border-b border-border/50">
                  <td className="py-3 pr-4">
                    <code className="text-xs text-primary">{f}</code>
                  </td>
                  <td className="py-3">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ollama config */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Ollama Provider Config</h2>
        <CodeBlock language=".shiro/config.yaml">{`models:
  codellama:
    provider: ollama
    model: codellama:34b
    base_url: http://localhost:11434
    timeout: 120          # longer timeout for local inference

  llama3:
    provider: ollama
    model: llama3:8b      # faster, less capable

  mistral:
    provider: ollama
    model: mistral:7b`}</CodeBlock>

        <p className="text-sm text-muted-foreground">
          Pull a model before running workflows:
        </p>
        <CodeBlock language="bash">{`ollama pull codellama:34b
ollama pull llama3:8b`}</CodeBlock>
      </div>

      {/* Provider interface */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Provider Interface</h2>
        <p className="text-muted-foreground text-sm">
          Both providers implement the same Go interface — they are fully
          interchangeable. See the{" "}
          <Link
            href="/docs/advanced/api"
            className="text-primary hover:underline"
          >
            API Contract
          </Link>{" "}
          for details.
        </p>
        <CodeBlock language="go">{`type Provider interface {
    Generate(ctx context.Context, req *GenerateRequest) (*GenerateResponse, error)
    Stream(ctx context.Context, req *GenerateRequest) (<-chan StreamChunk, error)
    Close() error
}

type GenerateRequest struct {
    Model       string    // Model name
    Messages    []Message // Chat messages
    System      string    // System prompt
    Temperature float64
    MaxTokens   int
    TopP        float64
}`}</CodeBlock>
      </div>
    </div>
  )
}
