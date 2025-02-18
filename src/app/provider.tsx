'use client'

import React from 'react';
import { PioneerProvider as BasePioneerProvider, usePioneer } from "@coinmasters/pioneer-react"
import { ChakraProvider, createSystem } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { ColorModeProvider } from '@/components/ui/color-mode';
import { PioneerProvider } from './context/PioneerContext';

// //@ts-ignore
// import { defaultConfig } from '@saas-ui-pro/react';

const system = createSystem({
  cssVarsRoot: 'body'
})

interface ProviderProps {
  children: React.ReactNode;
}

// Get environment variables with fallbacks
const PIONEER_URL = process.env.NEXT_PUBLIC_PIONEER_URL || 'http://127.0.0.1:9001/spec/swagger.json'
const PIONEER_WSS = process.env.NEXT_PUBLIC_PIONEER_WSS || 'ws://127.0.0.1:9001'

const PioneerInitializer = ({ children }: { children: React.ReactNode }) => {
  const pioneer = usePioneer();
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    const initPioneer = async () => {
      if (!isInitialized) {
        try {
          const pioneerSetup = {
            appName: 'KeepKey Portfolio',
            appIcon: 'https://pioneers.dev/coins/keepkey.png',
            spec: PIONEER_URL,
            wss: PIONEER_WSS,
          };
          
          await pioneer.onStart([], pioneerSetup);
          setIsInitialized(true);
        } catch (e) {
          console.error('Failed to initialize Pioneer:', e);
        }
      }
    };

    initPioneer();
  }, [pioneer, isInitialized]);

  return (
    <PioneerProvider value={pioneer}>
      {children}
    </PioneerProvider>
  );
};

export function Provider({ children }: ProviderProps) {
  return (
    <SessionProvider>
      <ChakraProvider value={system}>
        <ColorModeProvider>
          <BasePioneerProvider>
            <PioneerInitializer>
              {children}
            </PioneerInitializer>
          </BasePioneerProvider>
        </ColorModeProvider>
      </ChakraProvider>
    </SessionProvider>
  );
} 
