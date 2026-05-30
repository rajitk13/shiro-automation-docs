import { MetadataRoute } from "next"

const BASE_URL = "https://shiro-docs.rajit.cc"

const routes: string[] = [
  "/docs",
  "/docs/installation",
  "/docs/quickstart",
  "/docs/concepts/workflows",
  "/docs/concepts/modules",
  "/docs/concepts/dag",
  "/docs/concepts/state",
  "/docs/concepts/variables",
  "/docs/modules/print",
  "/docs/modules/shell",
  "/docs/modules/git",
  "/docs/modules/gitlab",
  "/docs/modules/slack",
  "/docs/modules/jira-datacenter",
  "/docs/modules/ai",
  "/docs/cli/run",
  "/docs/cli/validate",
  "/docs/cli/init",
  "/docs/cli/data",
  "/docs/cicd/github",
  "/docs/cicd/gitlab",
  "/docs/cicd/approvals",
  "/docs/ai/configuration",
  "/docs/ai/providers",
  "/docs/ai/code-review",
  "/docs/advanced/custom-modules",
  "/docs/advanced/development",
  "/docs/advanced/api",
  "/tools/validator",
]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "/docs" ? 1 : 0.8,
  }))
}
