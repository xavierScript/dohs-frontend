import React from "react";
import { Search, Dog, User } from "lucide-react";

const AnimalCaseFiltersPanel = ({
  filters,
  setFilters,
  filterOptions,
  filteredCasesCount,
  onResetFilters,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Species</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.species}
            onChange={(e) =>
              setFilters((f) => ({ ...f, species: e.target.value }))
            }
          >
            {filterOptions.species.map((opt) => (
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
              setFilters((f) => ({
                ...f,
                classification: e.target.value,
              }))
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
          <label className="text-sm font-medium text-gray-700">State</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.state}
            onChange={(e) =>
              setFilters((f) => ({ ...f, state: e.target.value }))
            }
          >
            {filterOptions.state.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

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
            Search Animal
          </label>
          <div className="relative">
            <Dog className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Animal ID, species, breed..."
              value={filters.animalSearch}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  animalSearch: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Search Owner
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Owner ID, name, farm..."
              value={filters.ownerSearch}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  ownerSearch: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={onResetFilters}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Reset Filters
        </button>
        <div className="ml-auto text-sm text-gray-600 py-2">
          {filteredCasesCount} cases found
        </div>
      </div>
    </div>
  );
};

export default AnimalCaseFiltersPanel;
