import React from "react";
import { Activity, Droplets, AlertTriangle, Skull } from "lucide-react";

const EnvironmentalCaseStatsCards = ({ cases, totalCases }) => {
  const stats = [
    {
      label: "Total Cases",
      value: totalCases,
      icon: Activity,
      color: "blue",
    },
    {
      label: "Sample Collected",
      value: cases.filter((c) => c.sample_collected === true).length,
      icon: Droplets,
      color: "green",
    },
    {
      label: "Confirmed Cases",
      value: cases.filter((c) => c.lab_results === "Confirmed").length,
      icon: AlertTriangle,
      color: "red",
    },
    {
      label: "Deceased",
      value: cases.filter((c) => c.outcome === "Deceased").length,
      icon: Skull,
      color: "red",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">
                {stat.label}
              </span>
              <div
                className={`w-12 h-12 rounded-full bg-${stat.color}-100 flex items-center justify-center`}
              >
                <Icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </div>
        );
      })}
    </div>
  );
};

export default EnvironmentalCaseStatsCards;
