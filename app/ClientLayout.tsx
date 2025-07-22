'use client';

import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { useSettingsStore } from "../store/settingsStore";
import React from "react";

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
  return (
    <body
      className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased${darkTheme ? " dark" : ""}`}
      suppressHydrationWarning={true}
    >
      <AuthProvider>
        {children}
      </AuthProvider>
    </body>
  );
} 