'use client';

import { usePathname } from 'next/navigation';
import { DocumentProvider } from '@/lib/document-context';
import { HdfcWorkflowProvider } from './HdfcWorkflowContext';
import DocumentTray from './DocumentTray';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isRootSelector = pathname === '/';

  return (
    <DocumentProvider>
      <HdfcWorkflowProvider>
        {children}
        {!isRootSelector && <DocumentTray />}
      </HdfcWorkflowProvider>
    </DocumentProvider>
  );
}
