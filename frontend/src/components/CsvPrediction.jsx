import React, { useState } from "react";
import { Upload } from "lucide-react";
import axios from "axios";

const CsvPrediction = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // pour l'aperçu
  const [resultCsv, setResultCsv] = useState(null); // CSV complet pour le download
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Veuillez sélectionner un fichier CSV !");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/predict_file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const csvContent = res.data.csv_result; // CSV complet en texte
      setResultCsv(csvContent);

      // Création de l'aperçu (10 premières lignes)
      const lines = csvContent.split("\n").slice(0, 11); // 1 ligne d'en-tête + 10 lignes
      setPreview(lines.join("\n"));
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'upload ou du scoring du fichier");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultCsv) return;
    const blob = new Blob([resultCsv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `scoring_${file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-5">
      <div className="flex flex-col md:flex-row gap-2 items-center">
        <h1 className="text-2xl font-semibold">
          Prédictions sur un fichier CSV
        </h1>
        : Upload un fichier csv pour une prediction globale
      </div>
      <div className="mt-5">
        <p>Uploader un fichier CSV</p>
        <div className="w-full h-[70px] rounded-[5px] bg-[#24242C] mt-2 flex items-center justify-between p-5 cursor-pointer">
          <div className="flex items-center gap-3">
            <Upload size={30} />
            <div>
              <p className="text-[15px]">Drag and drop file here</p>
              <span className="text-[12px] opacity-70">
                Limit 200MB per file • CSV
              </span>
            </div>
          </div>
          <div>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-file-input"
            />
            <label
              htmlFor="csv-file-input"
              className="p-2 bg-black rounded-[5px] hover:bg-[#24242c] hover:border hover:border-white cursor-pointer"
            >
              Browse files
            </label>
          </div>
        </div>
      </div>
      {/* Affichage du fichier sélectionné */}
      {file && (
        <p className="text-[13px] mt-1">
          Fichier sélectionné: <span className="font-bold text-green-400">{file.name}</span>
        </p>
      )}
      <button
        onClick={handleUpload}
        className="mt-4 w-full p-3 bg-indigo-600 hover:bg-indigo-700 rounded font-semibold"
        disabled={loading}
      >
        {loading ? "Prediction en cours..." : "Predire le fichier"}
      </button>

      {preview && (
        <div className="mt-4 p-4 bg-[#1E1E24] rounded">
          <h2 className="text-lg font-semibold">Aperçu des résultats (10 premières lignes) :</h2>
          <pre className="text-sm mt-2 overflow-x-auto">{preview}</pre>
          <button
            onClick={handleDownload}
            className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-semibold"
          >
            Télécharger le CSV complet
          </button>
        </div>
      )}
    </div>
  );
};

export default CsvPrediction;
