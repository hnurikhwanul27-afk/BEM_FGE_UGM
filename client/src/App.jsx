import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Routes, Route, useNavigate, useLocation, NavLink } from "react-router-dom";
import { Ctx, GoCtx } from "./ctx.js";
import { getContent } from "./api.js";
import { applyTheme } from "./theme.js";
import { gsap, decoAnim } from "./anim.js";
import { Lotus, Chev, Spark } from "./ornaments.jsx";
import { Beranda, Sejarah, Struktur, Berita, Galeri } from "./pages.jsx";
import Admin from "./Admin.jsx";
import { lines, split } from "./utils.js";

const SPARKS = [[8, 30], [22, 62], [48, 18], [70, 48], [88, 24], [60, 84], [35, 90], [93, 70]];
const MENU = [["/", "Beranda"], ["/sejarah", "Sejarah"], ["/struktur", "Struktur"], ["/berita", "Berita"], ["/galeri", "Gallery"]];

export default function App() {
  const [S, setS] = useState(null);
  const [err, setErr] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  const curtain = useRef(), cur = useRef(), loader = useRef();

  useEffect(() => { getContent().then(setS).catch(() => setErr(true)); }, []);
  useLayoutEffect(() => { if (S) applyTheme(S.theme); }, [S]);

  useEffect(() => {
    if (!S) return;
    decoAnim();
    gsap.timeline().from("#loader h2", { y: 40, opacity: 0, duration: 0.8, ease: "power3.out" })
      .to("#loader", { yPercent: -100, duration: 0.9, ease: "expo.inOut", delay: 0.4 }).set("#loader", { display: "none" });
    const mv = (e) => gsap.to(cur.current, { x: e.clientX - 17, y: e.clientY - 17, duration: 0.35, ease: "power3" });
    const ov = (e) => gsap.to(cur.current, { scale: e.target.closest?.("a,button,.card") ? 1.8 : 1, duration: 0.3 });
    addEventListener("mousemove", mv); document.addEventListener("mouseover", ov);
    return () => { removeEventListener("mousemove", mv); document.removeEventListener("mouseover", ov); };
  }, [!!S]);

  const go = (e, to) => {
    e.preventDefault();
    if (to === loc.pathname) return;
    gsap.timeline().set(curtain.current, { y: "100%" })
      .to(curtain.current, { y: 0, duration: 0.5, ease: "power3.inOut" })
      .add(() => { nav(to); scrollTo(0, 0); })
      .to(curtain.current, { y: "-100%", duration: 0.6, ease: "power3.inOut", delay: 0.1 });
  };

  if (err) return <p style={{ padding: 40 }}>Gagal memuat data. Pastikan server berjalan.</p>;
  if (!S) return <div id="loader"><div className="eyebrow">Memuat</div><h2>BEM <span className="script">Geografi</span></h2></div>;

  return (
    <Ctx.Provider value={{ S, setS }}>
      <GoCtx.Provider value={go}>
        <div id="loader"><div className="eyebrow">Memuat</div><h2>BEM <span className="script">Geografi</span></h2></div>
        <div id="curtain" ref={curtain} /><div id="cur" ref={cur} />
        <div id="deco"><Lotus c="d1" /><Lotus c="d2" /><Lotus c="d3" /><Lotus c="d5" /><Chev c="d4" />{SPARKS.map(([x, y], i) => <Spark key={i} x={x} y={y} />)}</div>
        <nav>
          <a className="brand" href="/" onClick={(e) => go(e, "/")}>{S.img?.nav ? <img src={S.img.nav} alt="BEM FGE UGM" /> : "BEM FGE UGM"}</a>
          <div className="links">{MENU.map(([to, l]) => (
            <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => (isActive ? "on" : "")} onClick={(e) => go(e, to)}>{l}</NavLink>))}</div>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<Beranda />} /><Route path="/sejarah" element={<Sejarah />} />
            <Route path="/struktur" element={<Struktur />} /><Route path="/berita" element={<Berita />} />
            <Route path="/galeri" element={<Galeri />} /><Route path="/admin" element={<Admin />} /><Route path="*" element={<Beranda />} />
          </Routes>
        </main>
        <footer>
          <svg className="fwave" viewBox="0 0 1200 60" preserveAspectRatio="none"><path d="M0 34Q200 0 400 34T800 34T1200 26V60H0z" style={{ fill: "var(--bg)" }} /><path d="M0 34Q200 0 400 34T800 34T1200 26" style={{ fill: "none", stroke: "var(--gold)", strokeWidth: 2 }} /></svg>
          <div className="fin"><div className="soc">{lines(S.sosmed).map((l, i) => { const [a, b] = split(l); return <span className="chip" key={i}><b>{a}</b>{b}</span>; })}</div>
            <div>© 2026 BEM KM Fakultas Geografi UGM · {S.jargon}</div></div>
        </footer>
      </GoCtx.Provider>
    </Ctx.Provider>
  );
}
