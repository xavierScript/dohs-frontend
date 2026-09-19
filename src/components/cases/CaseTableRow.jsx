import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

const CaseTableRow = ({ caseItem, viewMode, onViewDetails, onDelete }) => {
  if (viewMode === "default") {
    return (
      <>
        {/* Case ID */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
            {caseItem.case_id}
          </div>
        </td>

        {/* Person Info */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">
            {caseItem.personID}
          </div>
          <div className="text-sm text-gray-500">
            {caseItem.age}y, {caseItem.sex}
          </div>
        </td>

        {/* Disease */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{caseItem.disease}</div>
        </td>

        {/* Classification */}
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              caseItem.classification === "Confirmed"
                ? "bg-red-100 text-red-800"
                : caseItem.classification === "Probable"
                ? "bg-orange-100 text-orange-800"
                : caseItem.classification === "Suspect"
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
            {caseItem.outcome || "No Outcome Yet"}
          </span>
        </td>

        {/* Location */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{caseItem.state}</div>
          <div className="text-sm text-gray-500">{caseItem.lga}</div>
        </td>

        {/* Date Reported */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {new Date(caseItem.reported_at).toLocaleDateString()}
        </td>

        {/* Actions */}
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center gap-2">
            <button
              className="text-blue-600 hover:text-blue-900 p-1 rounded"
              title="View Details"
              onClick={() => onViewDetails(caseItem)}
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              className="text-gray-600 hover:text-gray-900 p-1 rounded"
              title="Edit Case"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              className="text-red-600 hover:text-red-900 p-1 rounded"
              title="Delete Case"
              onClick={() => onDelete && onDelete(caseItem)}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </>
    );
  }

  // Detailed view
  return (
    <>
      {/* Case ID */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
        {caseItem.case_id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {caseItem.case_id}
      </td>
      <td className="px-6 py-4">
        <div className="text-sm">
          <div className="font-medium text-gray-900">{caseItem.personID}</div>
          <div className="text-gray-500">ID: {caseItem.personID}</div>
          <div className="text-gray-500">
            {caseItem.age}y, {caseItem.sex}
          </div>
          <div className="text-gray-500">{caseItem.occupation}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm">
          <div className="font-medium text-gray-900">{caseItem.disease}</div>
          <div className="text-gray-500 mt-1">{caseItem.symptoms}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            caseItem.classification === "Confirmed"
              ? "bg-red-100 text-red-800"
              : caseItem.classification === "Probable"
              ? "bg-orange-100 text-orange-800"
              : caseItem.classification === "Suspect"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {caseItem.classification}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          Active
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            caseItem.outcome === "Deceased"
              ? "bg-red-100 text-red-800"
              : caseItem.outcome === "Recovered"
              ? "bg-green-100 text-green-800"
              : caseItem.outcome === "Under Treatment"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {caseItem.outcome || "No Outcome Yet"}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {caseItem.state}, {caseItem.lga}
          </div>
          <div className="text-gray-500">{caseItem.region}</div>
          <div className="text-gray-500">{caseItem.health_facility}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm">
          <div className="text-gray-900">
            Onset: {new Date(caseItem.date_of_onset).toLocaleDateString()}
          </div>
          <div className="text-gray-500">
            Confirmed:{" "}
            {new Date(caseItem.date_of_confirmation).toLocaleDateString()}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {caseItem.reporting_source}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center gap-2">
          <button
            className="text-blue-600 hover:text-blue-900 p-1 rounded"
            title="View Details"
            onClick={() => onViewDetails(caseItem)}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="text-gray-600 hover:text-gray-900 p-1 rounded"
            title="Edit Case"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            className="text-red-600 hover:text-red-900 p-1 rounded"
            title="Delete Case"
            onClick={() => onDelete && onDelete(caseItem)}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </>
  );
};

export default CaseTableRow;
