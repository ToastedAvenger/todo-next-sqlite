'use client';
import React from 'react';

export default function SortFilterBar({ sort, setSort, q, setQ }: { sort: string; setSort: (v:string)=>void; q: string; setQ:(v:string)=>void; }) {
  return (
    <div className="row" style={{ alignItems: 'center' }}>
      <div style={{ flex: 1, minWidth: 240 }}>
        <div className="label">Search</div>
        <input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Filter by text…" />
      </div>
      <div style={{ minWidth: 220 }}>
        <div className="label">Sort by</div>
        <select className="select" value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="created_desc">Date added (new → old)</option>
          <option value="created_asc">Date added (old → new)</option>
          <option value="alpha_asc">Alphabetical (A → Z)</option>
          <option value="alpha_desc">Alphabetical (Z → A)</option>
          <option value="due_asc">Due date (earliest first)</option>
          <option value="due_desc">Due date (latest first)</option>
        </select>
      </div>
    </div>
  );
}
