
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BookOpen, MessageCircle, FileText, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Récupérer les informations de l'utilisateur connecté
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const isAdmin = user?.role === "admin";
  
  const navItems = [
    {
      name: "Créer des questions",
      path: "/questions",
      Icon: BookOpen,
      adminOnly: true
    },
    {
      name: "Réponses",
      path: "/answers",
      Icon: FileText,
      adminOnly: false
    },
    {
      name: "Révision",
      path: "/revision",
      Icon: Search,
      adminOnly: false
    },
    {
      name: "Messages",
      path: "/messages",
      Icon: MessageCircle,
      adminOnly: false
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      localStorage.setItem("searchQuery", searchQuery);
      navigate("/answers");
    } else {
      toast.warning("Veuillez saisir un terme de recherche");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Vous êtes déconnecté");
    navigate("/login");
  };

  // Filtrer les éléments de navigation en fonction du rôle de l'utilisateur
  const filteredNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex space-x-1">
            <span className="font-bold text-xl text-primary">EPHATA</span>
            {user && (
              <span className="ml-2 text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                {user.name}
              </span>
            )}
          </div>
          
          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
            <Input
              type="search"
              placeholder="Rechercher des questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
          </form>
          
          <div className="hidden md:flex space-x-4">
            {filteredNavItems.map((item) => (
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
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </Button>
          </div>
          
          <div className="md:hidden flex items-center">
            {/* Menu hamburger pour mobile */}
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
