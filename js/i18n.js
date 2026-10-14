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
    navLabel: "Sections", navServices: "Services", navMethod: "Method", navCases: "Case studies",
    navCta: "Book a call",

    heroEyebrow: "AI agency · Townsville &amp; Aversa",
    heroTitle: "More sales.<br>Less busywork.<br><em>With AI.</em>",
    heroSub: "We build AI agents, automations and websites that answer your customers, qualify leads and book meetings for you. You keep the best part: closing.",
    heroCta: "Book a 30-minute call", heroCta2: "Watch an agent at work",
    assure1: "Written quote before we start", assure2: "Code and accounts in your name", assure3: "English &amp; Italian",

    trustLabel: "Experience", trustLabel2: "Our team has worked on projects for",

    probTag: "The problem",
    probTitle: "Every day you lose customers <em>without noticing.</em>",
    prob1T: "You reply too late",
    prob1D: "A lead messages you in the evening, you reply the next day. By then they've asked someone else for a quote.",
    prob2T: "People doing machine work",
    prob2D: "Copying data, answering the same questions, chasing follow-ups. Hours of work that don't earn a cent more.",
    prob3T: "Your website doesn't sell",
    prob3D: "It looks good, but it's slow, invisible on Google and brings in no leads. A shop window, not a salesperson.",

    demoTag: "The solution, live",
    demoTitle: "An agent that sells <em>even at 3 a.m.</em>",
    demoLead: "It replies within seconds on WhatsApp, Instagram and your site, works out what the customer needs, qualifies them and books the meeting in your calendar. When a person is needed, it hands over to your team.",
    demoList: "<li>Replies in seconds, 24/7</li><li>Uses your price lists, documents and FAQs</li><li>Logs everything in your CRM, no copy-paste</li>",
    demoCta: "I want an agent like this",
    chatLabel: "Demo conversation with an AI agent", chatName: "Assistant · Your brand", chatStatus: "online now", chatReplay: "↻ Replay",
    logLabel: "What happens behind the scenes", logTitle: "Behind the scenes",
    demoNote: "Illustrative demo · simulated conversation",

    roiTag: "Estimate your savings",
    roiTitle: "How much time does AI <em>give back</em> to you?",
    roiQ1: "Enquiries and messages per day", roiQ2: "Minutes to handle each one", roiQ3: "Share AI can handle", roiQ4: "Staff hourly cost",
    roiHours: "hours freed up per month", roiMoney: "operating cost per month",
    roiNote: "Rough estimate over 22 working days. On the call we redo it with your real numbers.",
    roiCta: "Let's check your numbers",

    svcTag: "Services",
    svcTitle: "Three ways to put <em>AI to work for you.</em>",
    svcLead: "We start from the problem, not the tech. Then we build only what saves you time or wins you customers.",
    svc1T: "AI consulting &amp; strategy",
    svc1D: "We map your processes and find where AI really saves money. You get a roadmap with priorities, costs and expected return.",
    svc1L: "<li>Process audit</li><li>Prioritised AI roadmap</li><li>Return estimate</li>",
    svcBadge: "Most requested",
    svc2T: "AI agents &amp; automation",
    svc2D: "Chatbots on WhatsApp, Instagram and your site, agents that read your documents, n8n workflows connecting CRM, email and back office.",
    svc2L: "<li>WhatsApp &amp; Instagram agents</li><li>RAG on your documents</li><li>n8n &amp; CRM automation</li>",
    svc3T: "Websites &amp; web apps that sell",
    svc3D: "Landing pages, websites and platforms that are fast, accessible and built to convert, already connected to your tools.",
    svc3L: "<li>Landing pages &amp; company sites</li><li>Web apps &amp; dashboards</li><li>Technical SEO &amp; WCAG 2.1</li>",

    methodTag: "Method",
    methodTitle: "From first call to launch, <em>no surprises.</em>",
    m1T: "Intro call", m1D: "30 minutes to understand your goals, numbers and the tools you already use.",
    m2T: "Analysis &amp; proposal", m2D: "You get a written quote with costs, timeline and expected results. Your call.",
    m3T: "Build &amp; test", m3D: "We build in stages and you see progress along the way, not just at the end.",
    m4T: "Launch &amp; optimise", m4D: "We measure results, improve what's needed and stay by your side.",

    casesTag: "Case studies",
    casesTitle: "Real projects, <em>not mockups.</em>",
    casesLead: "From AI customer service to portals used every day by millions of citizens.",
    moreLabel: "More projects", moreBtn: "Show all",
    casesNote: "The government and enterprise portals were built by our founder as a Senior Frontend Engineer at SMC, working in project teams.",

    teamTag: "About us",
    teamTitle: "Two cities, opposite sides of the world. <em>One team.</em>",
    teamLead: "Antipode grew out of its founder's experience. Antonio De Biase has six years of software development behind him, more than fifteen enterprise portals and the co-founding of CHEAI, an AI customer service platform. Townsville and Aversa are eight hours apart: when you close the office, we're still working on your project.",
    teamLink: "Our founder on LinkedIn ↗",
    st1: "years building software", st2: "enterprise &amp; government portals", st3: "WCAG 2.1 accessibility", st4: "offices, two time zones",

    faqTitle: "Frequently asked <em>questions.</em>",
    faqLead: "Can't find yours? Write to us: a person will answer, not a bot.",
    q1: "How much does a project cost?",
    a1: "It depends on what you need: a WhatsApp agent and a custom platform are different jobs. After the call you get a written quote with costs, timeline and what's included, before any work starts.",
    q2: "How soon will I see results?",
    a2: "A first agent or a simple automation can be live within a few weeks. Bigger projects are split into stages, so you start using them before the end.",
    q3: "Is AI safe for my customers' data?",
    a3: "The agent only uses the documents you choose and we handle data in line with the GDPR. We set it up to say \"I don't know\" instead of making things up, and to hand over to a person when needed.",
    q4: "Who owns the code, accounts and data?",
    a4: "You do. Domains, accounts and services are in your name, and on delivery you get the code and credentials. If you ever want to switch provider, you don't need anyone's permission.",
    q5: "Do you work remotely? How does it work?",
    a5: "Yes, with clients in Italy, Australia and elsewhere. Calls in English or Italian, frequent updates and a single point of contact who knows your project.",
    q6: "What happens after launch?",
    a6: "We monitor results in the first weeks and fix whatever is needed. After that, if you like, we agree a maintenance and continuous-improvement plan.",

    ctaTag: "Contact",
    ctaTitle: "Let's talk about your <em>next step.</em>",
    ctaLead: "Tell us in a couple of lines what you'd like to improve. We'll reply personally with a few questions and a call proposal.",
    ctaSteps: "<li>You write to us</li><li>A person replies, not a bot</li><li>30-minute call</li><li>Written quote</li>",
    fName: "Name", fCompany: "Company (optional)", fNeed: "I'm interested in",
    fT1: "AI consulting", fT2: "Agents &amp; automation", fT3: "Website / web app",
    fBudget: "Rough budget", bud0: "Not sure yet", fMsg: "What would you like to improve?",
    fSend: "Send request",
    fLegal: "The form opens your email app with the message ready: this site stores nothing. Read our <a href=\"privacy.html\">privacy policy</a>.",

    footTag: "AI consulting and development agency between Townsville and Aversa.",
    footStudio: "Studio", footContact: "Contact", italy: "Italy", vat: "VAT no.", legalLabel: "Legal",

    catPa: "Public sector", catEnt: "Healthcare &amp; Enterprise", catBiz: "Business &amp; E-commerce", catProd: "Startups &amp; products",

    /* strings used from JS */
    _title: "Antipode — AI agency: agents, automation and websites that sell",
    _desc: "Antipode is an AI consulting and development agency based in Townsville (Australia) and Aversa (Italy). AI agents that answer and qualify customers, automation and websites that convert.",
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
      // dictionary values are HTML; JS callers want plain text
      return String(v).replace(/&amp;/g, "&");
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

  // language buttons (also present on the legal pages)
  document.querySelectorAll(".lang__btn").forEach(function (b) {
    b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    b.addEventListener("click", function () { window.I18N.set(b.dataset.lang); });
  });
})();
