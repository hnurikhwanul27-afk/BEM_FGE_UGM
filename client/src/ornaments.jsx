const g = { fill: "var(--gold)", stroke: "var(--gold)", strokeWidth: 1 };
export const Lotus = ({ c }) => (
  <svg className={c} viewBox="0 0 100 100">
    {[...Array(12)].map((_, i) => (
      <path key={i} d="M50 50C38 34 40 14 50 4C60 14 62 34 50 50Z" transform={`rotate(${i * 30} 50 50)`} style={{ ...g, fillOpacity: i % 2 ? 0.22 : 0.34 }} />
    ))}
    {[...Array(8)].map((_, i) => (
      <path key={i} d="M50 50C43 42 44 30 50 22C56 30 57 42 50 50Z" transform={`rotate(${i * 45 + 22} 50 50)`} style={{ fill: "var(--gold2)", fillOpacity: 0.5, stroke: "var(--gold)", strokeWidth: 0.8 }} />
    ))}
    <circle cx="50" cy="50" r="6" style={{ fill: "var(--gold)" }} />
    <circle cx="50" cy="50" r="11" style={{ fill: "none", stroke: "var(--gold)", strokeWidth: 1.2 }} />
  </svg>
);
export const Wave = () => (
  <svg className="wave" viewBox="0 0 1200 40" preserveAspectRatio="none">
    <path d="M0 20Q150 0 300 20T600 20T900 20T1200 20" fill="none" stroke="var(--gold)" strokeWidth="2" />
    <path d="M0 32Q150 12 300 32T600 32T900 32T1200 32" fill="none" stroke="var(--gold)" strokeOpacity=".4" />
  </svg>
);
export const Chev = ({ c }) => (
  <svg className={c} viewBox="0 0 120 56">
    <path d="M2 46L32 8L60 40L88 8L118 46" style={{ fill: "none", stroke: "var(--gold)", strokeWidth: 5, strokeLinejoin: "round" }} />
    <path d="M2 54L32 22L60 50L88 22L118 54" style={{ fill: "none", stroke: "var(--gold)", strokeWidth: 3, strokeLinejoin: "round", opacity: 0.5 }} />
  </svg>
);
export const Spark = ({ x, y }) => (
  <svg className="sp" style={{ left: x + "%", top: y + "%" }} viewBox="0 0 20 20">
    <path d="M10 0Q11 9 20 10Q11 11 10 20Q9 11 0 10Q9 9 10 0Z" style={{ fill: "var(--gold2)" }} />
  </svg>
);
export const CalIcon = () => (
  <svg viewBox="0 0 20 20" width="16" height="16"><rect x="2" y="4" width="16" height="14" rx="2" style={{ fill: "none", stroke: "currentColor", strokeWidth: 1.6 }} /><path d="M2 8h16M6 2v4M14 2v4" style={{ stroke: "currentColor", strokeWidth: 1.6 }} /></svg>
);
