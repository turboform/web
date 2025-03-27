import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth/auth-provider";
import NavBar from "@/components/layout/nav-bar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TurboForm - The AI-Powered Form Builder | Create Forms Instantly with natural language",
  description: "Create custom forms in seconds with our AI form builder. Turn simple descriptions into professional forms - no coding required. Try TurboForm today!",
  icons: {
    icon: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <NavBar />
          <main className="flex-1">
            {children}
          </main>
          <Toaster position="bottom-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
