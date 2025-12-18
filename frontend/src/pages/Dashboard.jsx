import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import logo from "../assets/logo.png";
import { BarChart3, Gauge, Target, Timer } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BarChat from "@/components/BarChat";
import Piechart from "@/components/Piechart";
import axios from "axios";
import DateChart from "@/components/DateChart";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [historique, setHistorique] = useState([]);

  const getStats = () => {
    axios
      .get("http://127.0.0.1:8000/stats/general")
      .then((result) => {
        setStats(result.data);
        console.log(result.data);
      })
      .catch((err) => {
        if (err.response) {
          alert(err.response.data.error);
          console.log(err.response.data.error);
        }
      });
  };

  const getHistorique = () => {
    axios
      .get("http://127.0.0.1:8000/historique")
      .then((res) => {
        setHistorique(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getStats();
    getHistorique();
  }, []);

  const classStats = {
    Faible: historique.filter((p) => p.classe === "Faible").length,
    Élevé: historique.filter((p) => p.classe === "Élevé").length,
  };

  return (
    <div className="m-5 overflow-x-hidden max-h-screen overflow-y-auto pb-10">
      <div className="flex items-center justify-between">
        <h1 className="md:text-3xl text-[20px] font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <button
            className="bg-blue-800 text-white py-2 px-8 text-center font-semibold rounded-[5px] mr-5 md:mr-0"
            onClick={() => navigate("/New_Prediction")}
          >
            New Prediction
          </button>
          <Search
            size={20}
            color="#A1A1AA"
            className="md:relative md:left-10"
          />
          <input
            type="text"
            className="bg-[#24242C] h-[35px] w-[300px] rounded-[5px] focus:outline-none text-[#A1A1AA] pl-10 hidden md:block"
          />
          <img
            src={logo}
            className="w-12 h-12 p-2 rounded-[50%] hidden md:block"
            alt=""
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-2 rounded-[10px] mt-5">
        <div className="md:w-[300px] w-full h-[190px] rounded-[10px] border border-zinc-800 hover:border-purple-500/40 transition-all duration-300 shadow-lg hover:shadow-green-700/20 bg-gradient-to-br  from-zinc-900 to-black">
          <div className="flex items-center justify-between mb-4 p-5">
            <h3 className="text-zinc-400 text-sm">Total Prédictions</h3>
            <BarChart3 className="text-purple-400" size={26} />
          </div>
          <p className="text-3xl font-bold text-white text-center">
            {stats.nb_predictions}
          </p>
        </div>
        <div className="md:w-[300px] w-full h-[190px] rounded-[10px] bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 hover:border-yellow-500/40 transition-all duration-300 shadow-lg hover:shadow-yellow-700/20">
          <div className="flex items-center justify-between mb-4 p-5">
            <h3 className="text-zinc-400 text-sm">Taux de defaut (en %)</h3>
            <Gauge className="text-yellow-400" size={26} />
          </div>
          <p className="text-3xl font-bold text-white text-center">
            {((stats.taux_defaut ?? 0) * 100).toFixed(2)}%
          </p>
        </div>
        <div className="md:w-[300px] w-full h-[190px] rounded-[10px] bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 hover:border-green-500/40 transition-all duration-300 shadow-lg hover:shadow-green-700/20">
          <div className="flex items-center justify-between mb-4 p-5">
            <h3 className="text-zinc-400 text-sm">Précision du Modèle</h3>
            <Target className="text-green-400" size={26} />
          </div>
          <p className="text-3xl font-bold text-white text-center">93%</p>
        </div>
        <div className="md:w-[300px] w-full h-[190px] rounded-[10px] bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 hover:border-blue-500/40 transition-all duration-300 shadow-lg hover:shadow-blue-700/20">
          <div className="flex items-center justify-between mb-4 p-5">
            <h3 className="text-zinc-400 text-sm">Probabilité Moyenne</h3>
            <Timer className="text-blue-400" size={26} />
          </div>
          <p className="text-3xl font-bold text-white text-center">
            {(stats.proba_moyenne ?? 0).toFixed(2)}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <BarChat classDistribution={classStats} />
        <DateChart />
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-2xl">Predictons History</h2>
          <button className="py-2 px-6 bg-blue-800 text-white font-semibold rounded-[10px] cursor-pointer">
            <Link to="predictions">Show More</Link>
          </button>
        </div>
        <table className="w-full text-left text-zinc-300 mt-3">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400">
              <th className="py-3">Score</th>
              <th className="py-3">Classe</th>
              <th className="py-3">Date</th>
              <th className="py-3">Prédiction</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-zinc-800/50">
              <td className="py-3 font-medium">0.0003</td>
              <td className="py-3">Faible</td>
              <td className="py-3">2025-12-12</td>
              <td className="py-3">Risque faible</td>
            </tr>
            <tr className="border-b border-zinc-800/50">
              <td className="py-3 font-medium">1.000</td>
              <td className="py-3">Élevé</td>
              <td className="py-3">2025-12-12</td>
              <td className="py-3">Risque élevé</td>
            </tr>
            <tr className="border-b border-zinc-800/50">
              <td className="py-3 font-medium">1.000</td>
              <td className="py-3">Élevé</td>
              <td className="py-3">2025-12-12</td>
              <td className="py-3">Risque élevé</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
