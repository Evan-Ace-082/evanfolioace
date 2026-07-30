import { useState } from "react";
import { toast } from "sonner";
import { Field, FieldInput, useDraft } from "./fields";
import { useCollection, useDeleteRow, useSaveRow, useSingleton, type Row } from "@/lib/cms";

export function SingletonForm({ table, title, fields }: { table: string; title: string; fields: Field[] }) {
  const { data, isLoading } = useSingleton(table);
  const save = useSaveRow(table);
  const { draft, set, setDraft } = useDraft(data);

  if (isLoading) return <Skeleton />;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate(draft, {
          onSuccess: () => toast.success(`${title} saved`),
          onError: (err) => toast.error(err instanceof Error ? err.message : "Save failed"),
        });
      }}
      className="glass rounded-3xl p-6 sm:p-8"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {fields.map((f) => (
          <FieldInput key={f.key} field={f} value={draft[f.key]} onChange={(v) => set(f.key, v)} />
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="submit" disabled={save.isPending} className="rounded-xl btn-glow btn-glow-hover px-6 py-2.5 text-sm font-semibold disabled:opacity-60">
          {save.isPending ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={() => setDraft(data ?? {})} className="rounded-xl glass px-6 py-2.5 text-sm font-semibold hover:bg-white/10">
          Cancel
        </button>
        <a href="/" target="_blank" rel="noopener" className="rounded-xl glass px-6 py-2.5 text-sm font-semibold hover:bg-white/10">
          Preview site
        </a>
      </div>
    </form>
  );
}

export function CollectionManager({
  table,
  title,
  fields,
  labelKey = "title",
  orderBy = "display_order",
  readOnly = false,
}: {
  table: string;
  title: string;
  fields: Field[];
  labelKey?: string;
  orderBy?: string;
  readOnly?: boolean;
}) {
  const { data, isLoading } = useCollection(table, { orderBy, ascending: orderBy !== "created_at" });
  const save = useSaveRow(table);
  const remove = useDeleteRow(table);
  const [editing, setEditing] = useState<Row | null>(null);
  const [q, setQ] = useState("");

  const rows = (data ?? []).filter((r) =>
    q ? JSON.stringify(r).toLowerCase().includes(q.toLowerCase()) : true,
  );

  if (isLoading) return <Skeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${title.toLowerCase()}…`}
          className="w-full max-w-xs rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-primary sm:w-auto"
        />
        <span className="text-xs text-white/40">{rows.length} item(s)</span>
        {!readOnly && (
          <button onClick={() => setEditing({})} className="ml-auto rounded-xl btn-glow btn-glow-hover px-5 py-2.5 text-sm font-semibold">
            + New
          </button>
        )}
      </div>

      {editing && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate(editing, {
              onSuccess: () => {
                toast.success("Saved");
                setEditing(null);
              },
              onError: (err) => toast.error(err instanceof Error ? err.message : "Save failed"),
            });
          }}
          className="glass-strong rounded-3xl p-6"
        >
          <h3 className="mb-5 font-display text-lg font-bold">{editing.id ? "Edit" : "New"} entry</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {fields.map((f) => (
              <FieldInput key={f.key} field={f} value={editing[f.key]} onChange={(v) => setEditing({ ...editing, [f.key]: v })} />
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="submit" disabled={save.isPending} className="rounded-xl btn-glow btn-glow-hover px-6 py-2.5 text-sm font-semibold disabled:opacity-60">
              {save.isPending ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="rounded-xl glass px-6 py-2.5 text-sm font-semibold hover:bg-white/10">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-3">
        {rows.map((r) => (
          <div key={r.id} className="flex flex-wrap items-center gap-4 rounded-2xl glass p-4">
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-white/90">{String(r[labelKey] ?? r.name ?? r.title ?? "Untitled")}</div>
              <div className="truncate text-xs text-white/40">
                {String(r.short_description ?? r.description ?? r.subject ?? r.organization ?? r.company ?? r.institution ?? "")}
              </div>
            </div>
            {r.status ? <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-primary">{r.status}</span> : null}
            <button onClick={() => setEditing(r)} className="rounded-lg glass px-4 py-2 text-xs hover:bg-white/10">
              Edit
            </button>
            {!readOnly && (
              <button
                onClick={() => {
                  save.mutate({ ...r, id: undefined, slug: undefined, title: r.title ? `${r.title} (copy)` : undefined });
                }}
                className="rounded-lg glass px-4 py-2 text-xs hover:bg-white/10"
              >
                Duplicate
              </button>
            )}
            <button
              onClick={() => {
                if (confirm("Delete this item?")) remove.mutate(r.id, { onSuccess: () => toast.success("Deleted") });
              }}
              className="rounded-lg glass px-4 py-2 text-xs text-red-300 hover:bg-red-500/10"
            >
              Delete
            </button>
          </div>
        ))}
        {rows.length === 0 && <p className="rounded-2xl glass p-8 text-center text-sm text-white/40">Nothing here yet.</p>}
      </div>
    </div>
  );
}

export function Skeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/5" />
      ))}
    </div>
  );
}
