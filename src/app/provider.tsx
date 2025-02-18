'use client'

import React from 'react';
import { PioneerProvider } from "@coinmasters/pioneer-react"
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

export function Provider({ children }: ProviderProps) {
  return (
    <SessionProvider>
      <PioneerProvider>
        <ChakraProvider value={system}>
          <ColorModeProvider>{children}</ColorModeProvider>
        </ChakraProvider>
      </PioneerProvider>
    </SessionProvider>
  );
} 
