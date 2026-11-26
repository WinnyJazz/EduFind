"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, MapPin } from "lucide-react";
import { CRITERIA, type Outcome, type Ranked } from "@/lib/recommendation";

const FALLBACK = "/images/default-universitas.jpg";
const rp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

export function RecommendationSummary({ outcome }: { outcome: Outcome }) {
  const top = outcome.ranked[0];
  const { prefs } = outcome;
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="text-xl font-bold text-[#142B4A]">
        {top ? `${outcome.ranked.length} PT cocok untuk kamu` : "Belum ada PT yang cocok"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-gray-500">
        {top ? (
          <>Paling atas: <b className="text-[#142B4A]">{top.univ.nama_pt}</b> dengan skor {top.score.toFixed(3)}. </>
        ) : (
          "Tidak ada PT yang lolos batas anggaran dan akreditasi. Naikkan anggaran atau turunkan akreditasi minimum. "
        )}
        Dari {outcome.total} PT, {outcome.excluded} tidak ikut dihitung karena di luar batas anggaran
        {prefs.minAccred !== "all" ? " atau akreditasi" : ""}. Lokasi acuan: {prefs.location}.
      </p>
    </div>
  );
}

// Elemen utama: satu batang skor, tiap segmen = kontribusi satu kriteria (bobot × nilai normalisasi).
export function ScoreIndicator({ r }: { r: Ranked }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold tabular-nums text-[#142B4A]">{r.score.toFixed(3)}</span>
        <span className="text-xs text-gray-400">skor SAW (maks. 1)</span>
      </div>
      <div
        className="mt-2 flex h-3 overflow-hidden rounded-full bg-[#F1F5F9]"
        role="img"
        aria-label={`Skor ${r.score.toFixed(3)}: ${CRITERIA.map((c) => `${c.label} ${r.contrib[c.key].toFixed(3)}`).join(", ")}`}
      >
        {CRITERIA.map((c) => (
          <motion.div
            key={c.key}
            initial={{ width: 0 }}
            animate={{ width: `${r.contrib[c.key] * 100}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ background: c.color }}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
        {CRITERIA.map((c) => (
          <span key={c.key} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
            {c.label} {r.contrib[c.key].toFixed(3)}
          </span>
        ))}
      </div>
    </div>
  );
}

export function RecommendationDetail({ r, weights }: { r: Ranked; weights: Outcome["weights"] }) {
  const fmt = {
    jarak: (v: number) => `${v.toFixed(1)} km`,
    biaya: rp,
    akreditasi: (v: number) => `skor ${v}`,
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[460px] text-left text-sm">
        <thead className="text-xs text-gray-400">
          <tr>
            <th className="py-2 pr-3 font-medium">Kriteria</th>
            <th className="py-2 pr-3 font-medium">Nilai asli</th>
            <th className="py-2 pr-3 font-medium">Normalisasi (r)</th>
            <th className="py-2 pr-3 font-medium">Bobot (w)</th>
            <th className="py-2 font-medium">w × r</th>
          </tr>
        </thead>
        <tbody className="text-[#142B4A]">
          {CRITERIA.map((c) => (
            <tr key={c.key} className="border-t border-gray-100">
              <td className="py-2 pr-3">{c.label}</td>
              <td className="py-2 pr-3 tabular-nums">{fmt[c.key](c.key === "jarak" ? r.distanceKm : r.raw[c.key])}</td>
              <td className="py-2 pr-3 tabular-nums">{r.norm[c.key].toFixed(3)}</td>
              <td className="py-2 pr-3 tabular-nums">{(weights[c.key] * 100).toFixed(0)}%</td>
              <td className="py-2 tabular-nums">{r.contrib[c.key].toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function UniversityRankingCard({ r, weights }: { r: Ranked; weights: Outcome["weights"] }) {
  const [open, setOpen] = useState(false);
  const { univ } = r;
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex gap-4">
        <span className="w-8 shrink-0 text-2xl font-bold tabular-nums text-[#B98A3E]">#{r.rank}</span>
        {/* <img> biasa (bukan next/image) supaya URL dari domain kampus apa pun bisa tampil tanpa config remotePatterns */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={univ.gambar_url || FALLBACK}
          alt={`Kampus ${univ.nama_pt}`}
          loading="lazy"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK; }}
          className="hidden h-24 w-36 shrink-0 rounded-lg bg-[#F1F5F9] object-cover sm:block"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold leading-snug text-[#142B4A]">{univ.nama_pt}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
            <span className="flex items-center gap-1"><MapPin size={14} />{univ.kab_kota_pt}</span>
            <span>Akreditasi {univ.akred_pt}</span>
            <span>{rp(univ.biaya_per_semester)}/smt</span>
            <span>±{r.distanceKm.toFixed(0)} km</span>
          </p>
          <div className="mt-4"><ScoreIndicator r={r} /></div>
        </div>
      </div>
      <button
        type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
        className="mt-4 flex items-center gap-1 text-sm font-semibold text-[#315B83] hover:text-[#07368F]"
      >
        {open ? "Sembunyikan rincian" : "Lihat rincian skor"}
        <ChevronDown size={16} className={`transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-3"><RecommendationDetail r={r} weights={weights} /></div>}
    </article>
  );
}

export default function RecommendationResults({ outcome }: { outcome: Outcome }) {
  return (
    <section className="mx-auto mt-12 max-w-3xl space-y-4" aria-live="polite">
      <RecommendationSummary outcome={outcome} />
      {outcome.ranked.map((r) => (
        <UniversityRankingCard key={r.univ.slug} r={r} weights={outcome.weights} />
      ))}
    </section>
  );
}