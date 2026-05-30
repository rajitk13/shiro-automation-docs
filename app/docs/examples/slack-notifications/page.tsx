import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Slack Notifications - Shiro Examples",
  description: "Send deployment and pipeline status updates to Slack",
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

export default function SlackNotificationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm font-medium text-primary mb-2">Examples</div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Slack Notifications
        </h1>
        <p className="text-xl text-muted-foreground">
          Send real-time pipeline status updates and deployment alerts to Slack
          channels.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Simple Notification</h2>
        <p className="text-muted-foreground">
          Notify a channel when a deployment succeeds:
        </p>
        <CodeBlock language="json">{`{
  "name": "deploy-notify",
  "steps": [
    {
      "id": "deploy",
      "type": "shell",
      "config": {
        "command": "kubectl rollout restart deployment/myapp"
      }
    },
    {
      "id": "notify_success",
      "type": "slack.notify",
      "config": {
        "webhook_url": "{{env.SLACK_WEBHOOK_URL}}",
        "message": ":white_check_mark: *{{env.CI_PROJECT_NAME}}* deployed to production by {{env.GITLAB_USER_LOGIN}}"
      },
      "depends_on": ["deploy"]
    }
  ]
}`}</CodeBlock>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Pipeline Status with Jira Link
        </h2>
        <p className="text-muted-foreground">
          Include a Jira review button in the Slack message:
        </p>
        <CodeBlock language="json">{`{
  "name": "pipeline-status",
  "steps": [
    {
      "id": "run_tests",
      "type": "shell",
      "config": { "command": "go test ./..." }
    },
    {
      "id": "notify",
      "type": "slack.notify",
      "config": {
        "webhook_url": "{{env.SLACK_WEBHOOK_URL}}",
        "message": ":test_tube: Tests passed for branch *{{env.CI_COMMIT_REF_NAME}}*",
        "action_url": "{{env.CI_PIPELINE_URL}}",
        "action_text": "View Pipeline"
      },
      "depends_on": ["run_tests"]
    }
  ]
}`}</CodeBlock>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Setup</h2>
        <p className="text-muted-foreground">
          Create an Incoming Webhook in your Slack workspace and pass the URL as
          an environment variable:
        </p>
        <CodeBlock>{`# Set in CI/CD secrets or .env
export SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T.../B.../...

# Run with Docker
docker run --rm \\
  -v $(pwd):/workspace -w /workspace \\
  -e SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL \\
  ghcr.io/rajitk13/shiro-automation:latest \\
  shiro run`}</CodeBlock>
      </div>

      <div className="rounded-lg border border-border bg-card p-5 space-y-2">
        <p className="font-semibold text-sm">slack.notify config reference</p>
        <table className="w-full text-sm mt-2">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-2 font-medium">Field</th>
              <th className="pb-2 font-medium">Required</th>
              <th className="pb-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="py-2 font-mono text-xs">webhook_url</td>
              <td className="py-2">Yes</td>
              <td className="py-2">Slack Incoming Webhook URL</td>
            </tr>
            <tr>
              <td className="py-2 font-mono text-xs">message</td>
              <td className="py-2">Yes</td>
              <td className="py-2">Message body (supports Slack mrkdwn)</td>
            </tr>
            <tr>
              <td className="py-2 font-mono text-xs">action_url</td>
              <td className="py-2">No</td>
              <td className="py-2">URL for the action button</td>
            </tr>
            <tr>
              <td className="py-2 font-mono text-xs">action_text</td>
              <td className="py-2">No</td>
              <td className="py-2">
                Button label (default: &quot;Review in GitLab&quot;)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
