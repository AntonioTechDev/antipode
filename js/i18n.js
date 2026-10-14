/* IT/EN switch.
   The Italian copy lives in the HTML (default, indexable). English replaces it at load time.
   Elements: data-i18n → innerHTML, data-i18n-aria → aria-label, data-i18n-alt → alt.
   Language: ?lang= → saved choice → browser language. Switching reloads the page
   (keeps the scroll position) so every animation is rebuilt on the new text. */
(function () {
  var KEY = "antipode-lang";

  var EN = {
    skip: "Skip to content",
    brandLabel: "Antipode, back to top",
    navLabel: "Sections", navServices: "Services", navHow: "How we work", navCases: "Case studies",
    navCta: "Book a call",

    heroPill: "AI consulting &amp; software development · Townsville &amp; Aversa",
    heroTitle: "Software, AI and automation <span class=\"grad\">built around</span> your business.",
    heroSub: "We help you see where technology can grow your business, then we design and build web apps, automations and AI agents. From idea to launch, with one team.",
    heroCta: "Book a 30-minute call", heroCta2: "See our work",
    assure1: "Written quote before we start", assure2: "Code and accounts in your name", assure3: "One point of contact, from idea to launch",
    f1: "AI consulting", f2: "Custom web apps", f3: "Automation", f4: "AI agents",
    s1: "enterprise portals", s2: "years of development",
    shotNote: "Some of the projects we've worked on",
    logosLabel: "Our team has worked on projects for",

    baTitle: "Your project: before and after Antipode.",
    baLead: "Fewer suppliers to juggle, less repetitive work, more time to grow the business.",
    baBeforeK: "Without a tech partner", baBeforeT: "Stalled ideas,<br>lost hours",
    baBeforeL: "<li>No idea where to start with AI</li><li>Five suppliers, nobody in charge</li><li>Hours of repetitive work every week</li><li>Tools that don't talk to each other</li>",
    baAfterK: "With Antipode", baAfterT: "One partner,<br>idea to launch",
    baAfterL: "<li>A clear roadmap with priorities and costs</li><li>One contact for strategy and build</li><li>Custom automated processes</li><li>Connected tools, tidy data</li>",
    baCta: "Let's talk about your project",

    usesTitle: "What we build for you.",
    usesLead: "Four services, one team. Pick where to start, we'll handle the rest.",
    u1T: "AI consulting &amp; strategy",
    u1D: "We look at your processes, data and tools and tell you where AI really saves money. You get a roadmap with priorities, costs and expected return.",
    u2T: "Custom software &amp; web apps",
    u2D: "Back-office tools, client portals, dashboards and SaaS designed around the way you work. From MVP to production.",
    u3T: "Automation &amp; AI agents",
    u3D: "We connect email, CRM, spreadsheets and back office with n8n workflows and AI agents. They do the repetitive work, your team handles the rest.",
    u4T: "Websites &amp; landing pages that sell",
    u4D: "Fast, accessible, built to rank on Google and turn visits into leads. Already connected to your tools.",
    usesCta: "Let's talk it through",
    u1L: "AI consulting &amp; strategy", u2L: "Custom software &amp; web apps", u3L: "Automation &amp; AI agents", u4L: "Websites that sell",
    r0: "AI audit · your business", r1: "3-phase roadmap",
    r2: "Customer replies", r3: "−60% time · 2 weeks", r4: "Automatic quotes", r5: "−8 hours/week · 4 weeks", r6: "Monthly reports", r7: "from 1 day to 10 minutes",
    a1: "Orders", a2: "Customers", a3: "Shipped", a4: "In progress",
    w0: "Automated workflow", w1: "New enquiry", w2: "email or website form", w3: "AI reads and sorts it", w4: "and drafts the reply",
    w5: "CRM updated", w6: "contact and quote", w7: "Team notified", w8: "only when needed",
    ws1: "Your product, explained well.", ws2: "Get a quote", ws3: "Accessibility", ws4: "Leads from the site",

    howTag: "How we work",
    howTitle: "Working with us is <span class=\"grad\">simpler</span> than you think.",
    howLead: "No endless projects, no jargon. Three phases, one contact person, results you can measure.",
    how1S: "Analysis &amp; consulting", how2S: "Design &amp; build", how3S: "Launch &amp; growth",
    calTitle: "Intro call",
    how1T: "Analysis &amp; consulting",
    how1D: "In a 30-minute call we learn your goals, processes and tools. Then you get a written quote with costs, timeline and expected results.",
    d1: "Design &amp; prototype", d2: "Frontend development", d3: "Backend &amp; database", d4: "AI &amp; automation",
    how2T: "Design &amp; build",
    how2D: "We design, build and test in stages. You see progress every week, not just at the end.",
    upd0: "Project update",
    updList: "<li>✓ Version 1.0 live</li><li>✓ All tests passed</li><li>✓ Team training done</li><li>→ Next step: automated reports</li>",
    how3T: "Launch &amp; growth",
    how3D: "We go live, train your team and measure results. Then we keep improving, if you want.",

    integK: "Technology &amp; integrations",
    integT: "We work with the best tools. And with the ones you already use.",
    integMore: "… and any tool with an API",

    roiTag: "Estimate your savings",
    roiTitle: "What is <span class=\"grad\">automating</span> repetitive work worth?",
    roiQ1: "People doing repetitive work", roiQ2: "Hours per week each", roiQ3: "Share that can be automated", roiQ4: "Average hourly cost",
    roiHours: "hours freed up per month", roiMoney: "operating cost per month",
    roiNote: "Rough estimate. On the call we redo it on your real processes.",
    roiCta: "Let's check your numbers",

    casesTag: "Case studies", casesTitle: "Real projects, not mockups.",
    moreBtn: "See all projects",
    casesNote: "The government and enterprise portals were built by our founder as a Senior Frontend Engineer at SMC, working in project teams.",
    st1k: "Startup · 2026", st1b: "4 channels. One AI assistant.", st1t: "CHEAI: AI customer service",
    st1d: "The platform we co-founded: CRM, campaigns and an assistant that replies on WhatsApp, Instagram, TikTok and Messenger.",
    st1c1: "LLM agents + RAG", st1c2: "Co-founded by us",
    st2k: "Public sector", st2b: "15+ portals. Zero barriers.", st2t: "Portals used by millions of citizens",
    st2d: "Italy's Revenue Agency, Ministry of Finance, Customs, UNAR and more: WCAG 2.1 AA accessible interfaces, migrations and custom components.",
    st3k: "Enterprise · E-commerce", st3b: "Banking, industry, e-commerce.", st3t: "Websites for companies selling worldwide",
    st3d: "Scame, Banca Sella, AXA: multilingual product sites and customer portals, fast and integrated with company systems.",
    st3c1: "Multilingual", st3c2: "Performance", visit: "Visit the site",

    founderQuote: "“The right technology isn't the most complicated one. It's the one that makes you work better from day one.”",
    founderRole: "Founder of Antipode · co-founder of CHEAI",
    founderBio: "Six years of software development, more than fifteen enterprise portals for government, healthcare and banking, and an AI customer service platform. Townsville and Aversa are eight hours apart: when you close the office, we're still working on your project.",
    st1: "years of development", st2: "enterprise portals", st3: "offices, two time zones",

    faqTitle: "The questions we get asked most.",
    faqLead: "Can't find yours? Write to us: a person will answer, not a bot.",
    q1: "How much does a project cost?",
    a1: "It depends on what you need: a consultation, an automation and a custom platform are different jobs. After the call you get a written quote with costs, timeline and what's included, before any work starts.",
    q2: "How long does it take?",
    a2: "A consultation or a simple automation takes a few weeks, a web app a few months. We split the work into stages, so you start using the software before the end.",
    q3: "Do you work on existing software too?",
    a3: "Yes. We can start with an audit of what you have, improve it, connect it to new tools or migrate it. No need to start from scratch.",
    q4: "Is AI safe for my company's data?",
    a4: "We only use the data you choose and handle it under the GDPR. Before we start, we explain which services we use, where the data goes and how it's protected.",
    q5: "Who owns the code, accounts and data?",
    a5: "You do. Domains, accounts and services are in your name, and on delivery you get the code and credentials. If you ever want to switch provider, you don't need anyone's permission.",
    q6: "Do you work remotely? How does it work?",
    a6: "Yes, with clients in Italy, Australia and elsewhere. Calls in English or Italian, weekly updates and a single point of contact who knows your project.",

    ctaPill: "We reply personally, within one working day",
    ctaTitle: "Got an idea or a process to improve? <span class=\"grad\">Let's talk.</span>",
    ctaLead: "Tell us in a couple of lines what you need. We'll reply with a few questions and a call proposal.",
    fName: "Name", fCompany: "Company (optional)", fBudget: "Rough budget", bud0: "Not sure yet",
    fNeed: "I'm interested in", fT1: "AI consulting", fT2: "Software / web app", fT3: "Automation &amp; AI agents", fT4: "Website / landing page",
    fMsg: "What do you need?", fSend: "Send request",
    fLegal: "The form opens your email app with the message ready: this site stores nothing. Read our <a href=\"privacy.html\">privacy policy</a>.",

    footTag: "AI consulting and custom software development, between Townsville and Aversa.",
    aboutLink: "About us", footContact: "Contact", italy: "Italy", vat: "VAT no.", legalLabel: "Legal",
    catPa: "Public sector", catEnt: "Healthcare &amp; Enterprise", catBiz: "Business &amp; E-commerce", catProd: "Startups &amp; products",

    /* strings used from JS */
    _title: "Antipode — AI consulting, custom software and automation",
    _desc: "Antipode is an AI consulting and software development agency based in Townsville (Australia) and Aversa (Italy). We design and build web apps, automations, AI agents and websites, from idea to launch.",
    _formErr: "Please add your name, a valid email and a short message.",
    _formOk: "Opening your email app…",
    _mailSubject: "New project",
    _mailHello: "Hi Antipode,",
    _mailNeed: "Interested in",
    _tbd: "to be defined",
    _newTab: "opens in a new tab",
    _client: "Client", _library: "Library",
    _budget: "Budget", _todo: "to fill in"
  };

  var IT_JS = {
    _formErr: "Scrivi nome, un'email valida e due righe su cosa ti serve.",
    _formOk: "Apro il tuo programma di posta…",
    _mailSubject: "Nuovo progetto",
    _mailHello: "Ciao Antipode,",
    _mailNeed: "Mi interessa",
    _tbd: "da definire",
    _newTab: "apre in una nuova scheda",
    _client: "Cliente", _library: "Libreria",
    _budget: "Budget", _todo: "da compilare"
  };

  function pick() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q === "it" || q === "en") return q;
    try { var s = localStorage.getItem(KEY); if (s === "it" || s === "en") return s; } catch (e) {}
    return /^it\b/i.test(navigator.language || "") ? "it" : "en";
  }

  var lang = pick();
  document.documentElement.lang = lang;
  document.documentElement.dataset.lang = lang;

  window.I18N = {
    lang: lang,
    t: function (k) {
      var v = lang === "en" ? EN[k] : IT_JS[k];
      if (v === undefined) return null;
      return String(v).replace(/&amp;/g, "&"); // JS callers want plain text
    },
    set: function (l) {
      if (l === lang) return;
      try { localStorage.setItem(KEY, l); } catch (e) {}
      try { sessionStorage.setItem("antipode-y", String(window.scrollY)); } catch (e) {}
      var u = new URL(location.href);
      u.searchParams.set("lang", l);
      u.hash = "";
      location.replace(u.toString());
    }
  };

  function apply(root) {
    if (lang !== "en") return;
    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = EN[el.dataset.i18n]; if (v !== undefined) el.innerHTML = v;
    });
    root.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var v = EN[el.dataset.i18nAria]; if (v !== undefined) el.setAttribute("aria-label", v);
    });
    root.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var v = EN[el.dataset.i18nAlt]; if (v !== undefined) el.alt = v;
    });
    document.title = EN._title;
    var d = document.querySelector('meta[name="description"]'); if (d) d.content = EN._desc;
  }
  window.I18N.apply = apply;
  if (document.body && !document.body.hasAttribute("data-legal")) apply(document);

  document.querySelectorAll(".lang__btn").forEach(function (b) {
    b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    b.addEventListener("click", function () { window.I18N.set(b.dataset.lang); });
  });
})();
