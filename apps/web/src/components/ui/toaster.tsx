'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      richColors
      toastOptions={{
        style: {
          fontFamily: 'Inter, system-ui, sans-serif',
        },
      }}
    />
  );
}
