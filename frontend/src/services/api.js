// Base API URL - set VITE_API_URL in a .env file when you deploy the backend.
// Falls back to your local FastAPI server for development.
export const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: options.body instanceof FormData
      ? undefined
      : { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // response wasn't JSON, keep default message
    }
    throw new Error(message);
  }

  return response.json();
}

// ---------- Documents ----------

export function uploadPDF(file) {
  const formData = new FormData();
  formData.append("file", file);
  return request("/upload", { method: "POST", body: formData });
}

export function listDocuments() {
  return request("/documents");
}

export function deleteDocument(docId) {
  return request(`/documents/${docId}`, { method: "DELETE" });
}

// ---------- Chat ----------

export function askQuestion(question, docId) {
  return request("/chat", {
    method: "POST",
    body: JSON.stringify({ question, doc_id: docId || null }),
  });
}

// ---------- Smart Search ----------

export function smartSearch(query, docId) {
  const params = new URLSearchParams({ q: query });
  if (docId) params.set("doc_id", docId);
  return request(`/search?${params.toString()}`);
}

// ---------- Executive Summary ----------

export function getSummary(docId) {
  return request(`/summary/${docId}`);
}

// ---------- Engineering Dashboard ----------

export function getDashboard(docId) {
  return request(`/dashboard/${docId}`);
}

// ---------- Formula Extractor ----------

export function getFormulas(docId) {
  return request(`/formulas/${docId}`);
}

// ---------- Knowledge Graph ----------

export function getKnowledgeGraph(docId) {
  return request(`/knowledge-graph/${docId}`);
}

// ---------- Compare PDFs ----------

export function compareDocuments(docIdA, docIdB) {
  return request("/compare", {
    method: "POST",
    body: JSON.stringify({ doc_id_a: docIdA, doc_id_b: docIdB }),
  });
}

// ---------- Report Generator ----------

export function getReport(docId) {
  return request(`/report/${docId}`);
}
