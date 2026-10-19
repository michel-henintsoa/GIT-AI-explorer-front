"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/app/auth-context";

interface Repo {
  id: number;
  repo_url: string;
  repo_name: string;
  owner: string;
  added_at: string;
  last_used_at: string;
}

export function UserRepos() {
  const { user, isLoading: authLoading } = useAuth();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRepos = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("session_token");
      if (!token) {
        setRepos([]);
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "https://ai-gitexplorer.vercel.app"}/github/user/repos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRepos(data.repos || []);
      } else {
        setRepos([]);
      }
    } catch (err) {
      console.error("Error fetching repos:", err);
      setError("Impossible de charger l'historique");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchRepos();
    } else {
      setRepos([]);
    }
  }, [user, fetchRepos]);

  const handleReclone = useCallback(async (repoId: number) => {
    const token = localStorage.getItem("session_token");
    if (!token) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://ai-gitexplorer.vercel.app"}/github/user/repos/${repoId}/reclone`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        // Recharger l'historique après reclone
        fetchRepos();
        // Rediriger vers l'analyse du repo
        const repo = repos.find(r => r.id === repoId);
        if (repo) {
          window.location.href = `/?repo_url=${encodeURIComponent(repo.repo_url)}`;
        }
      }
    } catch (err) {
      console.error("Error recloning:", err);
    }
  }, [repos, fetchRepos]);

  const handleDelete = useCallback(async (repoId: number) => {
    const token = localStorage.getItem("session_token");
    if (!token) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://ai-gitexplorer.vercel.app"}/github/user/repos/${repoId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        setRepos(prev => prev.filter(r => r.id !== repoId));
      }
    } catch (err) {
      console.error("Error deleting repo:", err);
    }
  }, []);

  if (!user || authLoading) {
    return null;
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
          Mon historique
        </h3>
        <span className="text-[10px] text-slate-600">{repos.length} repo(s)</span>
      </div>

      {repos.length === 0 ? (
        <p className="text-xs text-slate-600 text-center py-4">
          Aucun repository dans l'historique.<br />
          Clone un repo pour commencer.
        </p>
      ) : (
        <div className="space-y-2">
          {repos.map(repo => (
            <div
              key={repo.id}
              className="flex items-center gap-2 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-slate-300 truncate">
                  {repo.owner}/{repo.repo_name}
                </p>
                <p className="text-[10px] text-slate-600">
                  {new Date(repo.last_used_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleReclone(repo.id)}
                  className="text-[10px] px-2 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
                  title="Recloner"
                >
                  Recloner
                </button>
                <button
                  onClick={() => handleDelete(repo.id)}
                  className="text-[10px] px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                  title="Supprimer"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 mt-2">{error}</p>
      )}
    </div>
  );
}
