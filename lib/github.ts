import { unstable_cache } from "next/cache"

const HEADERS = { Accept: "application/vnd.github+json" }

async function fetchVersion(repo: string): Promise<string> {
  try {
    // Try published releases first
    const relRes = await fetch(
      `https://api.github.com/repos/${repo}/releases/latest`,
      { headers: HEADERS }
    )
    if (relRes.ok) {
      const rel = await relRes.json()
      if (rel.tag_name) return rel.tag_name as string
    }

    // Fall back to latest git tag
    const tagRes = await fetch(
      `https://api.github.com/repos/${repo}/tags?per_page=1`,
      { headers: HEADERS }
    )
    if (tagRes.ok) {
      const tags = await tagRes.json()
      if (Array.isArray(tags) && tags.length > 0) return tags[0].name as string
    }

    return "latest"
  } catch {
    return "latest"
  }
}

export const getLatestRelease = unstable_cache(
  (repo: string) => fetchVersion(repo),
  ["github-latest-release"],
  { revalidate: 3600 }
)
