import React from "react";
import { X } from "lucide-react";

const CaseDetailsModal = ({ isOpen, onClose, caseData }) => {
  if (!isOpen || !caseData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Human Case Details
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Case ID: {caseData.case_id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Case Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Case Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Case ID
                </label>
                <p className="text-gray-900 font-medium">{caseData.case_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Disease
                </label>
                <p className="text-gray-900 font-medium">{caseData.disease}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Classification
                </label>
                <p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      caseData.classification === "Confirmed"
                        ? "bg-red-100 text-red-800"
                        : caseData.classification === "Probable"
                        ? "bg-orange-100 text-orange-800"
                        : caseData.classification === "Suspect"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {caseData.classification}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Outcome
                </label>
                <p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      caseData.outcome === "Recovered"
                        ? "bg-green-100 text-green-800"
                        : caseData.outcome === "Deceased"
                        ? "bg-red-100 text-red-800"
                        : caseData.outcome === "Under Treatment"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {caseData.outcome || "No Outcome Yet"}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Case Origin
                </label>
                <p className="text-gray-900">{caseData.case_origin || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Category
                </label>
                <p className="text-gray-900">{caseData.category}</p>
              </div>
            </div>
          </div>

          {/* Patient Information */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Person ID
                </label>
                <p className="text-gray-900 font-medium">{caseData.personID}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Age</label>
                <p className="text-gray-900">{caseData.age} years</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Sex</label>
                <p className="text-gray-900">{caseData.sex}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Occupation
                </label>
                <p className="text-gray-900">{caseData.occupation || "N/A"}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">
                  Symptoms
                </label>
                <p className="text-gray-900">{caseData.symptoms || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Location Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  State
                </label>
                <p className="text-gray-900">{caseData.state}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">LGA</label>
                <p className="text-gray-900">{caseData.lga}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Region
                </label>
                <p className="text-gray-900">{caseData.region}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Health Facility
                </label>
                <p className="text-gray-900">
                  {caseData.health_facility || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Coordinates
                </label>
                <p className="text-gray-900">
                  {caseData.latitude}, {caseData.longitude}
                </p>
              </div>
            </div>
          </div>

          {/* Clinical Information */}
          <div className="bg-orange-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Clinical Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Lab Results
                </label>
                <p className="text-gray-900">
                  {caseData.lab_results || "Pending"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Treatment Status
                </label>
                <p className="text-gray-900">
                  {caseData.treatment_status || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Hospitalized
                </label>
                <p className="text-gray-900">
                  {caseData.hospitalized ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Vaccination Status
                </label>
                <p className="text-gray-900">
                  {caseData.vaccination_status || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Important Dates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Date of Onset
                </label>
                <p className="text-gray-900">
                  {caseData.date_of_onset
                    ? new Date(caseData.date_of_onset).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Date of Confirmation
                </label>
                <p className="text-gray-900">
                  {caseData.date_of_confirmation
                    ? new Date(
                        caseData.date_of_confirmation
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Date Reported
                </label>
                <p className="text-gray-900">
                  {caseData.reported_at
                    ? new Date(caseData.reported_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Reporting Information */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reporting Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Reporting Source
                </label>
                <p className="text-gray-900">{caseData.reporting_source}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Reporter ID
                </label>
                <p className="text-gray-900">{caseData.reporter_id || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseDetailsModal;
