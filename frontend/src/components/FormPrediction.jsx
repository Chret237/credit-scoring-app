import React, { useState } from "react";
import axios from "axios";

const FormPrediction = ({
  setPrediction,
  setProbabilite,
  setIsCame,
  isCame,
  prediction,
  probabilite,
}) => {
  const [formData, setFormData] = useState({
    age: "",
    sexe: "",
    situation_familiale: "",
    revenu_mensuel: "",
    type_contrat_travail: "",
    anciennete_travail_mois: "",
    montant_credit: "",
    duree_mois: "",
    taux_interet: "",
    type_credit: "",
    nb_retards_30j: "",
    nb_retards_60j: "",
    nb_retards_90j: "",
    taux_endettement: "",
    ratio_dette_revenu: "",
  });
  const requiredFields = [
    "age",
    "sexe",
    "situation_familiale",
    "revenu_mensuel",
    "type_contrat_travail",
    "anciennete_travail_mois",
    "montant_credit",
    "duree_mois",
    "taux_interet",
  ];

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Vérification des champs obligatoires
    const emptyFields = requiredFields.filter((f) => !formData[f]);
    if (emptyFields.length > 0) {
      setError(`Veuillez remplir tous les champs obligatoires`);
      return;
    }
    console.log("Données du formulaire :", formData);
    // ici tu peux appeler ton API pour prédire le risque
    setError("");
    axios
      .post("http://127.0.0.1:8000/predict", formData)
      .then((res) => {
        setIsCame(true);
        setPrediction(res.data.prediction);
        setProbabilite(res.data.probabilite_defaut);
        console.log(res.data.prediction, res.data.probabilite_defaut);
      })
      .catch((err) => {
        if (err.response) {
          alert(err.response.data.error);
        } else {
          setError("Erreur de connexion au serveur");
        }
      });
  };

  return (
    <div>
      <form className=" p-6 w-full" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center">Formulaire client</h2>
        <p className="text-center mt-2 text-[12px] opacity-90">
          Entrez des informations enfin de prédire le risque
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {/* Age */}
          <div>
            <label className="block mb-1">Âge</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#24242C] focus:outline-none"
            />
          </div>

          {/* Sexe */}
          <div>
            <label className="block mb-1">Sexe</label>
            <select
              name="sexe"
              className="w-full p-2 rounded bg-[#24242C] focus:outline-none"
              value={formData.sexe}
              onChange={handleChange}
            >
              <option value="">Sélectionnez</option>
              <option value="H">Homme</option>
              <option value="F">Femme</option>
            </select>
          </div>

          {/* Situation familiale */}
          <div>
            <label className="block mb-1">Situation Familiale</label>
            <select
              name="situation_familiale"
              value={formData.situation_familiale}
              onChange={handleChange}
              className=" w-full p-2 rounded bg-[#24242C] focus:outline-none"
            >
              <option value="">Sélectionnez</option>
              <option value="celibataire">Célibataire</option>
              <option value="marie">Marié(e)</option>
              <option value="divorce">Divorcé(e)</option>
            </select>
          </div>

          {/* Revenu mensuel */}
          <div>
            <label className="block mb-1">Revenu Mensuel (FCFA)</label>
            <input
              type="number"
              name="revenu_mensuel"
              className="w-full p-2 rounded bg-[#24242C] focus:outline-none"
              value={formData.revenu_mensuel}
              onChange={handleChange}
            />
          </div>

          {/* Type de contrat de travail */}
          <div>
            <label className="block mb-1">Type de Contrat Travail</label>
            <input
              type="text"
              name="type_contrat_travail"
              value={formData.type_contrat_travail}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#24242C] focus:outline-none"
              placeholder="CDD, CDI, Informel, Independant"
            />
          </div>

          {/* Ancienneté en mois */}
          <div>
            <label className="block mb-1">Ancienneté Travail (mois)</label>
            <input
              type="number"
              name="anciennete_travail_mois"
              value={formData.anciennete_travail_mois}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#24242C] focus:outline-none"
            />
          </div>

          {/* Montant crédit */}
          <div>
            <label className="block mb-1">Montant Crédit (FCFA)</label>
            <input
              type="number"
              name="montant_credit"
              value={formData.montant_credit}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#24242C] focus:outline-none"
            />
          </div>

          {/* Durée crédit */}
          <div>
            <label className="block mb-1">Durée Crédit (mois)</label>
            <input
              type="number"
              name="duree_mois"
              value={formData.duree_mois}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#24242C] focus:outline-none"
            />
          </div>

          {/* Taux intérêt */}
          <div>
            <label className="block mb-1">Taux Intérêt (%)</label>
            <input
              type="number"
              value={formData.taux_interet}
              onChange={handleChange}
              name="taux_interet"
              className="w-full p-2 rounded bg-[#24242C] focus:outline-none"
            />
          </div>

          {/* Type crédit */}
          {/*<div>
            <label className="block mb-1">Type Crédit</label>
            <input
              type="text"
              name="type_credit"
              value={formData.type_credit}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#24242C] focus:outline-none"
            />
          </div>*/}
          <div>
            <label className="block mb-1">Type Crédit</label>
            <select
              name="type_credit"
              value={formData.type_credit}
              onChange={handleChange}
              className=" w-full p-2 rounded bg-[#24242C] focus:outline-none"
            >
              <option value="">Sélectionnez</option>
              <option value="conso">Conso</option>
              <option value="immobilier">Immobilier</option>
              <option value="auto">Auto</option>
              <option value="scolaire">Scolaire</option>
            </select>
          </div>

          {/* Retards 30j */}
          <div>
            <label className="block mb-1">Nb Retards 30j</label>
            <input
              type="number"
              name="nb_retards_30j"
              value={formData.nb_retards_30j}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#24242C] focus:outline-none"
            />
          </div>

          {/* Retards 60j */}
          <div>
            <label className="block mb-1">Nb Retards 60j</label>
            <input
              type="number"
              name="nb_retards_60j"
              value={formData.nb_retards_60j}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#24242C] focus:outline-none"
            />
          </div>

          {/* Retards 90j */}
          <div>
            <label className="block mb-1">Nb Retards 90j</label>
            <input
              type="number"
              name="nb_retards_90j"
              value={formData.nb_retards_90j}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#24242C] focus:outline-none"
            />
          </div>

          {/* Taux endettement */}
          <div>
            <label className="block mb-1">Taux Endettement (%)</label>
            <input
              type="number"
              step="0.01"
              value={formData.taux_endettement}
              onChange={handleChange}
              name="taux_endettement"
              className="w-full p-2 rounded bg-[#24242C] focus:outline-none"
            />
          </div>

          {/* Ratio dette/revenu */}
          <div>
            <label className="block mb-1">Ratio Dette/Revenu</label>
            <input
              type="number"
              step="0.01"
              name="ratio_dette_revenu"
              value={formData.ratio_dette_revenu}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#24242C] focus:outline-none"
            />
          </div>
        </div>
        {error && <p className="text-red-500 font-semibold mt-2 mb-2">{error}</p>}
        <button
          type="submit"
          className="mt-6 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 py-3 px-10 rounded font-semibold transition"
        >
          Predict
        </button>
      </form>
      <div>
        {isCame && !error && (
          <p className={`w-full p-5 rounded-[10px] text-white font-bold text-center ${prediction === 0? "bg-green-400": "bg-red-400"}`}>
            {prediction === 0
              ? "Client à risque faible"
              : "Client à risque élevée"}{" "}
            : {probabilite.toFixed(2)} de probabilité de faire defaut
          </p>
        )}
      </div>
    </div>
  );
};

export default FormPrediction;
