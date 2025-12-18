import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#22c55e", "#eab308", "#ef4444"]; // Faible / Moyen / Élevé

const classDistribution = [
  { name: "Faible", value: 120 },
  { name: "Moyen", value: 80 },
  { name: "Élevé", value: 40 },
];


const Piechart = () => {
  return (
    <div>
        <Card className="p-4 bg-neutral-950 text-white border-none hover:shadow hover:shadow-blue-400">
        <CardHeader>
          <CardTitle>Pourcentage par classe (Camembert)</CardTitle>
        </CardHeader>

        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={classDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {classDistribution.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>

              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default Piechart