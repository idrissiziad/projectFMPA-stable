import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProjectFMPA - Plateforme d'entraînement médical",
  description: "Plateforme d'entraînement aux questions médicales pour les étudiants et professionnels de santé",
  keywords: ["FMPA", "médecine", "questions médicales", "formation médicale", "étudiants en médecine"],
  authors: [{ name: "ProjectFMPA Team" }],
  openGraph: {
    title: "ProjectFMPA - Plateforme d'entraînement médical",
    description: "Entraînement aux questions médicales pour les étudiants et professionnels de santé",
    url: "https://projectfmpa.com",
    siteName: "ProjectFMPA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProjectFMPA - Plateforme d'entraînement médical",
    description: "Entraînement aux questions médicales pour les étudiants et professionnels de santé",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
