import React from "react";
import { Search, User, AlertCircle } from "lucide-react";

const CaseFiltersPanel = ({
  filters,
  setFilters,
  filterOptions,
  onReset,
  resultsCount,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
      {/* Filter Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Case Origin
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.caseOrigin}
            onChange={(e) =>
              setFilters((f) => ({ ...f, caseOrigin: e.target.value }))
            }
          >
            {filterOptions.caseOrigin.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Outcome</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.outcome}
            onChange={(e) =>
              setFilters((f) => ({ ...f, outcome: e.target.value }))
            }
          >
            {filterOptions.outcome.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Disease</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.disease}
            onChange={(e) =>
              setFilters((f) => ({ ...f, disease: e.target.value }))
            }
          >
            {filterOptions.disease.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Classification
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.classification}
            onChange={(e) =>
              setFilters((f) => ({ ...f, classification: e.target.value }))
            }
          >
            {filterOptions.classification.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Follow-up Status
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.followUp}
            onChange={(e) =>
              setFilters((f) => ({ ...f, followUp: e.target.value }))
            }
          >
            {filterOptions.followUp.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Investigation Status
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.status}
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: e.target.value }))
            }
          >
            {filterOptions.status.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Region</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.region}
            onChange={(e) =>
              setFilters((f) => ({ ...f, region: e.target.value }))
            }
          >
            {filterOptions.region.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Sex</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.sex}
            onChange={(e) => setFilters((f) => ({ ...f, sex: e.target.value }))}
          >
            {filterOptions.sex.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Search Cases
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Case ID, EPID number, disease..."
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Search Person
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Person ID, name, contact..."
              value={filters.personSearch}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  personSearch: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Search Event
          </label>
          <div className="relative">
            <AlertCircle className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Event ID, outbreak name..."
              value={filters.eventSearch}
              onChange={(e) =>
                setFilters((f) => ({ ...f, eventSearch: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

      {/* Reset Button and Results Count */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onReset}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Reset Filters
        </button>
        <div className="ml-auto text-sm text-gray-600 py-2">
          {resultsCount} cases found
        </div>
      </div>
    </div>
  );
};

export default CaseFiltersPanel;
