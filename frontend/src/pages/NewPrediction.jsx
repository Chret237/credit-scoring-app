import React, { useState } from "react";
import { Search, FileText, Upload } from "lucide-react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import FormPrediction from "@/components/FormPrediction";
import CsvPrediction from "@/components/CsvPrediction";

const NewPrediction = () => {
  const location = useLocation();
  const current = location.pathname;

  const [prediction, setPrediction] = useState(null);
  const [probabilite, setProbabilite] = useState(null);
  const [isCame, setIsCame] = useState(false);

  return (
    <div className="md:max-h-screen m-5 md:overflow-y-auto text-white p-4 pb-10">
      <h1 className="text-white font-bold text-3xl">New-Prediction</h1>
      <ul className="mt-5 flex items-center gap-4">
        <li
          className={`flex items-center gap-1 cursor-pointer ${
            current.endsWith("/form") ? "p-2 bg-gray-800 rounded-[5px]" : ""
          }`}
        >
          <FileText size={15} /> <Link to="/New_Prediction/form">Form</Link>
        </li>
        <li
          className={`flex items-center gap-1 cursor-pointer ${
            current.endsWith("/csv") ? "p-2 bg-gray-800 rounded-[5px]" : ""
          }`}
        >
          <Upload size={15} /> <Link to="/New_Prediction/csv">CSV</Link>
        </li>
      </ul>
      <Routes>
        <Route
          path="form"
          element={
            <FormPrediction setPrediction={setPrediction} setProbabilite={setProbabilite} setIsCame={setIsCame} isCame={isCame} probabilite={probabilite} prediction={prediction} />
          }
        />
        <Route path="csv" element={<CsvPrediction />} />
        {/* Default: afficher Form */}
        <Route
          index
          element={
            <FormPrediction setPrediction={setPrediction} setProbabilite={setProbabilite} setIsCame={setIsCame} isCame={isCame} probabilite={probabilite} prediction={prediction} />
          }
        />
      </Routes>
      
    </div>
  );
};

export default NewPrediction;
