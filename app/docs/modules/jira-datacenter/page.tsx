import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "jira-datacenter Module - Shiro Documentation",
  description:
    "Jira Data Center integration for Shiro — create issues, search, transition, user management",
}

function CodeBlock({
  children,
  language = "json",
}: {
  children: string
  language?: string
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-[var(--code-bg)]">
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2">
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

function ParamRow({
  name,
  type,
  required,
  description,
}: {
  name: string
  type: string
  required?: boolean
  description: string
}) {
  return (
    <tr className="border-b border-border/50">
      <td className="py-3 pr-4">
        <code className="text-xs text-primary">{name}</code>
        {required && (
          <span className="ml-1.5 text-[10px] text-red-400 font-medium">
            required
          </span>
        )}
      </td>
      <td className="py-3 pr-4 text-xs text-muted-foreground">{type}</td>
      <td className="py-3 text-sm text-muted-foreground">{description}</td>
    </tr>
  )
}

export default function JiraModulePage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 text-sm font-medium text-primary mb-2">
          <span>External Module</span>
          <span className="text-border">·</span>
          <Link
            href="https://github.com/rajitk13/shiro-automation-jira-datacenter"
            target="_blank"
            className="text-muted-foreground hover:text-primary transition-colors font-normal"
          >
            rajitk13/shiro-automation-jira-datacenter ↗
          </Link>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          jira-datacenter
        </h1>
        <p className="text-xl text-muted-foreground">
          Jira Data Center integration — create issues, get/update, add
          comments, transition status, search via JQL, manage users and groups.
        </p>
      </div>

      {/* Installation */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <p className="text-muted-foreground">
          The Jira module is an <strong>external module</strong> — it must be
          added and compiled into your Shiro binary. No proxy server required;
          it talks directly to Jira Data Center via PAT.
        </p>
        <CodeBlock language="bash">{`# 1. Register the module
shiro add module github.com/rajitk13/shiro-jira-module

# 2. Recompile shiro with the jira module baked in
shiro build`}</CodeBlock>
        <p className="text-sm text-muted-foreground">
          <code className="text-xs text-primary">shiro build</code>{" "}
          auto-generates{" "}
          <code className="text-xs">internal/cli/registry.go</code>, runs{" "}
          <code className="text-xs">go mod tidy</code>, and recompiles the
          binary.
        </p>
      </div>

      {/* Environment Variables */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Environment Variables</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left font-semibold pr-4">Variable</th>
                <th className="py-2 text-left font-semibold pr-4">Required</th>
                <th className="py-2 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-3 pr-4">
                  <code className="text-xs text-primary">JIRA_BASE_URL</code>
                </td>
                <td className="py-3 pr-4 text-red-400 text-xs font-medium">
                  Yes
                </td>
                <td className="py-3">
                  Base URL of your Jira instance (e.g.{" "}
                  <code className="text-xs">https://jira.corp.example.com</code>
                  )
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 pr-4">
                  <code className="text-xs text-primary">JIRA_API_TOKEN</code>
                </td>
                <td className="py-3 pr-4 text-red-400 text-xs font-medium">
                  Yes
                </td>
                <td className="py-3">
                  Personal Access Token (PAT) — sent as Bearer token
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Operations */}
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Operations</h2>

        {/* create_issue */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold font-mono text-primary">
            create_issue
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left font-semibold pr-4 w-40">
                  Field
                </th>
                <th className="py-2 text-left font-semibold pr-12 w-16">
                  Type
                </th>
                <th className="py-2 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              <ParamRow
                name="project"
                type="string"
                required
                description="Project key (e.g. DEV)"
              />
              <ParamRow
                name="summary"
                type="string"
                required
                description="Issue title"
              />
              <ParamRow
                name="description"
                type="string"
                description="Issue description"
              />
              <ParamRow
                name="issue_type"
                type="string"
                description='Issue type — defaults to "Task"'
              />
              <ParamRow
                name="priority"
                type="string"
                description="High, Medium, Low"
              />
              <ParamRow
                name="assignee"
                type="string"
                description="Account ID or username of assignee"
              />
              <ParamRow
                name="labels"
                type="string"
                description="Comma-separated labels"
              />
            </tbody>
          </table>
          <CodeBlock>{`{
  "id": "create_ticket",
  "type": "jira",
  "config": {
    "operation": "create_issue",
    "project": "DEV",
    "summary": "Deploy: {{steps.ai_review.text}}",
    "description": "Automated ticket from CI pipeline",
    "issue_type": "Task",
    "priority": "High"
  }
}`}</CodeBlock>
        </div>

        {/* get_issue */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold font-mono text-primary">
            get_issue
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left font-semibold pr-4 w-40">
                  Field
                </th>
                <th className="py-2 text-left font-semibold pr-12 w-16">
                  Type
                </th>
                <th className="py-2 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              <ParamRow
                name="issue_key"
                type="string"
                required
                description="Issue key (e.g. DEV-42)"
              />
            </tbody>
          </table>
          <CodeBlock>{`{
  "id": "fetch_ticket",
  "type": "jira",
  "config": {
    "operation": "get_issue",
    "issue_key": "DEV-42"
  }
}`}</CodeBlock>
        </div>

        {/* update_issue */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold font-mono text-primary">
            update_issue
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left font-semibold pr-4 w-40">
                  Field
                </th>
                <th className="py-2 text-left font-semibold pr-12 w-16">
                  Type
                </th>
                <th className="py-2 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              <ParamRow
                name="issue_key"
                type="string"
                required
                description="Issue key (e.g. DEV-42)"
              />
              <ParamRow
                name="summary"
                type="string"
                description="New summary"
              />
              <ParamRow
                name="description"
                type="string"
                description="New description"
              />
              <ParamRow
                name="priority"
                type="string"
                description="New priority"
              />
              <ParamRow
                name="assignee"
                type="string"
                description="New assignee username"
              />
              <ParamRow
                name="labels"
                type="string"
                description="Comma-separated labels"
              />
            </tbody>
          </table>
        </div>

        {/* add_comment */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold font-mono text-primary">
            add_comment
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left font-semibold pr-4 w-40">
                  Field
                </th>
                <th className="py-2 text-left font-semibold pr-12 w-16">
                  Type
                </th>
                <th className="py-2 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              <ParamRow
                name="issue_key"
                type="string"
                required
                description="Issue key (e.g. DEV-42)"
              />
              <ParamRow
                name="comment"
                type="string"
                required
                description="Comment body text"
              />
            </tbody>
          </table>
          <CodeBlock>{`{
  "id": "post_comment",
  "type": "jira",
  "config": {
    "operation": "add_comment",
    "issue_key": "{{steps.create_ticket.output.issue_key}}",
    "comment": "AI Review:\\n{{steps.ai_review.text}}"
  },
  "depends_on": ["create_ticket", "ai_review"]
}`}</CodeBlock>
        </div>

        {/* transition_issue */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold font-mono text-primary">
            transition_issue
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left font-semibold pr-4 w-40">
                  Field
                </th>
                <th className="py-2 text-left font-semibold pr-12 w-16">
                  Type
                </th>
                <th className="py-2 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              <ParamRow
                name="issue_key"
                type="string"
                required
                description="Issue key (e.g. DEV-42)"
              />
              <ParamRow
                name="transition_id"
                type="string"
                required
                description="Jira transition ID (from Jira UI workflow)"
              />
            </tbody>
          </table>
        </div>

        {/* search_issues */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold font-mono text-primary">
            search_issues
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left font-semibold pr-4 w-40">
                  Field
                </th>
                <th className="py-2 text-left font-semibold pr-12 w-16">
                  Type
                </th>
                <th className="py-2 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              <ParamRow
                name="jql"
                type="string"
                required
                description="JQL query string"
              />
            </tbody>
          </table>
          <CodeBlock>{`{
  "id": "find_open_bugs",
  "type": "jira",
  "config": {
    "operation": "search_issues",
    "jql": "project = DEV AND issuetype = Bug AND status != Done ORDER BY priority DESC"
  }
}`}</CodeBlock>
        </div>

        {/* User & Group ops */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">User &amp; Group Operations</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                op: "get_user",
                desc: "Get user info. Requires username or account_id.",
              },
              {
                op: "get_user_groups",
                desc: "Get groups for a user. Requires username or account_id.",
              },
              {
                op: "add_user_to_group",
                desc: "Add user to a group. Requires admin permissions. Needs username/account_id + group_name.",
              },
              {
                op: "get_group_members",
                desc: "List all members of a group. Requires group_name.",
              },
            ].map(({ op, desc }) => (
              <div
                key={op}
                className="rounded-lg border border-border bg-card p-4"
              >
                <code className="text-sm text-primary">{op}</code>
                <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Output Fields</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left font-semibold pr-4">Field</th>
                <th className="py-2 text-left font-semibold pr-4">Type</th>
                <th className="py-2 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              <ParamRow
                name="issue_key"
                type="string"
                description="Jira issue key (e.g. DEV-42)"
              />
              <ParamRow
                name="issue_id"
                type="string"
                description="Internal Jira issue ID"
              />
              <ParamRow
                name="url"
                type="string"
                description="Browser URL to the issue"
              />
              <ParamRow
                name="comment_id"
                type="string"
                description="ID of the created comment (add_comment only)"
              />
              <ParamRow
                name="total"
                type="number"
                description="Total results count (search_issues only)"
              />
              <ParamRow
                name="data"
                type="object"
                description="Full issue or search result payload from Jira API"
              />
              <ParamRow
                name="user"
                type="object"
                description="User information (get_user only)"
              />
              <ParamRow
                name="groups"
                type="array"
                description="List of groups (get_user_groups only)"
              />
              <ParamRow
                name="members"
                type="array"
                description="List of group members (get_group_members only)"
              />
              <ParamRow
                name="success"
                type="boolean"
                description="Operation success flag (add_user_to_group only)"
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* Full workflow example */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Full Workflow Example</h2>
        <p className="text-muted-foreground">
          AI code review → create Jira ticket → post comment with review output
        </p>
        <CodeBlock>{`{
  "name": "ai-review-to-jira",
  "steps": [
    {
      "id": "get_diff",
      "type": "git.diff",
      "config": { "operation": "diff", "base_branch": "main" }
    },
    {
      "id": "ai_review",
      "type": "ai.generate",
      "config": {
        "prompt": "Review this code diff:\\n{{steps.get_diff.diff}}",
        "model": "gpt-4o"
      },
      "depends_on": ["get_diff"]
    },
    {
      "id": "create_ticket",
      "type": "jira",
      "config": {
        "operation": "create_issue",
        "project": "DEV",
        "summary": "Code Review: {{env.CI_COMMIT_SHORT_SHA}}",
        "description": "{{steps.ai_review.text}}",
        "issue_type": "Task",
        "priority": "Medium"
      },
      "depends_on": ["ai_review"]
    },
    {
      "id": "log_ticket",
      "type": "print",
      "config": {
        "message": "Created ticket: {{steps.create_ticket.output.issue_key}} — {{steps.create_ticket.output.url}}"
      },
      "depends_on": ["create_ticket"]
    }
  ]
}`}</CodeBlock>
      </div>
    </div>
  )
}
