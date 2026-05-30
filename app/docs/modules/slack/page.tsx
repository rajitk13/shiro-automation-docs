import { Metadata } from "next"

export const metadata: Metadata = {
  title: "slack.notify Module - Shiro Documentation",
  description: "Send Slack notifications from workflows",
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

export default function SlackModulePage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-primary font-medium mb-2">
          Built-in Module
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">slack.notify</h1>
        <p className="text-xl text-muted-foreground">
          Send rich notifications to Slack channels via incoming webhooks.
          Supports human-in-loop approval flows.
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
              <td className="py-3 font-mono text-accent">webhook_url</td>
              <td className="py-3">string</td>
              <td className="py-3">Yes</td>
              <td className="py-3">Slack incoming webhook URL</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">message</td>
              <td className="py-3">string</td>
              <td className="py-3">Yes</td>
              <td className="py-3">Message text to send</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">channel</td>
              <td className="py-3">string</td>
              <td className="py-3">No</td>
              <td className="py-3">
                Override the webhook&apos;s default channel
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">
                gitlab_pipeline_url
              </td>
              <td className="py-3">string</td>
              <td className="py-3">No</td>
              <td className="py-3">GitLab pipeline URL for approval button</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 font-mono text-accent">button_text</td>
              <td className="py-3">string</td>
              <td className="py-3">No</td>
              <td className="py-3">
                Text on the action button (default: &quot;Review in
                GitLab&quot;)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Examples</h2>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Simple Notification</h3>
          <CodeBlock>{`{
  "id": "notify",
  "type": "slack.notify",
  "config": {
    "webhook_url": "{{env.SLACK_WEBHOOK_URL}}",
    "message": "Deployment to production completed!"
  }
}`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">With Channel Override</h3>
          <CodeBlock>{`{
  "id": "notify_team",
  "type": "slack.notify",
  "config": {
    "webhook_url": "{{env.SLACK_WEBHOOK_URL}}",
    "channel": "#deployments",
    "message": "Build {{env.CI_COMMIT_SHA}} is ready for review"
  }
}`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">
            Approval Request (Human-in-Loop)
          </h3>
          <CodeBlock>{`{
  "id": "request_approval",
  "type": "slack.notify",
  "pause": true,
  "config": {
    "webhook_url": "{{env.SLACK_WEBHOOK_URL}}",
    "channel": "#deployments",
    "message": "Production deployment is ready. Please review and approve.",
    "gitlab_pipeline_url": "{{env.CI_SERVER_URL}}/{{env.CI_PROJECT_ID}}/-/pipelines/{{env.CI_PIPELINE_ID}}",
    "button_text": "Approve Deployment"
  }
}`}</CodeBlock>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-2">Setup</h2>
        <p className="text-muted-foreground mb-2">
          Create an incoming webhook in Slack:
        </p>
        <ol className="space-y-1 text-sm text-muted-foreground">
          <li>1. Go to your Slack workspace → Apps → Incoming Webhooks</li>
          <li>2. Create a new webhook and select a channel</li>
          <li>3. Copy the webhook URL</li>
          <li>
            4. Store it as{" "}
            <code className="text-accent">SLACK_WEBHOOK_URL</code> in your CI
            environment
          </li>
        </ol>
      </div>
    </div>
  )
}
