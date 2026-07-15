"use client"

import * as React from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CodeTabsProps {
  /** One label per child, in order (e.g. ["cURL", "JavaScript"]). */
  labels: string[]
  /** One code block per label — typically server-highlighted DocsCodeBlocks. */
  children: React.ReactNode
}

/**
 * Language switcher for multi-language code samples. The children are rendered
 * on the server (shiki highlighting included) and only the tab switching runs
 * on the client.
 */
export function CodeTabs({ labels, children }: CodeTabsProps) {
  const panels = React.Children.toArray(children)

  return (
    <Tabs defaultValue={labels[0]} className="gap-2">
      <TabsList>
        {labels.map((label) => (
          <TabsTrigger key={label} value={label}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {labels.map((label, index) => (
        <TabsContent key={label} value={label}>
          {panels[index]}
        </TabsContent>
      ))}
    </Tabs>
  )
}
