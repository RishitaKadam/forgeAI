import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { listDocuments, uploadPDF, deleteDocument } from "../services/api";

const DocumentsContext = createContext(null);

export function DocumentsProvider({ children }) {
  const [documents, setDocuments] = useState([]);
  const [activeDocId, setActiveDocId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listDocuments();
      setDocuments(data.documents || []);
      setError("");
    } catch (err) {
      setError(err.message || "Could not reach the ForgeAI backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!activeDocId && documents.length > 0) {
      setActiveDocId(documents[0].doc_id);
    }
  }, [documents, activeDocId]);

  async function addDocument(file) {
    setUploading(true);
    try {
      const result = await uploadPDF(file);
      await refresh();
      setActiveDocId(result.doc_id);
      return result;
    } finally {
      setUploading(false);
    }
  }

  async function removeDocument(docId) {
    await deleteDocument(docId);
    if (activeDocId === docId) setActiveDocId(null);
    await refresh();
  }

  const activeDocument = documents.find((d) => d.doc_id === activeDocId) || null;

  const value = {
    documents,
    loading,
    uploading,
    error,
    activeDocId,
    activeDocument,
    setActiveDocId,
    addDocument,
    removeDocument,
    refresh,
  };

  return (
    <DocumentsContext.Provider value={value}>
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocumentsContext() {
  const ctx = useContext(DocumentsContext);
  if (!ctx) {
    throw new Error("useDocumentsContext must be used inside <DocumentsProvider>");
  }
  return ctx;
}
