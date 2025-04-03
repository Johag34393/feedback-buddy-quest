
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface UserNote {
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

const Notes = () => {
  const [userNotes, setUserNotes] = useState<UserNote[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setIsAdmin(user.role === "admin");
    }

    // Charger les notes depuis localStorage
    const savedNotes = localStorage.getItem("userAnswers");
    if (savedNotes) {
      setUserNotes(JSON.parse(savedNotes));
    }
  }, []);

  const exportToCSV = () => {
    // Entêtes CSV
    let csvContent = "ID,Utilisateur,Date,Note,Total,Pourcentage\n";
    
    // Ajouter chaque résultat
    userNotes.forEach(note => {
      const date = new Date(note.date).toLocaleDateString();
      csvContent += `${note.id},${note.username},${date},${note.score},${note.totalScore},${note.percentage}%\n`;
    });
    
    // Créer un blob et le télécharger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "notes_visiteurs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export réussi",
      description: "Les notes des visiteurs ont été exportées avec succès",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Notes des visiteurs</h1>
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
              Les notes détaillées ne sont visibles que par l'administrateur.
            </p>
          </CardContent>
        </Card>
      ) : userNotes.length === 0 ? (
        <Card className="mb-8">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Aucune note de visiteur n'a encore été enregistrée.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif des notes</CardTitle>
              <CardDescription>
                Tableau récapitulatif des performances des visiteurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Visiteur</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Pourcentage</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userNotes.map((note) => (
                    <TableRow key={note.id}>
                      <TableCell className="font-medium">{note.username}</TableCell>
                      <TableCell>{new Date(note.date).toLocaleDateString()}</TableCell>
                      <TableCell>{note.score}/{note.totalScore}</TableCell>
                      <TableCell>{note.percentage}%</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          note.percentage >= 75 ? 'bg-green-100 text-green-800' : 
                          note.percentage >= 50 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {note.percentage >= 75 ? 'Excellent' : 
                           note.percentage >= 50 ? 'Satisfaisant' : 
                           'À améliorer'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold mt-8 mb-4">Détails des réponses</h2>
          <div className="grid gap-6">
            {userNotes.map((userNote) => (
              <Card key={userNote.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{userNote.username}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {new Date(userNote.date).toLocaleString()}
                    </div>
                  </div>
                  <CardDescription>
                    Note: {userNote.score}/{userNote.totalScore} ({userNote.percentage}%)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h3 className="font-medium">Détails des réponses:</h3>
                    <ul className="space-y-1">
                      {userNote.answers.map((answer, index) => (
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
        </div>
      )}
    </div>
  );
};

export default Notes;
