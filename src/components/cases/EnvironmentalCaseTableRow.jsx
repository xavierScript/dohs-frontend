import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

const EnvironmentalCaseTableRow = ({ caseItem, onViewDetails }) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* Case ID */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
          {caseItem.case_id}
        </div>
      </td>

      {/* Environmental Factor */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">
            {caseItem.environmental_factors}
          </div>
          <div className="text-sm text-gray-500">
            {caseItem.sample_collected ? "Sample Collected" : "No Sample"}
          </div>
        </div>
      </td>

      {/* Disease */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{caseItem.disease}</div>
        {caseItem.lab_results && (
          <div className="text-sm text-gray-500">{caseItem.lab_results}</div>
        )}
      </td>

      {/* Classification */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            caseItem.classification === "Confirmed"
              ? "bg-red-100 text-red-800"
              : caseItem.classification === "Probable"
              ? "bg-orange-100 text-orange-800"
              : caseItem.classification === "Suspected"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {caseItem.classification}
        </span>
      </td>

      {/* Outcome */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            caseItem.outcome === "Recovered"
              ? "bg-green-100 text-green-800"
              : caseItem.outcome === "Deceased"
              ? "bg-red-100 text-red-800"
              : caseItem.outcome === "Under Treatment"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {caseItem.outcome || "Unknown"}
        </span>
      </td>

      {/* Location */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {caseItem.state}, {caseItem.lga}
        </div>
        <div className="text-sm text-gray-500">{caseItem.region}</div>
      </td>

      {/* Date Reported */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {caseItem.reported_at
            ? new Date(caseItem.reported_at).toLocaleDateString()
            : "N/A"}
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex space-x-2">
          <button
            className="text-blue-600 hover:text-blue-800"
            title="View Details"
            onClick={() => onViewDetails(caseItem)}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="text-green-600 hover:text-green-800"
            title="Edit Case"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            className="text-red-600 hover:text-red-800"
            title="Delete Case"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default EnvironmentalCaseTableRow;
