'use client'

import React, { useMemo } from 'react';
import { PioneerProvider } from "@coinmasters/pioneer-react"
import { ChakraProvider, createSystem } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';

// //@ts-ignore
// import { defaultConfig } from '@saas-ui-pro/react';

interface ProviderProps {
  children: React.ReactNode;
  initialColorMode?: 'light' | 'dark';
}

export function Provider({ children, initialColorMode = 'dark' }: ProviderProps) {
  const system = useMemo(() => createSystem({}), []);
  return (
    <SessionProvider>
      <PioneerProvider>
        <ChakraProvider value={system}>
          {children}
        </ChakraProvider>
      </PioneerProvider>
    </SessionProvider>
  );
} 
