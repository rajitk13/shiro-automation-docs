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
      startOnLoad: true,
      theme: "neutral",
      securityLevel: "loose",
    })
  }, [])

  useEffect(() => {
    if (ref.current) {
      mermaid.run({
        nodes: [ref.current],
      })
    }
  }, [chart])

  return (
    <div
      ref={ref}
      className="mermaid flex justify-center"
      data-mermaid={chart}
    />
  )
}
