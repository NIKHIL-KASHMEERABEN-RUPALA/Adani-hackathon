import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "@/context/DataContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Equipment from "@/pages/Equipment";
import EquipmentDetail from "@/pages/EquipmentDetail";
import Teams from "@/pages/Teams";
import Requests from "@/pages/Requests";
import Calendar from "@/pages/Calendar";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />

              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/equipment" element={<Equipment />} />
                        <Route path="/equipment/:id" element={<EquipmentDetail />} />
                        <Route path="/teams" element={<Teams />} />
                        <Route path="/requests" element={<Requests />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
