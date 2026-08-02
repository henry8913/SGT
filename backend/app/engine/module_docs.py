"""Documentazione dei moduli calcolati (categoria C).

Qui vivono, scritte a mano accanto all'implementazione Python di ogni step,
le formule in notazione leggibile mostrate nella pagina admin "Motore di calcolo".

Vincoli:
- Non è un motore di formule: il contenuto è solo testo esplicativo.
- La struttura reale del calcolo è nel codice di ogni step (step1..step8).
- Le correzioni si fanno nel codice con commit normale, mai da questa pagina.
"""

MODULE_DOCS = {
    "baricentri": {
        "nome": "Baricentri",
        "file": "backend/app/engine/step1_baricentri.py",
        "descrizione": "Centro di gravità della gru a partire dalle masse proprie (componenti utilizzati).",
        "campi": [
            {"campo": "total_mass", "formula": "total_mass = Σ massa_i  (solo componenti utilizzati)", "coefficienti": []},
            {"campo": "moment_x", "formula": "moment_x = Σ (massa_i × coordinata_x_i)", "coefficienti": []},
            {"campo": "moment_y", "formula": "moment_y = Σ (massa_i × coordinata_y_i)", "coefficienti": []},
            {"campo": "moment_z", "formula": "moment_z = Σ (massa_i × braccio_i)", "coefficienti": []},
            {"campo": "x_cg", "formula": "x_cg = moment_x / total_mass", "coefficienti": []},
            {"campo": "y_cg", "formula": "y_cg = moment_y / total_mass", "coefficienti": []},
            {"campo": "z_cg", "formula": "z_cg = moment_z / total_mass", "coefficienti": []},
        ],
    },
    "aree_vento": {
        "nome": "Aree vento",
        "file": "backend/app/engine/step3_aree_vento.py",
        "descrizione": "Aree esposte al vento per le quattro parti della gru, sommando le aree per parte.",
        "campi": [
            {"campo": "a_b", "formula": "a_b = Σ valori aree con parte = 'braccio'", "coefficienti": []},
            {"campo": "a_rc", "formula": "a_rc = Σ valori aree con parte = 'rotazione'", "coefficienti": []},
            {"campo": "a_cb", "formula": "a_cb = Σ valori aree con parte = 'controbraccio'", "coefficienti": []},
            {"campo": "a_pu", "formula": "a_pu = Σ valori aree con parte = 'carico'", "coefficienti": []},
            {"campo": "xcs_total", "formula": "xcs_total = Σ coordinata_x di tutte le aree", "coefficienti": []},
            {"campo": "ycs_total", "formula": "ycs_total = Σ coordinata_y di tutte le aree", "coefficienti": []},
        ],
    },
    "vento": {
        "nome": "Vento",
        "file": "backend/app/engine/step4_vento.py",
        "descrizione": "Forze del vento e momento ribaltante del vento, usando la pressione normativa.",
        "campi": [
            {"campo": "p_norma", "formula": "p_norma = q_riferimento × fattore_altezza(h)", "coefficienti": ["q_riferimento", "fattore_h20", "fattore_h50", "fattore_h100"]},
            {"campo": "fw_braccio", "formula": "fw_braccio = a_b × p_norma", "coefficienti": []},
            {"campo": "fw_rotazione", "formula": "fw_rotazione = a_rc × p_norma", "coefficienti": []},
            {"campo": "fw_controbraccio", "formula": "fw_controbraccio = a_cb × p_norma", "coefficienti": []},
            {"campo": "fw_carico", "formula": "fw_carico = a_pu × p_norma", "coefficienti": []},
            {"campo": "fw_total", "formula": "fw_total = fw_braccio + fw_rotazione + fw_controbraccio + fw_carico", "coefficienti": []},
            {"campo": "moment_wind", "formula": "moment_wind = fw_total × altezza × fattore_momento_braccio", "coefficienti": ["fattore_momento_braccio"]},
        ],
    },
    "stabilita_q": {
        "nome": "Stabilità C25-Q",
        "file": "backend/app/engine/step5_stabilita_q.py",
        "descrizione": "Verifica di stabilità in configurazione quadrata per le 12 condizioni P01..P12.",
        "campi": [
            {"campo": "v", "formula": "v = peso_proprio (carico verticale)", "coefficienti": ["peso_proprio"]},
            {"campo": "mr", "formula": "mr = momento_stabilizzante", "coefficienti": ["momento_stabilizzante"]},
            {"campo": "mw", "formula": "mw = momento_vento", "coefficienti": ["momento_vento"]},
            {"campo": "mtot", "formula": "mtot = mr + mw", "coefficienti": []},
            {"campo": "t", "formula": "t = v × coefficiente_attrito", "coefficienti": ["coefficiente_attrito"]},
            {"campo": "safety_coefficient", "formula": "safety_coefficient = v / (mw + 1)", "coefficienti": []},
            {"campo": "esito", "formula": "esito = OK se safety_coefficient ≥ soglia_sicurezza, altrimenti KO", "coefficienti": ["soglia_sicurezza"]},
        ],
    },
    "stabilita_d": {
        "nome": "Stabilità C25-D",
        "file": "backend/app/engine/step6_stabilita_d.py",
        "descrizione": "Verifica di stabilità in configurazione diagonale per le 12 condizioni P01..P12.",
        "campi": [
            {"campo": "v", "formula": "v = peso_proprio (carico verticale)", "coefficienti": ["peso_proprio"]},
            {"campo": "mr", "formula": "mr = momento_stabilizzante", "coefficienti": ["momento_stabilizzante"]},
            {"campo": "mw", "formula": "mw = momento_vento", "coefficienti": ["momento_vento"]},
            {"campo": "mtot", "formula": "mtot = mr + mw", "coefficienti": []},
            {"campo": "t", "formula": "t = v × coefficiente_attrito", "coefficienti": ["coefficiente_attrito"]},
            {"campo": "safety_coefficient", "formula": "safety_coefficient = v / (mw + 1)", "coefficienti": []},
            {"campo": "esito", "formula": "esito = OK se safety_coefficient ≥ soglia_sicurezza, altrimenti KO", "coefficienti": ["soglia_sicurezza"]},
        ],
    },
    "curve_carico": {
        "nome": "Curve di carico",
        "file": "backend/app/engine/step2_curve_carico.py",
        "descrizione": "Curve di carico massime per raggio, ordinate per raggio crescente.",
        "campi": [
            {"campo": "raggio", "formula": "raggio = raggio della curva (m)", "coefficienti": []},
            {"campo": "carico_max", "formula": "carico_max = carico massimo sollevabile (kg) — dato di input della curva", "coefficienti": []},
        ],
    },
    "carichi_ralla": {
        "nome": "Carichi ralla e base",
        "file": "backend/app/engine/step7_carichi_ralla.py",
        "descrizione": "Verifica dei carichi sulla ralla per le condizioni P01, P02, P03.",
        "campi": [
            {"campo": "v", "formula": "v = peso_proprio (carico verticale)", "coefficienti": ["peso_proprio"]},
            {"campo": "mr", "formula": "mr = momento_stabilizzante", "coefficienti": ["momento_stabilizzante"]},
            {"campo": "mw", "formula": "mw = momento_vento", "coefficienti": ["momento_vento"]},
            {"campo": "mtot", "formula": "mtot = mr + mw", "coefficienti": []},
            {"campo": "t", "formula": "t = v × coefficiente_attrito", "coefficienti": ["coefficiente_attrito"]},
            {"campo": "mtot_out_in_ratio", "formula": "mtot_out_in_ratio = mtot / mr", "coefficienti": []},
        ],
    },
    "diagramma": {
        "nome": "Diagramma di carico",
        "file": "backend/app/engine/step8_diagramma.py",
        "descrizione": "Diagramma carico/raggio con fattore di riduzione per raggio e massa totale.",
        "campi": [
            {"campo": "raggio", "formula": "raggio = raggio del punto (m)", "coefficienti": []},
            {"campo": "carico_max", "formula": "carico_max = carico massimo dalla curva (kg)", "coefficienti": []},
            {"campo": "carico_effettivo", "formula": "carico_effettivo = carico_max × max(fattore_minimo, 1 − (raggio/raggio_max) × coeff_riduzione) × (1 − totale_masse/massa_max)", "coefficienti": ["raggio_max", "coefficiente_riduzione_raggio", "massa_max", "fattore_minimo"]},
        ],
    },
}
