
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import QuestionCreator from "./pages/QuestionCreator";
import Notes from "./pages/Notes";
import Revision from "./pages/Revision";
import MessageCollection from "./pages/MessageCollection";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Deployment from "./pages/Deployment";
import AccessCodeManager from "./pages/AccessCodeManager";
import Quiz from "./pages/Quiz";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

// Composant amélioré pour protéger les routes
const ProtectedRoute = ({ children, requireAdmin = false, visitorAllowed = false }) => {
  const userString = localStorage.getItem("user");
  
  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!userString) {
    return <Navigate to="/login" replace />;
  }
  
  const user = JSON.parse(userString);
  
  // Si la route requiert des droits d'admin et que l'utilisateur n'est pas admin
  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/quiz" replace />;
  }
  
  // Si la route n'est pas autorisée pour les agents et que l'utilisateur n'est pas admin
  if (!visitorAllowed && user.role !== "admin") {
    return <Navigate to="/quiz" replace />;
  }
  
  // Sinon, afficher le contenu normalement
  return children;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = () => {
      const userString = localStorage.getItem("user");
      setIsAuthenticated(!!userString);
    };
    
    checkAuth();
    window.addEventListener("storage", checkAuth);
    
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }>
              {/* Redirect root to quiz for everyone */}
              <Route index element={
                <Navigate to="/quiz" replace />
              } />
              
              {/* Routes pour administrateur uniquement */}
              <Route path="questions" element={
                <ProtectedRoute requireAdmin={true}>
                  <QuestionCreator />
                </ProtectedRoute>
              } />
              <Route path="notes" element={
                <ProtectedRoute requireAdmin={true}>
                  <Notes />
                </ProtectedRoute>
              } />
              <Route path="deployment" element={
                <ProtectedRoute requireAdmin={true}>
                  <Deployment />
                </ProtectedRoute>
              } />
              <Route path="access-codes" element={
                <ProtectedRoute requireAdmin={true}>
                  <AccessCodeManager />
                </ProtectedRoute>
              } />
              
              {/* Routes accessibles aux agents */}
              <Route path="quiz" element={
                <ProtectedRoute visitorAllowed={true}>
                  <Quiz />
                </ProtectedRoute>
              } />
              <Route path="revision" element={
                <ProtectedRoute visitorAllowed={true}>
                  <Revision />
                </ProtectedRoute>
              } />
              <Route path="messages" element={
                <ProtectedRoute visitorAllowed={true}>
                  <MessageCollection />
                </ProtectedRoute>
              } />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
