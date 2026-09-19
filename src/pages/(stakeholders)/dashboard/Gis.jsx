import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../../components/Navbar";
import DashboardLayout from "../../../components/dashboardLayouts/Dashboard";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  CircleMarker,
  LayersControl,
  LayerGroup,
  useMap,
  Tooltip,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import nigeriaGeoJson from "../../../geodata.json";
import {
  Search,
  Filter,
  RefreshCw,
  Users,
  PawPrint,
  Leaf,
  BarChart3,
  Eye,
  EyeOff,
  Flame,
  AlertTriangle,
  MapPin,
  Clock,
  X,
} from "lucide-react";

// Custom CSS for professional markers
const markerStyles = `
  .custom-case-marker {
    background: transparent !important;
    border: none !important;
  }
  .custom-case-marker svg {
    overflow: visible;
  }
  @keyframes newAlertPulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.15);
    }
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = markerStyles;
  document.head.appendChild(styleSheet);
}

// All case data (human, animal, environmental) will be fetched from API

function InteractiveMap() {
  const [healthData, setHealthData] = useState([]);
  const [humanCasesData, setHumanCasesData] = useState([]);
  const [animalCasesData, setAnimalCasesData] = useState([]);
  const [environmentalCasesData, setEnvironmentalCasesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stateColor, setStateColor] = useState("#90ee90");
  const [showControls, setShowControls] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    caseType: "all", // all, human, animal, environmental
    severity: "all", // all, low, medium, high, critical
    status: "all", // all, active, contained, monitoring, etc.
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleLayers, setVisibleLayers] = useState({
    human: true,
    animal: true,
    environmental: true,
  });
  const [newCaseAlert, setNewCaseAlert] = useState(null);
  const [previousCaseCount, setPreviousCaseCount] = useState({
    human: 0,
    animal: 0,
    environmental: 0,
  });
  const [mapZoom, setMapZoom] = useState(6); // Track current zoom level
  const [scrollWheelZoomEnabled, setScrollWheelZoomEnabled] = useState(false); // Toggle scroll-wheel zoom
  const [showHeatMap, setShowHeatMap] = useState(false); // Toggle heat map view
  const [newAlertCaseId, setNewAlertCaseId] = useState(null); // Track the new alert case ID for animation

  const mapRef = useRef(null);
  const audioRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const soundIntervalRef = useRef(null);
  const soundTimeoutRef = useRef(null);

  // Fetch human cases from API
  const fetchHumanCases = async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
      }
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
            page: 1,
            page_size: 100,
            sort_by: "created_at",
            sort_order: "desc",
          },
        }
      );

      console.log("Human cases API response:", response.data);

      if (response.data && response.data.items) {
        // Transform API data to match expected structure
        const transformedHumanCases = response.data.items.map(
          (item, index) => ({
            id: item.id || index + 1,
            name: `${item.case_id} - ${item.disease}`,
            lat: item.latitude,
            lon: item.longitude,
            cases: 1, // Each item is one case
            disease: item.disease,
            severity: getSeverityFromClassification(item.classification),
            type: "human",
            reportedDate: item.reported_at
              ? new Date(item.reported_at).toISOString().split("T")[0]
              : null,
            status: getStatusFromOutcome(item.outcome),
            // Additional fields from API
            caseId: item.case_id,
            personID: item.personID,
            age: item.age,
            sex: item.sex,
            state: item.state,
            lga: item.lga,
            region: item.region,
            healthFacility: item.health_facility,
            reportingSource: item.reporting_source,
            symptoms: item.symptoms,
            riskFactors: item.risk_factors,
            classification: item.classification,
            outcome: item.outcome,
            dateOfOnset: item.date_of_onset,
            dateOfConfirmation: item.date_of_confirmation,
            occupation: item.occupation,
          })
        );

        setHumanCasesData(transformedHumanCases);
        console.log("Transformed human cases:", transformedHumanCases);
        return transformedHumanCases;
      } else {
        setHumanCasesData([]);
        return [];
      }
    } catch (error) {
      console.error("Error fetching human cases:", error);
      setError(error.response?.data?.message || "Failed to fetch human cases");
      setHumanCasesData([]);
      return [];
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  };

  // Helper function to map classification to severity
  const getSeverityFromClassification = (classification) => {
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

  // Helper function to map outcome to status
  const getStatusFromOutcome = (outcome) => {
    switch (outcome?.toLowerCase()) {
      case "deceased":
        return "critical";
      case "recovered":
        return "contained";
      case "under treatment":
        return "active";
      default:
        return "monitoring";
    }
  };

  // Function to play alert sound repeatedly
  const playAlertSound = () => {
    // Clear any existing sound intervals/timeouts first
    stopAlertSound();

    // Create a simple beep sound using Web Audio API
    const playBeep = () => {
      try {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Set frequency for alert sound (higher pitch)
        oscillator.frequency.value = 800;
        oscillator.type = "sine";

        // Set volume
        gainNode.gain.value = 0.3;

        // Play sound
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);

        // Second beep
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();
        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);
        oscillator2.frequency.value = 1000;
        oscillator2.type = "sine";
        gainNode2.gain.value = 0.3;
        oscillator2.start(audioContext.currentTime + 0.4);
        oscillator2.stop(audioContext.currentTime + 0.7);

        console.log("Alert sound played");
      } catch (error) {
        console.log("Audio play failed:", error);
      }
    };

    // Play immediately
    playBeep();

    // Repeat every 3 seconds for 1 minute
    soundIntervalRef.current = setInterval(playBeep, 3000);

    // Stop after 1 minute
    soundTimeoutRef.current = setTimeout(() => {
      stopAlertSound();
      console.log("Alert sound stopped after 1 minute");
    }, 60000);
  };

  // Function to stop alert sound
  const stopAlertSound = () => {
    if (soundIntervalRef.current) {
      clearInterval(soundIntervalRef.current);
      soundIntervalRef.current = null;
    }
    if (soundTimeoutRef.current) {
      clearTimeout(soundTimeoutRef.current);
      soundTimeoutRef.current = null;
    }
    console.log("Alert sound stopped");
  };

  // Function to show new case notification
  const showNewCaseNotification = (caseData) => {
    setNewCaseAlert(caseData);
    setNewAlertCaseId(caseData.id); // Set the case ID for marker animation
    playAlertSound();

    // Auto-hide notification after 1 minute (60 seconds)
    setTimeout(() => {
      setNewCaseAlert(null);
      setNewAlertCaseId(null); // Clear the animation marker
      stopAlertSound();
    }, 60000);
  };

  // Check for new cases and trigger alerts
  const checkForNewCases = (newHumanCases, newAnimalCases, newEnvCases) => {
    const currentCounts = {
      human: newHumanCases.length,
      animal: newAnimalCases.length,
      environmental: newEnvCases.length,
    };

    // Check if this is the initial load
    const isInitialLoad =
      previousCaseCount.human === 0 &&
      previousCaseCount.animal === 0 &&
      previousCaseCount.environmental === 0;

    if (!isInitialLoad) {
      // Check for new human cases
      if (currentCounts.human > previousCaseCount.human) {
        const newCases = newHumanCases.slice(
          0,
          currentCounts.human - previousCaseCount.human
        );
        newCases.forEach((caseData) => {
          showNewCaseNotification({
            ...caseData,
            message: `New Human Case Alert: ${caseData.disease}`,
          });
        });
      }

      // Check for new animal cases
      if (currentCounts.animal > previousCaseCount.animal) {
        const newCases = newAnimalCases.slice(
          0,
          currentCounts.animal - previousCaseCount.animal
        );
        newCases.forEach((caseData) => {
          showNewCaseNotification({
            ...caseData,
            message: `New Animal Case Alert: ${caseData.disease}`,
          });
        });
      }

      // Check for new environmental cases
      if (currentCounts.environmental > previousCaseCount.environmental) {
        const newCases = newEnvCases.slice(
          0,
          currentCounts.environmental - previousCaseCount.environmental
        );
        newCases.forEach((caseData) => {
          showNewCaseNotification({
            ...caseData,
            message: `New Environmental Case Alert: ${
              caseData.contaminant || caseData.disease
            }`,
          });
        });
      }
    }

    // Update previous counts
    setPreviousCaseCount(currentCounts);
  };

  // Fetch animal cases from API
  const fetchAnimalCases = async (silent = false) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        "https://backend.onehealth-wwrg.com/api/v1/reports/animal",
        {
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
        }
      );

      console.log("Animal cases API response:", response.data);

      if (response.data) {
        const items = Array.isArray(response.data)
          ? response.data
          : response.data.items || [];

        const transformedAnimalCases = items.map((item, index) => ({
          id: item.id || index + 1,
          name: `${item.case_id} - ${item.disease}`,
          lat: item.latitude,
          lon: item.longitude,
          cases: 1,
          disease: item.disease,
          species: item.animal_type,
          severity: getSeverityFromClassification(item.classification),
          type: "animal",
          reportedDate: item.reported_at
            ? new Date(item.reported_at).toISOString().split("T")[0]
            : null,
          status: getStatusFromOutcome(item.outcome),
          caseId: item.case_id,
          animalType: item.animal_type,
          farmOwner: item.farm_owner,
          state: item.state,
          lga: item.lga,
          region: item.region,
          classification: item.classification,
          outcome: item.outcome,
        }));

        setAnimalCasesData(transformedAnimalCases);
        console.log("Transformed animal cases:", transformedAnimalCases);
        return transformedAnimalCases;
      } else {
        setAnimalCasesData([]);
        return [];
      }
    } catch (error) {
      console.error("Error fetching animal cases:", error);
      setAnimalCasesData([]);
      return [];
    }
  };

  // Fetch environmental cases from API
  const fetchEnvironmentalCases = async (silent = false) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        "https://backend.onehealth-wwrg.com/api/v1/reports/env",
        {
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
        }
      );

      console.log("Environmental cases API response:", response.data);

      if (response.data) {
        const items = Array.isArray(response.data)
          ? response.data
          : response.data.items || [];

        const transformedEnvCases = items.map((item, index) => ({
          id: item.id || index + 1,
          name: `${item.case_id} - ${item.environmental_factors}`,
          lat: item.latitude,
          lon: item.longitude,
          cases: 1,
          disease: item.disease,
          contaminant: item.environmental_factors,
          severity: getSeverityFromClassification(item.classification),
          type: "environmental",
          reportedDate: item.reported_at
            ? new Date(item.reported_at).toISOString().split("T")[0]
            : null,
          status: item.sample_collected ? "assessment" : "pending",
          caseId: item.case_id,
          environmentalFactors: item.environmental_factors,
          sampleCollected: item.sample_collected,
          labResults: item.lab_results,
          state: item.state,
          lga: item.lga,
          region: item.region,
          classification: item.classification,
          outcome: item.outcome,
        }));

        setEnvironmentalCasesData(transformedEnvCases);
        console.log("Transformed environmental cases:", transformedEnvCases);
        return transformedEnvCases;
      } else {
        setEnvironmentalCasesData([]);
        return [];
      }
    } catch (error) {
      console.error("Error fetching environmental cases:", error);
      setEnvironmentalCasesData([]);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllCases = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [humanCases, animalCases, envCases] = await Promise.all([
          fetchHumanCases(),
          fetchAnimalCases(),
          fetchEnvironmentalCases(),
        ]);

        // Initialize case counts on first load
        checkForNewCases(humanCases, animalCases, envCases);
      } catch (error) {
        console.error("Error fetching cases:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllCases();
  }, []);

  // Real-time polling effect - checks for new cases every 10 seconds
  useEffect(() => {
    const pollForNewCases = async () => {
      try {
        const [humanCases, animalCases, envCases] = await Promise.all([
          fetchHumanCases(true), // silent mode - no loading spinner
          fetchAnimalCases(true),
          fetchEnvironmentalCases(true),
        ]);

        // Check for new cases and trigger alerts
        checkForNewCases(humanCases, animalCases, envCases);
      } catch (error) {
        console.error("Error polling for new cases:", error);
      }
    };

    // Set up polling interval (10 seconds)
    pollingIntervalRef.current = setInterval(pollForNewCases, 10000);

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [humanCasesData, animalCasesData, environmentalCasesData]);

  // Function to refresh all data manually
  const refreshAllData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [humanCases, animalCases, envCases] = await Promise.all([
        fetchHumanCases(),
        fetchAnimalCases(),
        fetchEnvironmentalCases(),
      ]);

      // Check for new cases
      checkForNewCases(humanCases, animalCases, envCases);
    } catch (error) {
      console.error("Error refreshing cases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Combine all case data when any cases are loaded
  useEffect(() => {
    const allCasesData = [
      ...humanCasesData,
      ...animalCasesData,
      ...environmentalCasesData,
    ];
    setHealthData(allCasesData);
    console.log("Combined all cases:", allCasesData);
  }, [humanCasesData, animalCasesData, environmentalCasesData]);

  // Filter data based on active filters and search
  const filteredData = healthData.filter((item) => {
    const typeMatch =
      activeFilters.caseType === "all" || item.type === activeFilters.caseType;
    const severityMatch =
      activeFilters.severity === "all" ||
      item.severity === activeFilters.severity;
    const statusMatch =
      activeFilters.status === "all" || item.status === activeFilters.status;
    const searchMatch =
      !searchTerm ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.disease &&
        item.disease.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.contaminant &&
        item.contaminant.toLowerCase().includes(searchTerm.toLowerCase()));

    return typeMatch && severityMatch && statusMatch && searchMatch;
  });

  // Calculate statistics
  const stats = {
    total: filteredData.length,
    human: filteredData.filter((item) => item.type === "human").length,
    animal: filteredData.filter((item) => item.type === "animal").length,
    environmental: filteredData.filter((item) => item.type === "environmental")
      .length,
    critical: filteredData.filter((item) => item.severity === "critical")
      .length,
    active: filteredData.filter((item) => item.status === "active").length,
  };

  // const nigeriaBounds = L.geoJSON(nigeriaGeoJson).getBounds();

  const onEachFeature = (feature, layer) => {
    const { state, cases, id } = feature.properties;

    // Only bind popup if state is defined
    if (state && state !== "undefined") {
      layer.bindPopup(`<strong>${state}</strong><br>Cases: ${cases || 0}`);
    }

    layer.on("mouseover", () => {
      layer.setStyle({
        fillOpacity: 0.7,
        weight: 2,
        fillColor: "blue",
      });
    });
    layer.on("mouseout", () => {
      layer.setStyle(stateStyle(feature));
    });
  };

  const stateStyle = (feature) => ({
    fillColor: "transparent",
    color: "black",
    weight: 2,
    fillOpacity: 0.1,
    opacity: 1,
  });

  // Component to track map zoom level and handle scroll wheel zoom toggle
  const ZoomHandler = () => {
    const map = useMap();

    useEffect(() => {
      const handleZoom = () => {
        setMapZoom(map.getZoom());
      };

      map.on("zoomend", handleZoom);

      return () => {
        map.off("zoomend", handleZoom);
      };
    }, [map]);

    // Enable/disable scroll wheel zoom based on state
    useEffect(() => {
      if (scrollWheelZoomEnabled) {
        map.scrollWheelZoom.enable();
      } else {
        map.scrollWheelZoom.disable();
      }
    }, [map, scrollWheelZoomEnabled]);

    // Fix popup panning issue - ensure map remains draggable after popup opens
    useEffect(() => {
      // Ensure dragging is always enabled
      map.dragging.enable();

      // Handle popup open events
      const handlePopupOpen = () => {
        // Re-enable dragging and zooming after popup opens
        setTimeout(() => {
          map.dragging.enable();
          map.touchZoom.enable();
          map.doubleClickZoom.enable();
          map.boxZoom.enable();
          map.keyboard.enable();
          if (scrollWheelZoomEnabled) {
            map.scrollWheelZoom.enable();
          }
        }, 100);
      };

      map.on("popupopen", handlePopupOpen);

      return () => {
        map.off("popupopen", handlePopupOpen);
      };
    }, [map, scrollWheelZoomEnabled]);

    return null;
  };

  // Heat Map Component
  const HeatMapLayer = ({ data }) => {
    const map = useMap();

    useEffect(() => {
      if (!data || data.length === 0) return;

      // Prepare heat map data: [lat, lng, intensity]
      const heatData = data
        .filter((item) => item.lat != null && item.lon != null)
        .map((item) => {
          // Intensity based on severity: critical=1.0, high=0.75, medium=0.5, low=0.25
          let intensity = 0.5;
          switch (item.severity) {
            case "critical":
              intensity = 1.0;
              break;
            case "high":
              intensity = 0.75;
              break;
            case "medium":
              intensity = 0.5;
              break;
            case "low":
              intensity = 0.25;
              break;
          }
          return [item.lat, item.lon, intensity];
        });

      // Create heat layer with custom gradient
      const heatLayer = L.heatLayer(heatData, {
        radius: 25,
        blur: 15,
        maxZoom: 13,
        max: 1.0,
        gradient: {
          0.0: "#fbbf24", // yellow (low)
          0.4: "#fb923c", // orange (medium)
          0.6: "#f87171", // light red (high)
          0.8: "#dc2626", // strong red (critical)
          1.0: "#991b1b", // dark red (very critical)
        },
      }).addTo(map);

      return () => {
        map.removeLayer(heatLayer);
      };
    }, [map, data]);

    return null;
  };

  // Professional marker system with clean medical/scientific icons
  // Icons scale based on zoom level for better visibility
  const createCaseIcon = (
    caseType,
    severity,
    zoom = mapZoom,
    isNewAlert = false
  ) => {
    let iconPath = "";
    let iconColor = "";
    let backgroundColor = "";
    let borderColor = "";

    // Calculate zoom scale factor (zoom levels 5-18, scale 0.6x to 2.0x)
    const zoomScale = Math.max(0.6, Math.min(2.0, 0.6 + (zoom - 5) * 0.1));

    // Base sizes for different severities (will be multiplied by zoomScale)
    let baseSize = 32;

    // Unified severity color scale (applies to all case types)
    switch (severity) {
      case "critical":
        backgroundColor = "#dc2626"; // strong red
        borderColor = "#991b1b"; // darker red border
        iconColor = "#ffffff"; // white icon
        baseSize = 40;
        break;
      case "high":
        backgroundColor = "#f87171"; // lighter red
        borderColor = "#dc2626"; // red border
        iconColor = "#ffffff";
        baseSize = 36;
        break;
      case "medium":
        backgroundColor = "#fb923c"; // orange
        borderColor = "#ea580c"; // darker orange border
        iconColor = "#ffffff";
        baseSize = 32;
        break;
      case "low":
        backgroundColor = "#fbbf24"; // yellow
        borderColor = "#f59e0b"; // darker yellow border
        iconColor = "#78350f"; // dark brown icon
        baseSize = 28;
        break;
      default:
        backgroundColor = "#6b7280"; // neutral gray
        borderColor = "#4b5563";
        iconColor = "#ffffff";
    }

    // Professional SVG icon paths for each case type
    switch (caseType) {
      case "human":
        // Medical cross icon (professional medical symbol)
        iconPath = `
          <g transform="translate(50, 50)">
            <rect x="-3" y="-12" width="6" height="24" fill="${iconColor}" rx="1"/>
            <rect x="-12" y="-3" width="24" height="6" fill="${iconColor}" rx="1"/>
            <circle cx="0" cy="0" r="14" fill="none" stroke="${iconColor}" stroke-width="2"/>
          </g>
        `;
        break;
      case "animal":
        // Veterinary symbol (paw with medical cross)
        iconPath = `
          <g transform="translate(50, 50)">
            <!-- Paw pad -->
            <ellipse cx="0" cy="2" rx="8" ry="10" fill="${iconColor}"/>
            <!-- Toes -->
            <circle cx="-7" cy="-6" r="4" fill="${iconColor}"/>
            <circle cx="0" cy="-8" r="4" fill="${iconColor}"/>
            <circle cx="7" cy="-6" r="4" fill="${iconColor}"/>
            <!-- Small cross overlay -->
            <rect x="-1.5" y="-2" width="3" height="8" fill="${backgroundColor}" rx="0.5"/>
            <rect x="-4" y="1.5" width="8" height="3" fill="${backgroundColor}" rx="0.5"/>
          </g>
        `;
        break;
      case "environmental":
        // Biohazard symbol (professional version)
        iconPath = `
          <g transform="translate(50, 50)">
            <circle cx="0" cy="0" r="3" fill="${iconColor}"/>
            <g transform="rotate(0)">
              <path d="M 0,-3 C -4,-8 -8,-8 -10,-4 L -5,-2 C -3,-4 -2,-4 0,-3 Z" fill="${iconColor}"/>
              <circle cx="-9" cy="-5" r="3" fill="${iconColor}"/>
            </g>
            <g transform="rotate(120)">
              <path d="M 0,-3 C -4,-8 -8,-8 -10,-4 L -5,-2 C -3,-4 -2,-4 0,-3 Z" fill="${iconColor}"/>
              <circle cx="-9" cy="-5" r="3" fill="${iconColor}"/>
            </g>
            <g transform="rotate(240)">
              <path d="M 0,-3 C -4,-8 -8,-8 -10,-4 L -5,-2 C -3,-4 -2,-4 0,-3 Z" fill="${iconColor}"/>
              <circle cx="-9" cy="-5" r="3" fill="${iconColor}"/>
            </g>
          </g>
        `;
        break;
      default:
        iconPath = `<circle cx="50" cy="50" r="8" fill="${iconColor}"/>`;
    }

    // Apply zoom scaling to final size
    const size = Math.round(baseSize * zoomScale);

    // Create professional marker with clean design
    const iconHtml = `
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        ${
          isNewAlert
            ? "animation: newAlertPulse 1.5s ease-in-out infinite;"
            : ""
        }
      ">
        <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <!-- Professional drop shadow -->
            <filter id="shadow-${caseType}-${severity}-${size}" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.4"/>
            </filter>
            
            <!-- Gradient for depth -->
            <radialGradient id="gradient-${caseType}-${severity}-${size}">
              <stop offset="0%" stop-color="${backgroundColor}" stop-opacity="1"/>
              <stop offset="100%" stop-color="${borderColor}" stop-opacity="1"/>
            </radialGradient>
          </defs>
          
          <!-- Outer glow for critical cases OR new alert -->
          ${
            severity === "critical" || isNewAlert
              ? `
            <circle cx="50" cy="50" r="48" fill="none" stroke="${backgroundColor}" stroke-width="4" opacity="0.3">
              <animate attributeName="r" values="48;52;48" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite"/>
            </circle>
          `
              : ""
          }
          
          <!-- Additional pulsing ring for new alerts -->
          ${
            isNewAlert
              ? `
            <circle cx="50" cy="50" r="45" fill="none" stroke="#fbbf24" stroke-width="3" opacity="0.6">
              <animate attributeName="r" values="45;55;45" dur="1.5s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.6;0;0.6" dur="1.5s" repeatCount="indefinite"/>
            </circle>
          `
              : ""
          }
          
          <!-- Main marker circle with gradient -->
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            fill="url(#gradient-${caseType}-${severity}-${size})" 
            stroke="${borderColor}" 
            stroke-width="3"
            filter="url(#shadow-${caseType}-${severity}-${size})"
          />
          
          <!-- Icon -->
          ${iconPath}
          
          <!-- Severity indicator dots -->
          ${
            severity === "critical"
              ? `
            <circle cx="50" cy="80" r="3" fill="${iconColor}"/>
            <circle cx="44" cy="78" r="2" fill="${iconColor}" opacity="0.7"/>
            <circle cx="56" cy="78" r="2" fill="${iconColor}" opacity="0.7"/>
          `
              : severity === "high"
              ? `
            <circle cx="50" cy="80" r="2.5" fill="${iconColor}"/>
            <circle cx="44" cy="78" r="2" fill="${iconColor}" opacity="0.7"/>
          `
              : severity === "medium"
              ? `
            <circle cx="50" cy="80" r="2" fill="${iconColor}"/>
          `
              : ""
          }
        </svg>
      </div>
    `;

    return L.divIcon({
      html: iconHtml,
      className: `custom-case-marker ${isNewAlert ? "new-alert-marker" : ""}`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2],
    });
  };

  // Create impact radius circles for environmental cases with case-type specific colors
  const createImpactCircle = (environmentalCase) => {
    let color = "#8e44ad"; // Purple for environmental consistency
    let opacity = 0.3;

    switch (environmentalCase.severity) {
      case "critical":
        opacity = 0.5;
        break;
      case "high":
        opacity = 0.4;
        break;
      case "medium":
        opacity = 0.3;
        break;
      case "low":
        opacity = 0.2;
        break;
    }

    return {
      center: [environmentalCase.lat, environmentalCase.lon],
      radius: environmentalCase.affectedRadius || 1000,
      pathOptions: {
        color: color,
        fillColor: color,
        fillOpacity: opacity,
        weight: 3,
      },
    };
  };

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Map Data
          </h2>
          <p className="text-gray-600">
            Fetching real-time health surveillance data...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h2 className="text-xl font-semibold text-red-900 mb-2">
              Error Loading Data
            </h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchHumanCases}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        {/* Enhanced Control Panel */}
        {showControls && (
          <div className="bg-gray-50 shadow-lg border-b border-gray-200 p-4 z-10">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2.5 rounded-lg shadow-md">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    GIS Dashboard Control Panel
                  </h2>
                  <p className="text-xs text-gray-600">
                    Real-time One Health Surveillance Monitoring
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowControls(false)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow"
              >
                <EyeOff className="w-4 h-4" />
                Hide Panel
              </button>
            </div>

            {/* Statistics Dashboard */}
            <div className="grid grid-cols-6 gap-3 mb-4">
              <div className="bg-blue-600 px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs text-blue-100 font-semibold uppercase tracking-wide">
                    Total Cases
                  </div>
                  <BarChart3 className="w-4 h-4 text-blue-200" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {stats.total}
                </div>
                <div className="text-xs text-blue-100 mt-1 flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      humanCasesData.length > 0
                        ? "bg-green-300 animate-pulse"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  {humanCasesData.length > 0 ? "Live Data" : "No Data"}
                </div>
              </div>

              <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                    Human
                  </div>
                  <Users className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {stats.human}
                </div>
                <div className="text-xs text-gray-500 mt-1">Health Cases</div>
              </div>

              <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                    Animal
                  </div>
                  <PawPrint className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {stats.animal}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Veterinary Cases
                </div>
              </div>

              <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                    Environmental
                  </div>
                  <Leaf className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {stats.environmental}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Eco-Health Cases
                </div>
              </div>

              <div className="bg-orange-500 px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs text-orange-100 font-semibold uppercase tracking-wide">
                    Critical
                  </div>
                  <AlertTriangle className="w-4 h-4 text-orange-100" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {stats.critical}
                </div>
                <div className="text-xs text-orange-100 mt-1">
                  High Priority
                </div>
              </div>

              <div className="bg-gray-700 px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs text-gray-300 font-semibold uppercase tracking-wide">
                    Zoom Level
                  </div>
                  <MapPin className="w-4 h-4 text-gray-300" />
                </div>
                <div className="text-2xl font-bold text-white">{mapZoom}</div>
                <div className="text-xs text-gray-300 mt-1">Max: 18</div>
              </div>
            </div>

            {/* Quick Controls Row */}
            <div className="flex items-center justify-between gap-3 mb-4 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowHeatMap(!showHeatMap)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium shadow-sm hover:shadow ${
                    showHeatMap
                      ? "bg-orange-500 text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  title={showHeatMap ? "Disable Heat Map" : "Enable Heat Map"}
                >
                  <Flame className="w-4 h-4" />
                  Heat Map: {showHeatMap ? "ON" : "OFF"}
                </button>
                <button
                  onClick={() =>
                    setScrollWheelZoomEnabled(!scrollWheelZoomEnabled)
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium shadow-sm hover:shadow ${
                    scrollWheelZoomEnabled
                      ? "bg-green-500 text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  title={
                    scrollWheelZoomEnabled
                      ? "Disable Scroll Zoom"
                      : "Enable Scroll Zoom"
                  }
                >
                  <BarChart3 className="w-4 h-4" />
                  Scroll Zoom: {scrollWheelZoomEnabled ? "ON" : "OFF"}
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={refreshAllData}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow font-medium"
                  title="Refresh All Cases Data"
                  disabled={isLoading}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                  {isLoading ? "Refreshing..." : "Refresh Data"}
                </button>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-3 rounded-lg shadow-sm mb-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">
                  Filters & Search
                </span>
                {(activeFilters.caseType !== "all" ||
                  activeFilters.severity !== "all" ||
                  activeFilters.status !== "all" ||
                  searchTerm) && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">
                    Active
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[300px]">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by disease, location, case ID, symptoms..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm font-medium"
                    value={activeFilters.caseType}
                    onChange={(e) =>
                      setActiveFilters((prev) => ({
                        ...prev,
                        caseType: e.target.value,
                      }))
                    }
                  >
                    <option value="all">📊 All Types</option>
                    <option value="human">👥 Human Cases</option>
                    <option value="animal">🐾 Animal Cases</option>
                    <option value="environmental">🌿 Environmental</option>
                  </select>

                  <select
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm font-medium"
                    value={activeFilters.severity}
                    onChange={(e) =>
                      setActiveFilters((prev) => ({
                        ...prev,
                        severity: e.target.value,
                      }))
                    }
                  >
                    <option value="all">⚡ All Severities</option>
                    <option value="critical">🔴 Critical</option>
                    <option value="high">🟠 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>

                  <select
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm font-medium"
                    value={activeFilters.status}
                    onChange={(e) =>
                      setActiveFilters((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                  >
                    <option value="all">📋 All Statuses</option>
                    <option value="active">🔥 Active</option>
                    <option value="contained">✅ Contained</option>
                    <option value="monitoring">👁️ Monitoring</option>
                    <option value="quarantined">🔒 Quarantined</option>
                    <option value="remediation">🔧 Remediation</option>
                  </select>

                  <button
                    onClick={() => {
                      setActiveFilters({
                        caseType: "all",
                        severity: "all",
                        status: "all",
                      });
                      setSearchTerm("");
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-sm font-medium"
                    title="Clear all filters"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Layer Visibility Controls */}
            <div className="bg-white p-3 rounded-lg shadow-sm mb-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">
                  Layer Visibility
                </span>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={visibleLayers.human}
                    onChange={(e) =>
                      setVisibleLayers((prev) => ({
                        ...prev,
                        human: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-1.5 rounded">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Human Cases
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-bold">
                      {stats.human}
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={visibleLayers.animal}
                    onChange={(e) =>
                      setVisibleLayers((prev) => ({
                        ...prev,
                        animal: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 p-1.5 rounded">
                      <PawPrint className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Animal Cases
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-bold">
                      {stats.animal}
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={visibleLayers.environmental}
                    onChange={(e) =>
                      setVisibleLayers((prev) => ({
                        ...prev,
                        environmental: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-100 p-1.5 rounded">
                      <Leaf className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Environmental
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-bold">
                      {stats.environmental}
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Enhanced Legend */}
            <div className="grid grid-cols-2 gap-3">
              {showHeatMap && (
                <div className="col-span-2 bg-orange-50 p-4 rounded-lg border border-orange-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-500 p-2 rounded-lg">
                        <Flame className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-orange-900 text-sm">
                          Heat Map Active
                        </div>
                        <div className="text-xs text-orange-700">
                          Disease concentration density visualization
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-32 h-6 rounded-lg shadow-inner border border-orange-300"
                        style={{
                          background:
                            "linear-gradient(to right, #fbbf24, #fb923c, #f87171, #dc2626, #991b1b)",
                        }}
                      ></div>
                      <div className="text-xs font-medium text-orange-800">
                        Low → Critical
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Severity Scale
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-600 rounded-lg shadow-md flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Critical
                    </span>
                    <span className="text-xs text-gray-500">(40px)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-orange-500 rounded-lg shadow-md flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      High
                    </span>
                    <span className="text-xs text-gray-500">(36px)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-orange-400 rounded-lg shadow-md flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Medium
                    </span>
                    <span className="text-xs text-gray-500">(32px)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-yellow-400 rounded-lg shadow-md flex items-center justify-center">
                      <div className="w-1 h-1 bg-amber-900 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Low
                    </span>
                    <span className="text-xs text-gray-500">(28px)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Case Type Markers
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <filter
                            id="shadow-human"
                            x="-50%"
                            y="-50%"
                            width="200%"
                            height="200%"
                          >
                            <feDropShadow
                              dx="0"
                              dy="2"
                              stdDeviation="3"
                              floodOpacity="0.4"
                            />
                          </filter>
                          <radialGradient id="gradient-human">
                            <stop
                              offset="0%"
                              stopColor="#dc2626"
                              stopOpacity="1"
                            />
                            <stop
                              offset="100%"
                              stopColor="#991b1b"
                              stopOpacity="1"
                            />
                          </radialGradient>
                        </defs>
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="url(#gradient-human)"
                          stroke="#991b1b"
                          strokeWidth="3"
                          filter="url(#shadow-human)"
                        />
                        <g transform="translate(50, 50)">
                          <rect
                            x="-3"
                            y="-12"
                            width="6"
                            height="24"
                            fill="#ffffff"
                            rx="1"
                          />
                          <rect
                            x="-12"
                            y="-3"
                            width="24"
                            height="6"
                            fill="#ffffff"
                            rx="1"
                          />
                          <circle
                            cx="0"
                            cy="0"
                            r="14"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                        </g>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Human Health
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <filter
                            id="shadow-animal"
                            x="-50%"
                            y="-50%"
                            width="200%"
                            height="200%"
                          >
                            <feDropShadow
                              dx="0"
                              dy="2"
                              stdDeviation="3"
                              floodOpacity="0.4"
                            />
                          </filter>
                          <radialGradient id="gradient-animal">
                            <stop
                              offset="0%"
                              stopColor="#10b981"
                              stopOpacity="1"
                            />
                            <stop
                              offset="100%"
                              stopColor="#059669"
                              stopOpacity="1"
                            />
                          </radialGradient>
                        </defs>
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="url(#gradient-animal)"
                          stroke="#059669"
                          strokeWidth="3"
                          filter="url(#shadow-animal)"
                        />
                        <g transform="translate(50, 50)">
                          <ellipse
                            cx="0"
                            cy="2"
                            rx="8"
                            ry="10"
                            fill="#ffffff"
                          />
                          <circle cx="-7" cy="-6" r="4" fill="#ffffff" />
                          <circle cx="0" cy="-8" r="4" fill="#ffffff" />
                          <circle cx="7" cy="-6" r="4" fill="#ffffff" />
                          <rect
                            x="-1.5"
                            y="-2"
                            width="3"
                            height="8"
                            fill="#10b981"
                            rx="0.5"
                          />
                          <rect
                            x="-4"
                            y="1.5"
                            width="8"
                            height="3"
                            fill="#10b981"
                            rx="0.5"
                          />
                        </g>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Animal Health
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <filter
                            id="shadow-env"
                            x="-50%"
                            y="-50%"
                            width="200%"
                            height="200%"
                          >
                            <feDropShadow
                              dx="0"
                              dy="2"
                              stdDeviation="3"
                              floodOpacity="0.4"
                            />
                          </filter>
                          <radialGradient id="gradient-env">
                            <stop
                              offset="0%"
                              stopColor="#8b5cf6"
                              stopOpacity="1"
                            />
                            <stop
                              offset="100%"
                              stopColor="#7c3aed"
                              stopOpacity="1"
                            />
                          </radialGradient>
                        </defs>
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="url(#gradient-env)"
                          stroke="#7c3aed"
                          strokeWidth="3"
                          filter="url(#shadow-env)"
                        />
                        <g transform="translate(50, 50)">
                          <circle cx="0" cy="0" r="3" fill="#ffffff" />
                          <g transform="rotate(0)">
                            <path
                              d="M 0,-3 C -4,-8 -8,-8 -10,-4 L -5,-2 C -3,-4 -2,-4 0,-3 Z"
                              fill="#ffffff"
                            />
                            <circle cx="-9" cy="-5" r="3" fill="#ffffff" />
                          </g>
                          <g transform="rotate(120)">
                            <path
                              d="M 0,-3 C -4,-8 -8,-8 -10,-4 L -5,-2 C -3,-4 -2,-4 0,-3 Z"
                              fill="#ffffff"
                            />
                            <circle cx="-9" cy="-5" r="3" fill="#ffffff" />
                          </g>
                          <g transform="rotate(240)">
                            <path
                              d="M 0,-3 C -4,-8 -8,-8 -10,-4 L -5,-2 C -3,-4 -2,-4 0,-3 Z"
                              fill="#ffffff"
                            />
                            <circle cx="-9" cy="-5" r="3" fill="#ffffff" />
                          </g>
                        </g>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Environmental
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-200">
                    <div className="relative w-10 h-10">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                        className="animate-pulse"
                      >
                        <defs>
                          <radialGradient id="gradient-alert">
                            <stop
                              offset="0%"
                              stopColor="#fb923c"
                              stopOpacity="1"
                            />
                            <stop
                              offset="100%"
                              stopColor="#ea580c"
                              stopOpacity="1"
                            />
                          </radialGradient>
                        </defs>
                        <circle
                          cx="50"
                          cy="50"
                          r="48"
                          fill="none"
                          stroke="#fb923c"
                          strokeWidth="4"
                          opacity="0.3"
                        >
                          <animate
                            attributeName="r"
                            values="48;52;48"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.3;0;0.3"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="url(#gradient-alert)"
                          stroke="#ea580c"
                          strokeWidth="3"
                        />
                        <circle cx="50" cy="80" r="3" fill="#ffffff" />
                        <circle
                          cx="44"
                          cy="78"
                          r="2"
                          fill="#ffffff"
                          opacity="0.7"
                        />
                        <circle
                          cx="56"
                          cy="78"
                          r="2"
                          fill="#ffffff"
                          opacity="0.7"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-orange-700">
                      New Alert (Pulsing)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Show Controls Button */}
        {!showControls && (
          <button
            onClick={() => setShowControls(true)}
            className="absolute top-4 left-4 z-[1000] flex items-center gap-2 px-4 py-3 bg-blue-600 text-white shadow-xl rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 font-semibold"
          >
            <Eye className="w-5 h-5" />
            Show Control Panel
          </button>
        )}

        {/* Enhanced Map */}
        <div
          style={{
            width: "100%",
            height: showControls ? "calc(100vh - 280px)" : "calc(100vh - 64px)",
            overflow: "hidden",
          }}
        >
          <MapContainer
            center={[9.082, 8.6753]}
            zoom={6}
            minZoom={5}
            maxZoom={18}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
          >
            {/* Zoom handler to track zoom level changes */}
            <ZoomHandler />

            {/* Heat Map Layer - Shows when heat map is enabled */}
            {showHeatMap && <HeatMapLayer data={filteredData} />}

            <LayersControl position="topright">
              {/* Base Layers */}
              <LayersControl.BaseLayer name="OpenStreetMap" checked>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>

              <LayersControl.BaseLayer name="Google Satellite">
                <LayerGroup>
                  <TileLayer
                    url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                    attribution="&copy; <a href='https://www.google.com/maps'>Google</a>"
                  />
                  <TileLayer url="https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}" />
                </LayerGroup>
              </LayersControl.BaseLayer>

              {/* Nigeria Boundaries */}
              <LayersControl.Overlay name="Nigeria Boundaries" checked>
                <GeoJSON
                  data={nigeriaGeoJson}
                  style={stateStyle}
                  onEachFeature={onEachFeature}
                  filter={(feature) => {
                    // Only render features with valid state properties
                    const state = feature.properties?.state;
                    return state && state !== "undefined" && state !== "";
                  }}
                />
              </LayersControl.Overlay>

              {/* Human Cases Layer */}
              <LayersControl.Overlay name="Human Health Cases" checked>
                <LayerGroup>
                  {!showHeatMap &&
                    filteredData
                      .filter(
                        (item) =>
                          item.type === "human" &&
                          visibleLayers.human &&
                          item.lat != null &&
                          item.lon != null
                      )
                      .map((caseData) => (
                        <Marker
                          key={caseData.id}
                          position={[caseData.lat, caseData.lon]}
                          icon={createCaseIcon(
                            caseData.type,
                            caseData.severity,
                            mapZoom,
                            caseData.id === newAlertCaseId
                          )}
                        >
                          <Popup
                            maxWidth={350}
                            autoPan={true}
                            autoPanPadding={[50, 50]}
                            closeButton={true}
                            keepInView={true}
                          >
                            <div className="p-3">
                              <h3 className="font-bold text-lg mb-2 text-red-800">
                                <Users className="w-5 h-5 inline mr-2" />
                                {caseData.name}
                              </h3>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <strong>Disease:</strong> {caseData.disease}
                                </div>
                                <div>
                                  <strong>Cases:</strong>{" "}
                                  {caseData.cases.toLocaleString()}
                                </div>
                                <div>
                                  <strong>Severity:</strong>
                                  <span
                                    className={`ml-1 px-2 py-1 rounded text-xs font-bold ${
                                      caseData.severity === "critical"
                                        ? "bg-red-100 text-red-800"
                                        : caseData.severity === "high"
                                        ? "bg-orange-100 text-orange-800"
                                        : caseData.severity === "medium"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    {caseData.severity.toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <strong>Status:</strong>
                                  <span className="ml-1 px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                                    {caseData.status.toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <strong>Reported:</strong>{" "}
                                  {caseData.reportedDate}
                                </div>
                                <div className="text-gray-500">
                                  <strong>Coordinates:</strong>{" "}
                                  {caseData.lat?.toFixed(4) ?? "N/A"},{" "}
                                  {caseData.lon?.toFixed(4) ?? "N/A"}
                                </div>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                </LayerGroup>
              </LayersControl.Overlay>

              {/* Animal Cases Layer */}
              <LayersControl.Overlay name="Animal Health Cases" checked>
                <LayerGroup>
                  {!showHeatMap &&
                    filteredData
                      .filter(
                        (item) =>
                          item.type === "animal" &&
                          visibleLayers.animal &&
                          item.lat != null &&
                          item.lon != null
                      )
                      .map((caseData) => (
                        <Marker
                          key={caseData.id}
                          position={[caseData.lat, caseData.lon]}
                          icon={createCaseIcon(
                            caseData.type,
                            caseData.severity,
                            mapZoom,
                            caseData.id === newAlertCaseId
                          )}
                        >
                          <Popup
                            maxWidth={350}
                            autoPan={true}
                            autoPanPadding={[50, 50]}
                            closeButton={true}
                            keepInView={true}
                          >
                            <div className="p-3">
                              <h3 className="font-bold text-lg mb-2 text-green-800">
                                <PawPrint className="w-5 h-5 inline mr-2" />
                                {caseData.name}
                              </h3>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <strong>Disease:</strong> {caseData.disease}
                                </div>
                                <div>
                                  <strong>Species:</strong> {caseData.species}
                                </div>
                                <div>
                                  <strong>Affected Animals:</strong>{" "}
                                  {caseData.cases.toLocaleString()}
                                </div>
                                <div>
                                  <strong>Farm Owner:</strong>{" "}
                                  {caseData.farmOwner}
                                </div>
                                <div>
                                  <strong>Severity:</strong>
                                  <span
                                    className={`ml-1 px-2 py-1 rounded text-xs font-bold ${
                                      caseData.severity === "critical"
                                        ? "bg-red-100 text-red-800"
                                        : caseData.severity === "high"
                                        ? "bg-orange-100 text-orange-800"
                                        : caseData.severity === "medium"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    {caseData.severity.toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <strong>Status:</strong>
                                  <span className="ml-1 px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                                    {caseData.status.toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <strong>Reported:</strong>{" "}
                                  {caseData.reportedDate}
                                </div>
                                <div className="text-gray-500">
                                  <strong>Coordinates:</strong>{" "}
                                  {caseData.lat?.toFixed(4) ?? "N/A"},{" "}
                                  {caseData.lon?.toFixed(4) ?? "N/A"}
                                </div>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                </LayerGroup>
              </LayersControl.Overlay>

              {/* Environmental Cases Layer with Impact Circles */}
              <LayersControl.Overlay name="Environmental Cases" checked>
                <LayerGroup>
                  {!showHeatMap &&
                    filteredData
                      .filter(
                        (item) =>
                          item.type === "environmental" &&
                          visibleLayers.environmental &&
                          item.lat != null &&
                          item.lon != null
                      )
                      .map((caseData) => {
                        const circleProps = createImpactCircle(caseData);
                        return (
                          <React.Fragment key={caseData.id}>
                            {/* Impact Radius Circle */}
                            <Circle
                              center={circleProps.center}
                              radius={circleProps.radius}
                              pathOptions={circleProps.pathOptions}
                            >
                              <Tooltip>
                                Impact Radius:{" "}
                                {(circleProps.radius / 1000).toFixed(1)} km
                              </Tooltip>
                            </Circle>

                            {/* Marker */}
                            <Marker
                              position={[caseData.lat, caseData.lon]}
                              icon={createCaseIcon(
                                caseData.type,
                                caseData.severity,
                                mapZoom,
                                caseData.id === newAlertCaseId
                              )}
                            >
                              <Popup
                                maxWidth={350}
                                autoPan={true}
                                autoPanPadding={[50, 50]}
                                closeButton={true}
                                keepInView={true}
                              >
                                <div className="p-3">
                                  <h3 className="font-bold text-lg mb-2 text-purple-800">
                                    <Leaf className="w-5 h-5 inline mr-2" />
                                    {caseData.name}
                                  </h3>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <strong>Incident Type:</strong>{" "}
                                      {caseData.incidentType}
                                    </div>
                                    <div>
                                      <strong>Contaminant:</strong>{" "}
                                      {caseData.contaminant}
                                    </div>
                                    <div>
                                      <strong>Affected Population:</strong>{" "}
                                      {caseData.cases.toLocaleString()}
                                    </div>
                                    <div>
                                      <strong>Impact Radius:</strong>{" "}
                                      {(caseData.affectedRadius / 1000).toFixed(
                                        1
                                      )}{" "}
                                      km
                                    </div>
                                    <div>
                                      <strong>Severity:</strong>
                                      <span
                                        className={`ml-1 px-2 py-1 rounded text-xs font-bold ${
                                          caseData.severity === "critical"
                                            ? "bg-red-100 text-red-800"
                                            : caseData.severity === "high"
                                            ? "bg-orange-100 text-orange-800"
                                            : caseData.severity === "medium"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-green-100 text-green-800"
                                        }`}
                                      >
                                        {caseData.severity.toUpperCase()}
                                      </span>
                                    </div>
                                    <div>
                                      <strong>Status:</strong>
                                      <span className="ml-1 px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                                        {caseData.status.toUpperCase()}
                                      </span>
                                    </div>
                                    <div>
                                      <strong>Reported:</strong>{" "}
                                      {caseData.reportedDate}
                                    </div>
                                    <div className="text-gray-500">
                                      <strong>Coordinates:</strong>{" "}
                                      {caseData.lat?.toFixed(4) ?? "N/A"},{" "}
                                      {caseData.lon?.toFixed(4) ?? "N/A"}
                                    </div>
                                  </div>
                                </div>
                              </Popup>
                            </Marker>
                          </React.Fragment>
                        );
                      })}
                </LayerGroup>
              </LayersControl.Overlay>
            </LayersControl>
          </MapContainer>
        </div>

        {/* Professional New Case Alert Notification */}
        {newCaseAlert && (
          <div className="fixed top-20 right-4 z-[10000] animate-slideIn">
            <div className="bg-white rounded-lg shadow-2xl max-w-md border-l-8 border-red-600 overflow-hidden">
              {/* Alert Header with Severity Indicator */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white rounded-full p-2 animate-pulse">
                    <AlertTriangle
                      className="w-6 h-6 text-red-600"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg tracking-tight">
                      CRITICAL ALERT
                    </h3>
                    <p className="text-red-100 text-xs font-medium">
                      New Case Detected
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setNewCaseAlert(null);
                    stopAlertSound();
                  }}
                  className="bg-white text-red-600 hover:bg-red-50 rounded-lg p-2.5 transition-all flex-shrink-0 hover:scale-110 shadow-lg font-bold"
                  title="Close Alert"
                  style={{ minWidth: "44px", minHeight: "44px" }}
                >
                  <X className="w-6 h-6" strokeWidth={3} />
                </button>
              </div>

              {/* Alert Body */}
              <div className="p-6 bg-gray-50">
                {/* Case Type Badge */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-3 rounded-lg ${
                      newCaseAlert.type === "human"
                        ? "bg-red-100"
                        : newCaseAlert.type === "animal"
                        ? "bg-green-100"
                        : "bg-purple-100"
                    }`}
                  >
                    {newCaseAlert.type === "human" && (
                      <Users
                        className={`w-6 h-6 text-red-700`}
                        strokeWidth={2}
                      />
                    )}
                    {newCaseAlert.type === "animal" && (
                      <PawPrint
                        className={`w-6 h-6 text-green-700`}
                        strokeWidth={2}
                      />
                    )}
                    {newCaseAlert.type === "environmental" && (
                      <Leaf
                        className={`w-6 h-6 text-purple-700`}
                        strokeWidth={2}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      {newCaseAlert.type} Health Case
                    </p>
                    <p className="text-gray-900 font-bold text-lg leading-tight">
                      {newCaseAlert.disease}
                    </p>
                  </div>
                </div>

                {/* Alert Details */}
                <div className="space-y-3 bg-white rounded-lg p-4 border border-gray-200">
                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                        Location
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {newCaseAlert.state}, {newCaseAlert.lga}
                      </p>
                    </div>
                  </div>

                  {/* Severity */}
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Severity Level
                      </p>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                          newCaseAlert.severity === "critical"
                            ? "bg-red-100 text-red-800 border border-red-300"
                            : newCaseAlert.severity === "high"
                            ? "bg-orange-100 text-orange-800 border border-orange-300"
                            : newCaseAlert.severity === "medium"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                            : "bg-green-100 text-green-800 border border-green-300"
                        }`}
                      >
                        {newCaseAlert.severity}
                      </span>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                        Detected At
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {new Date().toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="mt-6 pt-4 border-t-2 border-gray-300">
                  <button
                    onClick={() => {
                      setNewCaseAlert(null);
                      stopAlertSound();
                    }}
                    className="w-full px-6 py-4 bg-red-600 hover:bg-red-700 text-white text-base font-bold rounded-lg transition-all hover:shadow-xl flex items-center justify-center gap-3 uppercase tracking-wide"
                  >
                    <X className="w-5 h-5" strokeWidth={3} />
                    Dismiss Alert
                  </button>
                  <p className="text-xs text-gray-500 font-medium text-center mt-3">
                    Case ID: {newCaseAlert.caseId}
                  </p>
                </div>
              </div>
            </div>

            {/* CSS Animation */}
            <style jsx>{`
              @keyframes slideIn {
                from {
                  transform: translateX(400px);
                  opacity: 0;
                }
                to {
                  transform: translateX(0);
                  opacity: 1;
                }
              }
              .animate-slideIn {
                animation: slideIn 0.3s ease-out;
              }
            `}</style>
          </div>
        )}

        {/* Hidden Audio Element for Alert Sound */}
        <audio
          ref={audioRef}
          src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTUIGWi77eamUR4ESa7k7bVkGgQ7l9zvzXkpBSZ7yO7WjD0JFGG16euqVxYJRJvd8L1nJgUhfcrx04k7CBlnuuzoo1caBEOr5O20YxwFNpPZ8st5LQUle8fv2Yw+CBRhtOnsr1YVCUOb3e+8Zy4FIX7J8dSJOwgZaLvs6KRWGgRDq+PrtGMcBTaS2PLMeS0FJXvH79mNPwgUYbTp7K9VFQlDm93vvGcuBSF+yfHUiToIGWi77OikVxsEQqzj67RjHAU2ktnyzHktBSV6x/DZjT4IFF+06eyvVRUJQprd77tnLgUhfcnx1Ik6CBlouuzopFcbBEKr4+q0YxwFNpHY8st5LQUle8fw2Y0+CBRftOnssFYVCUKa3e+7Zy4FIX3J8dOJOwgZZ7rs6KRXGwRCq+TqtGMcBTaR2PLLeS0FJXvH79mNPggUX7Tp7K9VFQlCmt3vu2cuBSJ9yfHTiTsIGWa77OikVxwEQqrk67RjHQU2kNjyynotBSV7x+/ZjT0IFF+16eywVhYJQ5rd77tnLwUhfcnx04k7CBpnuuzopFcbBEKq5Ou0Yx0FNpDY8sp6LQUle8fv2Y09CBRftunssVcWCUOa3e+7Zy4FIX3J8dOJOwgaZ7vs6KNXGwRCquTrtWIdBTaQ2PLKei0FJXrH79mNPQgUX7bp7LFWFwlEmt3vu2cvBSF9yfHTiTwIGme77OijVxsEQqrk67RjHAU1kNnyynotBSZ7x+/ZjT4IFF+26eyvVxQJRJrd77xnLgUhfcnx04k7CBpnuuzoo1gbBEKp5Oy0YxwFNpDY8sp6LQUle8fv2Y09CBRftunssVcXCUSa3e+7Zy4FIX3J8dOJOwgZZ7vs6KRYGwRCqeTstGMdBTaQ2PKKei0FJXrH79mNPggUX7bp7K9XFwlEmt3vu2cvBSF9yfHTiTsIGWe77OikWBsEQqnk7LRjHQU2kNnyyn0tBSV6x+/ZjD4IFF+26eyvVhcJQ5rd77xnLgUhfcnx04k7CBlouuzoo1gbA0Kp5Ou0Yx0FNo/Y8sp6LgUle8fu2Y0+CBRftOnssFcWCUSa3e+7aCkGIX3J8dSJOwgZZ7vt6KNYGwNDqeTstGMdBTaP2PLKei0FJHvH7tiNPggUX7Tp7LFWFglDmt3vvGgsBlF9yfHUiTsIGWe77OikVxsEQ6rk67RjHQU2jtnyynotBSR7x+7YjT0IFF+16eywVhYJQprd77tmLgchfcnx1Ik7CBdouuzoo1caA0Oq5Ou0Yx0ENpDZ8sp6LQUke8fu2I09CBRftOnssFYWCUSa3e+8Zi4FIX7I8dSJOwgZaLrt6KNXGwRCq+TstGMdBTaN2PLKei0FJHvH7tiNPggUXbTp7LFWFwlDmt3vu2cuBSF+yfHUiTsIGmi77OikWBsDQqnk67RjHQU2jtjyynktBSR7x+7ZjT4IFF206eyxVhUJQ5rd77tnLgUhfcnx1Ik7CBlou+zopFccBEOq5Ou0Yx0FNo7Y8st6LQUke8jv2I0+CBRftOnssFYVCUKa3e+7Zy4FIX3J8dOJOwgZaLvt6KRXGwRDqeTrtGMdBTaO2PLKei0FJHvI79iNPQgUX7Tp7K9XFQlCmt3vu2cuBSF9yfHTiTsIGWi77OikVxsEQqvj67RjHQU2jtnyynotBSR7x+/ZjT0IFF+06eyvVhUJQprc77tnLgUhfcnx04k7CBlouuzopFcbBEKr4+u0Yx0FNo7Z8sp6LQUke8fv2Y09CBRftOnssFYWCUKa3e+7Zy4FIX3J8dSJOwgZaLvt6KRXGwRCq+TrtGMdBTaO2PLKei0FJHvH79mNPggUX7Tp7K9XFglCmt3vu2cuBSF9yfHUiTsIGWi77OikVxsEQqvk67VjHAU2jtnyynotBSR7x+/ZjT4IFF+06eyvVhYJQprd77tnLgUhfcnx1Ik7CBlouuzopFcbBEKr5Ou1Yx0FNo7Z8spzLQUke8fv2Y0+CBRftOnssFYWCUKa3e+7Zy4FIX3J8dSJOwgZaLvs6KRXGwRCq+TrtWMdBTaO2PLKeS0FJHvH79mNPQgUX7Tp7LBWFglCmt3vu2cuBSF9yfHUiTsIGWi77OikVxsEQqvk67VjHQU2jtnyynotBSV7x+/ZjT4IFF+06eyvVhYJQprd77tnLgUhfcnx1Ik7CBlou+zopFcbBEKr5Ou1Yx0FNo7Z8sp6LQUke8fv2Y09CBRftOnssFYWCUKa3e+7Zy4FIX3J8dSJOwgZZ7vs6KRXGwRCq+TstWMdBTaN2PLKei0FJHvH79mNPggUXrTp7LBWFglCmt3vu2cuBSF9yfHUiTsIGWe77OikVxwEQqvk7LVjHQU2jdnyyn0tBSR7x+/ZjT4IFF+06eywVhYJQprd77xnLgUhfcnx1Ik7CBlnu+zopFccBEKr5Oy1Yx0FNo3Z8sp6LQUke8fv2Y0+CBRftOnssFYWCUKa3e+8Zy4FIX3J8dSJOwgZZ7vs6KRXHARCq+TstWMdBTaN2fLKei0FJHvH79iNPggUX7Tp7LBWFglCmt3vvGcuBSF9yfHUiTwHGWe77OikVxwEQqvk7LVjHQU2jdnyynktBSR7yO/YjT4IFF+06eywVhYJQprd77xnLgUhfcnx1Ik8B"
        />
      </div>
    </DashboardLayout>
  );
}

export default InteractiveMap;
