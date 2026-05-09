import { Providers } from "./providers";
import type { Metadata } from "next";
import { DM_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";
import ThemeSwitcher from "../components/layout/ThemeSwitcher";
import { ThemeProvider } from "../components/ThemeProvider";

const sans = Instrument_Sans({ subsets: ['latin'], variable: "--font-body"});
const mono = DM_Mono({ subsets: ['latin'], weight: ['300','400','500'], variable: "--font-mono"})

export const metadata: Metadata = {
    title: 'Money Tracker',
    description: 'Track your finances'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Money Tracker</title>
        <link rel="stylesheet" href="./globals.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${sans.variable} ${mono.variable}`}
        suppressHydrationWarning
      >
        <Providers>
          <ThemeProvider
            attribute={"class"}
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <ThemeSwitcher />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
