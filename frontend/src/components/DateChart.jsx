import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const DateChart = () => {
  const [data, setData] = useState([]);

  // 🔥 Charger les données depuis l'API FastAPI
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/stats/predictions_par_jour");
        const json = await res.json();

        // Transformer en format Recharts
        const formatted = json.dates.map((date, index) => ({
          date,
          predictions: json.counts[index],
        }));

        setData(formatted);
      } catch (error) {
        console.error("Erreur chargement stats", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="p-4 bg-neutral-950 text-white border-none hover:shadow hover:shadow-blue-400">
      <CardHeader>
        <CardTitle> Évolution des prédictions dans le temps</CardTitle>
      </CardHeader>

      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip
              contentStyle={{ backgroundColor: "#111", border: "1px solid #333" }}
              labelStyle={{ color: "#fff" }}
              itemStyle={{ color: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="predictions"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DateChart;
