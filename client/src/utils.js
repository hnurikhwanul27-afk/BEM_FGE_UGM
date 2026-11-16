export const lines = (s) => String(s || "").split("\n").map((x) => x.trim()).filter(Boolean);
export const split = (l) => { const i = l.indexOf("|"); return i < 0 ? ["", l] : [l.slice(0, i).trim(), l.slice(i + 1).trim()]; };
