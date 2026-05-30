import { NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { writeFile, unlink } from "fs/promises"
import { tmpdir } from "os"
import { join } from "path"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function POST(req: NextRequest) {
  const { workflow } = await req.json()

  if (!workflow || typeof workflow !== "string") {
    return NextResponse.json(
      { error: "Missing workflow JSON" },
      { status: 400 }
    )
  }

  // Write to a temp file
  const tmpFile = join(tmpdir(), `shiro-validate-${Date.now()}.json`)

  try {
    await writeFile(tmpFile, workflow, "utf-8")
  } catch {
    return NextResponse.json(
      { error: "Failed to write temp file" },
      { status: 500 }
    )
  }

  try {
    const { stdout, stderr } = await execAsync(
      `shiro validate -workflow "${tmpFile}"`,
      {
        timeout: 10000,
      }
    )

    await unlink(tmpFile).catch(() => {})

    return NextResponse.json({
      valid: true,
      output: (stdout + stderr).trim(),
    })
  } catch (err: unknown) {
    await unlink(tmpFile).catch(() => {})

    const execErr = err as {
      stdout?: string
      stderr?: string
      message?: string
      code?: number
    }

    // shiro validate exits non-zero on validation failure
    const output = ((execErr.stdout ?? "") + (execErr.stderr ?? "")).trim()

    // If shiro binary not found, fall back gracefully
    if (
      execErr.message?.includes("ENOENT") ||
      execErr.message?.includes("not found")
    ) {
      return NextResponse.json(
        {
          error:
            "shiro binary not found in PATH. Install Shiro to use real validation.",
          fallback: true,
        },
        { status: 503 }
      )
    }

    return NextResponse.json({
      valid: false,
      output: output || execErr.message || "Unknown error",
    })
  }
}
