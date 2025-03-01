'use client';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { SessionProvider } from 'next-auth/react';
export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <SessionProvider>
  
  <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
     
   
    </SessionProvider>
  );
};