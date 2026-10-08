import { createKey } from "./key3d.js";

const { gsap, ScrollTrigger } = window;
gsap.registerPlugin(ScrollTrigger);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = () => innerWidth < 760;
const LANG = window.I18N?.lang || "it";
const T = (k, fallback) => window.I18N?.t(k) ?? fallback;
const SCRUB = matchMedia("(pointer: coarse)").matches ? 0.5 : 1;
// mobile: the URL bar showing/hiding must not re-measure every trigger mid-scroll
ScrollTrigger.config({ ignoreMobileResize: true });

// scroll position kept across a language switch
let restoreY = 0;
try { restoreY = +sessionStorage.getItem("antipode-y") || 0; sessionStorage.removeItem("antipode-y"); } catch (e) {}

/* ---------------------------------------------------------
   Smooth scroll (Lenis) wired into ScrollTrigger
--------------------------------------------------------- */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
scrollTo(0, 0);
let lenis = null;
if (!reduceMotion && window.Lenis) {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop(); // until the loader is gone
}
$$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
  const id = a.getAttribute("href");
  const el = id === "#top" ? document.body : $(id);
  if (!el) return;
  e.preventDefault();
  if (lenis) lenis.scrollTo(id === "#top" ? 0 : el, { duration: 1.6 });
  else (id === "#top" ? scrollTo({ top: 0, behavior: "smooth" }) : el.scrollIntoView({ behavior: "smooth" }));
}));

/* ---------------------------------------------------------
   Text helpers: per-char split + "echo" headings
--------------------------------------------------------- */
function splitChars(el) {
  const text = el.textContent;
  el.textContent = "";
  [...text].forEach((c) => {
    const s = document.createElement("span");
    s.className = "ch";
    s.textContent = c;
    el.appendChild(s);
  });
  return $$(".ch", el);
}

// Builds: main layer (lines masked) + N ghost copies that trail below it.
function buildEcho(el, ghosts = 3) {
  const lines = el.innerHTML.split(/<br\s*\/?>/i).map((l) => l.trim());
  const linesHTML = lines.map((l) => `<span class="echo__line"><span>${l}</span></span>`).join("");
  let html = `<span class="echo__layer echo__main">${linesHTML}</span>`;
  for (let i = 1; i <= ghosts; i++) html += `<span class="echo__layer echo__ghost" aria-hidden="true">${linesHTML}</span>`;
  el.innerHTML = html;
  const main = $$(".echo__main .echo__line > span", el);
  const ghostEls = $$(".echo__ghost", el);
  gsap.set(main, { yPercent: 115 });
  gsap.set(ghostEls, { opacity: 0 });
  el._echo = { main, ghostEls };
}
const GHOST_ALPHA = [0.34, 0.18, 0.08];
function echoIn(el, opts = {}) {
  const { main, ghostEls } = el._echo;
  const tl = gsap.timeline();
  tl.to(main, { yPercent: 0, duration: 0.9, stagger: 0.09, ease: "power4.out" }, 0);
  ghostEls.forEach((g, i) => {
    tl.fromTo(g, { yPercent: 0, opacity: 0 },
      { yPercent: (opts.spread ?? 13) * (i + 1), opacity: GHOST_ALPHA[i] ?? 0.05, duration: 1, ease: "power3.out" }, 0.12 + i * 0.08);
  });
  return tl;
}
function echoOut(el) {
  const { main, ghostEls } = el._echo;
  const tl = gsap.timeline();
  tl.to(main, { yPercent: -115, duration: 0.7, stagger: 0.06, ease: "power3.in" }, 0);
  tl.to(ghostEls, { yPercent: 0, opacity: 0, duration: 0.6, ease: "power2.in" }, 0);
  return tl;
}

$$("[data-echo]").forEach((el) => buildEcho(el));
const heroChars = $$(".hero__word").flatMap(splitChars);

/* ---------------------------------------------------------
   3D keycap + loader
--------------------------------------------------------- */
const pct = $(".loader__pct");
const bar = $(".loader__bar i");
const prog = { v: 0 };
const progTween = gsap.to(prog, { v: 88, duration: 2.2, ease: "power2.out", onUpdate: () => {
  pct.textContent = Math.round(prog.v); bar.style.width = prog.v + "%";
} });

gsap.set(heroChars, { yPercent: 120, rotateX: -70, opacity: 0 });
gsap.set(".hero__rule", { scaleX: 0, transformOrigin: "left" });
gsap.set([".hero__kicker", ".hero__sub", ".hero__foot", ".hero__scroll"], { opacity: 0, y: 24 });

let key3d = null;
try {
  key3d = await createKey($("#key3d"));
} catch (err) {
  console.warn("WebGL non disponibile, continuo senza 3D", err);
}
const K = key3d ? key3d.state : { x: 0, y: 0, rx: 0, ry: 0, rz: 0, scale: 1, bits: 0 };

await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]);
progTween.kill();
await new Promise((r) => gsap.to(prog, { v: 100, duration: 0.4, onUpdate: () => {
  pct.textContent = Math.round(prog.v); bar.style.width = prog.v + "%";
}, onComplete: r }));

const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
if (restoreY) intro.timeScale(4);
intro
  .to(".loader", { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "power4.inOut" })
  .set(".loader", { display: "none" })
  .to(".hero__rule", { scaleX: 1, duration: 1.2, stagger: 0.1 }, "-=0.45")
  .to(heroChars, { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.1, stagger: 0.035 }, "<")
  .to(K, { y: -1.95, ry: -0.5 + Math.PI * 2, duration: 1.8, ease: "expo.out" }, "<0.15")
  .to([".hero__kicker", ".hero__sub", ".hero__foot", ".hero__scroll"], { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, "<0.3")
  .add(() => {
    buildStory();
    lenis?.start();
    ScrollTrigger.refresh();
    if (restoreY) { if (lenis) lenis.scrollTo(restoreY, { immediate: true }); else scrollTo(0, restoreY); }
  });

/* ---------------------------------------------------------
   STAGE: hero → 3 scroll steps, key rotates with scroll
--------------------------------------------------------- */
const step1 = $(".step--1"), step2 = $(".step--2"), step2b = $(".step--2b"), step3 = $(".step--3");
const h1 = $("h2", step1), h2 = $("h2", step2), h3 = $("h2", step3);
const counters = $$("[data-count]");

function countTo(tl, at) {
  counters.forEach((el) => {
    const o = { v: 0 }, end = +el.dataset.count, suf = el.dataset.suffix || "";
    tl.to(o, { v: end, duration: 1, ease: "none", onUpdate: () => { el.textContent = Math.round(o.v) + suf; } }, at);
  });
}

function buildStory() {
const story = gsap.timeline({
  defaults: { ease: "power2.inOut" },
  // ends when the services panel starts sliding over the sticky stage
  scrollTrigger: { trigger: "#stage-wrap", start: "top top", end: () => "+=" + ($("#stage-wrap").offsetHeight - 2 * innerHeight), scrub: SCRUB, invalidateOnRefresh: true },
});
story
  // hero leaves, key rises
  .to(heroChars, { yPercent: -130, opacity: 0, stagger: 0.02, duration: 1 }, 0)
  .to([".hero__kicker", ".hero__rule", ".hero__sub", ".hero__foot", ".hero__scroll"], { opacity: 0, y: -40, duration: 0.8 }, 0)
  .to(".stage__pattern", { yPercent: -12, duration: 10, ease: "none" }, 0)
  .to(K, { y: 0.15, x: 1.5, rx: 0.25, ry: Math.PI * 2 + 0.6 + Math.PI, scale: 1.08, bits: 1, duration: 1.6 }, 0.2)
  // step 1
  .set(step1, { autoAlpha: 1 }, 1.2)
  .add(echoIn(h1), 1.2)
  .fromTo($(".step__txt", step1), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 1.6)
  .to({}, { duration: 1 })
  // step 2 — heading sits BEHIND the key
  .add(echoOut(h1), 3.4)
  .to($(".step__txt", step1), { opacity: 0, duration: 0.4 }, 3.4)
  .to(K, { x: 0, y: -0.25, rx: 1.22, ry: Math.PI * 4, rz: 0.18, scale: 1.18, duration: 1.6 }, 3.5)
  .set([step2, step2b], { autoAlpha: 1 }, 4)
  .add(echoIn(h2, { spread: 16 }), 4)
  .fromTo(step2b.children, { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.6 }, 4.4)
  .to({}, { duration: 1 })
  // step 3
  .add(echoOut(h2), 6.2)
  .to(step2b.children, { opacity: 0, y: -20, duration: 0.4 }, 6.2)
  .to(K, { x: 1.55, y: 0.25, rx: -0.65, ry: Math.PI * 4 + 0.9, rz: -0.32, scale: 1, duration: 1.6 }, 6.3)
  .set(step3, { autoAlpha: 1 }, 6.8)
  .add(echoIn(h3), 6.8)
  .fromTo($(".stats", step3), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, 7.3);
countTo(story, 7.3);
story
  .to(K, { ry: Math.PI * 5, rx: 0.4, duration: 2.2 }, 8.2)
  .to({}, { duration: 0.6 });
}

/* ---------------------------------------------------------
   SERVICES: pinned split, 3 swaps
--------------------------------------------------------- */
const sHeads = $$(".services__heads .echo");
const sVis = $$(".svc-visual");
const sItems = $$(".svc-list li");
gsap.set(sHeads, { autoAlpha: 0 });
gsap.set(sVis, { autoAlpha: 0 });
const svcN = $("#svc-n");
function setActive(i) {
  sItems.forEach((li, j) => li.classList.toggle("is-active", i === j));
  svcN.textContent = "0" + (i + 1);
}
setActive(0);

const bars = $$(".dash__chart i");
const svc = gsap.timeline({
  defaults: { ease: "power3.inOut" },
  scrollTrigger: {
    trigger: ".services", start: "top 75%", scrub: SCRUB, invalidateOnRefresh: true,
    end: () => "+=" + (innerHeight * 0.75 + $(".services").offsetHeight - 2 * innerHeight),
  },
  onUpdate: () => { const t = svc.time(); setActive(t < 2.5 ? 0 : t < 4.5 ? 1 : 2); },
});
svc.set(sHeads[0], { autoAlpha: 1 }, 0)
  .add(echoIn(sHeads[0]), 0)
  .fromTo(sVis[0], { autoAlpha: 0, y: 100, rotate: -8 }, { autoAlpha: 1, y: 0, rotate: 0, duration: 1, ease: "power4.out" }, 0);
[1, 2].forEach((i) => {
  const at = i * 2;
  svc.add(echoOut(sHeads[i - 1]), at)
    .to(sVis[i - 1], { autoAlpha: 0, y: -90, rotate: 6, scale: 0.92, duration: 0.9 }, at)
    .set(sHeads[i], { autoAlpha: 1 }, at + 0.5)
    .add(echoIn(sHeads[i]), at + 0.5)
    .fromTo(sVis[i], { autoAlpha: 0, y: 110, rotate: -8, scale: 0.92 }, { autoAlpha: 1, y: 0, rotate: 0, scale: 1, duration: 1 }, at + 0.5);
});
svc.fromTo(bars, { scaleY: 0 }, { scaleY: 1, stagger: 0.05, duration: 0.6, ease: "back.out(2)" }, 4.7).to({}, { duration: 1 });

/* ---------------------------------------------------------
   Generic echo reveals for standalone headings
--------------------------------------------------------- */
$$(".journey__head .echo, .work__intro .echo, .proof .echo, .offer .echo, .faq .echo, .contact .echo").forEach((el) => {
  ScrollTrigger.create({ trigger: el, start: "top 82%", once: true, onEnter: () => echoIn(el) });
});

/* ---------------------------------------------------------
   JOURNEY: horizontal timeline driven by vertical scroll
   (sticky panel; the section gets exactly the height it needs)
--------------------------------------------------------- */
const journey = $(".journey"), jpin = $(".journey__pin"), jtrack = $("#jtrack");
const chapters = $$(".jch", jtrack), ticks = $$(".jline__ticks li");
const jyear = $("#jyear"), jfill = $("#jfill");
journey.classList.add("is-pinned");
const jDist = () => Math.max(0, jtrack.scrollWidth - innerWidth);
const setJourneyHeight = () => { jpin.style.height = jDist() + innerHeight * 1.25 + "px"; };
setJourneyHeight();
ScrollTrigger.addEventListener("refreshInit", setJourneyHeight);

let jIdx = -1;
function setChapter(i) {
  if (i === jIdx) return;
  const dir = i > jIdx ? 1 : -1;
  jIdx = i;
  chapters.forEach((c, k) => c.classList.toggle("is-active", k === i));
  ticks.forEach((t, k) => t.classList.toggle("is-active", k <= i));
  const label = i === chapters.length - 1 ? $(".jch__year", chapters[i]).textContent : chapters[i].dataset.year;
  gsap.to(jyear, { yPercent: -100 * dir, opacity: 0, duration: 0.18, ease: "power2.in", onComplete: () => {
    jyear.textContent = label;
    jyear.parentElement.classList.toggle("is-long", label.length > 4);
    gsap.fromTo(jyear, { yPercent: 100 * dir, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.35, ease: "power3.out" });
  } });
}
const hScroll = gsap.to(jtrack, {
  x: () => -jDist(), ease: "none",
  onUpdate: function () {
    const pr = this.progress();
    jfill.style.transform = `scaleX(${pr})`;
    setChapter(Math.min(chapters.length - 1, Math.round(pr * (chapters.length - 1))));
  },
  scrollTrigger: { trigger: jpin, start: "top top", end: () => "+=" + jDist(), scrub: SCRUB < 1 ? 0.4 : 0.8, invalidateOnRefresh: true },
});
setChapter(0);

chapters.forEach((ch) => {
  gsap.fromTo($(".jch__card", ch), { rotate: 6, scale: 0.86, opacity: 0.55 }, {
    rotate: 0, scale: 1, opacity: 1, ease: "none",
    scrollTrigger: { trigger: ch, containerAnimation: hScroll, start: "left 100%", end: "left 50%", scrub: true },
  });
  gsap.fromTo($(".jch__year", ch), { xPercent: 30 }, {
    xPercent: -10, ease: "none",
    scrollTrigger: { trigger: ch, containerAnimation: hScroll, start: "left right", end: "right left", scrub: true },
  });
  const img = $(".jv-shot img", ch);
  if (img) gsap.fromTo(img, { xPercent: -5 }, {
    xPercent: 5, ease: "none",
    scrollTrigger: { trigger: ch, containerAnimation: hScroll, start: "left right", end: "right left", scrub: true },
  });
});
gsap.fromTo([".journey__lede", ".journey__year", ".jline"], { opacity: 0, y: 30 }, {
  opacity: 1, y: 0, stagger: 0.1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".journey", start: "top 70%" },
});

// live clocks in the last chapter
const clocks = $$(".clock__time");
function tickClocks() {
  const now = new Date();
  clocks.forEach((el) => {
    el.textContent = new Intl.DateTimeFormat(LANG === "en" ? "en-AU" : "it-IT", { timeZone: el.dataset.tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
  });
}
tickClocks();
setInterval(tickClocks, 20000);

/* ---------------------------------------------------------
   WHY: marker strikes + stickers
--------------------------------------------------------- */
$$(".strike path").forEach((p) => {
  const len = p.getTotalLength();
  gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
});
const whyTl = gsap.timeline({ scrollTrigger: { trigger: ".why__title", start: "top 72%" } });
whyTl
  .fromTo(".why__title .hl", { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: "power4.out" })
  .to(".strike path", { strokeDashoffset: 0, stagger: 0.18, duration: 0.6, ease: "power2.out" }, "-=0.3")
  .fromTo(".sticker", { scale: 0, rotate: 30 }, { scale: 1, rotate: (i, el) => getComputedStyle(el).getPropertyValue("--r"), stagger: 0.12, duration: 0.6, ease: "back.out(3)" }, "-=0.5")
  .fromTo(".why__sub", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");
gsap.fromTo(".why__col", { opacity: 0, y: 60 }, { opacity: 1, y: 0, stagger: 0.15, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".why__cols", start: "top 80%" } });

/* ---------------------------------------------------------
   WORK intro collage parallax
--------------------------------------------------------- */
$$(".work__collage img").forEach((img, i) => {
  const dir = i % 2 ? 1 : -1;
  gsap.fromTo(img, { yPercent: 30 + i * 12, rotate: `+=${dir * 10}` }, {
    yPercent: -20 - i * 10, rotate: `-=${dir * 6}`, ease: "none",
    scrollTrigger: { trigger: ".work__intro", start: "top bottom", end: "bottom top", scrub: true },
  });
});

/* ---------------------------------------------------------
   SHOWCASE: render, filter, tilt
--------------------------------------------------------- */
const grid = $("#grid");
const COVER = {
  pa: ["var(--cobalt)", "var(--lime)"], enterprise: ["var(--lilac)", "var(--ink)"],
  business: ["var(--paper)", "var(--cobalt)"], product: ["var(--lime)", "var(--ink)"],
};
const host = (u) => { try { return new URL(u).host.replace(/^www\./, ""); } catch { return T("_private", "progetto privato"); } };
const whenLabel = (w) => (w === "client" ? T("_client", "Cliente") : w === "library" ? T("_library", "Libreria") : w);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

grid.innerHTML = window.PROJECTS.map((p) => {
  const [bg, fg] = COVER[p.cat];
  const media = p.img
    ? `<img src="assets/shots/${p.img}" alt="${T("_homeOf", "Homepage di")} ${esc(p.title)}" loading="lazy" decoding="async" width="1200" height="750">`
    : `<div class="card__cover" style="--cover-bg:${bg};--cover-fg:${fg}"><span>${esc(p.title)}</span></div>`;
  const inner = `
    <div class="card__media">
      <div class="card__bar"><i></i><i></i><i></i><span class="mono">${esc(host(p.url))}</span></div>
      ${media}
      ${p.url ? '<span class="card__go" aria-hidden="true">↗</span>' : ""}
    </div>
    <div class="card__info">
      <div class="card__row"><h3 class="card__title">${esc(p.title)}</h3><span class="mono card__year">${esc(whenLabel(p.when))}</span></div>
      <p class="mono card__desc">${esc(p.desc[LANG] || p.desc.it)}</p>
      <div class="card__tags">${p.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
    </div>`;
  return `<article class="card${p.feature ? " card--feature" : ""}" data-cat="${p.cat}">
    ${p.url ? `<a href="${p.url}" target="_blank" rel="noopener" aria-label="${esc(p.title)} (${T("_newTab", "apre in una nuova scheda")})">${inner}</a>` : inner}
  </article>`;
}).join("");

const cards = $$(".card", grid);
const countEl = $("#work-count");
const pad = (n) => String(n).padStart(2, "0");
countEl.textContent = pad(cards.length);

ScrollTrigger.batch(cards, {
  start: "top 90%", once: true,
  onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 70, rotate: 2 }, { opacity: 1, y: 0, rotate: 0, stagger: 0.08, duration: 1, ease: "power4.out" }),
});

$$(".filter").forEach((btn) => btn.addEventListener("click", () => {
  $$(".filter").forEach((b) => { b.classList.toggle("is-active", b === btn); b.setAttribute("aria-pressed", b === btn); });
  const f = btn.dataset.filter;
  const show = cards.filter((c) => f === "all" || c.dataset.cat === f);
  gsap.to(cards, { opacity: 0, y: 20, duration: 0.2, onComplete: () => {
    cards.forEach((c) => { c.style.display = show.includes(c) ? "" : "none"; });
    countEl.textContent = pad(show.length);
    gsap.fromTo(show, { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, stagger: 0.05, duration: 0.6, ease: "power3.out" });
    ScrollTrigger.refresh();
  } });
}));

if (matchMedia("(hover: hover)").matches) {
  cards.forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, { rotateY: x * 7, rotateX: -y * 7, transformPerspective: 900, duration: 0.5, ease: "power2.out" });
    });
    card.addEventListener("pointerleave", () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "power3.out" }));
  });
}

/* ---------------------------------------------------------
   SHOWCASE CTA
--------------------------------------------------------- */
gsap.fromTo(".showcase__cta", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".showcase__cta", start: "top 90%" } });

/* ---------------------------------------------------------
   TESTIMONIALS — real quotes only; placeholders appear on localhost
--------------------------------------------------------- */
const isDev = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
const real = (window.TESTIMONIALS || []).filter((t) => !t.placeholder);
const shown = real.length ? real : isDev ? window.TESTIMONIALS || [] : [];
const quotesEl = $("#quotes");
if (shown.length) {
  quotesEl.innerHTML = shown.map((t) => `
    <figure class="quote${t.placeholder ? " quote--todo" : ""}">
      ${t.placeholder ? `<span class="quote__todo mono">${T("_todo", "da compilare")}</span>` : ""}
      <span class="quote__mark" aria-hidden="true">“</span>
      <blockquote><p>${esc(t.quote[LANG] || t.quote.it)}</p></blockquote>
      <figcaption class="mono"><b>${esc(t.name)}</b><span>${esc(t.role[LANG] || t.role.it)}</span>${t.project ? `<i>${esc(t.project)}</i>` : ""}</figcaption>
    </figure>`).join("");
  gsap.fromTo(".quote", { opacity: 0, y: 80, rotate: (i) => [-3, 2, -1][i % 3] }, {
    opacity: 1, y: 0, rotate: 0, stagger: 0.12, duration: 1.1, ease: "power4.out",
    scrollTrigger: { trigger: quotesEl, start: "top 85%" },
  });
} else {
  quotesEl.remove();
}
gsap.fromTo(".logos__list li", { opacity: 0, y: 24 }, {
  opacity: 1, y: 0, stagger: 0.04, duration: 0.6, ease: "power3.out",
  scrollTrigger: { trigger: ".logos", start: "top 88%" },
});

/* ---------------------------------------------------------
   FAQ — accordion + FAQPage structured data for search engines
--------------------------------------------------------- */
const qas = $$(".qa");
gsap.fromTo(qas, { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: ".faq__list", start: "top 85%" } });
qas.forEach((d) => d.addEventListener("toggle", () => {
  // keep one answer open at a time, then re-measure the triggers below
  if (d.open) qas.forEach((o) => { if (o !== d) o.open = false; });
  setTimeout(() => ScrollTrigger.refresh(), 450);
}));
const ld = document.createElement("script");
ld.type = "application/ld+json";
ld.textContent = JSON.stringify({
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: qas.map((d) => ({
    "@type": "Question", name: $("summary span", d).textContent.trim(),
    acceptedAnswer: { "@type": "Answer", text: $(".qa__a", d).textContent.trim() },
  })),
});
document.head.appendChild(ld);

/* ---------------------------------------------------------
   OFFER cards + process
--------------------------------------------------------- */
gsap.fromTo(".ocard", { y: 160, rotate: (i) => [-6, 3, 7][i], opacity: 0 }, {
  y: 0, rotate: 0, opacity: 1, stagger: 0.12, duration: 1.2, ease: "power4.out",
  scrollTrigger: { trigger: ".offer__cards", start: "top 85%" },
});
gsap.fromTo(".process li", { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, scrollTrigger: { trigger: ".process", start: "top 90%" } });

/* ---------------------------------------------------------
   CONTACT: keycaps + mailto form
--------------------------------------------------------- */
const keyEls = $$(".kc");
gsap.fromTo(keyEls, { y: -120, opacity: 0, rotate: () => gsap.utils.random(-25, 25) }, { y: 0, opacity: 1, rotate: 0, stagger: 0.08, duration: 1, ease: "bounce.out", scrollTrigger: { trigger: "#keys", start: "top 80%" } });
function press(el) { el.classList.add("is-down"); setTimeout(() => el.classList.remove("is-down"), 140); }
keyEls.forEach((k) => k.addEventListener("click", () => {
  press(k);
  if (k.dataset.k === "Enter") $('#cform input[name="nome"]').focus();
}));
addEventListener("keydown", (e) => {
  if (e.target.closest?.("input, textarea")) return;
  const k = keyEls.find((el) => el.dataset.k.toLowerCase() === e.key.toLowerCase());
  if (k) k.classList.add("is-down");
});
addEventListener("keyup", (e) => {
  const k = keyEls.find((el) => el.dataset.k.toLowerCase() === e.key.toLowerCase());
  if (k) k.classList.remove("is-down");
});

const form = $("#cform"), msg = $("#cform-msg");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = new FormData(form);
  const nome = (d.get("nome") || "").trim(), email = (d.get("email") || "").trim(), testo = (d.get("messaggio") || "").trim();
  if (!nome || !/^\S+@\S+\.\S+$/.test(email) || !testo) {
    msg.textContent = T("_formErr");
    gsap.fromTo(form, { x: -8 }, { x: 0, duration: 0.5, ease: "elastic.out(1, .3)" });
    return;
  }
  const tipi = d.getAll("tipo").join(", ") || T("_tbd");
  const budget = d.get("budget") || T("_tbd");
  const body = `${T("_mailHello")}\n\n${testo}\n\n${T("_mailNeed")}: ${tipi}\n${T("_budget")}: ${budget}\n\n${nome}\n${email}`;
  location.href = `mailto:antoniodebiase2003@gmail.com?subject=${encodeURIComponent(T("_mailSubject") + " — " + nome)}&body=${encodeURIComponent(body)}`;
  msg.textContent = T("_formOk");
});

/* ---------------------------------------------------------
   Corner motion toggle
--------------------------------------------------------- */
const mt = $("#motion-toggle");
mt.addEventListener("click", () => {
  const on = mt.getAttribute("aria-pressed") !== "true";
  mt.setAttribute("aria-pressed", on);
  mt.setAttribute("aria-label", on ? T("motionOn") : T("motionOff"));
  key3d?.setPaused(on);
  document.documentElement.style.setProperty("--anim", on ? "paused" : "running");
  $$(".marquee__track, .footer__big, .stage__pattern, .grain").forEach((el) => { el.style.animationPlayState = on ? "paused" : "running"; });
});

addEventListener("load", () => ScrollTrigger.refresh());
