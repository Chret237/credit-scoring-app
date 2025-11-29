from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import joblib
import pandas as pd
from pathlib import Path
import io
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi import Request


# Chemins absolus basés sur le répertoire du fichier
BASE_DIR = Path(__file__).parent.parent
MODELS_DIR = BASE_DIR / "models"

# Charger le modèle et le seuil
model_path = MODELS_DIR / "modele_risque_defaut.pkl"
seuil_path = MODELS_DIR / "seuil_optimal.pkl"

pipeline = joblib.load(str(model_path))
SEUIL_OPTIMAL = joblib.load(str(seuil_path)) if seuil_path.exists() else 0.5

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

