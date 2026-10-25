"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { fetchAdminEnquiries, patchAdminEnquiry } from "@/lib/admin-api";
import type { Enquiry } from "@/lib/enquiries";

function Badge({
  tone,
  children,
}: {
  tone: "amber" | "green" | "neutral";
  children: ReactNode;
}) {
  return <span className={`rg-badge ${tone}`}>{children}</span>;
}

export default function EnquiriesPanel() {
  const [rows, setRows] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"New" | "All">("New");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await fetchAdminEnquiries());
    } catch (cause) {
      toast.error(String((cause as Error).message || cause));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const visible = rows.filter((r) => filter === "All" || r.status === "New");

  async function setStatus(row: Enquiry, status: Enquiry["status"]) {
    try {
      await patchAdminEnquiry(row.id, { ...row, status });
      await refresh();
      toast.success(`Marked as ${status.toLowerCase()}`);
    } catch (cause) {
      toast.error(String((cause as Error).message || cause));
    }
  }

  return (
    <section className="rg-panel">
      <div className="rg-panel-head">
        <div>
          <h2>Customer enquiries</h2>
          <p className="rg-subtle">
            Leads from the website enquiry form. Contact details stay staff-only.
          </p>
        </div>
        <div className="rg-inline-actions">
          <button
            type="button"
            className={`rg-btn small ${filter === "New" ? "primary" : ""}`}
            onClick={() => setFilter("New")}
          >
            New
          </button>
          <button
            type="button"
            className={`rg-btn small ${filter === "All" ? "primary" : ""}`}
            onClick={() => setFilter("All")}
          >
            All
          </button>
        </div>
      </div>
      {loading ? (
        <p className="rg-subtle">Loading enquiries…</p>
      ) : visible.length === 0 ? (
        <p className="rg-subtle">No enquiries in this view.</p>
      ) : (
        <div className="rg-table-wrap">
          <table className="rg-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Need</th>
                <th>Details</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong>{row.name}</strong>
                    <small>
                      {row.phone}
                      {row.area ? ` · ${row.area}` : ""}
                    </small>
                  </td>
                  <td>
                    {row.service}
                    {row.budget ? <small>Budget: {row.budget}</small> : null}
                  </td>
                  <td>
                    {(row.startTime || row.endTime) && (
                      <small>
                        {row.startTime || "?"} – {row.endTime || "?"}
                      </small>
                    )}
                    {row.message ? <small>{row.message}</small> : null}
                  </td>
                  <td>
                    <Badge
                      tone={
                        row.status === "New"
                          ? "amber"
                          : row.status === "Contacted"
                            ? "green"
                            : "neutral"
                      }
                    >
                      {row.status}
                    </Badge>
                  </td>
                  <td>
                    {row.status === "New" ? (
                      <div className="rg-inline-actions">
                        <button
                          type="button"
                          className="rg-btn primary small"
                          onClick={() => void setStatus(row, "Contacted")}
                        >
                          Contacted
                        </button>
                        <button
                          type="button"
                          className="rg-btn small"
                          onClick={() => void setStatus(row, "Closed")}
                        >
                          Close
                        </button>
                      </div>
                    ) : row.status === "Contacted" ? (
                      <button
                        type="button"
                        className="rg-btn small"
                        onClick={() => void setStatus(row, "Closed")}
                      >
                        Close
                      </button>
                    ) : (
                      <span className="rg-subtle">Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
