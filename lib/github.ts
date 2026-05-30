const OPTS = {
  headers: { Accept: "application/vnd.github+json" },
  next: { revalidate: 3600 },
}

export async function getLatestRelease(repo: string): Promise<string> {
  try {
    // Try published releases first
    const relRes = await fetch(
      `https://api.github.com/repos/${repo}/releases/latest`,
      OPTS
    )
    if (relRes.ok) {
      const rel = await relRes.json()
      if (rel.tag_name) return rel.tag_name as string
    }

    // Fall back to latest git tag
    const tagRes = await fetch(
      `https://api.github.com/repos/${repo}/tags?per_page=1`,
      OPTS
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
