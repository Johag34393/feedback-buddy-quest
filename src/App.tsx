
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import QuestionCreator from "./pages/QuestionCreator";
import Answers from "./pages/Answers";
import MessageCollection from "./pages/MessageCollection";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

// Protection de route avec vérification d'authentification
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const userString = localStorage.getItem("user");
  
  if (!userString) {
    return <Navigate to="/login" replace />;
  }
  
  const user = JSON.parse(userString);
  
  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  
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
              <Route index element={<Navigate to="/questions" replace />} />
              <Route path="questions" element={
                <ProtectedRoute requireAdmin={true}>
                  <QuestionCreator />
                </ProtectedRoute>
              } />
              <Route path="answers" element={<Answers />} />
              <Route path="messages" element={<MessageCollection />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
