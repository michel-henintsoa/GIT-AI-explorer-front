"use server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function fetchSummary(repoUrl: string) {
  const res = await fetch(
    `${BACKEND_URL}/summary?repo_url=${encodeURIComponent(repoUrl)}`
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Backend error (${res.status})`);
  }
  return res.json();
}

export async function fetchFiles(repoUrl: string) {
  const res = await fetch(
    `${BACKEND_URL}/files?repo_url=${encodeURIComponent(repoUrl)}`
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Backend error (${res.status})`);
  }
  return res.json();
}

export async function fetchFileExplanation(repoUrl: string, path: string) {
  const res = await fetch(
    `${BACKEND_URL}/explain-file?repo_url=${encodeURIComponent(repoUrl)}&path=${encodeURIComponent(path)}`
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Backend error (${res.status})`);
  }
  return res.json();
}

export async function fetchFunctions(repoUrl: string, path: string) {
  const res = await fetch(
    `${BACKEND_URL}/functions?repo_url=${encodeURIComponent(repoUrl)}&path=${encodeURIComponent(path)}`
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Backend error (${res.status})`);
  }
  return res.json();
}

export async function fetchFunctionExplanation(
  repoUrl: string,
  path: string,
  funcName: string
) {
  const res = await fetch(
    `${BACKEND_URL}/explain-function?repo_url=${encodeURIComponent(repoUrl)}&path=${encodeURIComponent(path)}&function=${encodeURIComponent(funcName)}`
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Backend error (${res.status})`);
  }
  return res.json();
}
