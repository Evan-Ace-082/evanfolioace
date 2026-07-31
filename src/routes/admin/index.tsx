import { useEffect, useState } from "react";
import { createFileRoute, redirect, useNavigate, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCollection } from "@/lib/cms";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/admin/login" });
    return { user: data.user };
  },
  head: () => ({
    meta: [
      { title: "Dashboard — Portfolio Admin" },
      { name: "description", content: "Manage portfolio content: projects, skills, messages and more." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Dashboard — Portfolio Admin" },
      { property: "og:description", content: "Manage portfolio content: projects, skills, messages and more." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminHome,
});

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-xs uppercase tracking-widest text-white/40">{label}</div>
      <div className="mt-2 font-display text-3xl font-bold text-gradient">{value}</div>
    </div>
  );
}

function AdminHome() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  const projects = useCollection("projects");
  const skills = useCollection("skills");
  const messages = useCollection("messages", { orderBy: "created_at", ascending: false });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  return (
    <main className="relative min-h-screen bg-background px-6 py-12 text-white">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-10" />
      <div className="relative mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-gradient">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-white/50">Signed in as {email ?? "…"}</p>
          </div>
          <div className="ml-auto flex gap-3">
            <Link to="/" className="rounded-xl glass px-5 py-2.5 text-sm font-semibold hover:bg-white/10">
              View site
            </Link>
            <button onClick={signOut} className="rounded-xl glass px-5 py-2.5 text-sm font-semibold hover:bg-white/10">
              Sign out
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard label="Projects" value={projects.data?.length ?? 0} />
          <StatCard label="Skills" value={skills.data?.length ?? 0} />
          <StatCard label="Messages" value={messages.data?.length ?? 0} />
        </div>

        <div className="mt-10 glass rounded-3xl p-6">
          <h2 className="font-display text-lg font-bold">Recent messages</h2>
          <div className="mt-4 space-y-3">
            {(messages.data ?? []).slice(0, 5).map((m) => (
              <div key={m.id} className="rounded-2xl bg-white/5 p-4">
                <div className="text-sm font-semibold text-white/90">
                  {String(m.name ?? "Unknown")} · <span className="text-white/50">{String(m.email ?? "")}</span>
                </div>
                <div className="mt-1 line-clamp-2 text-sm text-white/60">{String(m.message ?? "")}</div>
              </div>
            ))}
            {(messages.data ?? []).length === 0 && (
              <p className="text-sm text-white/40">No messages yet.</p>
            )}
          </div>
        </div>

        <p className="mt-8 text-xs text-white/30">
          Content editors for every section are being added next.
        </p>
      </div>
    </main>
  );
}
