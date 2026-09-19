// src/App.jsx
//import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./pages/auth/Signup-health";
import SignUpNonHealth from "./pages/auth/Signup-nonhealth";
import Login from "./pages/auth/Login-health";
import NonHealthLogin from "./pages/auth/Login-nonhealth";
import SelectRole from "./pages/auth/SelectRole";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import ProtectedRoute from "./components/ProtectedRoute";
import NonHealthDashboard from "./pages/dashboard/NonHealthDashboard";
import HealthDashboard from "./pages/dashboard/HealthDashboard";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import DiseaseCaseReport from "./pages/report-gen/Disease";
import EnvironmentalIncidentReportForm from "./pages/report-gen/Environmental";
import Contact from "./pages/contact/Contact";
import Chatbot from "./pages/chatbot/Chatbot";
import Surveillance from "./pages/surveillance-data/Surveillance";
import Stakeholder from "./pages/stakeholder/Stakeholder";
import OverviewDashboard from "./pages/(stakeholders)/dashboard/Overview";
import "./App.css";
import InteractiveMap from "./pages/(stakeholders)/dashboard/Gis";
import Cases from "./pages/(stakeholders)/dashboard/HumanCases";
import AnimalCases from "./pages/(stakeholders)/dashboard/AnimalCases";
import EnvironmentalCases from "./pages/(stakeholders)/dashboard/EnvironmentalCases";
import Reports from "./pages/(stakeholders)/dashboard/Reports";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup-non-health" element={<SignUpNonHealth />} />
        <Route path="/health-login" element={<Login />} />
        <Route path="/non-health-login" element={<NonHealthLogin />} />
        <Route path="/login" element={<SelectRole />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route path="/non-health-dashboard" element={<NonHealthDashboard />} />
        <Route path="/health-dashboard" element={<HealthDashboard />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/report-dis-cas" element={<DiseaseCaseReport />} />
        <Route
          path="/report-env-inc"
          element={<EnvironmentalIncidentReportForm />}
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/surveillance" element={<Surveillance />} />
        <Route path="/stakeholder" element={<Stakeholder />} />

        <Route path="/stakeholder/dashboard" element={<OverviewDashboard />} />
        <Route path="/stakeholder/dashboard/map" element={<InteractiveMap />} />
        <Route path="/stakeholder/dashboard/cases" element={<Cases />} />
        <Route
          path="/stakeholder/dashboard/animal-cases"
          element={<AnimalCases />}
        />
        <Route
          path="/stakeholder/dashboard/environmental-cases"
          element={<EnvironmentalCases />}
        />
        <Route path="/stakeholder/dashboard/reports" element={<Reports />} />
      </Routes>
    </Router>
  );
}

export default App;
