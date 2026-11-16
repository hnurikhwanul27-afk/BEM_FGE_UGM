import { useEffect, useRef, useState } from "react";
import { useSite } from "./ctx.js";
import { isAuthed, login, logout, saveContent, upload } from "./api.js";
import { THEMES, applyTheme } from "./theme.js";

const Inp = ({ label, value, onChange, area }) => (
  <><label>{label}</label>
    {area ? <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} />
      : <input value={value || ""} onChange={(e) => onChange(e.target.value)} />}</>
);
const Pic = ({ label, url, onUrl, onErr }) => (
  <><label>{label}</label>{url && <img className="thumb" src={url} alt="" />}
    <input type="file" accept="image/*" onChange={async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try { onUrl(await upload(f)); } catch { onErr("Upload gagal"); }
    }} /></>
);

function Login({ onOk }) {
  const [u, setU] = useState(""), [p, setP] = useState(""), [e, setE] = useState("");
  const submit = async (ev) => { ev.preventDefault(); try { await login(u, p); onOk(); } catch (x) { setE(x.message); } };
  return (
    <div className="wrap adm"><div className="pagehead"><div className="eyebrow">Khusus Pengurus</div><h1>Admin <span className="script">Login</span></h1></div>
      <form className="card" onSubmit={submit} style={{ maxWidth: 460 }}>
        <Inp label="Username" value={u} onChange={setU} />
        <label>Password</label><input type="password" value={p} onChange={(e) => setP(e.target.value)} />
        {e && <p className="mini">{e}</p>}
        <div className="row"><button className="btn" type="submit">Masuk</button></div>
      </form></div>
  );
}

function Editor({ onOut }) {
  const { S, setS } = useSite();
  const [d, setD] = useState(() => JSON.parse(JSON.stringify(S)));
  const [msg, setMsg] = useState("");
  const sref = useRef(S); sref.current = S;
  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 2200); };
  useEffect(() => { applyTheme(d.theme); }, [d.theme]);
  useEffect(() => () => applyTheme(sref.current.theme), []);

  const set = (k, v) => setD((p) => ({ ...p, [k]: v }));
  const setImg = (k, v) => setD((p) => ({ ...p, img: { ...p.img, [k]: v } }));
  const upd = (k, i, f, v) => setD((p) => ({ ...p, [k]: p[k].map((x, j) => (j === i ? { ...x, [f]: v } : x)) }));
  const del = (k, i) => setD((p) => ({ ...p, [k]: p[k].filter((_, j) => j !== i) }));
  const add = (k, item, front) => setD((p) => ({ ...p, [k]: front ? [item, ...p[k]] : [...p[k], item] }));
  const fld = (k, label, area = true) => <Inp label={label} value={d[k]} onChange={(v) => set(k, v)} area={area} />;
  const th = d.theme || THEMES.Marun;

  const save = async () => {
    try {
      const ns = d.struktur.map((x) => ({ ...x }));
      ns.forEach((x) => { let c = x, k = 0; while (c && c.p && k++ < 50) c = ns.find((y) => y.id === c.p); if (k >= 50) x.p = ""; });
      const out = { ...d, struktur: ns };
      await saveContent(out); setS(out); setD(out); flash("Tersimpan");
    } catch (e) { flash(e.message); }
  };

  const gal = (k, label) => (
    <div className="card"><h3>{label}</h3><label>Tambah gambar (boleh pilih banyak)</label>
      <input type="file" accept="image/*" multiple onChange={async (e) => {
        for (const f of e.target.files) { try { add(k, { u: await upload(f), c: "" }, true); } catch { flash("Upload gagal"); } }
        e.target.value = "";
      }} />
      {d[k].map((g, i) => (
        <div className="item" style={{ display: "block" }} key={i}>
          <img className="thumb" src={g.u} alt="" />
          <Inp label="Keterangan" value={g.c} onChange={(v) => upd(k, i, "c", v)} />
          <div className="row"><button onClick={() => del(k, i)}>Hapus</button></div>
        </div>))}
    </div>
  );

  return (
    <div className="wrap adm"><div className="pagehead"><div className="eyebrow">Khusus Pengurus</div><h1>Admin <span className="script">Panel</span></h1></div>
      <div className="row" style={{ marginBottom: 18 }}>
        <button className="btn" onClick={save}>Simpan Semua Perubahan</button>
        <button className="btn ghost" onClick={() => { logout(); onOut(); }}>Keluar</button></div>

      <div className="card"><h3>Tampilan &amp; Logo</h3>
        <Pic label="Logo navbar (menggantikan tulisan BEM FGE UGM)" url={d.img?.nav} onUrl={(u) => setImg("nav", u)} onErr={flash} />
        {d.img?.nav && <div className="row"><button className="btn ghost" onClick={() => setImg("nav", "")}>Kembali ke tulisan</button></div>}
        <label>Warna tampilan</label>
        <div className="row">{Object.keys(THEMES).map((k) => <button className="btn ghost" key={k} onClick={() => set("theme", THEMES[k])}>{k}</button>)}</div>
        {[["bg", "Latar paling gelap"], ["bg2", "Latar tengah"], ["red", "Latar paling terang"], ["gold", "Aksen / ornamen"], ["gold2", "Aksen muda"], ["cream", "Warna teks"]].map(([k, l]) => (
          <div key={k}><label>{l}</label><input type="color" value={th[k]} onChange={(e) => set("theme", { ...th, [k]: e.target.value })} /></div>))}
        {fld("sosmed", "Kontak & media sosial footer (nama | isi, satu baris per item)")}
      </div>

      <div className="card"><h3>Beranda</h3>
        <Inp label="Nama kabinet" value={d.kabinet.nama} onChange={(v) => set("kabinet", { ...d.kabinet, nama: v })} />
        <Inp label="Tema / tagline kabinet" value={d.kabinet.tema} onChange={(v) => set("kabinet", { ...d.kabinet, tema: v })} />
        <Pic label="Foto kabinet" url={d.img?.kab} onUrl={(u) => setImg("kab", u)} onErr={flash} />
        <Pic label="Logo BEM" url={d.img?.logoBem} onUrl={(u) => setImg("logoBem", u)} onErr={flash} />
        <Pic label="Logo kabinet" url={d.img?.logoKab} onUrl={(u) => setImg("logoKab", u)} onErr={flash} />
        {fld("jargon", "Jargon", false)}{fld("profil", "Profil BEM")}{fld("tujuan", "Tujuan")}{fld("fungsi", "Fungsi")}{fld("visi", "Visi")}
        {fld("misi", "Misi (satu baris = satu poin)")}{fld("logoBem", "Filosofi logo BEM")}{fld("logoBemPoin", "Makna logo BEM (judul | isi)")}
        {fld("logoKabinet", "Filosofi logo kabinet")}{fld("logoKabPoin", "Makna logo kabinet (judul | isi)")}
        {fld("korsa", "Filosofi korsa")}{fld("korsaPoin", "Poin korsa (judul | isi)")}{fld("yel", "Suara semangat / yel-yel")}{fld("mars", "Alunan asa & karsa (lagu/mars)")}
      </div>

      {gal("korsaImg", "Gambar Korsa")}

      <div className="card"><h3>Sejarah</h3>
        {d.sejarah.map((s, i) => (<div className="item" style={{ display: "block" }} key={i}>
          <Inp label="Tahun / judul" value={s.y} onChange={(v) => upd("sejarah", i, "y", v)} />
          <Inp label="Cerita" area value={s.t} onChange={(v) => upd("sejarah", i, "t", v)} />
          <div className="row"><button onClick={() => del("sejarah", i)}>Hapus</button></div></div>))}
        <div className="row"><button className="btn ghost" onClick={() => add("sejarah", { y: "", t: "" })}>+ Tambah</button></div>
      </div>

      <div className="card"><h3>Struktur Organisasi</h3>
        <p className="mini">Atur “Atasan” untuk menentukan hubungan antar divisi; kosongkan untuk posisi paling atas.</p>
        {d.struktur.map((s, i) => (<div className="item" style={{ display: "block" }} key={s.id}>
          <Inp label="Jabatan / Divisi" value={s.j} onChange={(v) => upd("struktur", i, "j", v)} />
          <Inp label="Nama" value={s.n} onChange={(v) => upd("struktur", i, "n", v)} />
          <label>Atasan</label>
          <select value={s.p} onChange={(e) => upd("struktur", i, "p", e.target.value)}>
            <option value="">— (paling atas) —</option>
            {d.struktur.filter((o) => o.id !== s.id).map((o) => <option key={o.id} value={o.id}>{o.j}{o.n ? " – " + o.n : ""}</option>)}
          </select>
          <Pic label="Foto" url={s.img} onUrl={(u) => upd("struktur", i, "img", u)} onErr={flash} />
          <div className="row"><button onClick={() => setD((p) => ({ ...p, struktur: p.struktur.filter((x) => x.id !== s.id).map((x) => (x.p === s.id ? { ...x, p: "" } : x)) }))}>Hapus posisi</button></div>
        </div>))}
        <div className="row"><button className="btn ghost" onClick={() => add("struktur", { id: "s" + Date.now(), j: "Divisi Baru", n: "", p: "", img: "" })}>+ Tambah Posisi</button></div>
      </div>

      <div className="card"><h3>Berita</h3>
        <div className="row"><button className="btn ghost" onClick={() => add("berita", { id: "b" + Date.now(), j: "", d: "", t: "", img: "" }, true)}>+ Tambah Berita</button></div>
        {d.berita.map((b, i) => (<div className="item" style={{ display: "block" }} key={b.id}>
          <Inp label="Judul" value={b.j} onChange={(v) => upd("berita", i, "j", v)} />
          <Inp label="Tanggal" value={b.d} onChange={(v) => upd("berita", i, "d", v)} />
          <Inp label="Isi" area value={b.t} onChange={(v) => upd("berita", i, "t", v)} />
          <Pic label="Gambar berita" url={b.img} onUrl={(u) => upd("berita", i, "img", u)} onErr={flash} />
          <div className="row"><button onClick={() => del("berita", i)}>Hapus</button></div></div>))}
      </div>

      {gal("galeri", "Gallery")}
      <div className="row"><button className="btn" onClick={save}>Simpan Semua Perubahan</button></div>
      {msg && <div className="flash">{msg}</div>}
    </div>
  );
}

export default function Admin() {
  const [ok, setOk] = useState(isAuthed());
  return ok ? <Editor onOut={() => setOk(false)} /> : <Login onOk={() => setOk(true)} />;
}
