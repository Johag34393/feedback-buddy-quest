
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MessageCircle, Star, Home, BookOpen } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    {
      name: "Tableau de bord",
      path: "/",
      Icon: Home
    },
    {
      name: "Questionnaire",
      path: "/questionnaire",
      Icon: Star
    },
    {
      name: "Quiz",
      path: "/quiz",
      Icon: BookOpen
    },
    {
      name: "Feedback",
      path: "/feedback",
      Icon: MessageCircle
    }
  ];

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            <span className="font-bold text-xl text-primary">Feedback</span>
            <span className="font-bold text-xl text-blue-600">Buddy</span>
          </div>
          
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                )}
              >
                <item.Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
          
          <div className="md:hidden flex items-center">
            {/* Hamburger menu pour mobile */}
            <button className="p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-800"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
