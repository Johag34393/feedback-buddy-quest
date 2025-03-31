
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
