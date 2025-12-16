import React, { ReactNode } from 'react';
import AppWrappers from './AppWrappers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AssetCare - Intelligent Maintenance',
  description: 'Next-gen predictive maintenance dashboard for industrial assets.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body id={'root'} suppressHydrationWarning>
        <AppWrappers>{children}</AppWrappers>
      </body>
    </html>
  );
}
