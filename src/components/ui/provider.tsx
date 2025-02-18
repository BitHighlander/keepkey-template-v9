"use client"

import * as React from 'react'
import { ChakraProvider, createSystem } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'

const system = createSystem({
  cssVarsRoot: 'body',
})

interface ProviderProps {
  children: React.ReactNode
}

export function Provider({ children }: ProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <ChakraProvider value={system}>
        {children}
      </ChakraProvider>
    </ThemeProvider>
  )
}
