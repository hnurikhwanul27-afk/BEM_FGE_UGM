const tok = () => localStorage.getItem("tk");
const auth = () => ({ Authorization: "Bearer " + tok() });
export const isAuthed = () => !!tok();
export const logout = () => localStorage.removeItem("tk");
export const getContent = () => fetch("/api/content").then((r) => r.json());
export async function login(username, password) {
  const r = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
  if (!r.ok) throw new Error("Username atau password salah");
  localStorage.setItem("tk", (await r.json()).token);
}
export async function saveContent(data) {
  const r = await fetch("/api/content", { method: "PUT", headers: { "Content-Type": "application/json", ...auth() }, body: JSON.stringify(data) });
  if (r.status === 401) { logout(); throw new Error("Sesi habis, silakan login ulang"); }
  if (!r.ok) throw new Error("Gagal menyimpan");
}
export async function upload(file) {
  const fd = new FormData(); fd.append("file", file);
  const r = await fetch("/api/upload", { method: "POST", headers: auth(), body: fd });
  if (!r.ok) throw new Error("Upload gagal");
  return (await r.json()).url;
}
