import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import HealthProfile from "./pages/HealthProfile";
import EmergencyQR from "./pages/EmergencyQR";
import EmergencyProfile from "./pages/EmergencyProfile";
import PrivacyControls from "./pages/PrivacyControls";
import AccessHistory from "./pages/AccessHistory";
import QRStatus from "./pages/QRStatus";
import MedicalDocuments from "./pages/MedicalDocuments";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/health-profile"
          element={
            <ProtectedRoute>
              <HealthProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/emergency-qr"
          element={
            <ProtectedRoute>
            <EmergencyQR />
            </ProtectedRoute>
          }
        />

        <Route
          path="/emergency/:profileId"
          element={<EmergencyProfile />}
        />

        <Route
          path="/privacy"
          element={
          <ProtectedRoute>
          <PrivacyControls />
        </ProtectedRoute>
        }
        />
        <Route
          path="/access-history"
          element={
          <ProtectedRoute>
          <AccessHistory />
          </ProtectedRoute>
        }
        />

        <Route
          path="/qr-status"
          element={
          <ProtectedRoute>
          <QRStatus />
          </ProtectedRoute>
        }
        />

        <Route
          path="/medical-documents"
          element={
          <ProtectedRoute>
          <MedicalDocuments />
          </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;