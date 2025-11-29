import streamlit as st
import requests
import pandas as pd

API_URL = "http://127.0.0.1:8000"

st.set_page_config(page_title="Risque de Défaut", layout="wide")

st.title("Application de Prédiction du Risque de Défaut")
st.write("Interface Streamlit connectée à l'API FastAPI")

# ----------------------------------------------------
# 1. FORMULAIRE DE SCORING INDIVIDUEL
# ----------------------------------------------------
st.header("Prédiction individuelle")

with st.form("form_client"):
    age = st.number_input("Âge", 18, 80, 30)
    sexe = st.selectbox("Sexe", ["H", "F"])
    situation_familiale = st.selectbox("Situation familiale", ["celibataire", "marie", "divorce"])
    revenu_mensuel = st.number_input("Revenu mensuel (FCFA)", 0, 3000000, 200000)
    type_contrat_travail = st.selectbox("Type de contrat", ["CDI", "CDD", "Informel","Independant"])
    anciennete_travail_mois = st.number_input("Ancienneté au travail (mois)", 0, 600, 12)
    montant_credit = st.number_input("Montant du crédit", 0, 10000000, 1000000)
    duree_mois = st.number_input("Durée du crédit (mois)", 1, 12, 12)
    taux_interet = st.number_input("Taux d'intérêt (%)", 0.0, 100.0, 5.0)
    type_credit = st.selectbox("Type de crédit", ["conso", "immobilier", "auto", "scolaire", "autre"])
    nb_retards_30j = st.number_input("Nombre de retards sur 30j", 0, 30, 0)
    nb_retards_60j = st.number_input("Nombre de retards sur 60j", 0, 60, 0)
    nb_retards_90j = st.number_input("Nombre de retards sur 90j", 0, 90, 0)
    taux_endettement = st.number_input("Taux d'endettement (%)", 0.0, 100.0, 0.0)
    ratio_dette_revenu = st.number_input("Ratio dette/revenu", 0.0, 100.0, 0.0)
    
    submit = st.form_submit_button("Prédire")

if submit:
    client_data = {
        "age": age,
        "sexe": sexe,
        "situation_familiale": situation_familiale,
        "revenu_mensuel": revenu_mensuel,
        "type_contrat_travail": type_contrat_travail,
        "anciennete_travail_mois": anciennete_travail_mois,
        "montant_credit": montant_credit,
        "duree_mois": duree_mois,
        "taux_interet": taux_interet,
        "type_credit": type_credit,
        "nb_retards_30j": nb_retards_30j,
        "nb_retards_60j": nb_retards_60j,
        "nb_retards_90j": nb_retards_90j,
        "taux_endettement": taux_endettement,
        "ratio_dette_revenu": ratio_dette_revenu
    }

    response = requests.post(f"{API_URL}/predict", json=client_data)

    if response.status_code == 200:
        result = response.json()
        st.success(f"Prédiction : {'❌ Défaut' if result['prediction']==1 else '✔️ Pas de défaut'}")
        st.info(f"Probabilité de défaut : {result['probabilite_defaut']:.2f}")
    else:
        st.error(f"Erreur lors de la requête API: {response.text}")


# ----------------------------------------------------
# 2. SCORING DE FICHIER CSV
# ----------------------------------------------------
st.header("Prédiction sur fichier CSV")

file = st.file_uploader("Uploader un fichier CSV", type=["csv"])

if file:
    st.write("Aperçu du fichier :")
    df = pd.read_csv(file)
    st.dataframe(df.head())

    if st.button("Lancer le scoring CSV"):
        files = {"file": (file.name, file.getvalue(), "text/csv")}
        response = requests.post(f"{API_URL}/predict_file_download", files=files)

        if response.status_code == 200:
            st.success("Scoring effectué ! Téléchargez le fichier ci-dessous :")
            st.download_button(
                label="⬇️ Télécharger le fichier scoré",
                data=response.content,
                file_name="resultat_scoring.csv",
                mime="text/csv"
            )
        else:
            st.error("Erreur API lors du scoring CSV")
