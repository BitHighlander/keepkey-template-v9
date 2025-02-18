'use client'

import React from 'react';
import { useEffect, useState } from 'react'
import { PioneerProvider, usePioneer } from "@coinmasters/pioneer-react"
import { ChakraProvider, createSystem } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { ColorModeProvider } from '@/components/ui/color-mode';

// //@ts-ignore
// import { defaultConfig } from '@saas-ui-pro/react';

const system = createSystem({
  cssVarsRoot: 'body',
  colorMode: 'dark',
})

interface ProviderProps {
  children: React.ReactNode;
}

// Get environment variables with fallbacks
const PIONEER_URL = process.env.NEXT_PUBLIC_PIONEER_URL || 'http://127.0.0.1:9001/spec/swagger.json'
const PIONEER_WSS = process.env.NEXT_PUBLIC_PIONEER_WSS || 'ws://127.0.0.1:9001'

// Create a wrapper component to handle Pioneer initialization
function PioneerInitializer({ children, onPioneerReady }: {
  children: React.ReactNode
  onPioneerReady: (pioneer: ReturnType<typeof usePioneer>) => void
}) {
  const pioneer = usePioneer()
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initPioneer = async () => {
      if (isInitialized) return

      try {
        setIsLoading(true)
        const pioneerSetup = {
          appName: 'KeepKey Portfolio',
          appIcon: 'https://pioneers.dev/coins/keepkey.png',
          spec: PIONEER_URL,
          wss: PIONEER_WSS,
        }
        console.log('pioneerSetup: ',pioneerSetup)
        await pioneer.onStart([], pioneerSetup)
        setIsInitialized(true)
        onPioneerReady(pioneer)
      } catch (e) {
        console.error('Pioneer initialization error:', e)
      } finally {
        setIsLoading(false)
      }
    }

    initPioneer()
  }, [pioneer, isInitialized, onPioneerReady])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}


export function Provider({ children }: ProviderProps) {
  const [pioneerInstance, setPioneerInstance] = useState<ReturnType<typeof usePioneer> | null>(null)

  const handlePioneerReady = (pioneer: ReturnType<typeof usePioneer>) => {
    setPioneerInstance(pioneer)
  }

  return (
    <SessionProvider>
      <PioneerProvider>
        <ChakraProvider value={system}>
          <ColorModeProvider>
            <PioneerInitializer onPioneerReady={handlePioneerReady}>
              {children}
            </PioneerInitializer>
          </ColorModeProvider>
        </ChakraProvider>
      </PioneerProvider>
    </SessionProvider>
  );
} 
