import { Metadata } from "next"

export const metadata: Metadata = {
  title: "GitLab CI - Shiro Documentation",
  description: "Integrate Shiro with GitLab CI/CD",
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

export default function GitLabCIPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-primary font-medium mb-2">
          CI/CD Integration
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">GitLab CI</h1>
        <p className="text-xl text-muted-foreground">
          Run Shiro workflows in GitLab CI/CD pipelines with native GitLab
          integration.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic Setup</h2>
        <p className="text-muted-foreground">
          Add Shiro to your <code className="text-accent">.gitlab-ci.yml</code>:
        </p>
        <CodeBlock>{`.gitlab-ci.yml

stages:
  - test
  - deploy

variables:
  SHIRO_VERSION: "latest"

# Install Shiro in before_script
default:
  before_script:
    - wget -O /usr/local/bin/shiro https://github.com/rajitk13/shiro-automation/releases/download/\${SHIRO_VERSION}/shiro-linux-amd64
    - chmod +x /usr/local/bin/shiro

test-workflow:
  stage: test
  script:
    - shiro run
  artifacts:
    when: always
    paths:
      - workflow-results.json

deploy:
  stage: deploy
  script:
    - shiro run -workflow .shiro/workflows/deploy.json
  only:
    - main`}</CodeBlock>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Docker Image</h2>
        <p className="text-muted-foreground">
          Use the pre-built Docker image to avoid downloading in each job:
        </p>
        <CodeBlock>{`test:
  stage: test
  image: ghcr.io/rajitk13/shiro-automation:latest
  script:
    - shiro run`}</CodeBlock>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">With State Storage</h2>
        <p className="text-muted-foreground">
          Persist state across jobs using GitLab artifacts:
        </p>
        <CodeBlock>{`workflow:
  stage: test
  script:
    - shiro run -state-store gitlab -fresh
  artifacts:
    when: always
    paths:
      - .shiro/state/

resume-workflow:
  stage: deploy
  when: manual
  needs: [workflow]
  script:
    - shiro run -state-store gitlab
  artifacts:
    when: always
    paths:
      - .shiro/state/`}</CodeBlock>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-2">Human-in-Loop Approvals</h2>
        <p className="text-muted-foreground mb-4">
          Implement approval workflows with Slack notifications:
        </p>
        <CodeBlock>{`{
  "id": "request_approval",
  "type": "slack.notify",
  "pause": true,
  "config": {
    "webhook_url": "{{env.SLACK_WEBHOOK_URL}}",
    "channel": "#deployments",
    "message": "Review deployment to production",
    "gitlab_pipeline_url": "{{env.CI_SERVER_URL}}/{{env.CI_PROJECT_ID}}/-/pipelines/{{env.CI_PIPELINE_ID}}"
  }
}`}</CodeBlock>
      </div>
    </div>
  )
}
