"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase in browser for admin view
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminDashboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pass, setPass] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [search, setSearch] = useState("");

  // Simple hardcoded password for admin - CHANGE THIS OR USE ENV
  const ADMIN_PASSWORD = "Aramkore@##$54545"; 

  useEffect(() => {
    if (isAuthenticated) {
      fetchEntries();
    }
  }, [isAuthenticated]);

  async function fetchEntries() {
    setLoading(true);
    const { data, error } = await supabase
      .from("entries")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setEntries(data);
    setLoading(false);
  }

  const handleLogin = (e) => {
    e.preventDefault();
    if (pass === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Wrong password, Bhai!");
    }
  };

  const exportCSV = () => {
    const headers = ["ID", "Username", "Lucky Number", "IP Address", "Date"];
    const rows = entries.map(e => [
      e.id, 
      e.username, 
      e.lucky_number, 
      e.ip_address, 
      new Date(e.created_at).toLocaleString()
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(r => r.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "giveaway_entries.csv");
    document.body.appendChild(link);
    link.click();
  };

  const filtered = entries.filter(e => 
    e.username.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div style={s.loginPage}>
        <div style={s.loginCard}>
          <h2 style={s.title}>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Enter Admin Password" 
              style={s.input} 
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <button type="submit" style={s.btn}>Enter Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={s.adminPage}>
      <header style={s.header}>
        <div style={s.headerContent}>
          <h1 style={s.title}>Giveaway Admin</h1>
          <div style={s.actions}>
            <input 
              type="text" 
              placeholder="Search username..." 
              style={s.search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={exportCSV} style={s.exportBtn}>Export Excel (CSV)</button>
            <button onClick={fetchEntries} style={s.refreshBtn}>🔄</button>
          </div>
        </div>
      </header>

      <main style={s.main}>
        <div style={s.stats}>
          <div style={s.statCard}>
            <span style={s.statLabel}>Total Entries</span>
            <span style={s.statValue}>{entries.length} / 1000</span>
          </div>
        </div>

        <div style={s.tableContainer}>
          {loading ? (
            <p>Loading entries...</p>
          ) : (
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Username</th>
                  <th style={s.th}>Lucky #</th>
                  <th style={s.th}>IP Address</th>
                  <th style={s.th}>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => (
                  <tr key={entry.id} style={s.tr}>
                    <td style={s.td}>@{entry.username}</td>
                    <td style={s.td}><span style={s.numberBadge}>{entry.lucky_number}</span></td>
                    <td style={s.td}><code style={s.ip}>{entry.ip_address}</code></td>
                    <td style={s.td}>{new Date(entry.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

const s = {
  loginPage: { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" },
  loginCard: { background: "white", padding: "3rem", borderRadius: 20, boxShadow: "0 10px 25px rgba(0,0,0,0.05)", textAlign: "center", width: 400 },
  adminPage: { minHeight: "100vh", background: "#f1f5f9", padding: "2rem" },
  header: { marginBottom: "2rem" },
  headerContent: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 15 },
  title: { fontSize: 24, fontWeight: 800, color: "#1e293b", fontFamily: "var(--font-montserrat)" },
  actions: { display: "flex", gap: 10, alignItems: "center" },
  search: { padding: "10px 15px", borderRadius: 10, border: "1px solid #cbd5e1", outline: "none", width: 250 },
  exportBtn: { background: "#10a37f", color: "white", border: "none", padding: "10px 20px", borderRadius: 10, fontWeight: 600, cursor: "pointer" },
  refreshBtn: { background: "white", border: "1px solid #cbd5e1", padding: "10px", borderRadius: 10, cursor: "pointer" },
  main: { maxWidth: 1200, margin: "0 auto" },
  stats: { marginBottom: "1.5rem" },
  statCard: { background: "white", padding: "1.5rem", borderRadius: 15, display: "inline-block", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" },
  statLabel: { display: "block", color: "#64748b", fontSize: 13, fontWeight: 600, textTransform: "uppercase" },
  statValue: { fontSize: 28, fontWeight: 800, color: "#10a37f" },
  tableContainer: { background: "white", borderRadius: 15, overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: { padding: "15px 20px", background: "#f8fafc", color: "#64748b", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #e2e8f0" },
  td: { padding: "15px 20px", borderBottom: "1px solid #f1f5f9", fontSize: 14, color: "#334155" },
  tr: { transition: "background 0.2s", ":hover": { background: "#f8fafc" } },
  numberBadge: { background: "#ecfdf5", color: "#10a37f", padding: "4px 10px", borderRadius: 6, fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  ip: { background: "#f1f5f9", padding: "2px 6px", borderRadius: 4, fontSize: 12 },
  input: { width: "100%", padding: "12px", marginBottom: "1rem", borderRadius: 10, border: "1px solid #e2e8f0", marginTop: "1rem" },
  btn: { width: "100%", padding: "12px", background: "#1e293b", color: "white", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" }
};
