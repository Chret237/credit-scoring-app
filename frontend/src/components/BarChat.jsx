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

const COLORS = ["#22c55e", "#ef4444"]; // Faible / Élevé

/*const classDistribution = [
  { name: "Faible", value: 1262 },
  { name: "Élevé", value: 3738 },
];*/


const BarChat = ({classDistribution}) => {

  if (!classDistribution) return null

  const data = [
    { name: "Faible", value: classDistribution.Faible },
    { name: "Élevé", value: classDistribution.Élevé },
  ]

  return (
    <div>
        <Card className="p-4 bg-neutral-950 text-white border-none hover:shadow hover:shadow-blue-400">
        <CardHeader>
          <CardTitle>Répartition des classes (Histogramme)</CardTitle>
        </CardHeader>

        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default BarChat