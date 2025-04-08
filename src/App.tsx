
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
            
            {/* Base route */}
            <Route path="/" element={<Index />}>
              {/* Redirect root to quiz */}
              <Route index element={<Quiz />} />
              
              {/* All routes accessible to all authenticated users */}
              <Route path="questions" element={<QuestionCreator />} />
              <Route path="notes" element={<Notes />} />
              <Route path="deployment" element={<Deployment />} />
              <Route path="access-codes" element={<AccessCodeManager />} />
              <Route path="quiz" element={<Quiz />} />
              <Route path="revision" element={<Revision />} />
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
