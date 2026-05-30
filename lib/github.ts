export async function getLatestRelease(repo: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/releases/latest`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      }
    )
    if (!res.ok) return "latest"
    const data = await res.json()
    return (data.tag_name as string) ?? "latest"
  } catch {
    return "latest"
  }
}
