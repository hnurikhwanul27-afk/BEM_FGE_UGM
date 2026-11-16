import React, { useContext, useLayoutEffect, useRef } from "react";
import { Ctx, GoCtx } from "./ctx.js";
import { gsap, pageAnim } from "./anim.js";
import { Lotus, Wave, CalIcon } from "./ornaments.jsx";
import { lines, split } from "./utils.js";

export function Page({ children }) {
  const r = useRef();
  useLayoutEffect(() => { const c = gsap.context(() => pageAnim(r.current), r); return () => c.revert(); }, []);
  return <div ref={r}>{children}</div>;
}
export function GoLink({ to, className, children }) {
  const go = useContext(GoCtx);
  return <a href={to} className={className} onClick={(e) => go(e, to)}>{children}</a>;
}
const Words = ({ t }) => t.split(" ").map((w, i) => (<React.Fragment key={i}><span className="w"><i>{w}</i></span>{" "}</React.Fragment>));
const SH = ({ a, b }) => (<div className="sh"><Lotus c="sl" /><span className="script">{a}</span><h2>{b}</h2></div>);
const Head = ({ eyebrow, children }) => (<div className="pagehead"><div className="eyebrow">{eyebrow}</div><h1>{children}</h1></div>);
const Pts = ({ text }) => lines(text).map((l, i) => { const [a, b] = split(l); return <div className="pt" key={i}>{a && <b>{a}</b>}<span>{b}</span></div>; });
const LogoCard = ({ t, img, d, p }) => (
  <div className="card logo rv"><div className="emb">{img ? <img src={img} alt={t} /> : <span>Logo</span>}</div><h3>{t}</h3><p>{d}</p><Pts text={p} /></div>
);

export function Beranda() {
  const { S } = useContext(Ctx);
  const logos = [S.img?.nav, S.img?.logoBem, S.img?.logoKab].filter(Boolean);
  return (
    <Page>
      <div className="wrap"><div className="hero2"><Lotus c="fl a" /><Lotus c="fl b" />
        <div>
          {logos.length > 0 && <div className="lp">{logos.map((u, i) => <img key={i} src={u} alt="" />)}</div>}
          <div className="eyebrow">BEM KM Fakultas Geografi UGM</div>
          <h1><Words t={S.kabinet.nama} /></h1>
          <div className="script">{S.kabinet.tema}</div>
          <div className="row"><GoLink className="btn" to="/berita">Lihat Berita</GoLink><GoLink className="btn ghost" to="/struktur">Struktur Organisasi</GoLink></div>
        </div>
        <div className="polaroid"><div className="pin" />
          <div className="ph">{S.img?.kab ? <img src={S.img.kab} alt="Foto kabinet" /> : <>Foto kabinet<br />(unggah lewat Admin)</>}</div>
          <div className="ribbon">Kabinet Saat Ini</div></div>
      </div></div>
      <div className="marquee"><div>{Array(16).fill(S.jargon).map((j, i) => <span key={i}>{j}</span>)}</div></div>
      <div className="wrap">
        <section className="blk"><SH a="Profil" b="BEM FGE UGM" /><div className="card rv"><p className="big">{S.profil}</p></div></section><Wave />
        <section className="blk"><div className="bento">
          <div className="card rv t"><span className="pill">Tujuan</span><p>{S.tujuan}</p></div>
          <div className="card rv f"><span className="pill">Fungsi</span><p>{S.fungsi}</p></div>
          <div className="card rv v"><span className="pill">Visi</span><p>{S.visi}</p></div>
          <div className="card rv m"><span className="pill">Misi</span><ol className="num">{lines(S.misi).map((m, i) => <li key={i}>{m}</li>)}</ol></div>
        </div></section><Wave />
        <section className="blk"><SH a="Filosofi" b="Logo" /><div className="grid">
          <LogoCard t="Logo BEM" img={S.img?.logoBem} d={S.logoBem} p={S.logoBemPoin} />
          <LogoCard t="Logo Kabinet" img={S.img?.logoKab} d={S.logoKabinet} p={S.logoKabPoin} />
        </div></section><Wave />
        <section className="blk"><div className="korsa-h cond rv">Korsa</div><SH a="Filosofi" b="Korsa" />
          <div className="card rv" style={{ marginBottom: 18 }}><p className="big">{S.korsa}</p></div>
          {(S.korsaImg || []).length > 0 && <div className="kg">{S.korsaImg.map((k, i) => (<figure className="rv" key={i}><img src={k.u} alt={k.c || "Korsa"} loading="lazy" />{k.c && <figcaption>{k.c}</figcaption>}</figure>))}</div>}
          <div className="grid">{lines(S.korsaPoin).map((l, i) => { const [a, b] = split(l); return <div className="card rv" key={i}><h3>{a}</h3><p>{b}</p></div>; })}</div>
        </section><Wave />
        <section className="blk"><div className="grid">
          <div className="card poem rv"><span className="pill">Suara Semangat</span><p>{S.yel}</p></div>
          <div className="card poem rv"><span className="pill">Alunan Asa &amp; Karsa</span><p>{S.mars}</p></div>
        </div></section>
        <section className="blk"><SH a="Jargon" b="Kami" /><p className="script rv" style={{ fontSize: "clamp(34px,7vw,84px)", lineHeight: 1.1 }}>“{S.jargon}”</p></section>
      </div>
    </Page>
  );
}

export function Sejarah() {
  const { S } = useContext(Ctx);
  return (<Page><div className="wrap"><Head eyebrow="Perjalanan">Sejarah <span className="script">BEM</span></Head>
    <div className="tl">{S.sejarah.map((s, i) => <div className="it rv" key={i}><div className="yr">{s.y}</div><p>{s.t}</p></div>)}</div></div></Page>);
}

const Tree = ({ nodes, items }) => items.length ? (
  <ul>{items.map((x) => (
    <li key={x.id}>
      <div className="card nd rv">
        {x.img ? <img className="av" src={x.img} alt={x.n} /> : <div className="av">{(x.n || x.j || "?")[0]}</div>}
        <small>{x.j}</small><b>{x.n}</b>
      </div>
      <Tree nodes={nodes} items={nodes.filter((y) => y.p === x.id)} />
    </li>))}
  </ul>) : null;

export function Struktur() {
  const { S } = useContext(Ctx);
  const ids = new Set(S.struktur.map((x) => x.id));
  return (<Page><div className="wrap"><Head eyebrow={S.kabinet.nama}>Struktur <span className="script">Organisasi</span></Head>
    <div className="tree"><Tree nodes={S.struktur} items={S.struktur.filter((x) => !x.p || !ids.has(x.p))} /></div></div></Page>);
}

export function Berita() {
  const { S } = useContext(Ctx);
  return (<Page><div className="wrap"><Head eyebrow="Kabar Terbaru">Berita</Head>
    <div className="news g">{S.berita.length ? S.berita.map((b) => (
      <article className="rv" key={b.id}>
        {b.img && <img className="nimg" src={b.img} alt={b.j} loading="lazy" />}
        <div className="nb"><time className="ipill"><CalIcon />{b.d}</time><h3>{b.j}</h3><p>{b.t}</p></div>
      </article>)) : <div className="empty">Belum ada berita.</div>}</div></div></Page>);
}

export function Galeri() {
  const { S } = useContext(Ctx);
  return (<Page><div className="wrap"><Head eyebrow="Dokumentasi">Gallery</Head>
    {S.galeri.length ? <div className="gal">{S.galeri.map((g, i) => <figure className="rv" key={i}><img src={g.u} alt={g.c} loading="lazy" /><figcaption>{g.c}</figcaption></figure>)}</div>
      : <div className="empty">Belum ada foto. Tambahkan lewat Admin.</div>}</div></Page>);
}
