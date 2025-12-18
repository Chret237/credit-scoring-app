import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Predictions() {
  const [predictions, setPredictions] = useState([]);
  const [riskFilter, setRiskFilter] = useState("");
  const [minScore, setMinScore] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Fetch depuis l'API
  useEffect(() => {
    fetch("http://127.0.0.1:8000/historique")
      .then((res) => res.json())
      .then((data) => {
        setPredictions(data);
      });
  }, []);

  // Filtrage dynamique
  const filtered = predictions.filter((p) => {
    if (riskFilter && p.classe !== riskFilter) return false;
    if (minScore && p.proba < parseFloat(minScore)) return false;
    if (dateFilter && p.date_prediction !== dateFilter) return false;
    return true;
  });

  const exportPDF = () => {
    if (filtered.length === 0) return; // rien à exporter
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Historique des Prédictions", 14, 22);

    // Colonnes du tableau
    const tableColumn = ["Score", "Classe", "Date", "Prédiction"];

    // Données filtrées
    const tableRows = filtered.map((p) => [
      p.proba.toFixed(4),
      p.classe,
      p.date_prediction.split("T")[0],
      p.prediction === 1 ? "Risque élevé" : "Risque faible",
    ]);

    // Générer le tableau
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: "grid",
      headStyles: { fillColor: [40, 40, 40] },
      styles: { fontSize: 10 },
    });

    // Télécharger le PDF
    doc.save("historique_predictions.pdf");
  };

  return (
    <div className="p-6 overflow-y-auto max-h-screen">
      {/* --- TITRE --- */}
      <h1 className="text-2xl font-bold text-white mb-6">
        Toutes les Prédictions
      </h1>

      {/* --- SECTION FILTRES + EXPORT --- */}
      <Card className="bg-zinc-900 border-zinc-800 mb-6">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Filtrer par classe */}
            <div>
              <p className="text-sm text-zinc-400 mb-1">Risque</p>
              <Select onValueChange={(v) => setRiskFilter(v)}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Toutes les classes" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 text-white">
                  <SelectItem value="Faible">Faible</SelectItem>
                  <SelectItem value="Élevé">Élevé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Score minimum */}
            <div>
              <p className="text-sm text-zinc-400 mb-1">Score minimum</p>
              <Input
                placeholder="ex: 0.7"
                className="bg-zinc-800 border-zinc-700 text-white"
                onChange={(e) => setMinScore(e.target.value)}
              />
            </div>

            {/* Date */}
            <div>
              <p className="text-sm text-zinc-400 mb-1">Date</p>
              <Input
                type="date"
                className="bg-zinc-800 border-zinc-700 text-white"
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>

            {/* Boutons Export */}
            <div className="flex items-end gap-2">
              <Button
                className="bg-zinc-700 hover:bg-zinc-600 text-white w-full"
                onClick={exportPDF}
              >
                <Download size={16} className="mr-2" /> Export PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- TABLE DES PRÉDICTIONS --- */}
      <Card className="bg-zinc-900 border-zinc-800 max-h-[85vh] overflow-y-auto">
        <CardContent className="p-0">
          <table className="w-full table-auto text-left">
            <thead className="bg-zinc-800 text-zinc-300 text-sm">
              <tr>
                <th className="p-3">SCore</th>
                <th className="p-3">Classe</th>
                <th className="p-3">Date</th>
                <th className="p-3">Prédiction</th>
              </tr>
            </thead>

            <tbody className="text-white">
              {filtered.map((p, index) => (
                <tr
                  key={index}
                  className="border-b border-zinc-800 hover:bg-zinc-800/40 transition"
                >
                  {/* Score */}
                  <td className="p-3 font-semibold">{p.proba.toFixed(4)}</td>

                  {/* Classe prédite avec badges */}
                  <td className="p-3">
                    <Badge
                      className={
                        p.classe === "Faible" ? "bg-green-600" : "bg-red-600"
                      }
                    >
                      {p.classe}
                    </Badge>
                  </td>

                  {/* Date */}
                  <td className="p-3">{p.date_prediction.split("T")[0]}</td>

                  {/* Précision */}
                  <td className="p-3">
                    {p.prediction === 1 ? "Risque élevé" : "Risque faible"}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-5 text-center text-zinc-400">
                    Aucun résultat trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
