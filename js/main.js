import { createGlobe } from "./globe.js";

const { gsap, ScrollTrigger } = window;
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const LANG = window.I18N?.lang || "it";
const T = (k, fallback) => window.I18N?.t(k) ?? fallback;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = matchMedia("(hover: hover)").matches;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const nf = new Intl.NumberFormat(LANG === "en" ? "en-AU" : "it-IT");

/* ---------------------------------------------------------
   Scroll: Lenis + position kept across a language switch
--------------------------------------------------------- */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
let restoreY = 0;
try { restoreY = +sessionStorage.getItem("antipode-y") || 0; sessionStorage.removeItem("antipode-y"); } catch (e) {}

let lenis = null;
if (!reduceMotion && window.Lenis) {
  lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
const scrollToY = (y, opts = {}) => (lenis ? lenis.scrollTo(y, opts) : scrollTo({ top: typeof y === "number" ? y : y.offsetTop, behavior: opts.immediate ? "auto" : "smooth" }));
$$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
  const id = a.getAttribute("href");
  const el = id === "#top" ? 0 : $(id);
  if (el === null) return;
  e.preventDefault();
  scrollToY(el === 0 ? 0 : el, { offset: -80, duration: 1.4 });
}));

const nav = $("#nav");
const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 24);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------------------------------------------------------
   Headings: word-by-word reveal
--------------------------------------------------------- */
function splitHTML(node) {
  return [...node.childNodes].map((n) => {
    if (n.nodeType === 3) {
      return n.textContent.split(/(\s+)/).map((p) => (!p || /^\s+$/.test(p) ? p : `<span class="w"><span>${esc(p)}</span></span>`)).join("");
    }
    if (n.nodeName === "BR") return "<br>";
    const tag = n.nodeName.toLowerCase();
    return `<${tag}>${splitHTML(n)}</${tag}>`;
  }).join("");
}
$$("[data-split]").forEach((el) => { el.innerHTML = splitHTML(el); });

const heroWords = $$(".hero__title .w > span");
const heroRest = [".eyebrow", ".hero__sub", ".hero__ctas", ".hero__assure"];
gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.1 })
  .fromTo(heroWords, { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.05 })
  .fromTo(heroRest, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.35);

$$(".section [data-split]").forEach((h) => {
  const words = $$(".w > span", h);
  gsap.set(words, { yPercent: 110 });
  ScrollTrigger.create({
    trigger: h, start: "top 85%", once: true,
    onEnter: () => gsap.to(words, { yPercent: 0, duration: 1, stagger: 0.04, ease: "power4.out" }),
  });
});

gsap.set("[data-reveal]", { opacity: 0, y: 40 });
ScrollTrigger.batch("[data-reveal]", {
  start: "top 88%", once: true,
  onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" }),
});

/* ---------------------------------------------------------
   Globe + city labels
--------------------------------------------------------- */
let globe = null;
try { globe = createGlobe($("#globe")); } catch (err) { console.warn("WebGL non disponibile", err); }
if (globe) {
  gsap.fromTo(globe.state, { intro: 0 }, { intro: 1, duration: 2.4, ease: "expo.out", delay: 0.2 });
  gsap.to(globe.state, { y: 0.45, scale: 0.86, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  const tags = $$(".city-tag");
  gsap.ticker.add(() => {
    if (scrollY > innerHeight * 1.1) return;
    globe.project().forEach((p, i) => {
      const t = tags[i];
      if (!t) return;
      t.style.transform = `translate(${p.x}px, ${p.y}px)`;
      t.classList.toggle("is-on", p.visible && globe.state.intro > 0.8);
    });
  });
}

/* ---------------------------------------------------------
   Live clocks
--------------------------------------------------------- */
const clocks = $$(".js-clock");
const tick = () => {
  const now = new Date();
  clocks.forEach((el) => {
    el.textContent = new Intl.DateTimeFormat(LANG === "en" ? "en-AU" : "it-IT", { timeZone: el.dataset.tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
  });
};
tick(); setInterval(tick, 20000);

/* ---------------------------------------------------------
   Spotlight cards + magnetic buttons (pointer devices only)
--------------------------------------------------------- */
if (canHover) {
  $$(".spot").forEach((el) => el.addEventListener("pointermove", (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }));
  $$(".btn--primary, .btn--ghost").forEach((b) => {
    const xTo = gsap.quickTo(b, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(b, "y", { duration: 0.5, ease: "power3.out" });
    b.addEventListener("pointermove", (e) => {
      const r = b.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.18);
      yTo((e.clientY - r.top - r.height / 2) * 0.3);
    });
    b.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
  });
}

/* ---------------------------------------------------------
   DEMO — scripted agent conversation, plays when in view
--------------------------------------------------------- */
const CONVO = {
  it: [
    { u: "Ciao! Fate siti per ristoranti? Me ne servirebbe uno con le prenotazioni online 🍝" },
    { b: "Ciao! Sì, è proprio il nostro lavoro. Due domande veloci: hai già un dominio? E quanti coperti gestisci più o meno a sera?", log: ["Nuovo contatto da WhatsApp", "salvato nel CRM"] },
    { u: "Il dominio sì. Circa 60 coperti, siamo ad Aversa." },
    { b: "Perfetto, è un progetto chiaro. Ti propongo una call di 20 minuti per un preventivo preciso: meglio martedì alle 10:00 o giovedì alle 15:30?", log: ["Contatto qualificato", "ristorante · 60 coperti · dominio ok"] },
    { u: "Giovedì va benissimo!" },
    { b: "Fatto ✅ Ti ho mandato l'invito per email. A giovedì!", log: ["Appuntamento fissato", "giovedì 15:30 · Google Calendar"], log2: ["Team avvisato", "riepilogo inviato su Slack"] },
  ],
  en: [
    { u: "Hi! Do you build websites for restaurants? I'd need one with online bookings 🍝" },
    { b: "Hi! Yes, that's exactly what we do. Two quick questions: do you already have a domain? And roughly how many covers a night?", log: ["New lead from WhatsApp", "saved to CRM"] },
    { u: "Got the domain. Around 60 covers, we're in Townsville." },
    { b: "Great, that's a clear brief. How about a 20-minute call for an exact quote: Tuesday at 10:00 or Thursday at 3:30pm?", log: ["Lead qualified", "restaurant · 60 covers · has domain"] },
    { u: "Thursday works!" },
    { b: "Done ✅ I've emailed you the invite. See you Thursday!", log: ["Meeting booked", "Thursday 3:30pm · Google Calendar"], log2: ["Team notified", "summary sent to Slack"] },
  ],
};
const chatBody = $("#chat-body"), logList = $("#log-list");
let run = 0;
const wait = (ms, id) => new Promise((res, rej) => setTimeout(() => (id === run ? res() : rej("stop")), ms));
function bubble(cls, html) {
  const d = document.createElement("div");
  d.className = `msg ${cls}`;
  d.innerHTML = html;
  chatBody.appendChild(d);
  gsap.fromTo(d, { opacity: 0, y: 14, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out" });
  return d;
}
function logItem([t, s]) {
  const li = document.createElement("li");
  li.innerHTML = `<span>✓</span><span>${esc(t)}<small>${esc(s)}</small></span>`;
  logList.appendChild(li);
  gsap.fromTo(li, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" });
}
async function playChat() {
  const id = ++run;
  chatBody.innerHTML = ""; logList.innerHTML = "";
  try {
    for (const step of CONVO[LANG] || CONVO.it) {
      if (step.u) { await wait(900, id); bubble("msg--user", esc(step.u)); }
      else {
        await wait(500, id);
        const typing = bubble("msg--bot msg--typing", "<i></i><i></i><i></i>");
        await wait(Math.min(2200, 700 + step.b.length * 12), id);
        typing.remove();
        bubble("msg--bot", esc(step.b));
        if (step.log) { await wait(350, id); logItem(step.log); }
        if (step.log2) { await wait(500, id); logItem(step.log2); }
      }
    }
  } catch (e) { /* replay started */ }
}
ScrollTrigger.create({ trigger: ".demo__stage", start: "top 70%", once: true, onEnter: playChat });
$("#chat-replay").addEventListener("click", playChat);

/* ---------------------------------------------------------
   ROI calculator
--------------------------------------------------------- */
const R = { msg: $("#r-msg"), min: $("#r-min"), share: $("#r-share"), cost: $("#r-cost") };
const O = { msg: $("#o-msg"), min: $("#o-min"), share: $("#o-share"), cost: $("#o-cost") };
const outHours = $("#roi-hours"), outMoney = $("#roi-money");
const money = new Intl.NumberFormat(LANG === "en" ? "en-AU" : "it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const shown = { h: 0, m: 0 };
function calc() {
  Object.values(R).forEach((r) => r.style.setProperty("--p", `${((r.value - r.min) / (r.max - r.min)) * 100}%`));
  O.msg.textContent = R.msg.value;
  O.min.textContent = R.min.value;
  O.share.textContent = `${R.share.value}%`;
  O.cost.textContent = `${R.cost.value} €`;
  const hours = (R.msg.value * R.min.value * (R.share.value / 100) * 22) / 60;
  const eur = hours * R.cost.value;
  gsap.to(shown, {
    h: hours, m: eur, duration: 0.6, ease: "power3.out",
    onUpdate: () => { outHours.textContent = nf.format(Math.round(shown.h)); outMoney.textContent = money.format(Math.round(shown.m)); },
  });
}
Object.values(R).forEach((r) => r.addEventListener("input", calc));
ScrollTrigger.create({ trigger: ".roi", start: "top 75%", once: true, onEnter: calc });

/* ---------------------------------------------------------
   METHOD line
--------------------------------------------------------- */
gsap.fromTo("#steps-fill", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".steps", start: "top 80%", end: "bottom 60%", scrub: true } });

/* ---------------------------------------------------------
   Counters
--------------------------------------------------------- */
$$("[data-count]").forEach((el) => {
  const end = +el.dataset.count, suf = el.dataset.suffix || "", o = { v: 0 };
  ScrollTrigger.create({
    trigger: el, start: "top 90%", once: true,
    onEnter: () => gsap.to(o, { v: end, duration: 1.6, ease: "power3.out", onUpdate: () => { el.textContent = Math.round(o.v) + suf; } }),
  });
});

/* ---------------------------------------------------------
   CASES — featured + compact list with cursor preview
--------------------------------------------------------- */
const CAT = { pa: T("catPa", "Pubblica Amministrazione"), enterprise: T("catEnt", "Sanità & Enterprise"), business: T("catBiz", "Business & E-commerce"), product: T("catProd", "Startup & prodotti") };
const whenLabel = (w) => (w === "client" ? T("_client", "Cliente") : w === "library" ? T("_library", "Libreria") : w);
const FEATURED = ["CHEAI", "Agenzia delle Entrate", "Scame E-Mobility"];
const all = window.PROJECTS || [];
const feat = FEATURED.map((t) => all.find((p) => p.title === t)).filter(Boolean);
const rest = all.filter((p) => !FEATURED.includes(p.title));
const desc = (p) => p.desc[LANG] || p.desc.it;
const newTab = T("_newTab", "apre in una nuova scheda");

$("#featured").innerHTML = feat.map((p) => `
  <a class="fcase spot" href="${p.url}" target="_blank" rel="noopener" data-reveal aria-label="${esc(p.title)} (${newTab})">
    <span class="fcase__go" aria-hidden="true">↗</span>
    <div class="fcase__media"><img src="assets/shots/${p.img}" alt="" loading="lazy" decoding="async" width="1200" height="750"></div>
    <div class="fcase__body">
      <p class="fcase__meta mono"><span>${esc(CAT[p.cat])}</span><span>${esc(whenLabel(p.when))}</span></p>
      <h3>${esc(p.title)}</h3>
      <p>${esc(desc(p))}</p>
    </div>
  </a>`).join("");
gsap.set("#featured [data-reveal]", { opacity: 0, y: 40 });
ScrollTrigger.batch("#featured [data-reveal]", { start: "top 88%", once: true, onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" }) });

const VISIBLE = 8;
$("#plist").innerHTML = rest.map((p, i) => {
  const thumb = p.img ? `<span class="prow__thumb"><img src="assets/shots/${p.img}" alt="" loading="lazy" width="1200" height="750"></span>` : `<span class="prow__thumb"></span>`;
  const inner = `${thumb}<span class="prow__t">${esc(p.title)}</span><span class="prow__c mono">${esc(CAT[p.cat])}</span><span class="prow__y mono">${esc(whenLabel(p.when))}</span><span class="prow__a" aria-hidden="true">${p.url ? "↗" : ""}</span>`;
  const row = p.url
    ? `<a class="prow" href="${p.url}" target="_blank" rel="noopener" data-img="${p.img || ""}" aria-label="${esc(p.title)} (${newTab})">${inner}</a>`
    : `<div class="prow" data-img="${p.img || ""}">${inner}</div>`;
  return `<li class="${i >= VISIBLE ? "is-hidden" : ""}">${row}</li>`;
}).join("");
const moreBtn = $("#plist-more");
if (rest.length <= VISIBLE) moreBtn.remove();
else moreBtn.addEventListener("click", () => {
  const hidden = $$("#plist li.is-hidden");
  hidden.forEach((li) => li.classList.remove("is-hidden"));
  gsap.fromTo(hidden, { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: 0.03, duration: 0.5 });
  moreBtn.remove();
  ScrollTrigger.refresh();
});

if (canHover) {
  const prev = $("#hover-preview"), prevImg = $("img", prev);
  const px = gsap.quickTo(prev, "x", { duration: 0.45, ease: "power3.out" });
  const py = gsap.quickTo(prev, "y", { duration: 0.45, ease: "power3.out" });
  $("#plist").addEventListener("pointermove", (e) => { px(e.clientX + 24); py(e.clientY - 100); });
  $$("#plist .prow").forEach((row) => {
    row.addEventListener("pointerenter", () => {
      if (!row.dataset.img) return prev.classList.remove("is-on");
      prevImg.src = `assets/shots/${row.dataset.img}`;
      prev.classList.add("is-on");
    });
    row.addEventListener("pointerleave", () => prev.classList.remove("is-on"));
  });
}

/* ---------------------------------------------------------
   TESTIMONIALS — only real quotes; placeholders only on localhost
--------------------------------------------------------- */
const isDev = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
const realQ = (window.TESTIMONIALS || []).filter((t) => !t.placeholder);
const quotes = realQ.length ? realQ : isDev ? window.TESTIMONIALS || [] : [];
$("#quotes").innerHTML = quotes.map((t) => `
  <figure class="quote${t.placeholder ? " quote--todo" : ""}" data-reveal>
    ${t.placeholder ? `<span class="quote__todo mono">${T("_todo", "da compilare")}</span>` : ""}
    <blockquote>“${esc(t.quote[LANG] || t.quote.it)}”</blockquote>
    <figcaption><b>${esc(t.name)}</b><span>${esc(t.role[LANG] || t.role.it)}</span></figcaption>
  </figure>`).join("");
gsap.set("#quotes [data-reveal]", { opacity: 0, y: 40 });
ScrollTrigger.batch("#quotes [data-reveal]", { start: "top 90%", once: true, onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, stagger: 0.1, duration: 0.9 }) });

/* ---------------------------------------------------------
   FAQ — one open at a time + FAQPage structured data
--------------------------------------------------------- */
const qas = $$(".qa");
qas.forEach((d) => d.addEventListener("toggle", () => {
  if (d.open) qas.forEach((o) => { if (o !== d) o.open = false; });
  setTimeout(() => ScrollTrigger.refresh(), 480);
}));
const ld = document.createElement("script");
ld.type = "application/ld+json";
ld.textContent = JSON.stringify({
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: qas.map((d) => ({ "@type": "Question", name: $("summary span", d).textContent.trim(), acceptedAnswer: { "@type": "Answer", text: $(".qa__a", d).textContent.trim() } })),
});
document.head.appendChild(ld);

/* ---------------------------------------------------------
   Contact form → pre-filled email
--------------------------------------------------------- */
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
  const azienda = (d.get("azienda") || "").trim();
  const tipi = d.getAll("tipo").join(", ") || T("_tbd");
  const budget = d.get("budget") || T("_tbd");
  const body = `${T("_mailHello")}\n\n${testo}\n\n${T("_mailNeed")}: ${tipi}\n${T("_budget")}: ${budget}\n\n${nome}${azienda ? " · " + azienda : ""}\n${email}`;
  location.href = `mailto:antoniodebiase2003@gmail.com?subject=${encodeURIComponent(T("_mailSubject") + " — " + (azienda || nome))}&body=${encodeURIComponent(body)}`;
  msg.textContent = T("_formOk");
});

/* ---------------------------------------------------------
   Restore scroll after a language switch
--------------------------------------------------------- */
addEventListener("load", () => {
  ScrollTrigger.refresh();
  if (restoreY) scrollToY(restoreY, { immediate: true });
});
