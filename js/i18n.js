/* IT/EN switch.
   The Italian copy lives in the HTML (default, indexable). English replaces it at load time.
   Elements: data-i18n → innerHTML, data-i18n-aria → aria-label, data-i18n-alt → alt.
   Language: ?lang= → saved choice → browser language. Switching reloads the page
   (keeps the scroll position) so every scroll animation is rebuilt on the new text. */
(function () {
  var KEY = "antipode-lang";

  var EN = {
    skip: "Skip to content",
    loader: "Compiling the experience",
    navLabel: "Sections", navWork: "Work", navServices: "Services", navAbout: "About us",
    logoLabel: "Antipode, back to top",
    status: "Taking new projects", navCta: "Get a quote ↗",

    heroKicker: "Digital studio · Townsville (AU) &amp; Aversa (IT)",
    heroH1: "Antipode, digital studio: bold code",
    heroW1: "Bold", heroW2: "Code",
    heroSub: "Websites · Automations · Web apps",
    heroLede: "We design and build websites, automations and web apps for businesses that want less busywork and more customers. A small team across two time zones, and one person you actually talk to.",
    heroCta: "Let's talk", scroll: "Scroll",

    s1Title: "Nice site.<br>No customers?",
    s1Txt: "<li>It loads slowly and Google can't find it.</li><li>You spend hours answering the same messages.</li><li>Your business data lives in ten spreadsheets.</li><li class=\"problems__end\">Sound familiar? It's fixable.</li>",
    s2Title: "From idea<br>to deploy",
    s2Txt: "We start from your problem, not from the tech. Discovery, design, build, testing and launch stay with the same people: no hand-offs, no broken telephone.",
    s3Title: "Numbers,<br>not<br>promises",
    stat1: "years of experience", stat2: "enterprise portals", stat3: "WCAG 2.1 accessibility",

    svcTag: "Services",
    svcH1: "What's<br>inside",
    svcH2: "No templates.<br>No shortcuts.",
    svcH3: "Solid code,<br>every time",
    svc1T: "Custom websites",
    svc1D: "<b class=\"svc-for\">For sites that don't bring in leads.</b> Company sites, portals and landing pages that load fast, work for everyone and are built to rank. A CMS when you want to edit it yourself, custom code when every millisecond counts.",
    svc2T: "Automation &amp; AI",
    svc2D: "<b class=\"svc-for\">For teams answering the same questions all day.</b> n8n workflows, LLM agents and chatbots that reply on WhatsApp, Instagram and your site using your own documents. Sensitive requests go to a person.",
    svc3T: "Web apps &amp; MVPs",
    svc3D: "<b class=\"svc-for\">For businesses run on spreadsheets and disconnected apps.</b> Back-office tools, SaaS products and dashboards with login, roles, payments and API integrations. We start with an MVP you can show your first customers, then grow it.",
    mockUrl: "yoursite.com", mockScore: "Lighthouse<br>accessibility",
    flowA: "New lead", flowB: "AI agent", flowD: "Reply sent",
    kpi1: "Orders", kpi2: "Conversion", kpi3: "Reply time",

    aboutTag: "About us",
    jTitle: "Experience<br>&amp; craft",
    jLede: "Antipode grew out of its founder's path: six years writing code, from first websites for private clients to Italian government portals and an AI startup.",
    j1code: "// v1.0, the first of many",
    j1M: "Freelance", j1T: "The first client",
    j1D: "Websites and small web apps for professionals and local businesses. You learn fast when a client calls you at ten at night.",
    j2M: "ITS Incom · Milan", j2T: "The training",
    j2D: "A post-secondary Full Stack Development program: Java, SQL, JavaScript and team projects run by the same rules as a real company.",
    j3T: "Into the industry",
    j3D: "Junior Developer intern, then Senior Frontend Engineer: custom Liferay themes, reusable component libraries, drag-and-drop interfaces for clients.",
    j4M: "2023 → 2026", j4T: "Portals where mistakes cost",
    j4D: "15+ portals for government, healthcare, banking and e-commerce. WCAG 2.1 AA accessibility, Liferay 7.0 to 7.4 migrations, demos and training straight with clients.",
    j5T: "The first startup",
    j5D: "Co-founding Gruppo Automa and launching CHEAI: AI agents, RAG and customer service that replies on WhatsApp, Instagram and Messenger.",
    j6T: "Two cities, one team",
    j6D: "Everything we've learned, working for your business. While Italy sleeps, Australia is working on your project.",
    j6Cta: "Let's work together ↗",
    jToday: "Today", chipMig: "Migrations",
    altAE: "Homepage of the Agenzia delle Entrate portal",
    altUnar: "Homepage of the UNAR portal",
    altCheai: "Homepage of CHEAI",

    whyW1: "Why", whyW2: "code", whyW3: "matters",
    whyS1: "details", whyS2: "not just pixels", whyS3: "always",
    whySub: "A good-looking site that loads slowly, doesn't show up on Google or can't be used with a screen reader loses you customers every day.",
    why1T: "Accessible",
    why1D: "We built Italian government portals to WCAG 2.1 AA: keyboard-friendly, screen-reader friendly, usable by everyone. Your project gets the same standard.",
    why2T: "Fast",
    why2D: "Lean code, optimised images, Core Web Vitals kept in check. People don't wait, and neither does Google.",
    why3T: "Ready to grow",
    why3D: "Reusable components and a tidy architecture. When the next feature comes along, nobody starts from scratch.",

    workTitle: "The work<br>speaks louder<br>than we do",
    workCta: "See the work ↓",
    filterLabel: "Filter projects",
    fAll: "All", fPa: "Public sector", fEnt: "Healthcare &amp; Enterprise", fBiz: "Business &amp; E-commerce", fProd: "Startups &amp; products",
    workCtaTxt: "Want results like these for your business?",
    workCtaBtn: "Get a quote ↗",
    proofTag: "Testimonials",
    proofTitle: "Trust,<br>earned",
    proofLede: "Before Antipode, our founder worked on portals where mistakes are expensive: government, healthcare, banking. We bring the same care to your project.",
    logosLabel: "Enterprise portals our founder has worked on",
    faqTitle: "Questions<br>we get asked",
    faqLede: "The questions that come up in every first call. If yours isn't here, write to us: a person will answer, not a bot.",
    faqCta: "Ask your question ↗",
    q1: "How much does a project cost?",
    a1: "It depends on what you need: a landing page and a back-office app are very different jobs. After a first call we send a written quote with costs, timeline and what's included, before any work starts. You can already give us a rough budget in the form below.",
    q2: "How long does it take?",
    a2: "A company website usually takes weeks, a web app months. The quote lists every milestone with dates, so you always know where we are and what you'll see next.",
    q3: "How do you work remotely across two time zones?",
    a3: "Townsville and Aversa are eight or nine hours apart, so work keeps moving while you sleep. We book calls at times that suit both sides, in English or Italian.",
    q4: "Can I update the site myself?",
    a4: "Yes. If you need to change text, photos or articles we use a CMS and show you how it works. If the project is custom-coded, we build the editable parts you actually need.",
    q5: "Who owns the code, domain and accounts?",
    a5: "You do. Domain, hosting and accounts are in your name, and on delivery you get the source code and credentials. If you ever want to switch provider, you don't need anyone's permission.",
    q6: "What happens after launch?",
    a6: "In the weeks after go-live we fix anything that comes up. After that, if you like, we agree a maintenance plan with updates, backups and monitoring.",
    q7: "Are AI chatbots safe for my customers' data?",
    a7: "The chatbot only uses the documents you choose, and we handle data in line with the GDPR. We set it up to say \"I don't know\" instead of making things up, and to hand the conversation to a person when needed.",
    q8: "Do you work outside Italy and Australia?",
    a8: "Yes. We work remotely with clients anywhere and build sites in English and Italian.",
    workNote: "Our founder built the public-sector and enterprise portals as a Senior Frontend Engineer at SMC, working in project teams. Screenshots show the sites as they are today.",

    offerTitle: "Let's build<br>it together",
    offerCta: "Book a call",
    o1T: "Custom<br>website",
    o1L: "<li>Designed for you, no templates</li><li>Technical SEO and speed</li><li>WCAG 2.1 accessibility</li><li>Easy to update yourself</li>",
    o1F: "For: professionals, small businesses, brands",
    o2T: "Automation<br>&amp; AI agents",
    o2L: "<li>Workflows between the tools you already use</li><li>Chatbots on WhatsApp, Instagram and your site</li><li>Answers based on your documents</li><li>Hand-off to a person when needed</li>",
    o2F: "For: teams answering lots of customers every day",
    o3T: "Web apps<br>&amp; MVPs",
    o3L: "<li>Back-office tools and dashboards</li><li>API and payment integrations</li><li>Login, roles, database</li><li>Launch and maintenance</li>",
    o3F: "For: startups and internal processes",
    p1: "Intro call", p2: "Proposal &amp; quote", p3: "Design &amp; build", p4: "Launch &amp; support",

    cTitle: "Got a project?<br>Tell us<br>about it.",
    cName: "Name", cNeed: "We need", cT1: "Website", cT2: "Automation / AI", cT3: "Web app / MVP",
    cMsg: "What do you need?",
    cBudget: "Rough budget", bud0: "Not sure yet",
    cLegal: "The form opens your email app with the message ready to send: this site stores nothing. Details in our <a href=\"privacy.html\">privacy policy</a>.",
    cSend: "Send ↗",
    keys: '<button class="kc" data-k="H" type="button">H</button><button class="kc" data-k="E" type="button">E</button><button class="kc" data-k="Y" type="button">Y</button><button class="kc" data-k="!" type="button">!</button><button class="kc kc--wide kc--lime" data-k="Enter" type="button">enter ⏎</button>',
    keysLabel: "Decorative keyboard",
    keysHint: "Try typing on your keyboard ↑",
    cLinkedin: "Founder on LinkedIn ↗",
    footStudio: "Digital studio", legalLabel: "Legal", footTop: "Back to top ↑",
    footTag: "A digital studio between Townsville and Aversa. Websites, automations and web apps for businesses that want less busywork and more customers.",
    footContact: "Contact", italy: "Italy", vat: "VAT no.",
    motionOff: "Pause animations", motionOn: "Resume animations", toTop: "Back to top",

    /* strings used from JS */
    _title: "Antipode — Websites, automations and web apps · Townsville & Aversa",
    _desc: "Antipode is a digital studio based in Townsville (Australia) and Aversa (Italy). We build custom websites, AI automations and web apps. 15+ enterprise portals delivered for government, healthcare, banking and e-commerce.",
    _formErr: "Please add your name, a valid email and a short message.",
    _formOk: "Opening your email app…",
    _mailSubject: "New project",
    _mailHello: "Hi Antipode,",
    _mailNeed: "We need",
    _tbd: "to be defined",
    _homeOf: "Homepage of",
    _newTab: "opens in a new tab",
    _private: "private project",
    _client: "Client", _library: "Library",
    _budget: "Budget", _todo: "to fill in"
  };

  var IT_JS = {
    _formErr: "Scrivi nome, un'email valida e due righe sul progetto.",
    _formOk: "Apro il tuo programma di posta…",
    _mailSubject: "Nuovo progetto",
    _mailHello: "Ciao Antipode,",
    _mailNeed: "Ci serve",
    _tbd: "da definire",
    _homeOf: "Homepage di",
    _newTab: "apre in una nuova scheda",
    _private: "progetto privato",
    _client: "Cliente", _library: "Libreria",
    _budget: "Budget", _todo: "da compilare",
    motionOff: "Metti in pausa le animazioni", motionOn: "Riprendi le animazioni"
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
    t: function (k) { return lang === "en" ? EN[k] : (IT_JS[k] !== undefined ? IT_JS[k] : null); },
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
