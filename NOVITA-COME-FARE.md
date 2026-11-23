# Come pubblicare una novità sul sito

Ogni notizia è **un file di testo** nella cartella `_novita` del sito.
Si fa tutto dal sito di GitHub, nel browser: non serve installare niente.
Dopo il salvataggio il sito si aggiorna da solo in 1-2 minuti.

In home compaiono le **ultime 3 notizie**; tutte le altre restano nella pagina
**viadeimille61.it/novita/**.

---

## 1. Apri la cartella delle notizie

1. Vai su **github.com/danielecarrella/viadeimille61** ed entra con il tuo account.
2. Clicca sulla cartella **`_novita`**.

## 2. Crea il file della notizia

1. In alto a destra clicca **Add file → Create new file**.
2. Nel campo del nome scrivi:

   ```
   2026-12-01-titolo-breve.md
   ```

   - all'inizio la data (anno-mese-giorno), poi poche parole del titolo;
   - solo lettere minuscole, numeri e trattini: **niente spazi, accenti o apostrofi**;
   - deve finire con **`.md`**.

   Il nome diventa l'indirizzo della pagina, ad esempio
   `viadeimille61.it/novita/2026-12-01-titolo-breve/`.

## 3. Incolla questo modello e compilalo

```
---
titolo: "Il titolo della notizia"
date: 2026-12-01
riassunto: "Una o due frasi che riassumono la notizia."
immagine:
---
Qui scrivi il testo della notizia.

Per andare a capo e iniziare un nuovo paragrafo lascia una riga vuota.
```

- **titolo**: tra virgolette.
- **date**: la data della notizia, nel formato anno-mese-giorno (es. 2026-12-01).
  Le notizie sono ordinate per questa data, dalla più recente.
- **riassunto**: compare nelle anteprime in home e su Google. Tra virgolette.
- **immagine**: facoltativa (vedi il punto 4). Se non c'è, lascia vuoto.
- Le tre righe con `---` vanno lasciate esattamente come sono.

Se nel titolo o nel riassunto servono le virgolette, usa quelle tipografiche
(“ ”) oppure gli apostrofi: le virgolette dritte `"` chiuderebbero il testo.

### Come scrivere il testo

| Per ottenere | Scrivi |
|---|---|
| **grassetto** | `**parola**` |
| un link | `[testo del link](https://indirizzo.it)` |
| un elenco | ogni voce su una riga che inizia con `- ` |
| un sottotitolo | una riga che inizia con `## ` |

## 4. Immagine (facoltativa)

1. Prepara un'immagine **JPG orizzontale**, circa **1200 × 675 pixel**, sotto i **300 KB**.
   Il nome come per il file: minuscole e trattini, es. `orari-natale.jpg`.
2. Torna alla pagina principale del repository, entra in **`assets` → `img` → `novita`**.
3. Clicca **Add file → Upload files**, trascina l'immagine e clicca **Commit changes**.
4. Nel file della notizia scrivi:

   ```
   immagine: /assets/img/novita/orari-natale.jpg
   ```

## 5. Pubblica

1. In fondo alla pagina (o in alto a destra) clicca **Commit changes…**.
2. Lascia selezionato **Commit directly to the `main` branch** e conferma.
3. Dopo 1-2 minuti la notizia è online. Se non la vedi, ricarica la pagina con **Ctrl+F5**.

---

## Modificare o togliere una notizia

- **Modificare**: apri il file in `_novita`, clicca la **matita** (✏️), cambia e fai **Commit changes**.
- **Nasconderla senza cancellarla**: aggiungi la riga `published: false` tra le righe `---`.
- **Cancellarla**: apri il file, menu **…** in alto a destra → **Delete file** → **Commit changes**.

## Il file di esempio

Nella cartella c'è `2026-11-23-esempio-bozza.md`: è **solo un modello**, segnato come bozza
(`published: false`) e quindi **non compare sul sito**. Puoi copiarlo come base e poi cancellarlo.

## Cosa non scrivere nelle notizie

Il sito è di un intermediario assicurativo iscritto al RUI, quindi:

- niente promesse su **prezzi, sconti o rendimenti**;
- niente nomi di **prodotti Zurich** che non sono già presentati sul sito;
- per dubbi su testi che parlano di prodotti o coperture, chiedere prima a chi segue la compliance.
