
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
              <Route index element={<Navigate to="/notes" replace />} />
              <Route path="questions" element={
                <ProtectedRoute requireAdmin={true}>
                  <QuestionCreator />
                </ProtectedRoute>
              } />
              <Route path="quiz" element={<Quiz />} />
              <Route path="notes" element={<Notes />} />
              <Route path="revision" element={<Revision />} />
              <Route path="messages" element={<MessageCollection />} />
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
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
