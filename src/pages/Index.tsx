
import React, { useEffect } from "react";
import CustomNavigation from "@/components/CustomNavigation";
import { Outlet, useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const userString = localStorage.getItem("user");
    if (!userString) {
      navigate("/login");
      return;
    }
    
    // Rediriger vers la page appropriée en fonction du rôle
    const user = JSON.parse(userString);
    if (user.role === "admin") {
      // Les administrateurs vont à la page de leur choix
    } else {
      // Les visiteurs sont redirigés vers la page Quiz
      if (location.pathname === "/") {
        navigate("/quiz");
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomNavigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Index;
