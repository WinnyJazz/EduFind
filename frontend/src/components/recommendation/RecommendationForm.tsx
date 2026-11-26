"use client";

import { useState } from "react";
import { ChevronDown, MapPin, Sparkles, Wallet, BadgeCheck } from "lucide-react";
import { CRITERIA, LOCATIONS, type AccredLevel, type Criterion, type Prefs } from "@/lib/recommendation";

const fieldCls =
  "w-full appearance-none rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-10 text-sm text-[#142B4A] outline-none transition focus:border-[#07368F] focus:ring-2 focus:ring-[#07368F]/10";
const labelCls = "mb-2 block text-sm font-semibold text-[#142B4A]";

export function LocationInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label htmlFor="location" className={labelCls}>Lokasi kamu</label>
      <div className="relative">
        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#315B83]" />
        <select id="location" value={value} onChange={(e) => onChange(e.target.value)} className={fieldCls}>
          <option value="">Pilih kota / wilayah</option>
          {Object.keys(LOCATIONS).map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
}

export function BudgetInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const n = Number(value);
  return (
    <div>
      <label htmlFor="budget" className={labelCls}>Anggaran maksimal per semester</label>
      <div className="relative">
        <Wallet size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#315B83]" />
        <input
          id="budget" type="number" inputMode="numeric" min={0} step={500000} value={value}
          onChange={(e) => onChange(e.target.value)} placeholder="Contoh: 6000000"
          className={fieldCls.replace("pr-10", "pr-4")}
        />
      </div>
      <p className="mt-1.5 text-xs text-gray-400">
        {n > 0 ? `Rp ${n.toLocaleString("id-ID")} per semester. ` : ""}
        Kosongkan kalau tidak ada batas. PT di atas batas ini tidak ikut dihitung.
      </p>
    </div>
  );
}

export function AccreditationSelect({ value, onChange }: { value: AccredLevel; onChange: (v: AccredLevel) => void }) {
  return (
    <div>
      <label htmlFor="accred" className={labelCls}>Akreditasi minimum</label>
      <div className="relative">
        <BadgeCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#315B83]" />
        <select id="accred" value={value} onChange={(e) => onChange(e.target.value as AccredLevel)} className={fieldCls}>
          <option value="all">Semua akreditasi</option>
          <option value="Baik">Baik ke atas</option>
          <option value="Baik Sekali">Baik Sekali ke atas</option>
          <option value="Unggul">Unggul saja</option>
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
}

export function CriteriaWeightSlider({
  weights, onChange,
}: { weights: Record<Criterion, number>; onChange: (k: Criterion, v: number) => void }) {
  const sum = Object.values(weights).reduce((a, b) => a + b, 0);
  return (
    <fieldset className="rounded-xl bg-[#F8FAFC] p-5">
      <legend className="sr-only">Bobot kriteria</legend>
      <h3 className="text-sm font-bold text-[#142B4A]">Seberapa penting tiap kriteria?</h3>
      <p className="mt-1 text-sm text-gray-500">Geser sesuai prioritasmu. Bobot otomatis dijadikan persentase.</p>
      <div className="mt-4 space-y-4">
        {CRITERIA.map((c) => {
          const pct = sum ? Math.round((weights[c.key] / sum) * 100) : 0;
          return (
            <div key={c.key}>
              <div className="flex items-center justify-between text-sm">
                <label htmlFor={`w-${c.key}`} className="flex items-center gap-2 font-medium text-[#142B4A]">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                  {c.label}
                </label>
                <span className="tabular-nums text-gray-500">{pct}%</span>
              </div>
              <input
                id={`w-${c.key}`} type="range" min={0} max={100} step={5} value={weights[c.key]}
                onChange={(e) => onChange(c.key, Number(e.target.value))}
                className="mt-1 w-full cursor-pointer" style={{ accentColor: c.color === "#D7AD68" ? "#B98A3E" : c.color }}
              />
            </div>
          );
        })}
      </div>
      {sum === 0 && <p className="mt-3 text-xs text-red-600">Minimal satu kriteria harus punya bobot di atas 0.</p>}
    </fieldset>
  );
}

export function SubmitButton({ disabled }: { disabled: boolean }) {
  return (
    <button
      type="submit" disabled={disabled}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#07368F] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#142B4A] disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Sparkles size={17} className="text-[#D7AD68]" />
      Find Recommendations
    </button>
  );
}

export default function RecommendationForm({ onSubmit }: { onSubmit: (p: Prefs) => void }) {
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [accred, setAccred] = useState<AccredLevel>("all");
  const [weights, setWeights] = useState<Record<Criterion, number>>({ jarak: 50, biaya: 50, akreditasi: 50 });
  const sum = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <section className="mx-auto mt-12 max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
      <h2 className="text-xl font-bold text-[#142B4A]">Preferensi kamu</h2>
      <form
        className="mt-6 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ location, maxBudget: Number(budget) > 0 ? Number(budget) : null, minAccred: accred, weights });
        }}
      >
        <LocationInput value={location} onChange={setLocation} />
        <BudgetInput value={budget} onChange={setBudget} />
        <AccreditationSelect value={accred} onChange={setAccred} />
        <CriteriaWeightSlider weights={weights} onChange={(k, v) => setWeights((w) => ({ ...w, [k]: v }))} />
        <SubmitButton disabled={!location || sum === 0} />
      </form>
    </section>
  );
}