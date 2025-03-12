
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RouteGuard, PublicRouteGuard } from "@/components/RouteGuard";

// Pages
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import NewRequestPage from "./pages/NewRequestPage";
import MyRequestsPage from "./pages/MyRequestsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route 
              path="/login" 
              element={
                <PublicRouteGuard>
                  <LoginPage />
                </PublicRouteGuard>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRouteGuard>
                  <RegisterPage />
                </PublicRouteGuard>
              } 
            />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <RouteGuard>
                  <DashboardPage />
                </RouteGuard>
              } 
            />
            <Route 
              path="/new-request" 
              element={
                <RouteGuard>
                  <NewRequestPage />
                </RouteGuard>
              } 
            />
            <Route 
              path="/my-requests" 
              element={
                <RouteGuard>
                  <MyRequestsPage />
                </RouteGuard>
              } 
            />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
