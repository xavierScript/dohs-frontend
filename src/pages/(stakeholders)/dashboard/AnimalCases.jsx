import React, { useState, useMemo, useEffect } from "react";
import DashboardLayout from "../../../components/dashboardLayouts/Dashboard";
import axios from "axios";
import { Filter, Download, Plus } from "lucide-react";
import * as XLSX from "xlsx";
import {
  AnimalCaseStatsCards,
  AnimalCaseFiltersPanel,
  AnimalCaseTableRow,
  AnimalCaseDetailsModal,
} from "../../../components/cases";
import AnimalNewCaseModal from "../../../components/cases/AnimalNewCaseModal";

const AnimalCases = () => {
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCases, setTotalCases] = useState(0);
  const [apiCurrentPage, setApiCurrentPage] = useState(1);
  const [apiPageSize, setApiPageSize] = useState(100);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Case details modal state
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  // New case form data
  const [formData, setFormData] = useState({
    case_id: "",
    personID: "",
    disease: "",
    classification: "",
    outcome: "",
    longitude: 0,
    latitude: 0,
    state: "",
    lga: "",
    health_facility: "",
    region: "",
    date_of_onset: "",
    date_of_confirmation: "",
    reporting_source: "",
    animal_species: "",
    number_affected: 1,
    symptoms: "",
    lab_results: "",
    category: "Animal",
  });

  const [filters, setFilters] = useState({
    search: "",
    species: "All",
    disease: "All",
    classification: "All",
    status: "All",
    outcome: "All",
    state: "All",
    animalSearch: "",
    ownerSearch: "",
    dateFrom: "",
    dateTo: "",
  });

  // Fetch cases from API
  const fetchCases = async (page = 1, pageSize = 100) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        "https://backend.onehealth-wwrg.com/api/v1/reports/animal",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            page: page,
            page_size: pageSize,
            sort_by: "created_at",
            sort_order: "desc",
          },
        }
      );

      console.log("API Response:", response.data); // Debug log

      // Handle different response structures
      if (response.data) {
        if (Array.isArray(response.data)) {
          // Direct array response
          setCases(response.data);
          setTotalCases(response.data.length);
          console.log("Fetched Cases (Direct Array):", response.data);
        } else if (response.data.items && Array.isArray(response.data.items)) {
          // API response with 'items' property
          setCases(response.data.items);
          setTotalCases(response.data.total || response.data.items.length);
          console.log("Fetched Cases (Items):", response.data.items);
        } else {
          // Unknown structure, try to find the array
          console.warn("Unknown API response structure:", response.data);
          setCases([]);
          setTotalCases(0);
          console.log("Fetched Cases (Unknown Structure):", []);
        }
      } else {
        setCases([]);
        setTotalCases(0);
        console.log("Fetched Cases (No Data):", []);
      }
    } catch (error) {
      console.error("Error fetching cases:", error);
      setError(error.response?.data?.message || "Failed to fetch cases");
      setCases([]); // Fallback to empty array
      setTotalCases(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("AnimalCases: Component mounted, fetching cases...");
    fetchCases(apiCurrentPage, apiPageSize);
  }, []);

  // Generate filter options from API data
  const filterOptions = useMemo(() => {
    if (cases.length === 0) {
      return {
        species: ["All"],
        disease: ["All"],
        classification: ["All"],
        status: ["All"],
        outcome: ["All"],
        state: ["All"],
      };
    }
    return {
      species: [
        "All",
        ...new Set(cases.map((c) => c.animal_species).filter(Boolean)),
      ],
      disease: ["All", ...new Set(cases.map((c) => c.disease).filter(Boolean))],
      classification: [
        "All",
        ...new Set(cases.map((c) => c.classification).filter(Boolean)),
      ],
      status: ["All"],
      outcome: ["All", ...new Set(cases.map((c) => c.outcome).filter(Boolean))],
      state: ["All", ...new Set(cases.map((c) => c.state).filter(Boolean))],
    };
  }, [cases]);

  // Filter cases based on current filters
  const filteredCases = useMemo(() => {
    return cases.filter((caseItem) => {
      const searchMatch =
        !filters.search ||
        Object.values(caseItem).some(
          (value) =>
            value &&
            value
              .toString()
              .toLowerCase()
              .includes(filters.search.toLowerCase())
        );

      const animalSearchMatch =
        !filters.animalSearch ||
        `${caseItem.case_id} ${caseItem.animal_species} ${caseItem.personID}`
          .toLowerCase()
          .includes(filters.animalSearch.toLowerCase());

      const ownerSearchMatch =
        !filters.ownerSearch ||
        `${caseItem.reporting_source}`
          .toLowerCase()
          .includes(filters.ownerSearch.toLowerCase());

      return (
        searchMatch &&
        animalSearchMatch &&
        ownerSearchMatch &&
        (filters.species === "All" ||
          caseItem.animal_species === filters.species) &&
        (filters.disease === "All" || caseItem.disease === filters.disease) &&
        (filters.classification === "All" ||
          caseItem.classification === filters.classification) &&
        (filters.outcome === "All" || caseItem.outcome === filters.outcome) &&
        (filters.state === "All" || caseItem.state === filters.state)
      );
    });
  }, [cases, filters]);

  // Paginate filtered cases
  const paginatedCases = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredCases.slice(startIndex, startIndex + pageSize);
  }, [filteredCases, currentPage, pageSize]);

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: "",
      species: "All",
      disease: "All",
      classification: "All",
      status: "All",
      outcome: "All",
      state: "All",
      animalSearch: "",
      ownerSearch: "",
      dateFrom: "",
      dateTo: "",
    });
    setCurrentPage(1);
  };

  // Handle view case details
  const handleViewDetails = (caseItem) => {
    setSelectedCase(caseItem);
    setShowDetailsModal(true);
  };

  // Handle input change for new case form
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  // Handle form submission
  const handleSubmitNewCase = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "https://backend.onehealth-wwrg.com/api/v1/reports/animal",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Animal case created successfully!");
        setShowNewCaseModal(false);
        // Reset form
        setFormData({
          case_id: "",
          personID: "",
          disease: "",
          classification: "",
          outcome: "",
          longitude: 0,
          latitude: 0,
          state: "",
          lga: "",
          health_facility: "",
          region: "",
          date_of_onset: "",
          date_of_confirmation: "",
          reporting_source: "",
          animal_species: "",
          number_affected: 1,
          symptoms: "",
          lab_results: "",
          category: "Animal",
        });
        // Refresh the cases list
        await fetchCases(1, apiPageSize);
      }
    } catch (error) {
      console.error("Error creating animal case:", error);
      alert(
        error.response?.data?.message ||
          "Error creating animal case. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle opening new case modal
  const handleNewCaseClick = () => {
    setShowNewCaseModal(true);
  };

  // Handle export to Excel
  const handleExportToExcel = () => {
    // Prepare data for export
    const exportData = filteredCases.map((caseItem) => ({
      "Case ID": caseItem.case_id,
      "Animal Type": caseItem.animal_type,
      Disease: caseItem.disease,
      Classification: caseItem.classification,
      Outcome: caseItem.outcome,
      "Farm Owner": caseItem.farm_owner,
      State: caseItem.state,
      LGA: caseItem.lga,
      Region: caseItem.region,
      "Lab Results": caseItem.lab_results,
      "Sample Collected": caseItem.sample_collected ? "Yes" : "No",
      "Date of Onset": caseItem.date_of_onset,
      "Date of Confirmation": caseItem.date_of_confirmation,
      Latitude: caseItem.latitude,
      Longitude: caseItem.longitude,
      "Reported At": caseItem.reported_at
        ? new Date(caseItem.reported_at).toLocaleString()
        : "",
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const colWidths = [
      { wch: 12 }, // Case ID
      { wch: 15 }, // Animal Type
      { wch: 20 }, // Disease
      { wch: 15 }, // Classification
      { wch: 15 }, // Outcome
      { wch: 20 }, // Farm Owner
      { wch: 15 }, // State
      { wch: 15 }, // LGA
      { wch: 15 }, // Region
      { wch: 20 }, // Lab Results
      { wch: 18 }, // Sample Collected
      { wch: 15 }, // Date of Onset
      { wch: 18 }, // Date of Confirmation
      { wch: 12 }, // Latitude
      { wch: 12 }, // Longitude
      { wch: 20 }, // Reported At
    ];
    ws["!cols"] = colWidths;

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Animal Cases");

    // Generate filename with current date
    const date = new Date().toISOString().split("T")[0];
    const filename = `Animal_Cases_Export_${date}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 font-primary">
        {console.log("AnimalCases Render:", {
          isLoading,
          error,
          casesCount: cases.length,
          filteredCount: filteredCases.length,
        })}
        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading cases...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-red-800 font-medium">
                  Error Loading Cases
                </h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
                <button
                  onClick={() => fetchCases(1, apiPageSize)}
                  className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Animal Cases Directory
                </h2>
                <p className="text-sm text-gray-600">
                  Showing {filteredCases.length} of {totalCases} cases
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  <Filter className="w-4 h-4" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
                <button
                  onClick={handleExportToExcel}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-gray-700 transition"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button
                  onClick={handleNewCaseClick}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-blue-700 transition"
                >
                  <Plus className="w-4 h-4" />
                  New Case
                </button>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <AnimalCaseFiltersPanel
                filters={filters}
                setFilters={setFilters}
                filterOptions={filterOptions}
                filteredCasesCount={filteredCases.length}
                onResetFilters={resetFilters}
              />
            )}

            {/* Status Overview */}
            <AnimalCaseStatsCards cases={cases} totalCases={totalCases} />

            {/* Cases Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Table Header Controls */}
              <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-700">
                    Showing {(currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, filteredCases.length)} of{" "}
                    {filteredCases.length} entries
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">Show:</label>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-sm text-gray-700">entries</span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Case ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Animal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Disease
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Classification
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Outcome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Owner/Farm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Reported
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedCases.map((caseItem) => (
                      <AnimalCaseTableRow
                        key={caseItem.case_id || caseItem.id}
                        caseItem={caseItem}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of{" "}
                    {Math.ceil(filteredCases.length / pageSize)}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage(
                        Math.min(
                          Math.ceil(filteredCases.length / pageSize),
                          currentPage + 1
                        )
                      )
                    }
                    disabled={
                      currentPage >= Math.ceil(filteredCases.length / pageSize)
                    }
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* New Animal Case Modal */}
        <AnimalNewCaseModal
          isOpen={showNewCaseModal}
          onClose={() => setShowNewCaseModal(false)}
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmitNewCase}
          isSubmitting={isSubmitting}
        />

        {/* Animal Case Details Modal */}
        <AnimalCaseDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          caseData={selectedCase}
        />
      </div>
    </DashboardLayout>
  );
};

export default AnimalCases;
