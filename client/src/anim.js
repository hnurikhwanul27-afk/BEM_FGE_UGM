import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export { gsap };

export function pageAnim(root) {
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  const q = (s) => root.querySelectorAll(s);
  gsap.from(q("h1 .w i"), { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.08 });
  gsap.from(q(".pagehead>*"), { y: 50, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.1 });
  gsap.from(q(".hero2 .script,.hero2 .row,.hero2 .eyebrow,.hero2 .lp"), { y: 30, opacity: 0, duration: 1, delay: 0.5, stagger: 0.12, ease: "power3.out" });
  gsap.to(q(".fl"), { rotate: 360, duration: 50, repeat: -1, ease: "none" });
  const pl = q(".polaroid");
  if (pl.length) {
    gsap.from(pl, { y: 120, rotate: 12, opacity: 0, duration: 1.4, delay: 0.3, ease: "expo.out" });
    gsap.to(pl, { y: -12, duration: 3, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1.7 });
  }
  q(".rv").forEach((el) => gsap.from(el, { y: 70, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } }));
  q(".sh").forEach((el) => gsap.from(el, { x: -60, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } }));
  const m = root.querySelector(".marquee div");
  if (m) gsap.to(m, { xPercent: -50, duration: 30, repeat: -1, ease: "none" });
  q(".wave path").forEach((p) => {
    const l = p.getTotalLength();
    gsap.fromTo(p, { strokeDasharray: l, strokeDashoffset: l }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: p, start: "top 92%" } });
  });
}

export function decoAnim() {
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  gsap.to(".d1,.d5", { rotate: 360, duration: 90, repeat: -1, ease: "none" });
  gsap.to(".d2", { rotate: -360, duration: 60, repeat: -1, ease: "none" });
  gsap.to(".d3", { rotate: 360, duration: 45, repeat: -1, ease: "none" });
  gsap.to(".sp", { scale: 1.8, opacity: 0.25, duration: 1.5, yoyo: true, repeat: -1, stagger: 0.25, ease: "sine.inOut" });
  gsap.to(".d1", { y: 180, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1 } });
}
