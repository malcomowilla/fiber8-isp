import { useState, useEffect, useRef } from "react";

const CATEGORIES = {
  revenue: ["Sales", "Services", "Consulting", "Rent Income", "Other Revenue"],
  expense: ["Rent", "Salaries", "Utilities", "Internet", "Fuel", "Supplies", "Marketing", "Maintenance", "Other Expense"],
  asset: ["Equipment", "Vehicle", "Furniture", "Land", "Building", "Inventory", "Other Asset"],
  liability: ["Loan", "Credit Card", "Tax Payable", "Accounts Payable", "Other Liability"],
};

const ACCOUNTS = ["Cash", "Bank Account", "M-Pesa", "Credit"];

const TYPE_STYLES = {
  revenue: { bg: "#EAF3DE", color: "#3B6D11", label: "Revenue" },
  expense: { bg: "#FAEEDA", color: "#854F0B", label: "Expense" },
  asset: { bg: "#E6F1FB", color: "#185FA5", label: "Asset" },
  liability: { bg: "#FCEBEB", color: "#A32D2D", label: "Liability" },
};

function fmt(n) {
  return Number(n).toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function today() {
  return new Date().toISOString().split("T")[0];
}

function Badge({ type }) {
  const s = TYPE_STYLES[type] || { bg: "#F1EFE8", color: "#5F5E5A", label: type };
  return (
    <span style={{
      display: "inline-block", padding: "2px 9px", borderRadius: 20,
      fontSize: 11, fontWeight: 500, background: s.bg, color: s.color,
    }}>
      {s.label}
    </span>
  );
}

function SummaryCard({ label, value, color }) {
  return (
    <div style={{
      background: "#f7f7f5", borderRadius: 10, padding: "14px 16px", minWidth: 0,
    }}>
      <div style={{ fontSize: 11, color: "#888", marginBottom: 6, letterSpacing: "0.03em" }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 600, color: color || "#1a1a1a" }}>
        KES {fmt(value)}
      </div>
    </div>
  );
}

function RecordForm({ onAdd }) {
  const [type, setType] = useState("revenue");
  const [category, setCategory] = useState(CATEGORIES.revenue[0]);
  const [date, setDate] = useState(today());
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState(ACCOUNTS[0]);
  const [ref, setRef] = useState("");

  function handleTypeChange(t) {
    setType(t);
    setCategory(CATEGORIES[t][0]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!desc || !amount) return;
    onAdd({ id: Date.now(), date, type, category, desc, amount: parseFloat(amount), account, ref });
    setDesc(""); setAmount(""); setRef("");
    setDate(today());
  }

  const inputStyle = {
    width: "100%", fontSize: 13, padding: "7px 10px", borderRadius: 7,
    border: "0.5px solid #ddd", background: "#fff", color: "#1a1a1a",
    fontFamily: "inherit", outline: "none",
  };
  const labelStyle = { fontSize: 11, color: "#888", marginBottom: 4, display: "block" };

  return (
    <form onSubmit={handleSubmit} style={{
      background: "#fff", border: "0.5px solid #e8e8e8", borderRadius: 12,
      padding: "1.25rem", marginBottom: "1.5rem",
    }}>
      <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 16, color: "#1a1a1a" }}>New Transaction</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <label style={labelStyle}>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} required />
        </div>
        <div>
          <label style={labelStyle}>Type</label>
          <select value={type} onChange={e => handleTypeChange(e.target.value)} style={inputStyle}>
            <option value="revenue">Revenue</option>
            <option value="expense">Expense</option>
            <option value="asset">Asset Purchase</option>
            <option value="liability">Liability</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
            {CATEGORIES[type].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <label style={labelStyle}>Description</label>
          <input type="text" value={desc} onChange={e => setDesc(e.target.value)}
            placeholder="e.g. Office supplies" style={inputStyle} required />
        </div>
        <div>
          <label style={labelStyle}>Amount (KES)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
            min="0.01" step="0.01" placeholder="0.00" style={inputStyle} required />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>Account</label>
          <select value={account} onChange={e => setAccount(e.target.value)} style={inputStyle}>
            {ACCOUNTS.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Reference / Invoice #</label>
          <input type="text" value={ref} onChange={e => setRef(e.target.value)}
            placeholder="Optional" style={inputStyle} />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button type="submit" style={{
          padding: "8px 20px", fontSize: 13, fontWeight: 500, fontFamily: "inherit",
          background: "#378ADD", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer",
        }}>
          Save Transaction
        </button>
      </div>
    </form>
  );
}

function EntryTable({ entries, onDelete, showRef = false }) {
  if (!entries.length) {
    return <div style={{ textAlign: "center", padding: "2rem", color: "#aaa", fontSize: 13 }}>No transactions yet</div>;
  }
  const thStyle = { fontSize: 11, fontWeight: 500, color: "#999", textAlign: "left", padding: "6px 10px", borderBottom: "0.5px solid #eee" };
  const tdStyle = { padding: "8px 10px", borderBottom: "0.5px solid #f2f2f2", fontSize: 13, color: "#1a1a1a" };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Type</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Account</th>
            {showRef && <th style={thStyle}>Ref</th>}
            <th style={{ ...thStyle, textAlign: "right" }}>Amount</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {entries.map(en => (
            <tr key={en.id} style={{ transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
              onMouseLeave={e => e.currentTarget.style.background = ""}>
              <td style={tdStyle}>{en.date}</td>
              <td style={tdStyle}>{en.desc}</td>
              <td style={tdStyle}><Badge type={en.type} /></td>
              <td style={{ ...tdStyle, color: "#666" }}>{en.category}</td>
              <td style={{ ...tdStyle, color: "#666" }}>{en.account}</td>
              {showRef && <td style={{ ...tdStyle, color: "#999" }}>{en.ref || "—"}</td>}
              <td style={{
                ...tdStyle, textAlign: "right", fontWeight: 500,
                color: en.type === "revenue" || en.type === "asset" ? "#3B6D11" : "#A32D2D"
              }}>
                KES {fmt(en.amount)}
              </td>
              <td style={tdStyle}>
                <button onClick={() => onDelete(en.id)} style={{
                  fontSize: 11, padding: "3px 9px", cursor: "pointer", fontFamily: "inherit",
                  background: "none", border: "0.5px solid #f0a0a0", color: "#A32D2D", borderRadius: 6,
                }}>del</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Reports({ entries }) {
  const revenue = entries.filter(e => e.type === "revenue").reduce((s, e) => s + e.amount, 0);
  const expense = entries.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);
  const assets = entries.filter(e => e.type === "asset").reduce((s, e) => s + e.amount, 0);
  const liabilities = entries.filter(e => e.type === "liability").reduce((s, e) => s + e.amount, 0);
  const profit = revenue - expense;
  const equity = assets - liabilities;

  const expByCategory = CATEGORIES.expense.map(cat => ({
    cat,
    total: entries.filter(e => e.type === "expense" && e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter(x => x.total > 0);

  const maxExp = Math.max(...expByCategory.map(x => x.total), 1);

  const tdR = { padding: "7px 10px", fontSize: 13, textAlign: "right", borderBottom: "0.5px solid #f2f2f2" };
  const tdL = { padding: "7px 10px", fontSize: 13, borderBottom: "0.5px solid #f2f2f2", color: "#1a1a1a" };
  const thStyle = { fontSize: 11, fontWeight: 500, color: "#999", textAlign: "left", padding: "6px 10px", borderBottom: "0.5px solid #eee" };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 12, color: "#1a1a1a" }}>Income Statement</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={thStyle}>Item</th><th style={{ ...thStyle, textAlign: "right" }}>Amount</th></tr></thead>
            <tbody>
              <tr><td style={tdL}>Total Revenue</td><td style={{ ...tdR, color: "#3B6D11", fontWeight: 500 }}>KES {fmt(revenue)}</td></tr>
              <tr><td style={tdL}>Total Expenses</td><td style={{ ...tdR, color: "#A32D2D", fontWeight: 500 }}>KES {fmt(expense)}</td></tr>
              <tr>
                <td style={{ ...tdL, fontWeight: 600, borderTop: "1.5px solid #ddd" }}>Net Profit</td>
                <td style={{ ...tdR, fontWeight: 600, color: profit >= 0 ? "#3B6D11" : "#A32D2D", borderTop: "1.5px solid #ddd" }}>
                  KES {fmt(profit)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 12, color: "#1a1a1a" }}>Balance Sheet</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={thStyle}>Item</th><th style={{ ...thStyle, textAlign: "right" }}>Amount</th></tr></thead>
            <tbody>
              <tr><td style={tdL}>Total Assets</td><td style={{ ...tdR, color: "#185FA5", fontWeight: 500 }}>KES {fmt(assets)}</td></tr>
              <tr><td style={tdL}>Total Liabilities</td><td style={{ ...tdR, color: "#A32D2D", fontWeight: 500 }}>KES {fmt(liabilities)}</td></tr>
              <tr>
                <td style={{ ...tdL, fontWeight: 600, borderTop: "1.5px solid #ddd" }}>Owner's Equity</td>
                <td style={{ ...tdR, fontWeight: 600, color: equity >= 0 ? "#3B6D11" : "#A32D2D", borderTop: "1.5px solid #ddd" }}>
                  KES {fmt(equity)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {expByCategory.length > 0 && (
        <div>
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 14, color: "#1a1a1a" }}>Expenses by Category</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {expByCategory.sort((a, b) => b.total - a.total).map(x => (
              <div key={x.cat} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 12, color: "#666", width: 120, flexShrink: 0 }}>{x.cat}</div>
                <div style={{ flex: 1, background: "#f2f2f2", borderRadius: 4, height: 18, overflow: "hidden" }}>
                  <div style={{
                    width: `${(x.total / maxExp) * 100}%`, height: "100%",
                    background: "#FAEEDA", borderRadius: 4, transition: "width 0.4s ease",
                  }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#854F0B", width: 100, textAlign: "right", flexShrink: 0 }}>
                  KES {fmt(x.total)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Accounts({ entries }) {
  const rows = ACCOUNTS.map(acc => {
    const debits = entries
      .filter(e => e.account === acc && (e.type === "revenue" || e.type === "asset"))
      .reduce((s, e) => s + e.amount, 0);
    const credits = entries
      .filter(e => e.account === acc && (e.type === "expense" || e.type === "liability"))
      .reduce((s, e) => s + e.amount, 0);
    return { acc, debits, credits, balance: debits - credits };
  }).filter(r => r.debits > 0 || r.credits > 0);

  const thStyle = { fontSize: 11, fontWeight: 500, color: "#999", textAlign: "left", padding: "6px 10px", borderBottom: "0.5px solid #eee" };
  const tdStyle = { padding: "8px 10px", fontSize: 13, borderBottom: "0.5px solid #f2f2f2", color: "#1a1a1a" };

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={thStyle}>Account</th>
          <th style={{ ...thStyle, textAlign: "right" }}>Debit (in)</th>
          <th style={{ ...thStyle, textAlign: "right" }}>Credit (out)</th>
          <th style={{ ...thStyle, textAlign: "right" }}>Balance</th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr><td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "#aaa", fontSize: 13 }}>No data yet</td></tr>
        ) : (
          rows.map(r => (
            <tr key={r.acc}>
              <td style={tdStyle}>{r.acc}</td>
              <td style={{ ...tdStyle, textAlign: "right", color: "#3B6D11" }}>KES {fmt(r.debits)}</td>
              <td style={{ ...tdStyle, textAlign: "right", color: "#A32D2D" }}>KES {fmt(r.credits)}</td>
              <td style={{ ...tdStyle, textAlign: "right", fontWeight: 600, color: r.balance >= 0 ? "#185FA5" : "#A32D2D" }}>
                KES {fmt(r.balance)}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default function SimpleBookkeeping() {
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem("bk_entries") || "[]"); }
    catch { return []; }
  });
  const [activeTab, setActiveTab] = useState("record");

  useEffect(() => {
    localStorage.setItem("bk_entries", JSON.stringify(entries));
  }, [entries]);

  function addEntry(entry) {
    setEntries(prev => [entry, ...prev]);
  }

  function deleteEntry(id) {
    setEntries(prev => prev.filter(e => e.id !== id));
  }

  const revenue = entries.filter(e => e.type === "revenue").reduce((s, e) => s + e.amount, 0);
  const expense = entries.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);
  const assets = entries.filter(e => e.type === "asset").reduce((s, e) => s + e.amount, 0);
  const liabilities = entries.filter(e => e.type === "liability").reduce((s, e) => s + e.amount, 0);
  const profit = revenue - expense;

  const tabs = [
    { id: "record", label: "Record Entry" },
    { id: "journal", label: "Journal" },
    { id: "accounts", label: "Accounts" },
    { id: "reports", label: "Reports" },
  ];

  const tabStyle = (id) => ({
    padding: "9px 18px", fontSize: 13, background: "none", border: "none",
    cursor: "pointer", fontFamily: "inherit", fontWeight: activeTab === id ? 500 : 400,
    color: activeTab === id ? "#1a1a1a" : "#999",
    borderBottom: activeTab === id ? "2px solid #378ADD" : "2px solid transparent",
    marginBottom: -1, transition: "all 0.15s",
  });

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", padding: "1.5rem", maxWidth: 960, margin: "0 auto" }}>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: "1.5rem" }}>
        <SummaryCard label="Total Assets" value={assets} color="#185FA5" />
        <SummaryCard label="Total Liabilities" value={liabilities} color="#A32D2D" />
        <SummaryCard label="Revenue" value={revenue} color="#3B6D11" />
        <SummaryCard label="Expenses" value={expense} color="#854F0B" />
        <SummaryCard label="Net Profit" value={profit} color={profit >= 0 ? "#3B6D11" : "#A32D2D"} />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "0.5px solid #eee", marginBottom: "1.5rem" }}>
        {tabs.map(t => (
          <button key={t.id} style={tabStyle(t.id)} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "record" && (
        <>
          <RecordForm onAdd={addEntry} />
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 12, color: "#1a1a1a" }}>Recent entries</div>
          <EntryTable entries={entries.slice(0, 8)} onDelete={deleteEntry} />
        </>
      )}

      {activeTab === "journal" && (
        <>
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 12, color: "#1a1a1a" }}>All Transactions</div>
          <EntryTable entries={entries} onDelete={deleteEntry} showRef />
        </>
      )}

      {activeTab === "accounts" && (
        <>
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 12, color: "#1a1a1a" }}>Chart of Accounts</div>
          <Accounts entries={entries} />
        </>
      )}

      {activeTab === "reports" && <Reports entries={entries} />}
    </div>
  );
}