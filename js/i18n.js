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
    navLabel: "Sections", navHow: "How it works", navWhat: "What AI does", navCases: "Case studies",
    navCta: "Book a call",

    heroPill: "AI agency · Townsville &amp; Aversa",
    heroTitle: "More sales. Less busywork. <span class=\"grad\">With AI.</span>",
    heroSub: "AI agents that answer your customers, qualify leads and book meetings for you. On WhatsApp, Instagram and your website, even at night.",
    heroCta: "Book a 30-minute call", heroCta2: "See how much you'd save",
    assure1: "Written quote before we start", assure2: "Data handled under the GDPR", assure3: "A real person, always",

    appLabel: "Demo: an AI agent console", appTitle: "sales agent", appInbox: "Conversations", now: "now",
    siteWeb: "Website · 9 min", agentOn: "AI agent active", replay: "↻ Replay", logTitle: "Behind the scenes",
    kpi1: "Replies today", kpi2: "Meetings", demoNote: "Illustrative demo · simulated conversation",
    logosLabel: "Our team has worked on projects for",

    baTitle: "Your day: before and after AI.",
    baLead: "Less chaos in your inbox, more time for people who actually buy.",
    baBeforeK: "Before", baBeforeT: "All work,<br>no breathing room",
    baBeforeL: "<li>The same reply pasted 40 times a day</li><li>Leads lost between DMs, email and phone</li><li>Sales slipping away while you sleep</li><li>Spreadsheets updated by hand</li>",
    baAfterK: "With Antipode", baAfterT: "Less grind,<br>more sales",
    baAfterL: "<li>AI answers FAQs in seconds</li><li>Leads sorted and qualified in your CRM</li><li>Meetings booked even at night</li><li>Data synced automatically</li>",
    baCta: "I want the after",

    howTag: "How it works",
    howTitle: "Working with us is <span class=\"grad\">simpler</span> than you think.",
    howLead: "No endless projects, no jargon. Three steps, one contact person, results you can measure.",
    how1S: "We get to know you", how2S: "We build your agent", how3S: "AI works, you sell",
    calTitle: "Intro call",
    how1T: "We get to know you",
    how1D: "In 30 minutes we learn your goals, numbers and tools. Then you get a written quote with costs, timeline and expected results.",
    conn: "connected", docs: "Price lists, FAQs and documents", indexed: "indexed for the AI",
    how2T: "We build your agent",
    how2D: "We connect it to your channels and tools, train it on your documents and test it with you before it goes live.",
    reportIntro: "Here's today's summary:",
    reportList: "<li>128 conversations handled</li><li>23 qualified leads</li><li>9 meetings in the calendar</li><li>4 requests passed to the team</li>",
    how3T: "AI works, you sell",
    how3D: "The agent replies, qualifies and books. You get a daily summary and we keep improving it with real data.",

    usesTitle: "One agent, a thousand conversations.",
    usesLead: "Here's what it does every day instead of your team.",
    u1T: "Answer every message in seconds",
    u1D: "Prices, opening hours, availability: the agent replies on WhatsApp with your information, day and night.",
    u2T: "Turn comments into customers",
    u2D: "Someone writes \"INFO\" under a post? A private message goes out with the right link and the lead lands in your CRM.",
    u3T: "Qualify leads and book meetings",
    u3D: "It asks the right questions, spots who's ready to buy and books the call in your calendar.",
    u4T: "Everything in your CRM, automatically",
    u4D: "Name, needs and budget go where they belong, no copy-paste. With custom n8n workflows.",
    usesCta: "I want these results",
    biz: "Your brand",
    p1a: "Hi! Are you open Sunday for lunch?",
    p1b: "Hi! Yes, from 12:30 to 3pm 🍝 Shall I book you a table?",
    p1c: "Yes, for 4 people at 1pm",
    p1d: "Done ✅ Table for 4, Sunday at 1pm. See you soon!",
    p2cap: "New collection online ✨ Comment INFO for the link",
    p2dm: "Hi Giulia! Here's the link to the collection 👉 shop.yourbrand.com — looking for a particular size?",
    p3a: "To suggest the right solution: how many people are in your team?",
    p3b: "There are 12 of us",
    p3c: "Great. Pick a time for a call with our expert:",
    p4h: "New lead", p4a: "Source", p4b: "Interest", p4c: "Website + chatbot", p4d: "Status", p4e: "Qualified",
    u1L: "Automatic replies on WhatsApp", u2L: "Comment → private message", u3L: "Meetings in your calendar", u4L: "CRM sync",

    svcTag: "Services", svcTitle: "What we do for you.",
    road1: "WhatsApp chatbot", road2: "Quote automation", road3: "Automatic reports",
    ag1: "How much is shipping?", ag2: "Free over €50, delivered in 24–48 hours 📦",
    svc1T: "AI consulting &amp; strategy",
    svc1D: "We map your processes and find where AI really saves money. You get a roadmap with priorities, costs and expected return.",
    svc2T: "AI agents &amp; automation",
    svc2D: "Chatbots on WhatsApp, Instagram and your site, agents that read your documents, n8n workflows connecting CRM, email and back office.",
    svc3T: "Websites &amp; web apps that sell",
    svc3D: "Landing pages, websites and platforms that are fast, accessible and built to convert, already connected to your tools.",
    integK: "Integrations", integT: "Connects to the tools you already use.", integMore: "… and any tool with an API",

    roiTag: "Estimate your savings",
    roiTitle: "How much time does AI <span class=\"grad\">give back</span> to you?",
    roiQ1: "Enquiries and messages per day", roiQ2: "Minutes to handle each one", roiQ3: "Share AI can handle", roiQ4: "Staff hourly cost",
    roiHours: "hours freed up per month", roiMoney: "operating cost per month",
    roiNote: "Rough estimate over 22 working days. On the call we redo it with your real numbers.",
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

    founderQuote: "“We don't sell you artificial intelligence. We give you back time for the work that matters.”",
    founderRole: "Founder of Antipode · co-founder of CHEAI",
    founderBio: "Six years of software development, more than fifteen enterprise portals for government, healthcare and banking, and an AI customer service platform. Townsville and Aversa are eight hours apart: when you close the office, we're still working on your project.",
    st1: "years of development", st2: "enterprise portals", st3: "offices, two time zones",

    faqTitle: "The questions we get asked most.",
    faqLead: "Can't find yours? Write to us: a person will answer, not a bot.",
    q1: "How much does a project cost?",
    a1: "It depends on what you need: a WhatsApp agent and a custom platform are different jobs. After the call you get a written quote with costs, timeline and what's included, before any work starts.",
    q2: "How soon will I see results?",
    a2: "A first agent or a simple automation can be live within a few weeks. Bigger projects are split into stages, so you start using them before the end.",
    q3: "Is AI safe for my customers' data?",
    a3: "The agent only uses the documents you choose and we handle data in line with the GDPR. We set it up to say \"I don't know\" instead of making things up, and to hand over to a person when needed.",
    q4: "Will it sound like a robot?",
    a4: "No. We train it on your tone of voice and the answers you already give today. Before launch we test it together and adjust it until it sounds natural to you.",
    q5: "Who owns the code, accounts and data?",
    a5: "You do. Domains, accounts and services are in your name, and on delivery you get the code and credentials. If you ever want to switch provider, you don't need anyone's permission.",
    q6: "Do you work remotely? How does it work?",
    a6: "Yes, with clients in Italy, Australia and elsewhere. Calls in English or Italian, frequent updates and a single point of contact who knows your project.",

    ctaPill: "We reply personally, no bots",
    ctaTitle: "Start today. <span class=\"grad\">Let AI do the work.</span>",
    ctaLead: "Tell us in a couple of lines what you'd like to improve. We'll reply with a few questions and a call proposal.",
    fName: "Name", fCompany: "Company (optional)", fBudget: "Rough budget", bud0: "Not sure yet",
    fNeed: "I'm interested in", fT1: "AI consulting", fT2: "Agents &amp; automation", fT3: "Website / web app",
    fMsg: "What would you like to improve?", fSend: "Send request",
    fLegal: "The form opens your email app with the message ready: this site stores nothing. Read our <a href=\"privacy.html\">privacy policy</a>.",

    footTag: "AI consulting and development agency between Townsville and Aversa.",
    aboutLink: "About us", footContact: "Contact", italy: "Italy", vat: "VAT no.", legalLabel: "Legal",
    catPa: "Public sector", catEnt: "Healthcare &amp; Enterprise", catBiz: "Business &amp; E-commerce", catProd: "Startups &amp; products",

    /* strings used from JS */
    _title: "Antipode — AI agency: agents, automation and websites that sell",
    _desc: "Antipode is an AI consulting and development agency based in Townsville (Australia) and Aversa (Italy). AI agents that answer customers, qualify leads and book meetings. Automation and websites that convert.",
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
