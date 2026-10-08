# Antipode — Studio digitale (Townsville · Aversa)

Sito statico, nessun build. Tutto è ospitato in locale (font, GSAP, ScrollTrigger, Lenis, Three.js):
il sito non contatta servizi esterni, per questo non serve il banner cookie.

## Avvio in locale
```
python -m http.server 5173 --directory site
```
Apri http://localhost:5173 (serve un server: i moduli JS non funzionano da file://).

## Lingue (IT / EN)
- I testi italiani sono nell'HTML (`index.html`), quelli inglesi in `js/i18n.js` (oggetto `EN`, stesse chiavi di `data-i18n`).
- Per aggiungere un testo: metti `data-i18n="chiave"` sull'elemento e aggiungi `chiave` in `EN`.
- Lingua scelta: `?lang=it|en` → scelta salvata → lingua del browser.

## Dove modificare
- **Testimonianze** → `js/testimonials.js`: solo recensioni reali; quelle con `placeholder: true` si vedono SOLO su localhost
- **FAQ** → sezione `#faq` in `index.html` (+ traduzioni `q1…q8` / `a1…a8` in `js/i18n.js`)
- **Progetti showcase** → `js/projects.js` (descrizioni `desc: { it, en }`, screenshot `.webp` in `assets/shots/`)
- **Palette e font** → variabili in cima a `css/style.css`
- **Oggetto 3D** → `js/key3d.js` · **Animazioni** → `js/main.js`
- **Privacy / Cookie** → `privacy.html`, `cookie.html`: completare i campi evidenziati in giallo (ragione sociale, P.IVA, ABN, hosting, email)

## Pubblicazione
Carica la cartella `site/` su Netlify, Vercel, Cloudflare Pages o GitHub Pages.

## Struttura della landing (formula)
1. Logo + tagline + CTA "Preventivo" sempre visibili (nav fissa)
2. Problema → primo step della storia 3D
3. Soluzione / servizi → `#servizi`
4. Portfolio → `#lavori` + CTA
5. Testimonianze → `#recensioni`
6. Chi siamo → `#chi-siamo` + "Perché il codice conta"
7. FAQ → `#faq`
8. CTA → `#contatti` (modulo con budget)
9. Footer con servizi, studio, contatti, note legali

## Rollback
Ogni versione importante ha un tag: `git tag` per vederli, `git checkout <tag>` per tornarci.
