import { createContext, useContext } from 'react'


const ThemeContext = createContext({ isDark: false, toggleTheme: () => {} })

export function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value={{ isDark: false, toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
