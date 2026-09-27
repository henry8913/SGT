# Motore di calcolo SGT — Specifica 01: Input della parte aerea

> Ambito: **solo stabilità** (equilibrio / antiribaltamento) e **determinazione del quantitativo
> di zavorre di base**. Nessuna verifica strutturale (tensioni, aste, funi).
> Norma di riferimento: **UNI EN 14439** (gru a torre) + Direttiva Macchine 2006/42/CE,
> con combinazioni di carico e coefficienti di forma secondo **UNI EN 13001‑2**.
>
> Fonte dati: `Stabilità.xlsm` (cella per cella). Valori di riferimento estratti in
> `docs/motore/rif_xlsm.json` (valori cache, usati come *golden reference* di validazione).

---

## 1. Sistema di riferimento e convenzioni

Da `Masse_proprie!A3`:

- Origine sull'**asse ralla** (asse di rotazione).
- **+x** = direzione e verso del **braccio** (verso la punta).
- **z** = verticale.
- **y** = laterale (eccentricità per il vento).
- Masse e baricentri sono espressi **rispetto agli assi ralla**.

Convenzioni:

- Unità SI: lunghezze **m**, masse **kg**, forze **N** (o kg‑forza dove indicato), momenti **kg·m**.
- La geometria sorgente (`Geometria_braccio`) è in **mm** → convertire in **m** nei calcoli.
- **Controbraccio** e zavorre di volata hanno **x negativa**.
- Momenti: `MR` = momento rispetto all'asse di rotazione (ribaltante/stabilizzante),
  `MA`/`MB` = momenti ai bordi (lato A = −base/2, lato B = +base/2).

---

## 2. Caratteristiche macchina (`Caratteristiche_macchina`)

| Campo | Cella | Valore | U.M. |
|---|---|---|---|
| Escursione massima carico utile | S3 | 65 | m |
| Carico utile max in punta, tiro II | S4 | 1800 | kg |
| Carico utile max in punta, tiro II/IV | S5 | 1800 | kg |
| Carico utile max macchina, tiro II | S6 | 10000 | kg |
| Escursione max carrello (carico assoluto), tiro II | S7 | 16 | m |
| Carico utile max macchina, tiro II/IV | S8 | 10000 | kg |
| Escursione max carrello (carico assoluto), tiro II/IV | S9 | 16 | m |
| Altezza massima libera sotto gancio | S10 | 70 | m |
| Fune di sollevamento (Ø) | S11 | 16 | mm |
| Fune del carrello (Ø) | S12 | 7 | mm |
| Interasse carro di base | S22 | 4,5 | m |

**Versioni di sbraccio (derivate):** S14=65 (=S3), S15=60, S16=55, S17=50, S18=45,
S19=40, S20=35 → **7 versioni** (indicate come "derivata 0…6").

Lato torre/vento (foglio `Stabilità C25-Q`, da spostare nella spec 03):

- M3 = 1,7 (sezione torre/portaralla, m); J30 = 1,3 (passo traverse torre, m);
  J35 = 1700 (tipologia torre); J37 = J38 = 1,5 (superficie torre per metro lineare, m²/m)
- M11 = 250 N/m² (vento esercizio); M12 = 125 N/m² (vento montaggio); M13 = 879 N/m² (fuori servizio)
- M7 = 2 (n° rinvii tiro II); M8 = 2 (n° rinvii tiro IV)
- M28 = 1,1 (coefficiente inerziale sul carico sollevato)
- M20…M26 = coefficienti deformata secondo ordine (per le 12 condizioni)

---

## 3. Masse della parte aerea (`Masse_proprie`)

Tutti i valori seguenti sono **input** (nessuna formula nei dati di massa/posizione).

### 3.1 Modulo braccio (13 gruppi + accessori)

| Gruppo | x [m] | Massa [kg] | Cella |
|---|---|---|---|
| Braccio 13 (ELB13) | 3,5 | 2221 | Q27 |
| Braccio 12 (ELB12) | 8,5 | 1630 | Q28 |
| Braccio 11 (ELB11) | 13,5 | 1365 | Q29 |
| Braccio 10 (ELB10) | 18,5 | 1119 | Q30 |
| Braccio 9 (ELB09) | 23,5 | 984 | Q31 |
| Braccio 8 (ELB08) | 28,5 | 820 | Q32 |
| Braccio 7 (ELB07) | 33,5 | 720 | Q33 |
| Braccio 6 (ELB06) | 38,5 | 650 | Q34 |
| Braccio 5 (ELB05) | 43,5 | 515 | Q35 |
| Braccio 4 (ELB04) | 48,5 | 400 | Q36 |
| Braccio 3 (ELB03) | 53,5 | 345 | Q37 |
| Braccio 2 (ELB02) | 58,5 | 255 | Q38 |
| Braccio 1 (ELB01) | 63,5 | 225 | Q39 |
| Argano sollevamento | 1,8 | 1325 | Q40 |
| Argano carrello | 22,4 | 100 | Q41 |
| Punta mobile e capofisso | sbraccio + 1,4 | 73 (60+13) | Q42 |
| Pedana punta braccio | sbraccio (65) | 30 | Q43 |

> Nota: i gruppi braccio 15 e 14 sono vuoti ("-"). I 13 gruppi attivi corrispondono ai moduli ELB13…ELB01.

### 3.2 Modulo parti traslanti e funi

| Voce | Massa [kg] | Cella |
|---|---|---|
| Carrello con solo tiro II | 430 | Q52 |
| Scatola carrello | 0 | Q53 |
| Carrello con tiro II e IV (= Q52+Q53+Q63) | 430 | — |
| Pedana carrello | 50 | Q55 |
| Fune sollevamento | 1,1 kg/m × 350 m | Q56, Q57 |
| Fune carrello | 0,348 kg/m × 230 m | Q59, Q60 |
| Bozzello e gancio (solo tiro II) | 310 | Q62 |
| Asta per tiro IV | 0 | Q63 |
| Gancio II | 40 | Q64 |
| Gancio II/IV | 40 | Q65 |
| Bozzello, gancio e asta (II/IV) | 310 | Q66 |

### 3.3 Modulo rotazione centrale

| Voce | x [m] | Massa [kg] |
|---|---|---|
| Gruppo rotazione centrale 1700 | 0 | 4530 |
| Gruppo rotazione centrale 2050 | 0 | 5548 |
| Pedane portaralla | 0 | 485 |
| Cabina | 0 | 810 |
| Argano rotazione | 0 | 435 |
| Quadro elettrico | 0 | 215 |

### 3.4 Modulo controbraccio

| Voce | x [m] | Massa [kg] |
|---|---|---|
| Gruppo controbraccio | −7,1 | 4085 |
| Tiranti controbraccio (totale) | −4,46 | 1695 |
| Parapetti | −5,46 | 0 |
| Cartelloni | −9,24 | 0 |

### 3.5 Zavorre di volata

Parametri fisici: blocco **A** = 3120 kg (largh. 0,4 m × h 3,55 m), blocco **B** = 1560 kg
(largh. 0,2 m × h 3,55 m), 2 spine/blocco da 4,3 kg, distanza asse→primo blocco = 9,556 m.

Configurazioni **in esercizio** (derivata 0…7):

| Derivata | n° blocchi A | n° blocchi B |
|---|---|---|
| 0 | 8 | 1 |
| 1 | 8 | 0 |
| 2 | 7 | 1 |
| 3 | 7 | 0 |
| 4 | 5 | 0 |
| 5 | 4 | 0 |
| 6 | 3 | 1 |
| 7 | 3 | 0 |

Configurazioni **per il montaggio** (derivata 0…7): (4,0)(4,0)(3,0)(2,0)(2,0)(0,2)(0,2)(0,1).

> `Massa_zavorra = nA·(3120 + 2·4,3) + nB·(1560 + 2·4,3)`
> `x_zavorra = −(9,556 + (nA·0,4 + nB·0,2)/2)`

### 3.6 Zavorre di base

| Voce | Valore |
|---|---|
| Massa blocco zavorra carro base 3,8×3,8 | 3000 kg |
| Massa blocco zavorra carro base 4,5×4,5 | 3500 kg |
| "Altezza/Larghezza/Lunghezza zavorra di volata" (Q176/177/178) | 0,29 / 1,2 / 4,4 (etichette da chiarire) |
| Baricentro punta mobile oltre escursione max | 1,4 m (P180) |

---

## 4. Geometria braccio (`Geometria_braccio`)

13 moduli ELB, ciascuno con sezione **triangolare**. Tutti i valori sono **input** in mm.
Per ogni modulo: `Ivs` (interasse vert. sx), `Ivd` (interasse vert. dx), `Io` (interasse orizz.),
`p1,p2,p3` (passi), `θ` (inclinazione), `L_CI` (corrente inferiore), `L_CS` (corrente superiore).

| Modulo | Ivs | Ivd | Io | p1 | p2 | p3 | θ [°] | CI (profilo) | CS (profilo) |
|---|---|---|---|---|---|---|---|---|---|
| ELB13 | 1940 | 1940 | 1040 | 1750 | 1750 | 1750 | 76,76 | □160×160×16 | Ø130 |
| ELB12 | 1940 | 1940 | 1060 | 1666 | 1667 | 1667 | 76,76 | □160×160×14,2 | Ø120 |
| ELB11 | 1940 | 1940 | 1060 | 1666 | 1667 | 1667 | 77 | □150×150×12,5 | Ø110 |
| ELB10 | 1940 | 1940 | 1080 | 1666 | 1667 | 1667 | 76,76 | □130×130×14,2 | Ø100 |
| ELB09 | 1940 | 1940 | 1080 | 1666 | 1667 | 1667 | 75,57 | □120×120×12,5 | Ø90 |
| ELB08 | 1940 | 1940 | 1080 | 1666 | 1667 | 1667 | 76 | □120×120×10 | Ø80 |
| ELB07 | 1940 | 1940 | 1100 | 1666 | 1667 | 1667 | 75,57 | □100×100×10 | Ø75 |
| ELB06 | 1940 | 1480 | 1120 | 1666 | 1667 | 1667 | 70,537 | 100×100×8+p80×10 | Ø70 |
| ELB05 | 1480 | 1480 | 1120 | 1666 | 1667 | 1667 | 70,537 | □80×80×10 | Ø70 |
| ELB04 | 1480 | 1480 | 1120 | 1666 | 1667 | 1667 | 70,537 | □80×80×7 | Ø55 |
| ELB03 | 1480 | 1480 | 1120 | 1666 | 1667 | 1667 | 70,537 | □80×80×7 | Ø50 |
| ELB02 | 1480 | 1150 | 1120 | 1666 | 1667 | 1667 | 65,354 | □80×80×4 | Ø40 |
| ELB01 | 1150 | 1150 | 1120 | 1666 | 1667 | 1667 | 64,85 | □80×80×4 | Ø35 |

Le lunghezze delle aste di parete `dv1…dv7`, `do1…do7` sono **formule** sulla geometria.
I profili (`C.I.`, `C.S.`, `dv*`, `do*`) si risolvono tramite `Proprietà_beam` (area/sezione).

---

## 5. Superfici esposte al vento (`A_b`, `A_rc`, `A_cb`, `A_Pu`)

Approccio **misto**:
- **Calcolate** (formula UNI EN 13001‑2 App. A): modulo **braccio** `A_b`.
- **Input manuali** (misure CAD, attendibili): modulo **ralla/rotazione** `A_rc`,
  modulo **controbraccio** `A_cb`, geometria/aggiunte del braccio.

### 5.1 `A_b` — Braccio (calcolato + pochi input)

Calcolo per ogni modulo ELB di: area proiettata dei profili, coeff. di schermatura `η`
(interpolazione `FORECAST.LINEAR` sulla tabella `a/d – ϕ`), `Ca = C0·Ψ`, `A·Ca`.
Input manuali:

| Voce | Cella | Valore |
|---|---|---|
| Elemento aggiuntivo ELB13 | T25 | 1,01 |
| n° sezioni ripetute (tutti i moduli) | AK30, AK56, … | 7 |
| Area aggiuntiva "Argano soll." | AK38 | 1 |
| Area aggiuntiva "Argano carr." | AK64 | 0,7 |
| Ψ (assunto, da grafico) | X32, X58, … | 1 |
| Ca parti traslanti parallele | X356/361/366/371 | 1,7 |

> Nota del foglio: le aree calcolate **vanno verificate** con le aree effettive da disegno.

### 5.2 `A_rc` — Rotazione centrale / ralla (input manuale)

Aree esposte (`R`), coeff. `Ψ`, `C0`, tutte input; ortogonali e parallele.
Esempi: Cuspide 2050 = 1,503 m²; Cuspide 1700 = 1,503 m²; Ralla = 0,1×1,4;
Porta ralla inferiore 2050 = 1,8×0,7; Cabina = 2×1,8 (3,775 in parallelo); Quadro = 2×1,6.
`C0` = 1,7 (strutture) / 1,1 (cabina, quadro).

### 5.3 `A_cb` — Controbraccio (input manuale)

Ortogonali: Trave cb1 = 2,33, cb2 = 2,64, Tirante = 4,62/2, Parapetti = 1,02, Cartellone = 1,25
(Ca da `Ψ·C0`). Zavorra di volata = formula sui blocchi (area × C0). Parallele:
Zavorre = 3,55 (Ca 1,7); Carpenteria = 3,0 (Ca 1,7). Con/senza zavorra a seconda della derivata.

### 5.4 `A_Pu` — Carico utile (input manuale)

Per il carico sollevato: sup. esposta e `Ca = 2,5`; centro di spinta `Ycs = −1,45`.
Il foglio dichiara in nota **0,5 m²/t**, ma le celle usano **1 m²/t** (→ punto aperto, §7).

### 5.5 Centri di spinta (foglio `Vento`, y)

| Parte | Ycs [m] |
|---|---|
| Braccio | 0,73 + 2/2 = **1,73** |
| Parti traslanti (carrello, bozzello) | −1 |
| Carico utile | −1,45 |
| Rotazione centrale | 1 |
| Controbraccio struttura | 0,85 |
| Controbraccio tiranti | 1,28 + 1,4/2 = 1,98 |
| Controbraccio zavorra di volata | 0,52 |

---

## 6. Sintesi: input vs calcolato

| Dato | Origine |
|---|---|
| Caratteristiche macchina | **input** |
| Masse e baricentri parte aerea | **input** |
| Geometria moduli ELB (interassi, passi, θ, profili) | **input** |
| Lunghezze aste parete (dv/do) | calcolo su geometria |
| Superfici `A_rc`, `A_cb`, `A_Pu` | **input (CAD)** |
| Superfici `A_b` | calcolo EN 13001‑2 + input puntuali |
| Centri di spinta | **input** |
| Coefficienti vento/inerzia/deformata | input (spec 03) |

---

## 7. Punti aperti da confermare

1. **Carico utile**: `A_Pu` dichiara 0,5 m²/t a testo ma usa **1 m²/t** nelle celle. Quale è corretto?
2. **Numero derivate**: braccio 7 (0…6) ma zavorre di volata 8 (0…7). Come mappano fra loro?
3. **Zavorre di base**: KG 26.5 usa il carro **4,5×4,5** (S22 = 4,5) → blocco 3500 kg? Le celle Q176/177/178 ("zavorra di volata") nel modulo base vanno chiarite.
4. **Fune di sollevamento**: lunghezza 350 m fissa o dipendente dall'altezza della torre?
5. **Effetto inerziale**: nota in `Foglio1` ("Rivedere calcolo effetti inerziali sul sollevamento… con 10 t il momento +10% è molto alto") — da tenere presente in Fase 2.

---

## 8. Validazione

`docs/motore/rif_xlsm.json` contiene i valori cache cella‑per‑cella dei fogli di input e di
calcolo. Ogni grandezza implementata verrà confrontata con questi valori (tolleranza da definire),
così da rendere l'attendibilità **misurabile** passo dopo passo.

**Prossima spec (02):** Parte aerea → carichi alla ralla (baricentri, momenti `MR/MA/MB`,
spinte vento, combinazione). **Spec 03:** torre per ogni altezza → carichi base e zavorre `Zb`.
