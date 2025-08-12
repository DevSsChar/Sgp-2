"use client"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "./ThemeContext"

export default function SessionWrapper({ children }) {
    return (
        <SessionProvider>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </SessionProvider>
    )
}