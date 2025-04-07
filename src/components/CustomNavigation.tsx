
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  FileQuestion, 
  MessageSquare, 
  LogOut, 
  FilePenLine,
  QrCode,
  User,
  KeyRound,
  ClipboardCheck,
  Clock
} from "lucide-react";
import { toast } from "@/utils/toastUtils";

const CustomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  
  const isAdmin = user?.role === "admin";
  
  const menuItems = [
    {
      path: "/questions",
      label: "Questions",
      icon: <FileQuestion className="w-4 h-4" />,
      admin: true
    },
    {
      path: "/quiz",
      label: "Quiz",
      icon: <Clock className="w-4 h-4" />,
      admin: false
    },
    {
      path: "/notes",
      label: "Notes",
      icon: <ClipboardCheck className="w-4 h-4" />,
      admin: true
    },
    {
      path: "/revision",
      label: "Révision",
      icon: <BookOpen className="w-4 h-4" />,
      admin: false
    },
    {
      path: "/messages",
      label: "Messages",
      icon: <MessageSquare className="w-4 h-4" />,
      admin: false
    },
    {
      path: "/deployment",
      label: "Déploiement",
      icon: <QrCode className="w-4 h-4" />,
      admin: true
    },
    {
      path: "/access-codes",
      label: "Codes d'accès",
      icon: <KeyRound className="w-4 h-4" />,
      admin: true
    },
  ];
  
  // Filtrer les éléments du menu selon le rôle de l'utilisateur
  const filteredMenuItems = menuItems.filter(item => 
    !item.admin || (item.admin && isAdmin)
  );
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Déconnexion réussie");
    navigate("/login");
  };
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to={isAdmin ? "/" : "/quiz"} className="text-lg font-bold text-primary">
              EPHATA
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-1">
            {filteredMenuItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
              >
                <Button
                  variant={location.pathname.startsWith(item.path) ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  {item.icon}
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600 hidden md:flex items-center">
              <User className="w-4 h-4 mr-1" />
              <span>{user?.name || "Utilisateur"}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
        
        {/* Navigation mobile */}
        <div className="md:hidden overflow-x-auto pb-2 flex space-x-1">
          {filteredMenuItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className="flex-shrink-0"
            >
              <Button
                variant={location.pathname.startsWith(item.path) ? "default" : "ghost"}
                size="sm"
                className="whitespace-nowrap flex items-center gap-1"
              >
                {item.icon}
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default CustomNavigation;
