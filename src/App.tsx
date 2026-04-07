import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginPage from "./pages/LoginPage";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import DashboardOverview from "./pages/DashboardOverview";
import OutbreakMap from "./pages/OutbreakMap";
import HospitalManagement from "./pages/HospitalManagement";
import PatientAnalytics from "./pages/PatientAnalytics";
import AlertManagement from "./pages/AlertManagement";
import ReportsPage from "./pages/ReportsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="outbreak" element={<OutbreakMap />} />
            <Route path="hospitals" element={<HospitalManagement />} />
            <Route path="patients" element={<PatientAnalytics />} />
            <Route path="alerts" element={<AlertManagement />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
