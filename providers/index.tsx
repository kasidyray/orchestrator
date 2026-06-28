"use client"

import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import NextTopLoader from "nextjs-toploader"
import { Toaster } from "sonner"

import { ThemeProvider } from "@/components/theme-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <NextTopLoader
          color="var(--primary)"
          height={3}
          showSpinner={false}
          shadow={false}
        />
        {children}
        <Toaster position="top-right" richColors closeButton duration={4000} />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
