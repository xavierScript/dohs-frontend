import React, { useState, useMemo, useEffect } from "react";
import DashboardLayout from "../../../components/dashboardLayouts/Dashboard";
import axios from "axios";
import { Filter, Download, Plus } from "lucide-react";
import * as XLSX from "xlsx";
import {
  CaseStatsCards,
  CaseFiltersPanel,
  CaseTableRow,
  CaseDetailsModal,
  NewCaseModal,
} from "../../../components/cases";

const filterOptions = {
  caseOrigin: ["All", "Imported", "Local"],
  outcome: [
    "All",
    "No Outcome Yet",
    "Recovered",
    "Deceased",
    "Under Treatment",
  ],
  disease: [
    "All",
    "Rabies",
    "Yellow Fever",
    "COVID-19",
    "Measles",
    "Lassa Fever",
    "Cholera",
  ],
  classification: [
    "All",
    "Confirmed",
    "Probable",
    "Suspect",
    "Not yet classified",
  ],
  followUp: ["All", "Pending", "Done", "Discarded"],
  status: [
    "All",
    "Investigation pending",
    "Investigation done",
    "Investigation discarded",
  ],
  region: [
    "All",
    "South West",
    "South South",
    "North West",
    "North East",
    "North Central",
    "South East",
  ],
  sex: ["All", "Male", "Female"],
};

function Cases() {
  const [filters, setFilters] = useState({
    caseOrigin: "All",
    outcome: "All",
    disease: "All",
    classification: "All",
    followUp: "All",
    status: "All",
    region: "All",
    sex: "All",
    search: "",
    personSearch: "",
    eventSearch: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState("default"); // default, detailed
  const [showFilters, setShowFilters] = useState(false);
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
    age: 0,
    sex: "",
    occupation: "",
    symptoms: "",
    risk_factors: "",
    category: "Human",
  });

  // Cases data state
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCases, setTotalCases] = useState(0);
  const [apiCurrentPage, setApiCurrentPage] = useState(1);
  const [apiPageSize, setApiPageSize] = useState(100); // Fetch more records per API call

  // Fetch cases from API
  const fetchCases = async (page = 1, pageSize = 100) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        "https://backend.onehealth-wwrg.com/api/v1/reports/health",
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
    fetchCases(apiCurrentPage, apiPageSize);
  }, []);

  // Enhanced filtering logic
  const filteredCases = useMemo(() => {
    return cases.filter((caseItem) => {
      // Text searches
      if (
        filters.search &&
        !Object.values(caseItem).some((value) =>
          String(value).toLowerCase().includes(filters.search.toLowerCase())
        )
      )
        return false;

      if (
        filters.personSearch &&
        !`${caseItem.personID} ${caseItem.reporting_source}`
          .toLowerCase()
          .includes(filters.personSearch.toLowerCase())
      )
        return false;

      // Filter by specific fields
      if (filters.disease !== "All" && caseItem.disease !== filters.disease)
        return false;
      if (
        filters.classification !== "All" &&
        caseItem.classification !== filters.classification
      )
        return false;
      if (filters.outcome !== "All" && caseItem.outcome !== filters.outcome)
        return false;
      if (filters.region !== "All" && caseItem.region !== filters.region)
        return false;
      if (filters.sex !== "All" && caseItem.sex !== filters.sex) return false;

      return true;
    });
  }, [filters, cases]);

  // Pagination
  const totalPages = Math.ceil(filteredCases.length / pageSize);
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset filters
  const resetFilters = () => {
    setFilters({
      caseOrigin: "All",
      outcome: "All",
      disease: "All",
      classification: "All",
      followUp: "All",
      status: "All",
      region: "All",
      sex: "All",
      search: "",
      personSearch: "",
      eventSearch: "",
    });
    setCurrentPage(1);
  };

  // Handle viewing case details
  const handleViewDetails = (caseItem) => {
    setSelectedCase(caseItem);
    setShowDetailsModal(true);
  };

  // Handle deleting a case
  const handleDeleteCase = async (caseItem) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete case ${caseItem.case_id}?\n\nPerson ID: ${caseItem.personID}\nDisease: ${caseItem.disease}\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.delete(
        `https://backend.onehealth-wwrg.com/api/v1/reports/health/${caseItem.case_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        alert("Case deleted successfully!");
        // Refresh the cases list
        await fetchCases(apiCurrentPage, apiPageSize);
      }
    } catch (error) {
      console.error("Error deleting case:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Error deleting case. Please try again.";
      alert(errorMessage);
    }
  };

  // Handle form input changes
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
        "https://backend.onehealth-wwrg.com/api/v1/reports/health",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Case created successfully!");
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
          age: 0,
          sex: "",
          occupation: "",
          symptoms: "",
          risk_factors: "",
          category: "Human",
        });
        // Refresh the cases list
        await fetchCases(1, apiPageSize); // Reset to first page when refreshing
      }
    } catch (error) {
      console.error("Error creating case:", error);
      alert(
        error.response?.data?.message ||
          "Error creating case. Please try again."
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
      "EPID Number": caseItem.personID,
      Disease: caseItem.disease,
      Classification: caseItem.classification,
      Outcome: caseItem.outcome,
      Age: caseItem.age,
      Sex: caseItem.sex,
      Occupation: caseItem.occupation,
      State: caseItem.state,
      LGA: caseItem.lga,
      Region: caseItem.region,
      "Health Facility": caseItem.health_facility,
      "Reporting Source": caseItem.reporting_source,
      "Date of Onset": caseItem.date_of_onset,
      "Date of Confirmation": caseItem.date_of_confirmation,
      Symptoms: caseItem.symptoms,
      "Risk Factors": caseItem.risk_factors,
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
      { wch: 15 }, // EPID Number
      { wch: 20 }, // Disease
      { wch: 15 }, // Classification
      { wch: 15 }, // Outcome
      { wch: 8 }, // Age
      { wch: 10 }, // Sex
      { wch: 20 }, // Occupation
      { wch: 15 }, // State
      { wch: 15 }, // LGA
      { wch: 15 }, // Region
      { wch: 25 }, // Health Facility
      { wch: 20 }, // Reporting Source
      { wch: 15 }, // Date of Onset
      { wch: 18 }, // Date of Confirmation
      { wch: 30 }, // Symptoms
      { wch: 30 }, // Risk Factors
      { wch: 12 }, // Latitude
      { wch: 12 }, // Longitude
      { wch: 20 }, // Reported At
    ];
    ws["!cols"] = colWidths;

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Human Cases");

    // Generate filename with current date
    const date = new Date().toISOString().split("T")[0];
    const filename = `Human_Cases_Export_${date}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 font-primary">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Human Cases Directory
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
          <CaseFiltersPanel
            filters={filters}
            setFilters={setFilters}
            filterOptions={filterOptions}
            onReset={resetFilters}
            resultsCount={filteredCases.length}
          />
        )}

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
              <AlertCircle className="w-6 h-6 text-red-600" />
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

        {/* Status Overview */}
        {!isLoading && !error && <CaseStatsCards cases={cases} />}

        {/* Cases Table */}
        {!isLoading && !error && (
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
                    {viewMode === "default" ? (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Case ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Person
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
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Reported
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Case ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          EPID Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Person Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Disease Info
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Classification
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Investigation
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Outcome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedCases.map((caseItem, idx) => (
                    <tr
                      key={caseItem.case_id || caseItem.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <CaseTableRow
                        caseItem={caseItem}
                        viewMode={viewMode}
                        onViewDetails={handleViewDetails}
                        onDelete={handleDeleteCase}
                      />
                    </tr>
                  ))}

                  {paginatedCases.length === 0 && (
                    <tr>
                      <td
                        colSpan={viewMode === "default" ? 9 : 11}
                        className="px-6 py-12 text-center"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No cases found
                          </h3>
                          <p className="text-gray-500 mb-4">
                            Try adjusting your search criteria or filters.
                          </p>
                          <button
                            onClick={resetFilters}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            Clear Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredCases.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum =
                        Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                        i;
                      if (pageNum > totalPages) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Case Modal */}
      <NewCaseModal
        isOpen={showNewCaseModal}
        onClose={() => setShowNewCaseModal(false)}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmitNewCase}
        isSubmitting={isSubmitting}
      />

      {/* Case Details Modal */}
      <CaseDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        caseData={selectedCase}
      />
    </DashboardLayout>
  );
}

export default Cases;
