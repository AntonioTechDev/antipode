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
    navLabel: "Sections", navWork: "Work", navServices: "Services", navStory: "Story",
    logoLabel: "Antipode, back to top",
    status: "Taking new projects", navCta: "Contact us ↗",

    heroKicker: "Digital studio · Townsville (AU) &amp; Aversa (IT)",
    heroH1: "Antipode, digital studio: bold code",
    heroW1: "Bold", heroW2: "Code",
    heroSub: "Websites · Automations · Web apps",
    heroLede: "We design and build websites, automations and web apps for businesses that want less busywork and more customers. A small team across two time zones, and one person you actually talk to.",
    heroCta: "Let's talk", scroll: "Scroll",

    s1Title: "A new angle<br>on the web",
    s1Txt: "Before we open an editor, we ask what the people using the product need to get done. Design, code and data come after, and they all serve that answer.",
    s2Title: "From idea<br>to deploy",
    s2Txt: "Discovery, design, build, testing and launch stay with the same people. No hand-offs, no broken telephone.",
    s3Title: "A fresh<br>take<br>on code",
    stat1: "years of experience", stat2: "enterprise portals", stat3: "WCAG 2.1 accessibility",

    svcTag: "Services",
    svcH1: "What's<br>inside",
    svcH2: "No templates.<br>No shortcuts.",
    svcH3: "Solid code,<br>every time",
    svc1T: "Custom websites",
    svc1D: "Company sites, portals and landing pages that load fast, work for everyone and are built to rank. We use a CMS when you want to edit it yourself, and custom code when every millisecond counts.",
    svc2T: "Automation &amp; AI",
    svc2D: "n8n workflows, LLM agents and chatbots that answer on WhatsApp, Instagram and your site using your own documents. They take the repetitive questions and hand the tricky ones to a person.",
    svc3T: "Web apps &amp; MVPs",
    svc3D: "Back-office tools, SaaS products and dashboards with login, roles, payments and API integrations. We start with an MVP you can show your first customers, then grow it.",
    mockUrl: "yoursite.com", mockScore: "Lighthouse<br>accessibility",
    flowA: "New lead", flowB: "AI agent", flowD: "Reply sent",
    kpi1: "Orders", kpi2: "Conversion", kpi3: "Reply time",

    jTitle: "Experience<br>&amp; craft",
    jLede: "Antipode grew out of its founder's work. Antonio De Biase has spent six years building software, from first websites for private clients to Italian government portals and an AI startup.",
    j1: "2020 · Freelance<br>First websites and web apps for private clients",
    j1code: "// v1.0, the first of many",
    j2: "2022 · ITS Incom, Milan<br>Post-secondary qualification in Full Stack Development",
    j3: "2023 · SMC<br>From intern to Senior Frontend Engineer",
    j4: "2023 → 2026 · 15+ enterprise portals<br>Government, healthcare, banking and e-commerce on Liferay 7.x and React",
    j5: "2026 · Co-founder, Gruppo Automa<br>CHEAI, multichannel AI customer service",
    j6: "Today · Antipode<br>Townsville (QLD) and Aversa (Italy), clients in Italy and Australia",
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
    cLegal: "The form opens your email app with the message ready to send: this site stores nothing. Details in our <a href=\"privacy.html\">privacy policy</a>.",
    cSend: "Send ↗",
    keys: '<button class="kc" data-k="H" type="button">H</button><button class="kc" data-k="E" type="button">E</button><button class="kc" data-k="Y" type="button">Y</button><button class="kc" data-k="!" type="button">!</button><button class="kc kc--wide kc--lime" data-k="Enter" type="button">enter ⏎</button>',
    keysLabel: "Decorative keyboard",
    keysHint: "Try typing on your keyboard ↑",
    cLinkedin: "Founder on LinkedIn ↗",
    footStudio: "Digital studio", legalLabel: "Legal", footTop: "Back to top ↑",
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
    _client: "Client", _library: "Library"
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
