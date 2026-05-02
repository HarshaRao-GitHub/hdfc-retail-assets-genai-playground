'use client';

import { usePathname } from 'next/navigation';
import { DocumentProvider } from '@/lib/document-context';
import DocumentTray from './DocumentTray';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isRootSelector = pathname === '/';

  return (
    <DocumentProvider>
      {children}
      {!isRootSelector && <DocumentTray />}
    </DocumentProvider>
  );
}
