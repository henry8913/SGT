import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Step1 from './pages/Wizard/Step1';
import Step2 from './pages/Wizard/Step2';
import Step3 from './pages/Wizard/Step3';
import Step4 from './pages/Wizard/Step4';
import Step5 from './pages/Wizard/Step5';
import Step6 from './pages/Wizard/Step6';
import Calcola from './pages/Wizard/Calcola';
import Stabilita from './pages/Progetto/Stabilita';
import Carichi from './pages/Progetto/Carichi';
import Diagramma from './pages/Progetto/Diagramma';
import Formule from './pages/Formule';
import SettingsProfili from './pages/Settings/Profili';
import Password from './pages/Settings/Password';
import AdminUsers from './pages/Admin/Users';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>}
        />
        <Route
          path="/nuovo-progetto/step-1"
          element={<ProtectedRoute><Layout><Step1 /></Layout></ProtectedRoute>}
        />
        <Route
          path="/nuovo-progetto/step-2"
          element={<ProtectedRoute><Layout><Step2 /></Layout></ProtectedRoute>}
        />
        <Route
          path="/nuovo-progetto/step-3"
          element={<ProtectedRoute><Layout><Step3 /></Layout></ProtectedRoute>}
        />
        <Route
          path="/nuovo-progetto/step-4"
          element={<ProtectedRoute><Layout><Step4 /></Layout></ProtectedRoute>}
        />
        <Route
          path="/nuovo-progetto/step-5"
          element={<ProtectedRoute><Layout><Step5 /></Layout></ProtectedRoute>}
        />
        <Route
          path="/nuovo-progetto/step-6"
          element={<ProtectedRoute><Layout><Step6 /></Layout></ProtectedRoute>}
        />
        <Route
          path="/nuovo-progetto/calcola"
          element={<ProtectedRoute><Layout><Calcola /></Layout></ProtectedRoute>}
        />
        <Route
          path="/progetto/:id/stabilita"
          element={<ProtectedRoute><Layout><Stabilita /></Layout></ProtectedRoute>}
        />
        <Route
          path="/progetto/:id/carichi"
          element={<ProtectedRoute><Layout><Carichi /></Layout></ProtectedRoute>}
        />
        <Route
          path="/progetto/:id/diagramma"
          element={<ProtectedRoute><Layout><Diagramma /></Layout></ProtectedRoute>}
        />
        <Route
          path="/formule"
          element={<ProtectedRoute><Layout><Formule /></Layout></ProtectedRoute>}
        />
        <Route
          path="/settings/profili"
          element={<ProtectedRoute><Layout><SettingsProfili /></Layout></ProtectedRoute>}
        />
        <Route
          path="/settings/password"
          element={<ProtectedRoute><Layout><Password /></Layout></ProtectedRoute>}
        />
        <Route
          path="/admin/users"
          element={<ProtectedRoute><Layout><AdminUsers /></Layout></ProtectedRoute>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
