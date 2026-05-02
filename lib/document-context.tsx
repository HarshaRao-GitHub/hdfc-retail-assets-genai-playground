'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface ImageAttachment { base64: string; media_type: string; label: string; }

export interface SharedDocument {
  id: string;
  filename: string;
  text: string;
  images: ImageAttachment[];
  source: 'upload' | 'sample';
  department?: string;
  addedAt: number;
}

interface DocumentContextValue {
  documents: SharedDocument[];
  addDocument: (doc: Omit<SharedDocument, 'id' | 'addedAt'>) => void;
  addDocuments: (docs: Omit<SharedDocument, 'id' | 'addedAt'>[]) => void;
  removeDocument: (id: string) => void;
  clearAll: () => void;
  hasDocument: (filename: string) => boolean;
  getDocument: (id: string) => SharedDocument | undefined;
  trayOpen: boolean;
  setTrayOpen: (open: boolean) => void;
  viewerDoc: SharedDocument | null;
  setViewerDoc: (doc: SharedDocument | null) => void;
}

const DocumentContext = createContext<DocumentContextValue | null>(null);

let docCounter = 0;
function nextId() { return `doc_${Date.now()}_${++docCounter}`; }

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<SharedDocument[]>([]);
  const [trayOpen, setTrayOpen] = useState(false);
  const [viewerDoc, setViewerDoc] = useState<SharedDocument | null>(null);

  const hasDocument = useCallback(
    (filename: string) => documents.some(d => d.filename === filename),
    [documents],
  );

  const getDocument = useCallback(
    (id: string) => documents.find(d => d.id === id),
    [documents],
  );

  const addDocument = useCallback((doc: Omit<SharedDocument, 'id' | 'addedAt'>) => {
    setDocuments(prev => {
      if (prev.some(d => d.filename === doc.filename)) return prev;
      return [...prev, { ...doc, id: nextId(), addedAt: Date.now() }];
    });
  }, []);

  const addDocuments = useCallback((docs: Omit<SharedDocument, 'id' | 'addedAt'>[]) => {
    setDocuments(prev => {
      const existing = new Set(prev.map(d => d.filename));
      const newDocs = docs
        .filter(d => !existing.has(d.filename))
        .map(d => ({ ...d, id: nextId(), addedAt: Date.now() }));
      return newDocs.length ? [...prev, ...newDocs] : prev;
    });
  }, []);

  const removeDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    setViewerDoc(prev => (prev?.id === id ? null : prev));
  }, []);

  const clearAll = useCallback(() => {
    setDocuments([]);
    setViewerDoc(null);
  }, []);

  return (
    <DocumentContext.Provider value={{
      documents, addDocument, addDocuments, removeDocument, clearAll, hasDocument, getDocument,
      trayOpen, setTrayOpen, viewerDoc, setViewerDoc,
    }}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const ctx = useContext(DocumentContext);
  if (!ctx) throw new Error('useDocuments must be used within DocumentProvider');
  return ctx;
}
