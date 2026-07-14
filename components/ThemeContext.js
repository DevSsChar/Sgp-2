"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

function readStoredDarkMode() {
  try {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme !== null) return savedTheme === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

export function ThemeProvider({ children }) {
  // Start unset so we never persist "light" before reading localStorage.
  const [darkMode, setDarkMode] = useState(false);
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    const next = readStoredDarkMode();
    setDarkMode(next);
    setThemeReady(true);

    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (!themeReady) return;

    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode, themeReady]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, themeReady }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
