import React from "react";
import { CheckCircle, Clock, X, AlertCircle } from "lucide-react";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    "Investigation done": {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: CheckCircle,
    },
    "Investigation pending": {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: Clock,
    },
    "Investigation discarded": {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: X,
    },
  };

  const config = statusConfig[status] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
    icon: AlertCircle,
  };
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      <Icon className="w-3 h-3 mr-1" />
      {status}
    </span>
  );
};

export default StatusBadge;
