import React from "react";

const OutcomeBadge = ({ outcome }) => {
  const outcomeConfig = {
    Recovered: { bg: "bg-green-100", text: "text-green-800" },
    Deceased: { bg: "bg-red-100", text: "text-red-800" },
    "Under Treatment": { bg: "bg-blue-100", text: "text-blue-800" },
    "No Outcome Yet": { bg: "bg-gray-100", text: "text-gray-800" },
  };

  const config = outcomeConfig[outcome] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {outcome}
    </span>
  );
};

export default OutcomeBadge;
