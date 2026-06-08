import { NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

const SYSTEM_PROMPT = `You are an expert at creating Shiro Automation workflows. Generate valid JSON workflows based on user requirements.

Workflow Schema:
{
  "name": "string",
  "description": "string",
  "steps": [
    {
      "id": "string",
      "type": "string", // print, shell, slack, git, gitlab, github, ai.generate, etc.
      "config": object,
      "depends_on": ["string"] // optional, array of step IDs
    }
  ]
}

Available Modules and Their Configs:

print: { message: string, level: "info"|"warn"|"error" }

shell: { command: string, cwd?: string, env?: object }

slack: { webhook_url: string, message: string, channel?: string }

git: { operation: "clone"|"checkout"|"commit"|"push", repo?: string, branch?: string, message?: string }

gitlab: { operation: "post_comment"|"post_inline_comments"|"get_mr", body?: string, output_format?: "text"|"json", dedup?: boolean }

github: { operation: "get_diff"|"post_comment"|"post_inline_comments", body?: string, output_format?: "text"|"json", dedup?: boolean }

ai.generate: { model: string, prompt: string, system?: string, temperature?: number, max_tokens?: number }

Best Practices:
- Use depends_on to create DAG execution order
- Use meaningful step IDs (e.g., "fetch_diff", "ai_review", "post_comment")
- For AI code review: use github.get_diff → ai.generate → github.post_inline_comments
- Always include a description
- Output ONLY valid JSON, do NOT wrap in markdown code blocks
- Ensure all required config fields are present
- Do NOT include any text before or after the JSON

Current Shiro version supports all modules listed above.

IMPORTANT: Your response must be ONLY the JSON object, nothing else. No markdown, no explanations, no extra text.`

export async function POST(req: NextRequest) {
  try {
    const {
      prompt,
      apiKey,
      model = "gemini-2.5-flash",
      stream = false,
    } = await req.json()

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 })
    }

    if (!apiKey || typeof apiKey !== "string") {
      return NextResponse.json({ error: "Missing API key" }, { status: 400 })
    }

    const ai = new GoogleGenAI({ apiKey })

    if (stream) {
      // Streaming response
      let responseStream
      try {
        responseStream = await ai.models.generateContentStream({
          model,
          contents: `${SYSTEM_PROMPT}\n\n${prompt}`,
        })
      } catch (streamError) {
        console.error("Stream initialization error:", streamError)
        return NextResponse.json(
          {
            error: "Failed to initialize stream",
            details:
              streamError instanceof Error
                ? streamError.message
                : String(streamError),
          },
          { status: 500 }
        )
      }

      const encoder = new TextEncoder()
      const streamResponse = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of responseStream) {
              if (chunk.text) {
                controller.enqueue(encoder.encode(chunk.text))
              }
            }
            controller.close()
          } catch (error) {
            console.error("Streaming error:", error)
            controller.error(error)
          }
        },
      })

      return new NextResponse(streamResponse, {
        headers: {
          "Content-Type": "text/plain",
          "Transfer-Encoding": "chunked",
        },
      })
    }

    // Non-streaming response
    const result = await ai.models.generateContent({
      model,
      contents: `${SYSTEM_PROMPT}\n\n${prompt}`,
    })

    const text = result.text || ""

    // Extract JSON from response (handle markdown code blocks and extra text)
    let jsonText = text.trim()

    // Try to extract JSON from markdown code blocks first
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim()
    } else {
      // Try to find JSON object boundaries if no code blocks
      const firstBrace = text.indexOf("{")
      const lastBrace = text.lastIndexOf("}")
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonText = text.substring(firstBrace, lastBrace + 1)
      }
    }

    // Parse and validate JSON
    let workflow
    try {
      workflow = JSON.parse(jsonText)
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      return NextResponse.json(
        {
          error: "Failed to parse generated JSON",
          raw: text,
          extracted: jsonText,
        },
        { status: 500 }
      )
    }

    // Basic validation
    if (!workflow.name || !Array.isArray(workflow.steps)) {
      console.error("Validation failed:", {
        hasName: !!workflow.name,
        hasSteps: Array.isArray(workflow.steps),
        steps: workflow.steps,
      })
      return NextResponse.json(
        {
          error:
            "Invalid workflow structure. Generated workflow must have 'name' and 'steps' array.",
          workflow,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ workflow })
  } catch (error) {
    console.error("Workflow generation error:", error)

    const errorMessage = error instanceof Error ? error.message : String(error)

    // Handle Gemini API rate limiting (503 errors)
    if (
      errorMessage.includes("503") ||
      errorMessage.includes("high demand") ||
      errorMessage.includes("overloaded")
    ) {
      return NextResponse.json(
        {
          error:
            "Gemini API is currently experiencing high demand. Please try again in a few moments or switch to a different model.",
        },
        { status: 503 }
      )
    }

    // Handle invalid API key errors
    if (
      errorMessage.includes("API key") ||
      errorMessage.includes("401") ||
      errorMessage.includes("403")
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid API key. Please check your Gemini API key and try again.",
        },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "Failed to generate workflow", details: errorMessage },
      { status: 500 }
    )
  }
}
