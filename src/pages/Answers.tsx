
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface UserAnswer {
  id: string;
  username: string;
  date: string;
  score: number;
  totalScore: number;
  percentage: number;
  answers: {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
  }[];
}

const Answers = () => {
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setIsAdmin(user.role === "admin");
    }

    // Charger les réponses depuis localStorage
    const savedAnswers = localStorage.getItem("userAnswers");
    if (savedAnswers) {
      setUserAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  const exportToCSV = () => {
    // Entêtes CSV
    let csvContent = "ID,Utilisateur,Date,Score,Total,Pourcentage\n";
    
    // Ajouter chaque résultat
    userAnswers.forEach(answer => {
      const date = new Date(answer.date).toLocaleDateString();
      csvContent += `${answer.id},${answer.username},${date},${answer.score},${answer.totalScore},${answer.percentage}%\n`;
    });
    
    // Créer un blob et le télécharger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "resultats_quiz.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export réussi",
      description: "Les résultats ont été exportés avec succès",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Résultats des évaluations</h1>
        {isAdmin && (
          <Button 
            variant="outline" 
            onClick={exportToCSV}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exporter en CSV
          </Button>
        )}
      </div>

      {!isAdmin ? (
        <Card className="mb-8">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Les résultats détaillés ne sont visibles que par l'administrateur.
            </p>
          </CardContent>
        </Card>
      ) : userAnswers.length === 0 ? (
        <Card className="mb-8">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Aucun résultat d'évaluation n'a encore été enregistré.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {userAnswers.map((userAnswer) => (
            <Card key={userAnswer.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{userAnswer.username}</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {new Date(userAnswer.date).toLocaleString()}
                  </div>
                </div>
                <CardDescription>
                  Score: {userAnswer.score}/{userAnswer.totalScore} ({userAnswer.percentage}%)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="font-medium">Détails des réponses:</h3>
                  <ul className="space-y-1">
                    {userAnswer.answers.map((answer, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className={`w-6 h-6 flex items-center justify-center rounded-full ${answer.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {answer.isCorrect ? '✓' : '✗'}
                        </span>
                        <span>Question {index + 1}: {answer.userAnswer}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Answers;
