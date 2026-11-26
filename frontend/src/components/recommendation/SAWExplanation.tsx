import { CRITERIA, type Outcome } from "@/lib/recommendation";

export default function SAWExplanation({ weights }: { weights?: Outcome["weights"] }) {
  return (
    <section className="mx-auto mt-12 max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
      <h2 className="text-xl font-bold text-[#142B4A]">Cara skor dihitung</h2>
      <p className="mt-2 text-sm leading-6 text-gray-500">
        SAW menilai tiap PT lewat tiga langkah. PT di luar batas anggaran atau akreditasi minimum disaring dulu,
        jadi normalisasi hanya membandingkan PT yang memang layak.
      </p>

      <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-6 text-[#142B4A]">
        <li>
          <b>Samakan skala (normalisasi).</b> Kriteria benefit (makin besar makin baik):{" "}
          <code className="rounded bg-[#F1F5F9] px-1.5 py-0.5">r = x / x<sub>maks</sub></code>. Kriteria cost (makin kecil makin baik):{" "}
          <code className="rounded bg-[#F1F5F9] px-1.5 py-0.5">r = x<sub>min</sub> / x</code>. Hasilnya 0–1.
        </li>
        <li><b>Kalikan dengan bobot.</b> Bobot dari slidermu dijadikan persentase yang jumlahnya 100%.</li>
        <li>
          <b>Jumlahkan.</b> <code className="rounded bg-[#F1F5F9] px-1.5 py-0.5">V = Σ (w × r)</code>. Skor tertinggi
          jadi peringkat 1.
        </li>
      </ol>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[440px] text-left text-sm">
          <thead className="text-xs text-gray-400">
            <tr>
              <th className="py-2 pr-3 font-medium">Kriteria</th>
              <th className="py-2 pr-3 font-medium">Jenis</th>
              <th className="py-2 pr-3 font-medium">Satuan</th>
              {weights && <th className="py-2 font-medium">Bobotmu</th>}
            </tr>
          </thead>
          <tbody className="text-[#142B4A]">
            {CRITERIA.map((c) => (
              <tr key={c.key} className="border-t border-gray-100">
                <td className="py-2 pr-3">
                  <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                  {c.label}
                </td>
                <td className="py-2 pr-3">{c.type === "cost" ? "Cost" : "Benefit"}</td>
                <td className="py-2 pr-3">{c.unit}</td>
                {weights && <td className="py-2 tabular-nums">{(weights[c.key] * 100).toFixed(0)}%</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-5 text-xs leading-5 text-gray-400">
        Jarak adalah garis lurus dari titik pusat kota yang kamu pilih ke koordinat kampus, bukan jarak tempuh jalan.
        Jarak di bawah 1 km dihitung 1 km. Akreditasi diberi skor Unggul 4, Baik Sekali 3, Baik 2, Terakreditasi 1.
      </p>
    </section>
  );
}