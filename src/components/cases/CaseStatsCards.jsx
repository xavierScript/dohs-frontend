import React from "react";
import { Activity, Users, Skull, AlertTriangle } from "lucide-react";

const CaseStatsCards = ({ cases }) => {
  const stats = [
    {
      label: "Total Cases",
      value: cases.length,
      icon: Activity,
      color: "blue",
    },
    {
      label: "Deceased",
      value: cases.filter((c) => c.outcome === "Deceased").length,
      icon: Skull,
      color: "red",
    },
    {
      label: "Recovered",
      value: cases.filter((c) => c.outcome === "Recovered").length,
      icon: Users,
      color: "green",
    },
    {
      label: "Confirmed",
      value: cases.filter((c) => c.classification === "Confirmed").length,
      icon: AlertTriangle,
      color: "orange",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-full bg-${stat.color}-100 flex items-center justify-center`}
              >
                <Icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CaseStatsCards;
