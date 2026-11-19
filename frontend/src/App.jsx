import React from "react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Wallet, Plus, ArrowUpRight, Utensils, Car, ShoppingBag, ReceiptText,
  MoreHorizontal, Pencil, Trash2, Search, CalendarDays, TrendingDown,
  LayoutDashboard, CircleHelp, Bell, ChevronDown, X, Check, Filter,
  CreditCard, Sparkles
} from "lucide-react";

const API = "http://localhost:5000/api/expenses";
const CATEGORIES = ["Food", "Travel", "Shopping", "Bills", "Other"];
const today = new Date().toISOString().slice(0, 10);
const money = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 2
}).format(value || 0);
const icons = {
  Food: Utensils, Travel: Car, Shopping: ShoppingBag, Bills: ReceiptText, Other: CreditCard
};
const colors = {
  Food: "orange", Travel: "blue", Shopping: "purple", Bills: "green", Other: "gray"
};

function App() {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", amount: "", category: "Food", date: today });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadExpenses() {
    try {
      setLoading(true);
      const { data } = await axios.get(API);
      setExpenses(data);
      setError("");
    } catch {
      setError("Couldn't connect to the backend. Start the backend server and check your MongoDB connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadExpenses(); }, []);

  const visibleExpenses = useMemo(() => expenses
    .filter((item) => category === "All" || item.category === category)
    .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.date) - new Date(a.date)), [expenses, category, search]);

  const total = visibleExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const allTotal = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const thisMonth = expenses
    .filter((item) => new Date(item.date).getMonth() === new Date().getMonth()
      && new Date(item.date).getFullYear() === new Date().getFullYear())
    .reduce((sum, item) => sum + Number(item.amount), 0);

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm({ title: "", amount: "", category: "Food", date: today });
    setEditingId(null);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!form.title.trim()) return setError("Please enter an expense title.");
    if (!form.amount || !Number.isFinite(Number(form.amount)) || Number(form.amount) <= 0) {
      return setError("Amount must be greater than 0.");
    }
    if (!CATEGORIES.includes(form.category)) return setError("Please choose a valid category.");
    if (!form.date) return setError("Please select a date.");

    const payload = { ...form, title: form.title.trim(), amount: Number(form.amount) };
    try {
      setSaving(true);
      if (editingId) {
        await axios.put(`${API}/${editingId}`, payload);
        setNotice("Expense updated successfully.");
      } else {
        await axios.post(API, payload);
        setNotice("Expense added successfully.");
      }
      resetForm();
      await loadExpenses();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save the expense. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(item) {
    setEditingId(item._id);
    setForm({
      title: item.title,
      amount: String(item.amount),
      category: item.category,
      date: new Date(item.date).toISOString().slice(0, 10)
    });
    setError("");
    setNotice("");
    document.getElementById("expense-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function deleteExpense(id) {
    if (!window.confirm("Delete this expense? This cannot be undone.")) return;
    try {
      await axios.delete(`${API}/${id}`);
      setNotice("Expense deleted.");
      if (editingId === id) resetForm();
      await loadExpenses();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't delete this expense.");
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#"><span className="brand-mark"><Wallet size={21}/></span><span>pennywise<span className="brand-dot">.</span></span></a>
        <div className="side-label">WORKSPACE</div>
        <button className="nav-item active"><LayoutDashboard size={18}/> Overview</button>
        <button className="nav-item" onClick={() => document.getElementById("expense-form")?.scrollIntoView({behavior:"smooth"})}><Plus size={18}/> Add expense</button>
        <div className="side-bottom">
          <div className="tip-card"><div className="tip-icon"><Sparkles size={17}/></div><strong>Small steps add up.</strong><p>Keep track of today to feel more confident about tomorrow.</p></div>
          <button className="nav-item muted"><CircleHelp size={18}/> Help center</button>
          <div className="profile"><div className="avatar">J</div><div><strong>My Workspace</strong><span>Personal account</span></div><MoreHorizontal size={19} className="profile-more"/></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> <strong>Overview</strong></div>
          <div className="top-actions"><span className="today-label"><CalendarDays size={15}/> {new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</span><button className="icon-button" aria-label="Notifications"><Bell size={18}/></button><div className="mini-avatar">J</div></div>
        </header>

        <section className="page-heading">
          <div><div className="eyebrow"><span className="eyebrow-dot"></span> YOUR FINANCIAL SNAPSHOT</div><h1>Good morning<span className="wave"> ✦</span></h1><p>Here's what's happening with your expenses.</p></div>
          <button className="primary-button" onClick={() => document.getElementById("expense-form")?.scrollIntoView({behavior:"smooth",block:"center"})}><Plus size={17}/> Add expense</button>
        </section>

        {error && !error.includes("Please") && <div className="alert error-alert">{error}</div>}
        {notice && <div className="alert success-alert"><Check size={16}/>{notice}<button onClick={()=>setNotice("")}><X size={15}/></button></div>}

        <section className="stats-grid">
          <div className="stat-card main-stat"><div className="stat-top"><span>Total expenses</span><span className="stat-icon dark"><Wallet size={18}/></span></div><div className="stat-value">{money(allTotal)}</div><div className="stat-foot"><span className="trend-pill"><TrendingDown size={13}/> All time</span><span className="stat-note">Across {expenses.length} transactions</span></div><div className="stat-decoration"></div></div>
          <div className="stat-card"><div className="stat-top"><span>This month</span><span className="stat-icon violet"><CalendarDays size={18}/></span></div><div className="stat-value">{money(thisMonth)}</div><div className="stat-foot"><span className="stat-note">Expenses recorded this month</span></div></div>
          <div className="stat-card"><div className="stat-top"><span>Transactions</span><span className="stat-icon peach"><ReceiptText size={18}/></span></div><div className="stat-value">{expenses.length}</div><div className="stat-foot"><span className="stat-note">Total entries saved</span></div></div>
        </section>

        <section className="content-grid">
          <div className="panel transactions-panel">
            <div className="panel-heading"><div><h2>Recent transactions</h2><p>Your latest spending activity</p></div><span className="count-badge">{visibleExpenses.length} records</span></div>
            <div className="toolbar">
              <div className="search-box"><Search size={16}/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search expenses..."/></div>
              <div className="filter-box"><Filter size={15}/><select value={category} onChange={(e)=>setCategory(e.target.value)}><option value="All">All categories</option>{CATEGORIES.map((c)=><option key={c}>{c}</option>)}</select><ChevronDown size={14}/></div>
            </div>
            <div className="table-wrap">
              <table><thead><tr><th>TRANSACTION</th><th>CATEGORY</th><th>DATE</th><th className="amount-col">AMOUNT</th><th></th></tr></thead>
                <tbody>
                  {loading ? <tr><td colSpan="5" className="empty-state">Loading your expenses...</td></tr> :
                  visibleExpenses.length === 0 ? <tr><td colSpan="5" className="empty-state"><div className="empty-icon"><ReceiptText size={22}/></div><strong>No expenses found</strong><span>Add your first expense or change the filter.</span></td></tr> :
                  visibleExpenses.map((item) => {
                    const Icon = icons[item.category] || CreditCard;
                    return <tr key={item._id}><td><div className="transaction-name"><span className={`category-icon ${colors[item.category]}`}><Icon size={17}/></span><strong>{item.title}</strong></div></td><td><span className={`category-tag ${colors[item.category]}`}>{item.category}</span></td><td className="date-cell">{new Date(item.date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</td><td className="amount-cell">− {money(item.amount)}</td><td><div className="row-actions"><button title="Edit" onClick={()=>startEdit(item)}><Pencil size={15}/></button><button title="Delete" onClick={()=>deleteExpense(item._id)}><Trash2 size={15}/></button></div></td></tr>;
                  })}
                </tbody>
              </table>
            </div>
            <div className="table-footer"><span>Showing {visibleExpenses.length} of {expenses.length} expenses</span><strong>Filtered total: {money(total)}</strong></div>
          </div>

          <aside className="panel form-panel" id="expense-form">
            <div className="panel-heading form-heading"><div><div className="form-kicker">{editingId ? "MAKE A CHANGE" : "NEW ENTRY"}</div><h2>{editingId ? "Edit expense" : "Add an expense"}</h2><p>{editingId ? "Update the details below." : "What did you spend on today?"}</p></div>{editingId && <button className="close-edit" onClick={resetForm}><X size={17}/></button>}</div>
            <form onSubmit={handleSubmit}>
              <label>EXPENSE TITLE<input name="title" value={form.title} onChange={updateForm} placeholder="e.g. Lunch with friends" maxLength="80"/></label>
              <label>AMOUNT<div className="amount-input"><span>₹</span><input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={updateForm} placeholder="0.00"/></div></label>
              <label>CATEGORY<div className="select-wrap"><select name="category" value={form.category} onChange={updateForm}>{CATEGORIES.map((c)=><option key={c}>{c}</option>)}</select><ChevronDown size={16}/></div></label>
              <label>DATE<input name="date" type="date" value={form.date} onChange={updateForm}/></label>
              {error && <div className="form-error">{error}</div>}
              <button className="submit-button" type="submit" disabled={saving}>{saving ? "Saving..." : <>{editingId ? "Save changes" : "Add expense"} <ArrowUpRight size={17}/></>}</button>
              {editingId && <button type="button" className="cancel-button" onClick={resetForm}>Cancel editing</button>}
            </form>
            <div className="secure-note"><span><Check size={13}/></span> Your expense details are saved securely in your database.</div>
          </aside>
        </section>
        <footer className="footer"><span>© {new Date().getFullYear()} Pennywise Expense Tracker</span><span>Made to make money feel simpler <span className="heart">♥</span></span></footer>
      </main>
    </div>
  );
}

export default App;
