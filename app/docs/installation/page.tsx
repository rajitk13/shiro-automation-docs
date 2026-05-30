import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Installation - Shiro Documentation",
  description: "Install Shiro Automation on any platform",
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

export default function InstallationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Installation</h1>
        <p className="text-xl text-muted-foreground">
          Install Shiro on macOS, Linux, or Windows. Docker is the recommended
          method — no dependencies required.
        </p>
      </div>

      <div className="space-y-6">
        {/* ── Option 1: Docker (Recommended) ── */}
        <div className="space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-5">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Option 1: Docker</h2>
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
              Recommended
            </span>
          </div>
          <p className="text-muted-foreground">
            Pull the pre-built image from GitHub Container Registry. No Go
            toolchain or platform binary needed.
          </p>
          <CodeBlock>{`# Pull the latest image
docker pull ghcr.io/rajitk13/shiro-automation:latest

# Verify
docker run --rm ghcr.io/rajitk13/shiro-automation:latest shiro version`}</CodeBlock>

          <p className="text-sm text-muted-foreground pt-1">
            Run workflows by mounting your project directory:
          </p>
          <CodeBlock>{`docker run --rm \\
  -v $(pwd):/workspace \\
  -w /workspace \\
  ghcr.io/rajitk13/shiro-automation:latest \\
  shiro run`}</CodeBlock>

          <p className="text-sm text-muted-foreground pt-1">
            Pin to a specific build tag for reproducible CI:
          </p>
          <CodeBlock>{`docker pull ghcr.io/rajitk13/shiro-automation:v20260525-103919-ba52c2c`}</CodeBlock>
        </div>

        {/* ── Option 2: Auto-Detect Script ── */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">
            Option 2: Auto-Detect Script
          </h2>
          <p className="text-muted-foreground">
            Detects your platform and installs the correct binary automatically.
          </p>
          <CodeBlock>{`curl -sSL https://raw.githubusercontent.com/rajitk13/shiro-automation/master/scripts/install-auto.sh | bash`}</CodeBlock>
        </div>

        {/* ── Option 3: Pre-built Binaries ── */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">
            Option 3: Pre-built Binaries
          </h2>
          <p className="text-muted-foreground">
            Download directly from GitHub releases:
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">
                macOS (Apple Silicon)
              </h3>
              <CodeBlock>{`curl -LO https://github.com/rajitk13/shiro-automation/releases/latest/download/shiro-darwin-arm64
chmod +x shiro-darwin-arm64
sudo mv shiro-darwin-arm64 /usr/local/bin/shiro`}</CodeBlock>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">macOS (Intel)</h3>
              <CodeBlock>{`curl -LO https://github.com/rajitk13/shiro-automation/releases/latest/download/shiro-darwin-amd64
chmod +x shiro-darwin-amd64
sudo mv shiro-darwin-amd64 /usr/local/bin/shiro`}</CodeBlock>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">Linux (AMD64)</h3>
              <CodeBlock>{`curl -LO https://github.com/rajitk13/shiro-automation/releases/latest/download/shiro-linux-amd64
chmod +x shiro-linux-amd64
sudo mv shiro-linux-amd64 /usr/local/bin/shiro`}</CodeBlock>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">Linux (ARM64)</h3>
              <CodeBlock>{`curl -LO https://github.com/rajitk13/shiro-automation/releases/latest/download/shiro-linux-arm64
chmod +x shiro-linux-arm64
sudo mv shiro-linux-arm64 /usr/local/bin/shiro`}</CodeBlock>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">Windows (AMD64)</h3>
              <CodeBlock>{`curl -LO https://github.com/rajitk13/shiro-automation/releases/latest/download/shiro-windows-amd64.exe
# Move to a directory in your PATH and rename to shiro.exe`}</CodeBlock>
            </div>
          </div>
        </div>

        {/* ── Option 4: Build from Source ── */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Option 4: Build from Source</h2>
          <p className="text-muted-foreground">Requires Go 1.23 or later.</p>
          <CodeBlock>{`git clone https://github.com/rajitk13/shiro-automation.git
cd shiro-automation
go build -o shiro ./cmd/runtime
sudo mv shiro /usr/local/bin/`}</CodeBlock>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-2">Verify Installation</h2>
        <p className="text-muted-foreground mb-4">
          After installation, verify Shiro is working:
        </p>
        <CodeBlock>{`shiro version
shiro help`}</CodeBlock>
      </div>

      <div className="rounded-lg border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-6">
        <h2 className="text-xl font-semibold mb-2">Next Steps</h2>
        <p className="text-muted-foreground">
          Now that you have Shiro installed, initialize your first project:
        </p>
        <div className="mt-4">
          <CodeBlock>{`shiro init
shiro run`}</CodeBlock>
        </div>
      </div>
    </div>
  )
}
