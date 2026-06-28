import { IBM_Plex_Mono, Instrument_Sans } from "next/font/google"

import "./globals.css"
import { Providers } from "@/providers"
import { cn } from "@/lib/utils"

const instrumentSans = Instrument_Sans({subsets:['latin'],variable:'--font-sans'})

const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", instrumentSans.variable)}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
