import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Human-in-Loop Approvals - Shiro Documentation",
  description: "Implement approval workflows with pause and resume",
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

export default function ApprovalsPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-primary font-medium mb-2">
          CI/CD Integration
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Human-in-Loop Approvals
        </h1>
        <p className="text-xl text-muted-foreground">
          Implement approval workflows that pause for human review and resume on
          manual trigger.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">How It Works</h2>
        <ol className="space-y-3 text-muted-foreground">
          <li>
            <strong>1. Send Notification</strong> - Workflow sends Slack
            notification with review link
          </li>
          <li>
            <strong>2. Pause</strong> - Workflow pauses after the notification
            step
          </li>
          <li>
            <strong>3. Review</strong> - Human reviews and approves via
            GitLab/GitHub
          </li>
          <li>
            <strong>4. Resume</strong> - Resume job loads state and continues
            execution
          </li>
        </ol>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Approval Step</h2>
        <p className="text-muted-foreground">
          Use <code className="text-accent">pause: true</code> to stop execution
          after sending notification:
        </p>
        <CodeBlock>{`{
  "id": "request_approval",
  "type": "slack.notify",
  "pause": true,
  "config": {
    "webhook_url": "{{env.SLACK_WEBHOOK_URL}}",
    "channel": "#deployments",
    "message": "Review deployment to production. Click the GitLab button to approve.",
    "gitlab_pipeline_url": "{{env.CI_SERVER_URL}}/{{env.CI_PROJECT_ID}}/-/pipelines/{{env.CI_PIPELINE_ID}}",
    "button_text": "Review in GitLab"
  }
}`}</CodeBlock>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">GitLab CI Configuration</h2>
        <p className="text-muted-foreground">
          Split into two jobs: initial run and manual resume:
        </p>
        <CodeBlock language="yaml">{`stages:
  - deploy
  - resume

deploy-with-approval:
  stage: deploy
  script:
    - shiro run -state-store gitlab -fresh
  artifacts:
    when: always
    paths:
      - .shiro/state/

# Manual job to resume workflow
resume-deployment:
  stage: resume
  when: manual
  needs: [deploy-with-approval]
  script:
    - shiro run -state-store gitlab
  artifacts:
    when: always
    paths:
      - .shiro/state/`}</CodeBlock>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-2">
          Complete Example Workflow
        </h2>
        <CodeBlock>{`{
  "name": "approval-workflow",
  "steps": [
    {
      "id": "prepare",
      "type": "shell",
      "config": {
        "command": "echo 'Preparing deployment...'"
      }
    },
    {
      "id": "request_approval",
      "type": "slack.notify",
      "pause": true,
      "config": {
        "webhook_url": "{{env.SLACK_WEBHOOK_URL}}",
        "channel": "#deployments",
        "message": "Ready to deploy {{env.CI_COMMIT_REF_NAME}}. Please review.",
        "gitlab_pipeline_url": "{{env.CI_SERVER_URL}}/{{env.CI_PROJECT_ID}}/-/pipelines/{{env.CI_PIPELINE_ID}}"
      },
      "depends_on": ["prepare"]
    },
    {
      "id": "deploy",
      "type": "shell",
      "config": {
        "command": "kubectl apply -f k8s/production.yaml"
      },
      "depends_on": ["request_approval"]
    },
    {
      "id": "notify_complete",
      "type": "slack.notify",
      "config": {
        "webhook_url": "{{env.SLACK_WEBHOOK_URL}}",
        "message": "Deployment completed!"
      },
      "depends_on": ["deploy"]
    }
  ]
}`}</CodeBlock>
      </div>
    </div>
  )
}
