(function () {
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

  /* ---------------- smooth scroll + anchors ---------------- */
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
  const scrollToY = (target, opts = {}) => {
    if (lenis) return lenis.scrollTo(target, opts);
    const y = typeof target === "number" ? target : target.getBoundingClientRect().top + scrollY + (opts.offset || 0);
    scrollTo({ top: y, behavior: opts.immediate ? "auto" : "smooth" });
  };
  $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    const el = id === "#top" ? 0 : $(id);
    if (el === null) return;
    e.preventDefault();
    scrollToY(el, { offset: -90, duration: 1.4 });
  }));

  /* ---------------- headings: word reveal ---------------- */
  function splitHTML(node, grad = false) {
    return [...node.childNodes].map((n) => {
      if (n.nodeType === 3) {
        return n.textContent.split(/(\s+)/).map((p) => (!p || /^\s+$/.test(p) ? p : `<span class="w"><span${grad ? ' class="grad"' : ""}>${esc(p)}</span></span>`)).join("");
      }
      if (n.nodeName === "BR") return "<br>";
      if (n.classList?.contains("grad")) return splitHTML(n, true);
      const tag = n.nodeName.toLowerCase();
      return `<${tag}>${splitHTML(n, grad)}</${tag}>`;
    }).join("");
  }
  $$("[data-split]").forEach((el) => { el.innerHTML = splitHTML(el); });

  gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.05 })
    .fromTo(".hero__title .w > span", { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.045 })
    .fromTo([".hero .proof-pill", ".hero__sub", ".hero__ctas", ".assure"], { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.25)
    .fromTo(".shot", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.2 }, 0.5);

  $$("main section:not(.hero) [data-split]").forEach((h) => {
    const words = $$(".w > span", h);
    gsap.set(words, { yPercent: 110 });
    ScrollTrigger.create({ trigger: h, start: "top 86%", once: true, onEnter: () => gsap.to(words, { yPercent: 0, duration: 1, stagger: 0.035, ease: "power4.out" }) });
  });

  gsap.set("[data-reveal]", { opacity: 0, y: 50 });
  ScrollTrigger.batch("[data-reveal]", { start: "top 88%", once: true, onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out" }) });

  /* ---------------- hero product shot: tilts flat on scroll ---------------- */
  gsap.fromTo(".shot .app", { rotateX: 24, scale: 0.92 }, { rotateX: 0, scale: 1, ease: "none", scrollTrigger: { trigger: ".shot", start: "top 92%", end: "top 25%", scrub: true } });

  /* ---------------- hero chat demo ---------------- */
  const CONVO = {
    it: [
      { u: "Ciao! Fate siti per ristoranti? Me ne servirebbe uno con le prenotazioni online 🍝" },
      { b: "Ciao Marco! Sì, è proprio il nostro lavoro. Hai già un dominio? E quanti coperti gestisci più o meno a sera?", log: ["Nuovo contatto da WhatsApp", "salvato nel CRM"] },
      { u: "Il dominio sì. Circa 60 coperti, siamo ad Aversa." },
      { b: "Perfetto. Ti propongo una call di 20 minuti per un preventivo preciso: martedì alle 10:00 o giovedì alle 15:30?", log: ["Contatto qualificato", "ristorante · 60 coperti"] },
      { u: "Giovedì va benissimo!" },
      { b: "Fatto ✅ Ti ho mandato l'invito per email. A giovedì!", log: ["Appuntamento fissato", "gio 15:30 · Google Calendar"], booked: true },
    ],
    en: [
      { u: "Hi! Do you build websites for restaurants? I'd need one with online bookings 🍝" },
      { b: "Hi Marco! Yes, that's exactly what we do. Do you already have a domain? And roughly how many covers a night?", log: ["New lead from WhatsApp", "saved to CRM"] },
      { u: "Got the domain. Around 60 covers, we're in Townsville." },
      { b: "Great. How about a 20-minute call for an exact quote: Tuesday at 10:00 or Thursday at 3:30pm?", log: ["Lead qualified", "restaurant · 60 covers"] },
      { u: "Thursday works!" },
      { b: "Done ✅ I've emailed you the invite. See you Thursday!", log: ["Meeting booked", "Thu 3:30pm · Google Calendar"], booked: true },
    ],
  };
  const chatBody = $("#chat-body"), logList = $("#log-list"), kpiA = $("#kpi-a"), kpiB = $("#kpi-b");
  let run = 0, kA = 124, kB = 8;
  const wait = (ms, id) => new Promise((res, rej) => setTimeout(() => (id === run ? res() : rej("stop")), ms));
  function bubble(cls, html) {
    const d = document.createElement("div");
    d.className = `msg ${cls}`; d.innerHTML = html; chatBody.appendChild(d);
    gsap.fromTo(d, { opacity: 0, y: 12, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out" });
    return d;
  }
  function logItem([t, s]) {
    const li = document.createElement("li");
    li.innerHTML = `<span>✓</span><span>${esc(t)}<small>${esc(s)}</small></span>`;
    logList.appendChild(li);
    gsap.fromTo(li, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" });
  }
  function bump(el, v) { el.textContent = nf.format(v); gsap.fromTo(el, { scale: 1.25 }, { scale: 1, duration: 0.5, ease: "back.out(3)" }); }
  async function playChat() {
    const id = ++run;
    chatBody.innerHTML = ""; logList.innerHTML = "";
    kA = 124; kB = 8; kpiA.textContent = kA; kpiB.textContent = kB;
    try {
      for (const step of CONVO[LANG] || CONVO.it) {
        if (step.u) { await wait(1000, id); bubble("msg--user", esc(step.u)); continue; }
        await wait(450, id);
        const typing = bubble("msg--bot msg--typing", "<i></i><i></i><i></i>");
        await wait(Math.min(2000, 700 + step.b.length * 11), id);
        typing.remove();
        bubble("msg--bot", esc(step.b));
        bump(kpiA, ++kA);
        if (step.log) { await wait(350, id); logItem(step.log); }
        if (step.booked) { await wait(300, id); bump(kpiB, ++kB); }
      }
    } catch (e) { /* replay */ }
  }
  setTimeout(playChat, 1300);
  $("#chat-replay").addEventListener("click", playChat);

  /* ---------------- responsive scroll scenes ---------------- */
  const mm = gsap.matchMedia();
  const scribble = $(".scribble path");
  const sLen = scribble.getTotalLength();
  gsap.set(scribble, { strokeDasharray: sLen, strokeDashoffset: sLen });

  mm.add("(min-width: 861px)", () => {
    // BEFORE/AFTER: the "after" card slides over the "before" card, then the scribble draws
    const before = $("#ba-before"), after = $("#ba-after");
    const dx = () => (after.offsetWidth + 24) / 2;
    const tl = gsap.timeline({ scrollTrigger: { trigger: "#ba-pin", start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true } });
    tl.to(after, { x: () => -dx(), rotate: -1.5, ease: "power2.inOut", duration: 1 }, 0.15)
      .to(before, { x: () => dx() * 0.92, scale: 0.86, rotate: -4, opacity: 0.5, ease: "power2.inOut", duration: 1 }, 0.15)
      .to(after, { rotate: 0, duration: 0.3 }, 1.15)
      .to(scribble, { strokeDashoffset: 0, ease: "power2.out", duration: 0.6 }, 1.1)
      .to({}, { duration: 0.3 });

    // HOW IT WORKS: sticky, 3 panes switched by scroll
    const panes = $$(".how__pane"), steps = $$(".how__steps li");
    let hi = -1;
    ScrollTrigger.create({
      trigger: "#how-pin", start: "top top", end: "bottom bottom",
      onUpdate: (st) => {
        const i = Math.min(panes.length - 1, Math.floor(st.progress * panes.length));
        if (i === hi) return;
        hi = i;
        panes.forEach((p, k) => p.classList.toggle("is-active", k === i));
        steps.forEach((s, k) => s.classList.toggle("is-active", k === i));
      },
    });
  });
  mm.add("(max-width: 860px)", () => {
    ScrollTrigger.create({ trigger: "#ba-after", start: "top 70%", once: true, onEnter: () => gsap.to(scribble, { strokeDashoffset: 0, duration: 1, ease: "power2.out" }) });
  });

  // USE CASES: pinned lime band, phone screens + copy switch, progress bar (all sizes)
  const utexts = $$(".utext"), screens = $$(".scr"), dashes = $$(".dashes i");
  const pLabel = $("#phone-label"), pCount = $("#phone-count"), pBar = $("#phone-bar");
  const labels = [T("u1L", "Risposte automatiche su WhatsApp"), T("u2L", "Commento → messaggio privato"), T("u3L", "Appuntamenti in calendario"), T("u4L", "Sincronizzazione CRM")];
  let ui = 0;
  ScrollTrigger.create({
    trigger: "#uses-pin", start: "top top", end: "bottom bottom",
    onUpdate: (st) => {
      const n = utexts.length, f = st.progress * n;
      const i = Math.min(n - 1, Math.floor(f));
      pBar.style.width = `${Math.min(1, f - i) * 100}%`;
      if (i === ui) return;
      ui = i;
      utexts.forEach((t, k) => { t.classList.toggle("is-active", k === i); t.classList.toggle("is-past", k < i); });
      screens.forEach((s, k) => s.classList.toggle("is-active", k === i));
      dashes.forEach((d, k) => d.classList.toggle("on", k === i));
      pLabel.textContent = labels[i];
      pCount.textContent = `${i + 1}/${n}`;
    },
  });

  /* ---------------- integrations tiles ---------------- */
  gsap.fromTo(".integ__tiles li", { opacity: 0, y: 20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, stagger: 0.03, duration: 0.5, ease: "back.out(2)", scrollTrigger: { trigger: ".integ__tiles", start: "top 88%" } });

  /* ---------------- ROI ---------------- */
  const R = { msg: $("#r-msg"), min: $("#r-min"), share: $("#r-share"), cost: $("#r-cost") };
  const O = { msg: $("#o-msg"), min: $("#o-min"), share: $("#o-share"), cost: $("#o-cost") };
  const outH = $("#roi-hours"), outM = $("#roi-money");
  const money = new Intl.NumberFormat(LANG === "en" ? "en-AU" : "it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const shown = { h: 0, m: 0 };
  function calc() {
    Object.values(R).forEach((r) => r.style.setProperty("--p", `${((r.value - r.min) / (r.max - r.min)) * 100}%`));
    O.msg.textContent = R.msg.value; O.min.textContent = R.min.value; O.share.textContent = `${R.share.value}%`; O.cost.textContent = `${R.cost.value} €`;
    const hours = (R.msg.value * R.min.value * (R.share.value / 100) * 22) / 60;
    gsap.to(shown, { h: hours, m: hours * R.cost.value, duration: 0.6, ease: "power3.out", onUpdate: () => { outH.textContent = nf.format(Math.round(shown.h)); outM.textContent = money.format(Math.round(shown.m)); } });
  }
  Object.values(R).forEach((r) => r.addEventListener("input", calc));
  calc();

  /* ---------------- counters + clocks ---------------- */
  $$("[data-count]").forEach((el) => {
    const end = +el.dataset.count, suf = el.dataset.suffix || "", o = { v: 0 };
    ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: () => gsap.to(o, { v: end, duration: 1.6, ease: "power3.out", onUpdate: () => { el.textContent = Math.round(o.v) + suf; } }) });
  });
  const clocks = $$(".js-clock");
  const tick = () => { const now = new Date(); clocks.forEach((el) => { el.textContent = new Intl.DateTimeFormat(LANG === "en" ? "en-AU" : "it-IT", { timeZone: el.dataset.tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(now); }); };
  tick(); setInterval(tick, 20000);

  /* ---------------- case studies ---------------- */
  const CAT = { pa: T("catPa", "Pubblica Amministrazione"), enterprise: T("catEnt", "Sanità & Enterprise"), business: T("catBiz", "Business & E-commerce"), product: T("catProd", "Startup & prodotti") };
  const whenLabel = (w) => (w === "client" ? T("_client", "Cliente") : w === "library" ? T("_library", "Libreria") : w);
  const newTab = T("_newTab", "apre in una nuova scheda");
  const STORIES = [
    { img: "cheai.webp", url: "https://cheai.io", k: T("st1k", "Startup · 2026"), big: T("st1b", "4 canali. Un solo assistente AI."), t: T("st1t", "CHEAI: customer service con l'AI"), d: T("st1d", "La piattaforma che abbiamo co-fondato: CRM, campagne e un assistente che risponde su WhatsApp, Instagram, TikTok e Messenger."), chips: [T("st1c1", "Agenti LLM + RAG"), T("st1c2", "Co-fondata da noi")] },
    { img: "agenzia-entrate.webp", url: "https://www.agenziaentrate.gov.it", k: T("st2k", "Pubblica Amministrazione"), big: T("st2b", "15+ portali. Zero barriere."), t: T("st2t", "Portali usati da milioni di cittadini"), d: T("st2d", "Agenzia delle Entrate, MEF, ADM, UNAR e altri: interfacce accessibili secondo le WCAG 2.1 AA, migrazioni e componenti su misura."), chips: ["WCAG 2.1 AA", "Liferay 7.x"] },
    { img: "scame-emobility.webp", url: "https://www.emobility-scame.com", k: T("st3k", "Enterprise · E-commerce"), big: T("st3b", "Banche, industria, e-commerce."), t: T("st3t", "Siti per aziende che vendono nel mondo"), d: T("st3d", "Scame, Banca Sella, AXA: siti di prodotto e portali clienti multilingua, veloci e integrati con i sistemi aziendali."), chips: [T("st3c1", "Multilingua"), T("st3c2", "Performance")] },
  ];
  $("#stories").innerHTML = STORIES.map((s) => `
    <a class="story" href="${s.url}" target="_blank" rel="noopener" data-reveal aria-label="${esc(s.t)} (${newTab})">
      <div class="vcard story__top"><span class="story__k">${esc(s.k)}</span><span class="story__big">${esc(s.big)}</span><img class="story__img" src="assets/shots/${s.img}" alt="" loading="lazy" width="1200" height="750"></div>
      <h3>${esc(s.t)}</h3><p>${esc(s.d)}</p>
      <div class="story__chips">${s.chips.map((c) => `<span>${esc(c)}</span>`).join("")}</div>
      <span class="story__link">${esc(T("visit", "Visita il sito"))} ↗</span>
    </a>`).join("");
  gsap.set("#stories [data-reveal]", { opacity: 0, y: 50 });
  ScrollTrigger.batch("#stories [data-reveal]", { start: "top 88%", once: true, onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out" }) });

  const all = window.PROJECTS || [];
  $("#plist-n").textContent = `(${all.length})`;
  $("#plist").innerHTML = all.map((p) => {
    const inner = `<span class="prow__t">${esc(p.title)}</span><span class="prow__c">${esc(CAT[p.cat])}</span><span class="prow__y mono">${esc(whenLabel(p.when))}</span><span class="prow__a" aria-hidden="true">${p.url ? "↗" : ""}</span>`;
    return `<li>${p.url ? `<a class="prow" href="${p.url}" target="_blank" rel="noopener" data-img="${p.img || ""}" aria-label="${esc(p.title)} (${newTab})">${inner}</a>` : `<div class="prow" data-img="${p.img || ""}">${inner}</div>`}</li>`;
  }).join("");
  const toggle = $("#plist-toggle"), plist = $("#plist");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", open);
    plist.hidden = !open;
    if (open) gsap.fromTo($$("li", plist), { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.02, duration: 0.4 });
    ScrollTrigger.refresh();
  });
  if (canHover) {
    const prev = $("#hover-preview"), prevImg = $("img", prev);
    const px = gsap.quickTo(prev, "x", { duration: 0.45, ease: "power3.out" });
    const py = gsap.quickTo(prev, "y", { duration: 0.45, ease: "power3.out" });
    plist.addEventListener("pointermove", (e) => { px(e.clientX + 24); py(e.clientY - 90); });
    $$(".prow", plist).forEach((row) => {
      row.addEventListener("pointerenter", () => { if (!row.dataset.img) return prev.classList.remove("is-on"); prevImg.src = `assets/shots/${row.dataset.img}`; prev.classList.add("is-on"); });
      row.addEventListener("pointerleave", () => prev.classList.remove("is-on"));
    });
  }

  /* ---------------- testimonials (real only; placeholders on localhost) ---------------- */
  const isDev = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  const realQ = (window.TESTIMONIALS || []).filter((t) => !t.placeholder);
  const quotes = realQ.length ? realQ : isDev ? window.TESTIMONIALS || [] : [];
  $("#quotes").innerHTML = quotes.map((t) => `
    <figure class="quote${t.placeholder ? " quote--todo" : ""}">
      ${t.placeholder ? `<span class="quote__todo mono">${T("_todo", "da compilare")}</span>` : ""}
      <blockquote>“${esc(t.quote[LANG] || t.quote.it)}”</blockquote>
      <figcaption><b>${esc(t.name)}</b><span>${esc(t.role[LANG] || t.role.it)}</span></figcaption>
    </figure>`).join("");

  /* ---------------- FAQ ---------------- */
  const qas = $$(".qa");
  qas.forEach((d) => d.addEventListener("toggle", () => {
    if (d.open) qas.forEach((o) => { if (o !== d) o.open = false; });
    setTimeout(() => ScrollTrigger.refresh(), 450);
  }));
  const ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: qas.map((d) => ({ "@type": "Question", name: $("summary span", d).textContent.trim(), acceptedAnswer: { "@type": "Answer", text: $(".qa__a", d).textContent.trim() } })) });
  document.head.appendChild(ld);

  /* ---------------- contact form ---------------- */
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

  addEventListener("load", () => {
    ScrollTrigger.refresh();
    if (restoreY) scrollToY(restoreY, { immediate: true });
  });
})();
