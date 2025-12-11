import streamlit as st
import requests
import pandas as pd
import shap
import matplotlib.pyplot as plt
import joblib

API_URL = "http://127.0.0.1:8000"

st.set_page_config(page_title="Risque de Défaut", layout="wide")

st.title("Application de Prédiction du Risque de Défaut")
st.write("Interface Streamlit connectée à l'API FastAPI")

def generate_textual_explanations(shap_values, feature_names, top_k=11):
    """
    Génère un commentaire textuel basé sur les contributions SHAP.
    Retourne deux listes :
    - facteurs augmentant le risque
    - facteurs réduisant le risque
    """

    shap_array = shap_values[0].values

    pairs = list(zip(feature_names, shap_array))

    # Trier par importance absolue
    pairs_sorted = sorted(pairs, key=lambda x: abs(x[1]), reverse=True)

    increasing_risk = []
    decreasing_risk = []

    for name, value in pairs_sorted[:top_k]:

        clean_name = name.replace("categorical__", "").replace("numerical__", "")
        clean_name = clean_name.replace("_", " ").capitalize()

        if value > 0:
            increasing_risk.append(
                f"**{clean_name}** augmente le risque (+{value})."
            )
        else:
            decreasing_risk.append(
                f"**{clean_name}** réduit le risque ({value})."
            )

    return increasing_risk, decreasing_risk

def generate_summary(shap_values, feature_names, prediction):
    """
    Génère un résumé automatique basé sur les contributions SHAP et la prédiction.
    """

    shap_array = shap_values[0].values
    pairs = list(zip(feature_names, shap_array))

    # Trier par importance absolue
    sorted_pairs = sorted(pairs, key=lambda x: abs(x[1]), reverse=True)

    # Séparer facteurs augmentant / réduisant le risque
    risq_plus = [name for name, val in sorted_pairs if val > 0][:3]
    risq_minus = [name for name, val in sorted_pairs if val < 0][:3]

    # Reformater noms
    def clean(f):
        return f.replace("categorical__", "").replace("numerical__", "").replace("_", " ").capitalize()

    risq_plus = [clean(f) for f in risq_plus]
    risq_minus = [clean(f) for f in risq_minus]

    # Résumé selon la prédiction du modèle
    if prediction == 1:
        summary = (
            f"**Ce client présente un risque élevé principalement en raison de** : "
            f"{', '.join(risq_plus)}. "
            f"**Certains facteurs comme** {', '.join(risq_minus)} **réduisent légèrement le risque,** "
            f"**mais ils sont insuffisants pour inverser la tendance.**"
        )
    else:
        summary = (
            f"**Ce client présente un profil globalement rassurant grâce aux données des champs suivants :** "
            f"{', '.join(risq_minus)}. "
            f"**Cependant,** {', '.join(risq_plus)} **augmentent légèrement le risque,** "
            f"**mais restent dominés par les facteurs positifs.**"
        )

    return summary



# ----------------------------------------------------
# 1. FORMULAIRE DE SCORING INDIVIDUEL
# ----------------------------------------------------
st.header("Prédiction individuelle")

with st.form("form_client"):
    age = st.number_input("Âge", 18, 75, 30)
    sexe = st.selectbox("Sexe", ["H", "F"])
    situation_familiale = st.selectbox("Situation familiale", ["celibataire", "marie", "divorce"])
    revenu_mensuel = st.number_input("Revenu mensuel (FCFA)", 30000, 10000000, 300000)
    type_contrat_travail = st.selectbox("Type de contrat", ["CDI", "CDD", "Informel","Independant"])
    anciennete_travail_mois = st.number_input("Ancienneté au travail (mois)", 0, 480, 12)
    montant_credit = st.number_input("Montant du crédit", 10000, 100000000, 1000000)
    duree_mois = st.number_input("Durée du crédit (mois)", 6, 360, 12)
    taux_interet = st.number_input("Taux d'intérêt (%)", 1.0, 25.0, 5.0)
    type_credit = st.selectbox("Type de crédit", ["conso", "immobilier", "auto", "scolaire"])
    nb_retards_30j = st.number_input("Nombre de retards sur 30j", 0, 10, 0)
    nb_retards_60j = st.number_input("Nombre de retards sur 60j", 0, 10, 0)
    nb_retards_90j = st.number_input("Nombre de retards sur 90j", 0, 10, 0)
    taux_endettement = st.number_input("Taux d'endettement (%)", 0.0, 60.0, 5.0)
    ratio_dette_revenu = st.number_input("Ratio dette/revenu", 0.0, 2.0, 0.4)
    
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
        st.info(f"Client {'à risque **élevé**' if result['prediction']==1 else 'à risque **faible**'} : **{result['probabilite_defaut']*100:.2f}%** de probabilité de faire défaut.")

        prediction = result["prediction"]
        prob = result["probabilite_defaut"]


        st.subheader("Explication de la prédiction")

        try:
            # Charger pipeline
            pipeline = joblib.load("./models/modele_risque_defaut.pkl")
            preprocessor = pipeline.named_steps["preprocess"]
            model = pipeline.named_steps["model"]

            # Convertir client en DataFrame
            df_client = pd.DataFrame([client_data])

            # Transformer les features du client
            X_client_prepared = preprocessor.transform(df_client)

            # Construire un "background dataset" pour SHAP
            # IMPORTANT : on prend un petit échantillon des données réelles
            background_raw = df_client.sample(100, random_state=42, replace=True)
            background_prepared = preprocessor.transform(background_raw)

            # Nouveau masker selon SHAP (remplace feature_perturbation)
            masker = shap.maskers.Independent(background_prepared)

            # Nouveau LinearExplainer
            explainer = shap.LinearExplainer(model, masker=masker)
            shap_values = explainer(X_client_prepared)

            # Récupération des noms de features transformées
            feature_names = preprocessor.get_feature_names_out()

            # Générer explications textuelles
            # pos, neg = generate_textual_explanations(shap_values, feature_names)

            # col1, col2 = st.columns(2)

            # with col1:
            #     st.markdown("#### Facteurs augmentant le risque")
            #     for p in pos:
            #         st.warning(p)

            # with col2:
            #     st.markdown("#### Facteurs réduisant le risque")
            #     for n in neg:
            #         st.success(n)

            # st.subheader("Résumé de l'analyse")
            summary = generate_summary(shap_values, feature_names, prediction)
            st.info(summary)


            # # Affichage waterfall sans erreur
            # st.subheader("Explication SHAP (waterfall)")

            # fig, ax = plt.subplots(figsize=(10, 6))
            # shap.plots.waterfall(shap_values[0], max_display=15, show=False)
            # st.pyplot(fig)

        except Exception as e:
            st.error(f"Impossible de générer l'explication SHAP : {e}")


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
