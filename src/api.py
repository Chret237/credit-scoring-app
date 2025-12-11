from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
from pathlib import Path
import io
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
import json

# Initialiser la DB (si pas encore créée)
def init_db():
    conn = sqlite3.connect("historique.db")
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date_prediction TEXT,
        age INT,
        sexe TEXT,
        situation_familiale TEXT,
        type_contrat TEXT,
        type_credit TEXT,
        montant_credit REAL,
        revenu_mensuel REAL,
        duree_mois INT,
        prediction INT,
        proba REAL,
        seuil REAL
    )
    """)
    conn.commit()
    conn.close()

def load_db():
    conn = sqlite3.connect("historique.db")
    df = pd.read_sql_query("SELECT * FROM predictions", conn)
    conn.close()
    return df

def compute_all_stats():
    df = load_db()

    stats = {}

    # Statistiques générales
    stats["nb_predictions"] = len(df)
    stats["taux_defaut"] = float(df["prediction"].mean())
    stats["proba_moyenne"] = float(df["proba"].mean())
    stats["proba_mediane"] = float(df["proba"].median())

    # Stats temporelles
    df["date_prediction"] = pd.to_datetime(df["date_prediction"])
    daily = df.groupby(df["date_prediction"].dt.date).size()

    stats["predictions_par_jour"] = {
        "dates": daily.index.astype(str).tolist(),
        "counts": daily.values.tolist()
    }

    # Sauvegarde dans un fichier JSON
    with open("stats_cache.json", "w") as f:
        json.dump(stats, f)

    print("📊 Statistiques recalculées automatiquement.")
    return stats



# Chemins absolus basés sur le répertoire du fichier
BASE_DIR = Path(__file__).parent.parent
MODELS_DIR = BASE_DIR / "models"

# Charger le modèle et le seuil
model_path = MODELS_DIR / "modele_risque_defaut.pkl"
seuil_path = MODELS_DIR / "seuil_optimal.pkl"

pipeline = joblib.load(str(model_path))
SEUIL_OPTIMAL = joblib.load(str(seuil_path)) if seuil_path.exists() else 0.5

scheduler = BackgroundScheduler()
scheduler.add_job(compute_all_stats, "interval", minutes=5)
scheduler.start()

# Création de l'application FastAPI
app = FastAPI(title="API de Prédiction du Risque de Défaut")

templates = Jinja2Templates(directory="templates")

# Définition du schéma d'entrée
class ClientData(BaseModel):
  age: float
  sexe: str
  situation_familiale: str
  revenu_mensuel: float
  type_contrat_travail: str
  anciennete_travail_mois: int
  montant_credit: float
  duree_mois: int
  taux_interet: float
  type_credit: str
  nb_retards_30j: int
  nb_retards_60j: int
  nb_retards_90j: int
  taux_endettement: float
  ratio_dette_revenu: float

# Autoriser ton frontend (React sur Vite par exemple)
origins = [
    "http://localhost:5173",  # port de Vite par défaut
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # autorise POST, GET, OPTIONS...
    allow_headers=["*"],
)

# Fonction prédiction
def predict_client(features_dict):
    df = pd.DataFrame([features_dict])
    proba = pipeline.predict_proba(df)[:, 1][0]
    prediction = int(proba >= SEUIL_OPTIMAL)

    return {
        "prediction": prediction,
        "probabilite_defaut": float(proba),
        "seuil_utilise": SEUIL_OPTIMAL
    }

# Endpoint API
@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/predict")
def predict(data: ClientData):
    data_dict = data.dict()
    result = predict_client(data_dict)

    prediction = result["prediction"]
    prob = result["probabilite_defaut"]

    conn = sqlite3.connect("historique.db")
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO predictions (
        date_prediction, age, sexe, situation_familiale,
        type_contrat, type_credit, montant_credit,
        revenu_mensuel, duree_mois, prediction, proba, seuil
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        datetime.now().isoformat(),
        data.age,
        data.sexe,
        data.situation_familiale,
        data.type_contrat_travail,
        data.type_credit,
        data.montant_credit,
        data.revenu_mensuel,
        data.duree_mois,
        int(prediction),
        float(prob),
        SEUIL_OPTIMAL
    ))

    conn.commit()
    conn.close()

    return result

@app.post("/predict_file")
async def predict_file(file: UploadFile = File(...)):
    """
    Endpoint pour scorer un fichier CSV complet.
    Retourne un CSV contenant les probabilités et les prédictions.
    """

    # Lire le contenu du fichier uploadé
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))

    # Calcul des probabilités
    proba = pipeline.predict_proba(df)[:, 1]

    # Application du seuil
    predictions = (proba >= SEUIL_OPTIMAL).astype(int)

    # Ajouter les colonnes dans le DataFrame
    df["probabilite_defaut"] = proba
    df["prediction_defaut"] = predictions

    # Convertir en CSV pour renvoi
    output = io.StringIO()
    df.to_csv(output, index=False)
    output.seek(0)

    return {
        "filename": file.filename,
        "message": "Scoring effectué avec succès",
        "csv_result": output.getvalue()
    }

@app.post("/predict_file_download")
async def predict_file_download(file: UploadFile = File(...)):
    """
    Endpoint pour scorer un CSV et retourner un fichier CSV téléchargeable.
    """

    # Lire le fichier envoyé
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))

    # Probabilités de défaut
    proba = pipeline.predict_proba(df)[:, 1]

    # Prédictions selon le seuil
    predictions = (proba >= SEUIL_OPTIMAL).astype(int)

    # Ajouter les colonnes de scoring
    df["probabilite_defaut"] = proba
    df["prediction_defaut"] = predictions

    # Génération du CSV final
    output = io.StringIO()
    df.to_csv(output, index=False)
    output.seek(0)

    # Préparation de la réponse téléchargeable
    response = StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv"
    )

    response.headers["Content-Disposition"] = f"attachment; filename=scoring_{file.filename}"

    return response

@app.get("/stats/general")
def stats_general():
    df = load_db()

    nb_predictions = len(df)
    taux_defaut = df["prediction"].mean()
    proba_moyenne = df["proba"].mean()
    proba_mediane = df["proba"].median()

    return {
        "nb_predictions": nb_predictions,
        "taux_defaut": float(taux_defaut),
        "proba_moyenne": float(proba_moyenne),
        "proba_mediane": float(proba_mediane)
    }

@app.get("/stats/distribution_proba")
def distribution_proba():
    df = load_db()
    hist = np.histogram(df["proba"], bins=20)

    return {
        "bins": hist[1].tolist(),
        "counts": hist[0].tolist()
    }

@app.get("/stats/predictions_par_jour")
def stats_par_jour():
    df = load_db()
    df["date_prediction"] = pd.to_datetime(df["date_prediction"])
    daily = df.groupby(df["date_prediction"].dt.date).size()

    return {
        "dates": daily.index.astype(str).tolist(),
        "counts": daily.values.tolist()
    }

@app.get("/stats/par_variable/{col}")
def stats_par_variable(col: str):
    df = load_db()

    if col not in df.columns:
        return {"error": "colonne inexistante"}

    grouped = df.groupby(col)["prediction"].mean()

    return {
        "categorie": grouped.index.tolist(),
        "taux_defaut": [float(x) for x in grouped.values]
    }

@app.get("/stats/raw")
def raw_data():
    df = load_db()
    return df.to_dict(orient="records")

@app.get("/stats/cache")
def get_cached_stats():
    try:
        with open("stats_cache.json", "r") as f:
            data = json.load(f)
        return data
    except:
        return {"error": "stats_cache.json introuvable"}

init_db()
compute_all_stats()
