import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/dashboardLayouts/Dashboard";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  AlertTriangle,
  RefreshCw,
  Calendar,
  MapPin,
  FileText,
} from "lucide-react";

function OverviewDashboard() {
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("month");

  // Real data states
  const [humanCases, setHumanCases] = useState([]);
  const [animalCases, setAnimalCases] = useState([]);
  const [environmentalCases, setEnvironmentalCases] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    humanCases: 0,
    animalCases: 0,
    environmentalCases: 0,
    criticalCases: 0,
    changePercent: 0,
  });
  // Processed data states
  const [diseaseData, setDiseaseData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [severityData, setSeverityData] = useState([]);

  // Colors for charts
  const pieColors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"];
  const severityColors = {
    critical: "#dc2626",
    high: "#f97316",
    medium: "#fbbf24",
    low: "#10b981",
  };

  // Fetch all cases data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");

      // Fetch data with error handling for individual endpoints
      const results = await Promise.allSettled([
        axios.get("https://backend.onehealth-wwrg.com/api/v1/reports/health", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            page: 1,
            page_size: 100,
            sort_by: "created_at",
            sort_order: "desc",
          },
        }),
        axios.get("https://backend.onehealth-wwrg.com/api/v1/reports/animal", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            page: 1,
            page_size: 100,
            sort_by: "created_at",
            sort_order: "desc",
          },
        }),
        axios.get("https://backend.onehealth-wwrg.com/api/v1/reports/env", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            page: 1,
            page_size: 100,
            sort_by: "created_at",
            sort_order: "desc",
          },
        }),
      ]);

      // Extract data with fallbacks
      const humanData =
        results[0].status === "fulfilled"
          ? results[0].value.data.items || results[0].value.data || []
          : [];

      const animalData =
        results[1].status === "fulfilled"
          ? Array.isArray(results[1].value.data)
            ? results[1].value.data
            : results[1].value.data.items || []
          : [];

      const envData =
        results[2].status === "fulfilled"
          ? Array.isArray(results[2].value.data)
            ? results[2].value.data
            : results[2].value.data.items || []
          : [];

      // Log any failures
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          const endpoints = ["health", "animal", "environmental"];
          console.warn(
            `Failed to fetch ${endpoints[index]} data:`,
            result.reason
          );
        }
      });

      setHumanCases(humanData);
      setAnimalCases(animalData);
      setEnvironmentalCases(envData);

      // Process and calculate statistics
      processStatistics(humanData, animalData, envData);
      processDiseaseData(humanData, animalData);
      processStateData(humanData, animalData, envData);
      processLocationData(humanData, animalData, envData);
      processTrendData(humanData, animalData, envData);
      processSeverityData(humanData, animalData, envData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  // Process statistics
  const processStatistics = (human, animal, env) => {
    const totalReports = human.length + animal.length + env.length;
    const criticalCases = [
      ...human.filter((c) => c.classification?.toLowerCase() === "confirmed"),
      ...animal.filter((c) => c.classification?.toLowerCase() === "confirmed"),
      ...env.filter((c) => c.severity?.toLowerCase() === "critical"),
    ].length;

    setStats({
      totalReports,
      humanCases: human.length,
      animalCases: animal.length,
      environmentalCases: env.length,
      criticalCases,
      changePercent: 0, // Calculate based on historical data if available
    });
  };

  // Process disease data for top diseases
  const processDiseaseData = (human, animal) => {
    const diseaseCounts = {};

    [...human, ...animal].forEach((item) => {
      const disease = item.disease || "Unknown";
      diseaseCounts[disease] = (diseaseCounts[disease] || 0) + 1;
    });

    const sortedDiseases = Object.entries(diseaseCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));

    setDiseaseData(sortedDiseases);
  };

  // Process state data
  const processStateData = (human, animal, env) => {
    const stateCounts = {};

    [...human, ...animal, ...env].forEach((item) => {
      const state = item.state || "Unknown";
      stateCounts[state] = (stateCounts[state] || 0) + 1;
    });

    const sortedStates = Object.entries(stateCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));

    setStateData(sortedStates);
  };

  // Process location data (regions)
  const processLocationData = (human, animal, env) => {
    const regionMap = {
      North: [
        "Kano",
        "Kaduna",
        "Katsina",
        "Jigawa",
        "Borno",
        "Yobe",
        "Bauchi",
        "Gombe",
      ],
      South: [
        "Lagos",
        "Rivers",
        "Delta",
        "Edo",
        "Akwa Ibom",
        "Cross River",
        "Bayelsa",
      ],
      East: ["Enugu", "Anambra", "Imo", "Abia", "Ebonyi", "Ondo", "Ekiti"],
      West: [
        "Oyo",
        "Ogun",
        "Osun",
        "Kwara",
        "Niger",
        "Kogi",
        "Benue",
        "Plateau",
      ],
    };

    const regionCounts = { North: 0, South: 0, East: 0, West: 0 };

    [...human, ...animal, ...env].forEach((item) => {
      const state = item.state;
      for (const [region, states] of Object.entries(regionMap)) {
        if (states.includes(state)) {
          regionCounts[region]++;
          break;
        }
      }
    });

    const total = Object.values(regionCounts).reduce((a, b) => a + b, 0);
    const locationPercentages = Object.entries(regionCounts).map(
      ([name, count]) => ({
        name,
        value: total > 0 ? ((count / total) * 100).toFixed(1) : 0,
        count,
      })
    );

    setLocationData(locationPercentages);
  };

  // Process trend data (monthly)
  const processTrendData = (human, animal, env) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentYear = new Date().getFullYear();
    const monthlyCounts = {};

    [...human, ...animal, ...env].forEach((item) => {
      const date = new Date(item.reported_at || item.created_at);
      if (date.getFullYear() === currentYear) {
        const month = monthNames[date.getMonth()];
        monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
      }
    });

    const trendArray = monthNames.map((month) => ({
      month,
      cases: monthlyCounts[month] || 0,
    }));

    setTrendData(trendArray);
  };

  // Process severity data
  const processSeverityData = (human, animal, env) => {
    const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };

    const getSeverity = (classification) => {
      switch (classification?.toLowerCase()) {
        case "confirmed":
          return "critical";
        case "probable":
          return "high";
        case "suspect":
          return "medium";
        default:
          return "low";
      }
    };

    human.forEach((item) => {
      const severity = getSeverity(item.classification);
      severityCounts[severity]++;
    });

    animal.forEach((item) => {
      const severity = getSeverity(item.classification);
      severityCounts[severity]++;
    });

    env.forEach((item) => {
      const severity = item.severity?.toLowerCase() || "low";
      if (severityCounts[severity] !== undefined) {
        severityCounts[severity]++;
      }
    });

    setSeverityData(
      Object.entries(severityCounts).map(([name, value]) => ({ name, value }))
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-red-800 font-medium">{error}</p>
              <button
                onClick={fetchAllData}
                className="text-red-600 hover:text-red-700 text-sm underline mt-1"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                Dashboard Overview
              </h2>
              <p className="text-gray-600 mt-1">
                Real-time surveillance system monitoring
              </p>
            </div>
            <button
              onClick={fetchAllData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Reports
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.totalReports.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Human Cases</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.humanCases.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Animal Cases
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.animalCases.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Environmental
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.environmentalCases.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <MapPin className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Critical Cases
                </p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {stats.criticalCases.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Trend Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Monthly Trends
                </h3>
                <p className="text-sm text-gray-600">
                  Cases reported this year
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">2024</span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cases"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Total Cases"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Severity Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Severity Distribution
            </h3>
            <div className="h-72 flex items-center justify-center px-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <Pie
                    data={severityData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={65}
                    innerRadius={0}
                    label={({ cx, cy, midAngle, outerRadius, percent }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius + 25;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);

                      return (
                        <text
                          x={x}
                          y={y}
                          fill="#374151"
                          textAnchor={x > cx ? "start" : "end"}
                          dominantBaseline="central"
                          style={{ fontSize: "13px", fontWeight: "600" }}
                        >
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                    labelLine={{
                      stroke: "#9ca3af",
                      strokeWidth: 1,
                    }}
                  >
                    {severityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={severityColors[entry.name] || "#94a3b8"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {severityData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: severityColors[item.name] || "#94a3b8",
                      }}
                    ></div>
                    <span className="text-gray-700 capitalize">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Diseases */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Top Diseases
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={diseaseData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    type="number"
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#6b7280"
                    style={{ fontSize: "11px" }}
                    width={75}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Reports by States */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Top States
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stateData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    stroke="#6b7280"
                    style={{ fontSize: "11px" }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Regional Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Regional Distribution
            </h3>
            <div className="h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={locationData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={false}
                  >
                    {locationData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${props.payload.value}%`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {locationData.map((loc, idx) => (
                <div
                  key={loc.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: pieColors[idx % pieColors.length],
                      }}
                    ></div>
                    <span className="text-gray-700">{loc.name}</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {loc.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default OverviewDashboard;
