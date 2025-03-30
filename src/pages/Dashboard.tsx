
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Star } from "lucide-react";

const Dashboard = () => {
  // Données fictives pour le tableau de bord
  const stats = [
    { id: 1, name: "Questionnaires complétés", value: 248, icon: Star },
    { id: 2, name: "Coups de cœur", value: 156, icon: ThumbsUp },
    { id: 3, name: "Coups de gueule", value: 92, icon: ThumbsDown },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Les dernières actions effectuées</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-b pb-3">
              <p className="font-medium">Marc a complété un questionnaire</p>
              <p className="text-sm text-muted-foreground">Il y a 2 heures</p>
            </div>
            <div className="border-b pb-3">
              <p className="font-medium">Sophie a partagé un coup de cœur</p>
              <p className="text-sm text-muted-foreground">Il y a 3 heures</p>
            </div>
            <div className="border-b pb-3">
              <p className="font-medium">Alexandre a partagé un coup de gueule</p>
              <p className="text-sm text-muted-foreground">Il y a 5 heures</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Performance globale</CardTitle>
            <CardDescription>Évaluation des agents ce mois-ci</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Communication</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Efficacité</span>
                <span>92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "92%" }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Satisfaction client</span>
                <span>78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "78%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
