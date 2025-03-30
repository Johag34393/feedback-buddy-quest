
import React from "react";
import Navigation from "@/components/Navigation";
import { Outlet } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Index;
