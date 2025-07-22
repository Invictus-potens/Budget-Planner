'use client';

import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { useSettingsStore } from "../store/settingsStore";
import React, { useEffect } from "react";

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pacifico',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const darkTheme = useSettingsStore((s) => s.darkTheme);
  const className = `${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased`;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (darkTheme) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      // Debug logs
      console.log('[DarkMode Debug] darkTheme state:', darkTheme);
      console.log('[DarkMode Debug] <body> classList after effect:', document.body.className);
    }
  }, [darkTheme]);

  return (
    <body
      className={className}
      suppressHydrationWarning={true}
    >
      <AuthProvider>
        {children}
      </AuthProvider>
    </body>
  );
} 