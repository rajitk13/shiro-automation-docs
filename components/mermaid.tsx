"use client"

import { useEffect, useRef } from "react"
import mermaid from "mermaid"

interface MermaidProps {
  chart: string
}

export function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "neutral",
      securityLevel: "loose",
    })
  }, [])

  useEffect(() => {
    if (ref.current) {
      mermaid
        .render(`mermaid-${Date.now()}`, chart)
        .then((result) => {
          if (ref.current) {
            ref.current.innerHTML = result.svg
          }
        })
        .catch((err) => {
          console.error("Mermaid render error:", err)
        })
    }
  }, [chart])

  return <div ref={ref} className="flex justify-center overflow-x-auto" />
}
