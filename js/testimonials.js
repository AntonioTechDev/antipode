/* Testimonianze — SOLO recensioni reali, con il permesso di chi le firma.
   Per pubblicarne una: scrivi il testo in `quote`, compila nome/ruolo e metti `placeholder: false`.
   Le voci con `placeholder: true` si vedono solo su localhost (con il bollino "da compilare")
   e non compaiono MAI sul sito pubblicato. Se non ci sono recensioni reali, la sezione mostra
   solo l'elenco dei portali. */
window.TESTIMONIALS = [
  {
    placeholder: true,
    quote: {
      it: "Qui va la recensione di un cliente (es. Il Vizietto): 2–3 frasi su che problema avevano, cosa avete fatto e che risultato hanno visto.",
      en: "A client review goes here (e.g. Il Vizietto): 2–3 sentences on the problem they had, what you built and the result they saw."
    },
    name: "Nome Cognome",
    role: { it: "Ruolo, Azienda", en: "Role, Company" },
    project: "Il Vizietto"
  },
  {
    placeholder: true,
    quote: {
      it: "Qui va una raccomandazione di un collega o responsabile in SMC: puoi chiederla su LinkedIn e riportarla con il suo permesso.",
      en: "A recommendation from a colleague or manager at SMC goes here: ask for it on LinkedIn and quote it with their permission."
    },
    name: "Nome Cognome",
    role: { it: "Project Manager, SMC", en: "Project Manager, SMC" },
    project: "Portali PA"
  },
  {
    placeholder: true,
    quote: {
      it: "Qui va la recensione di un cliente CHEAI o di un partner di Gruppo Automa sull'automazione del customer service.",
      en: "A review from a CHEAI customer or Gruppo Automa partner about automating customer service goes here."
    },
    name: "Nome Cognome",
    role: { it: "Ruolo, Azienda", en: "Role, Company" },
    project: "CHEAI"
  }
];
