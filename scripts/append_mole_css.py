# -*- coding: utf-8 -*-
with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

mole_css = """
/* ═══ MOLE RATIO & STOICHIOMETRIC GUIDE STYLES ═══ */
.mole-guide-shell {
  margin-bottom: 24px;
}

/* Hero Banner */
.mole-hero {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  padding: 22px 24px;
  background: linear-gradient(135deg, rgba(47, 129, 247, 0.08) 0%, rgba(130, 80, 223, 0.06) 100%), var(--glass-strong);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(47, 129, 247, 0.2);
  box-shadow: 0 4px 20px rgba(47, 129, 247, 0.08), var(--shadow);
  margin-bottom: 16px;
}
.mole-hero-badge { margin-bottom: 8px; }
.mole-hero-title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--fg);
  margin: 0 0 8px;
  line-height: 1.35;
}
.mole-hero-desc {
  font-size: 0.92rem;
  color: var(--muted);
  line-height: 1.55;
  margin: 0 0 16px;
  max-width: 780px;
}
.mole-hero-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* Horizontal Scroll Filter Chips (Mobile-First) */
.mole-filter-bar {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 2px 10px;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 12px;
}
.mole-filter-bar::-webkit-scrollbar { display: none; }
.mole-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  background: var(--glass-strong);
  border: 1px solid var(--line-soft);
  color: var(--fg);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
}
.mole-chip:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
}
.mole-chip.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
  box-shadow: 0 2px 8px rgba(47, 129, 247, 0.3);
}
.mole-chip-count {
  display: inline-block;
  padding: 1px 6px;
  font-size: 0.72rem;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.08);
}
.mole-chip.active .mole-chip-count {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}

/* Search Bar */
.mole-search-wrap {
  position: relative;
  margin-bottom: 14px;
}
.mole-search-input {
  width: 100%;
  padding: 10px 38px 10px 14px;
  font-size: 0.92rem;
  border-radius: 10px;
  border: 1px solid var(--line-soft);
  background: var(--glass-strong);
  color: var(--fg);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.mole-search-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(47, 129, 247, 0.15);
}
.mole-search-clear {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--muted);
  cursor: pointer;
  font-size: 0.95rem;
  padding: 4px;
}
.mole-results-meta {
  font-size: 0.82rem;
  color: var(--muted);
  margin-bottom: 14px;
  padding: 0 2px;
}

/* Cards Grid */
.mole-cards-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.mole-card {
  background: var(--glass-strong);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--line-soft);
  border-left: 4px solid var(--accent);
  border-radius: 14px;
  padding: 16px 18px;
  box-shadow: var(--shadow);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.mole-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
}
.mole-card.border-amber { border-left-color: #d29922; }
.mole-card.border-emerald { border-left-color: #238636; }
.mole-card.border-coral { border-left-color: #da3633; }
.mole-card.border-purple { border-left-color: #8957e5; }
.mole-card.border-blue { border-left-color: #2f81f7; }
.mole-card.border-orange { border-left-color: #d97706; }

.mole-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 10px;
}
.mole-card-title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.mole-card-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 650;
  color: var(--fg);
  line-height: 1.4;
}
.mole-card-toggle {
  background: rgba(47, 129, 247, 0.08);
  border: 1px solid rgba(47, 129, 247, 0.15);
  color: var(--accent);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.15s;
}
.mole-card-toggle:hover {
  background: var(--accent);
  color: #fff;
}

/* Equation Box */
.mole-eq-box {
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(47, 129, 247, 0.12);
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 10px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.mole-eq-label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted);
  margin-bottom: 4px;
}
.mole-eq-code {
  font-family: var(--font-mono, "SF Mono", Consolas, monospace);
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--fg);
  line-height: 1.5;
  white-space: nowrap;
}
.mole-eq-cond {
  font-size: 0.78rem;
  color: var(--muted);
  margin-top: 4px;
  font-style: italic;
}

/* Ratio Row & Pills */
.mole-ratio-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}
.mole-ratio-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--muted);
}
.mole-ratio-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  border: 1px solid transparent;
}
.mole-ratio-pill.blue {
  background: rgba(47, 129, 247, 0.12);
  color: #0969da;
  border-color: rgba(47, 129, 247, 0.25);
}
.mole-ratio-pill.amber {
  background: rgba(210, 153, 34, 0.15);
  color: #9a6700;
  border-color: rgba(210, 153, 34, 0.35);
}
.mole-ratio-pill.emerald {
  background: rgba(35, 134, 54, 0.14);
  color: #1a7f37;
  border-color: rgba(35, 134, 54, 0.3);
}
.mole-ratio-pill.purple {
  background: rgba(137, 87, 229, 0.14);
  color: #6e40c9;
  border-color: rgba(137, 87, 229, 0.3);
}
.mole-ratio-pill.coral {
  background: rgba(218, 54, 51, 0.14);
  color: #cf222e;
  border-color: rgba(218, 54, 51, 0.3);
}
.mole-ratio-pill.orange {
  background: rgba(217, 119, 6, 0.14);
  color: #b45309;
  border-color: rgba(217, 119, 6, 0.3);
}

/* Card Body & Bullet Points */
.mole-card-body {
  border-top: 1px dashed var(--line-soft);
  padding-top: 10px;
  margin-top: 6px;
  animation: fadeIn 0.2s ease-in-out;
}
.mole-formula-box {
  background: rgba(47, 129, 247, 0.05);
  border: 1px solid rgba(47, 129, 247, 0.15);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.85rem;
  margin-bottom: 10px;
  color: var(--fg);
}
.mole-formula-box code {
  font-weight: 700;
  color: var(--accent);
}
.mole-points-list {
  margin: 0;
  padding-left: 20px;
  font-size: 0.88rem;
  color: var(--fg);
  line-height: 1.6;
}
.mole-points-list li {
  margin-bottom: 5px;
}
.mole-points-list li.mole-warn-point {
  color: #b05e00;
  font-weight: 550;
}

/* Table View */
.mole-table-wrap {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid var(--line-soft);
  background: var(--glass-strong);
}
.mole-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.86rem;
}
.mole-table th {
  background: rgba(0, 0, 0, 0.03);
  padding: 10px 14px;
  text-align: left;
  font-weight: 650;
  color: var(--muted);
  border-bottom: 1px solid var(--line-soft);
}
.mole-table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--line-soft);
  vertical-align: top;
}
.mole-table tr:last-child td { border-bottom: none; }
.mole-table .tbl-name { font-size: 0.92rem; color: var(--fg); margin-bottom: 2px; }
.mole-table .tbl-eq-code {
  font-family: var(--font-mono, monospace);
  font-size: 0.82rem;
  line-height: 1.45;
  color: var(--fg);
}
.mole-table .tbl-formula {
  background: rgba(47, 129, 247, 0.05);
  padding: 4px 8px;
  border-radius: 6px;
  margin-bottom: 6px;
  font-size: 0.8rem;
}
.mole-table .tbl-points {
  margin: 0;
  padding-left: 18px;
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--muted);
}
.mole-table .tbl-points li { margin-bottom: 4px; }

/* Dark Mode Overrides */
html[data-theme="dark"] .mole-hero {
  background: linear-gradient(135deg, rgba(56, 139, 253, 0.12) 0%, rgba(137, 87, 229, 0.08) 100%), #161b22;
  border-color: rgba(56, 139, 253, 0.25);
}
html[data-theme="dark"] .mole-eq-box {
  background: #0d1117;
  border-color: rgba(56, 139, 253, 0.2);
}
html[data-theme="dark"] .mole-ratio-pill.blue {
  background: rgba(56, 139, 253, 0.18);
  color: #79c0ff;
  border-color: rgba(56, 139, 253, 0.35);
}
html[data-theme="dark"] .mole-ratio-pill.amber {
  background: rgba(210, 153, 34, 0.2);
  color: #e3b341;
  border-color: rgba(210, 153, 34, 0.4);
}
html[data-theme="dark"] .mole-ratio-pill.emerald {
  background: rgba(46, 160, 67, 0.2);
  color: #56d364;
  border-color: rgba(46, 160, 67, 0.4);
}
html[data-theme="dark"] .mole-ratio-pill.purple {
  background: rgba(187, 128, 255, 0.18);
  color: #d2a8ff;
  border-color: rgba(187, 128, 255, 0.35);
}
html[data-theme="dark"] .mole-ratio-pill.coral {
  background: rgba(248, 81, 73, 0.2);
  color: #ff7b72;
  border-color: rgba(248, 81, 73, 0.4);
}
html[data-theme="dark"] .mole-ratio-pill.orange {
  background: rgba(217, 119, 6, 0.2);
  color: #ffa657;
  border-color: rgba(217, 119, 6, 0.4);
}
html[data-theme="dark"] .mole-formula-box {
  background: rgba(56, 139, 253, 0.08);
  border-color: rgba(56, 139, 253, 0.2);
}
html[data-theme="dark"] .mole-points-list li.mole-warn-point {
  color: #e3b341;
}
html[data-theme="dark"] .mole-table th {
  background: rgba(255, 255, 255, 0.03);
}

/* Mobile Responsiveness */
@media (max-width: 640px) {
  .mole-hero {
    padding: 16px 14px;
    border-radius: 12px;
  }
  .mole-hero-title {
    font-size: 1.1rem;
  }
  .mole-hero-desc {
    font-size: 0.85rem;
    margin-bottom: 12px;
  }
  .mole-hero-actions .btn {
    font-size: 0.78rem;
    padding: 6px 10px;
  }
  .mole-card {
    padding: 12px 14px;
    border-radius: 12px;
  }
  .mole-card-title {
    font-size: 0.94rem;
  }
  .mole-eq-code {
    font-size: 0.82rem;
  }
  .mole-ratio-pill {
    font-size: 0.8rem;
    padding: 3px 10px;
  }
  .mole-points-list {
    font-size: 0.82rem;
    padding-left: 16px;
  }
}
"""

with open("css/style.css", "a", encoding="utf-8") as f:
    f.write("\n" + mole_css + "\n")

print("Appended mole_css to css/style.css successfully!")
