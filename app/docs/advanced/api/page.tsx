import { Metadata } from "next"

export const metadata: Metadata = {
  title: "API Contract - Shiro Documentation",
  description:
    "Complete Shiro module API contract: Go interface, subprocess protocol, HTTP API",
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

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="space-y-4 scroll-mt-20">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {children}
    </div>
  )
}

export default function APIContractPage() {
  return (
    <div className="space-y-12">
      <div>
        <div className="text-sm font-medium text-primary mb-2">Advanced</div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">API Contract</h1>
        <p className="text-xl text-muted-foreground">
          Complete reference for the Shiro module interface — Go types,
          subprocess stdin/stdout protocol, and HTTP microservice API.
        </p>
      </div>

      {/* TOC */}
      <nav className="rounded-lg border border-border bg-card p-4 space-y-1 text-sm">
        <div className="font-medium mb-2 text-xs uppercase tracking-wider text-muted-foreground">
          On this page
        </div>
        {[
          ["#module-interface", "Module interface"],
          ["#module-metadata", "ModuleMetadata & SchemaField"],
          ["#registry", "Registry"],
          ["#subprocess-protocol", "Subprocess protocol"],
          ["#http-api", "HTTP module API"],
          ["#ai-provider", "AI Provider interface"],
        ].map(([href, label]) => (
          <a
            key={href}
            href={href}
            className="block text-muted-foreground hover:text-primary transition-colors py-0.5"
          >
            {label}
          </a>
        ))}
      </nav>

      {/* Module interface */}
      <Section id="module-interface" title="Module Interface">
        <p className="text-muted-foreground">
          All Shiro modules — whether compiled-in Go, subprocess, or HTTP —
          ultimately implement this interface. Compiled Go modules must
          implement it directly.
        </p>
        <CodeBlock language="go">{`// internal/modules/module.go

type Module interface {
    // Run executes the module for a single workflow step.
    // stepCtx contains resolved outputs from upstream steps.
    // step is the workflow.Step struct; extract Config via reflection.
    // Returns output map accessible as {{steps.<id>.output.*}} in downstream steps.
    Run(ctx context.Context, stepCtx interface{}, step interface{}) (map[string]interface{}, error)

    // Metadata returns the module's schema for documentation and validation.
    Metadata() ModuleMetadata
}`}</CodeBlock>
      </Section>

      {/* ModuleMetadata */}
      <Section id="module-metadata" title="ModuleMetadata & SchemaField">
        <CodeBlock language="go">{`type ModuleMetadata struct {
    Name         string                 \`json:"name"\`
    Description  string                 \`json:"description"\`
    InputSchema  map[string]SchemaField \`json:"input_schema"\`
    OutputSchema map[string]SchemaField \`json:"output_schema"\`
}

type SchemaField struct {
    Type        string      \`json:"type"\`        // "string" | "number" | "boolean" | "array" | "object"
    Description string      \`json:"description"\`
    Required    bool        \`json:"required"\`
    Default     interface{} \`json:"default,omitempty"\`
}`}</CodeBlock>
        <p className="text-sm text-muted-foreground">
          Copy these structs into your module package. Do <strong>not</strong>{" "}
          import them from <code className="text-xs">internal/modules</code> —
          that creates circular dependencies.
        </p>
      </Section>

      {/* Registry */}
      <Section id="registry" title="Registry">
        <p className="text-muted-foreground">
          The registry maps module type names to{" "}
          <code className="text-xs text-primary">Module</code> instances.
          Compiled-in modules register themselves at startup via generated code
          in <code className="text-xs">internal/cli/registry.go</code>.
        </p>
        <CodeBlock language="go">{`type Registry struct { /* ... */ }

func NewRegistry() *Registry

// Register adds a module by type name. Returns error if already registered.
func (r *Registry) Register(moduleType string, module Module) error

// Get retrieves a module by type name.
func (r *Registry) Get(moduleType string) (Module, error)

// List returns all registered type names.
func (r *Registry) List() []string

// RegisterHTTPModule adds an HTTP-backed module.
func (r *Registry) RegisterHTTPModule(moduleType string, config *HTTPModuleConfig) error`}</CodeBlock>

        <p className="text-muted-foreground">
          Registry config file format (auto-generated by{" "}
          <code className="text-xs text-primary">shiro add module</code>):
        </p>
        <CodeBlock language=".shiro/modules/registry.yaml">{`modules:
  mymodule:
    name: mymodule
    type: builtin           # builtin | http | subprocess
    package: github.com/your-org/shiro-mymodule
    factory: NewMyModule    # exported constructor function name
    version: "1.0.0"
    description: "My module"
    source: https://github.com/your-org/shiro-mymodule
    added_at: "2025-01-01T00:00:00Z"`}</CodeBlock>
      </Section>

      {/* Subprocess protocol */}
      <Section id="subprocess-protocol" title="Subprocess Protocol">
        <p className="text-muted-foreground">
          Subprocess modules receive a JSON request on <strong>stdin</strong>{" "}
          and must write a JSON response to <strong>stdout</strong>. The binary
          must be named{" "}
          <code className="text-xs text-primary">shiro-&lt;name&gt;</code> and
          placed in
          <code className="text-xs"> .shiro/plugins/</code> or on{" "}
          <code className="text-xs">PATH</code>.
        </p>

        <h3 className="font-semibold text-lg mt-2">Request (stdin)</h3>
        <CodeBlock language="json">{`{
  "action": "operation_name",          // step type or specific operation
  "config": {                          // step.config map
    "key": "value"
  },
  "context": {                         // resolved upstream step outputs
    "steps": {
      "step_id": { "output": { ... } }
    }
  }
}`}</CodeBlock>

        <h3 className="font-semibold text-lg mt-2">Response (stdout)</h3>
        <CodeBlock language="json">{`{
  "output": {                          // returned as steps.<id>.output.*
    "result": "...",
    "success": true
  },
  "error": ""                          // non-empty string causes step failure
}`}</CodeBlock>

        <h3 className="font-semibold text-lg mt-2">Metadata action</h3>
        <p className="text-sm text-muted-foreground">
          Shiro calls the binary with{" "}
          <code className="text-xs text-primary">
            {'"action": "__metadata__"'}
          </code>{" "}
          to fetch schema. Respond with a{" "}
          <code className="text-xs">ModuleMetadata</code> JSON object:
        </p>
        <CodeBlock language="json">{`// Shiro sends:
{ "action": "__metadata__" }

// Binary responds:
{
  "name": "mymodule",
  "description": "Does useful things",
  "input_schema": {
    "key": { "type": "string", "description": "...", "required": true }
  },
  "output_schema": {
    "result": { "type": "string", "description": "..." }
  }
}`}</CodeBlock>

        <h3 className="font-semibold text-lg mt-2">Go types</h3>
        <CodeBlock language="go">{`// SubprocessRequest — sent to the binary via stdin
type SubprocessRequest struct {
    Action  string                 \`json:"action"\`
    Config  map[string]interface{} \`json:"config"\`
    Context map[string]interface{} \`json:"context,omitempty"\`
}

// SubprocessResponse — read from the binary's stdout
type SubprocessResponse struct {
    Output map[string]interface{} \`json:"output"\`
    Error  string                 \`json:"error,omitempty"\`
}`}</CodeBlock>
      </Section>

      {/* HTTP API */}
      <Section id="http-api" title="HTTP Module API">
        <p className="text-muted-foreground">
          HTTP modules are language-agnostic servers that implement two
          endpoints. Register them in the registry with{" "}
          <code className="text-xs text-primary">type: http</code>.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
                POST
              </span>
              <code className="text-sm">/run</code>
            </div>
            <p className="text-sm text-muted-foreground">
              Execute a step. Body is the same JSON as the subprocess stdin
              request.
            </p>
            <CodeBlock language="json">{`// Request body
{
  "action": "operation",
  "config": { "key": "value" },
  "context": { "steps": { ... } }
}

// Response body (200 OK)
{
  "output": { "result": "..." },
  "error": ""
}`}</CodeBlock>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">
                GET
              </span>
              <code className="text-sm">/metadata</code>
            </div>
            <p className="text-sm text-muted-foreground">
              Return module metadata. Response body is a{" "}
              <code className="text-xs">ModuleMetadata</code> JSON object.
            </p>
            <CodeBlock language="json">{`// Response body (200 OK)
{
  "name": "mymodule",
  "description": "...",
  "input_schema": { ... },
  "output_schema": { ... }
}`}</CodeBlock>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Shiro supports multiple endpoints per HTTP module for load balancing —
          specify them as a list under{" "}
          <code className="text-xs text-primary">endpoints</code> in the
          registry.
        </p>
      </Section>

      {/* AI Provider */}
      <Section id="ai-provider" title="AI Provider Interface">
        <p className="text-muted-foreground">
          The <code className="text-xs text-primary">ai.generate</code> module
          resolves providers from{" "}
          <code className="text-xs">.shiro/config.yaml</code>. Built-in
          providers are <code className="text-xs text-primary">openai</code> and{" "}
          <code className="text-xs text-primary">ollama</code>.
        </p>
        <CodeBlock language="go">{`// internal/ai/provider.go

type Provider interface {
    Generate(ctx context.Context, req *GenerateRequest) (*GenerateResponse, error)
    Stream(ctx context.Context, req *GenerateRequest) (<-chan StreamChunk, error)
    Close() error
}

type GenerateRequest struct {
    Model       string            \`json:"model"\`
    Messages    []Message         \`json:"messages"\`
    System      string            \`json:"system,omitempty"\`
    Temperature float64           \`json:"temperature,omitempty"\`
    MaxTokens   int               \`json:"max_tokens,omitempty"\`
    TopP        float64           \`json:"top_p,omitempty"\`
    Metadata    map[string]string \`json:"metadata,omitempty"\`
}

type Message struct {
    Role    string \`json:"role"\`    // "system" | "user" | "assistant"
    Content string \`json:"content"\`
}

type GenerateResponse struct {
    Content      string            \`json:"content"\`
    FinishReason string            \`json:"finish_reason"\`
    Usage        *Usage            \`json:"usage,omitempty"\`
    Metadata     map[string]string \`json:"metadata,omitempty"\`
}

type Usage struct {
    PromptTokens     int \`json:"prompt_tokens"\`
    CompletionTokens int \`json:"completion_tokens"\`
    TotalTokens      int \`json:"total_tokens"\`
}

type ProviderConfig struct {
    Type          string            \`json:"type"\`             // "ollama" | "openai"
    BaseURL       string            \`json:"base_url"\`
    APIKey        string            \`json:"api_key,omitempty"\`
    Model         string            \`json:"model"\`
    Headers       map[string]string \`json:"headers,omitempty"\`
    Timeout       int               \`json:"timeout"\`
    SkipTLSVerify bool              \`json:"skip_tls_verify,omitempty"\`
}`}</CodeBlock>
      </Section>
    </div>
  )
}
