export const THEMES = {
  Marun: { bg: "#4a0a0a", bg2: "#6e1410", red: "#8f1d14", gold: "#f0b94d", gold2: "#ffd98a", cream: "#fff3dc" },
  Navy: { bg: "#08182f", bg2: "#0f2f5a", red: "#1a4a86", gold: "#e8d9a8", gold2: "#fff4d6", cream: "#fff8e8" },
  Hijau: { bg: "#0a2e1f", bg2: "#14503a", red: "#1d6b4d", gold: "#f0c75e", gold2: "#ffe49a", cream: "#f6f3dc" },
  Ungu: { bg: "#2a1850", bg2: "#4b2f8a", red: "#6b4fb3", gold: "#f2d27a", gold2: "#ffe9a8", cream: "#f3eeff" },
};
export function applyTheme(t) {
  t = { ...THEMES.Marun, ...(t || {}) };
  const r = document.documentElement.style;
  for (const k in t) r.setProperty("--" + k, t[k]);
  const s = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><g fill='none' stroke='${t.gold}' stroke-opacity='.18'><circle cx='0' cy='0' r='40'/><circle cx='80' cy='0' r='40'/><circle cx='0' cy='80' r='40'/><circle cx='80' cy='80' r='40'/><circle cx='40' cy='40' r='40'/></g></svg>`;
  r.setProperty("--pat", `url("data:image/svg+xml,${encodeURIComponent(s)}")`);
}
