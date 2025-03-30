
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Question {
  id: number;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswerId: string;
}

const Revision = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  useEffect(() => {
    // Charger les questions depuis le localStorage
    const savedQuestions = localStorage.getItem("quizQuestions");
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    }
  }, []);

  const handleRevisionQuery = async () => {
    if (query.trim() === "") {
      toast.warning("Veuillez saisir une question ou un sujet de révision");
      return;
    }

    setIsLoading(true);
    
    // Simuler une réponse d'IA (dans une vraie application, cela appellerait une API d'IA)
    setTimeout(() => {
      // Rechercher dans les questions existantes
      const matchingQuestions = questions.filter(
        q => q.text.toLowerCase().includes(query.toLowerCase())
      );
      
      if (matchingQuestions.length > 0) {
        const responseText = `Voici ce que j'ai trouvé sur "${query}" :\n\n${
          matchingQuestions.map((q, index) => {
            const correctOption = q.options.find(opt => opt.id === q.correctAnswerId);
            return `Question ${index + 1}: ${q.text}\nRéponse: ${correctOption?.text || "Non spécifiée"}`;
          }).join("\n\n")
        }`;
        
        setAiResponse(responseText);
      } else {
        setAiResponse(`Je n'ai pas trouvé d'information spécifique sur "${query}" dans la base de connaissances actuelle. Veuillez reformuler votre question ou consulter d'autres sources.`);
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleQuestionSelect = (question: Question) => {
    setSelectedQuestion(question);
    
    const correctOption = question.options.find(opt => opt.id === question.correctAnswerId);
    
    setAiResponse(`Question: ${question.text}\n\nRéponse: ${correctOption?.text || "Non spécifiée"}\n\nExplication: Cette question fait partie de votre base de connaissances. Utilisez cette information pour vous préparer aux examens ou tests.`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Révision Assistée</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Questions disponibles</CardTitle>
              <CardDescription>Cliquez sur une question pour obtenir des informations</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto">
              {questions.length > 0 ? (
                <ul className="space-y-2">
                  {questions.map((question) => (
                    <li 
                      key={question.id}
                      className="p-2 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleQuestionSelect(question)}
                    >
                      {question.text}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Aucune question disponible</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Assistant de Révision</CardTitle>
              <CardDescription>
                Posez une question sur un sujet que vous souhaitez réviser
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Que voulez-vous réviser aujourd'hui ?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleRevisionQuery} disabled={isLoading}>
                  {isLoading ? "Recherche..." : "Demander"}
                </Button>
              </div>
              
              <Textarea
                placeholder="La réponse apparaîtra ici..."
                value={aiResponse}
                readOnly
                className="min-h-[250px] font-mono text-sm"
              />
            </CardContent>
            <CardFooter className="justify-between text-sm text-muted-foreground">
              <p>Basé sur les questions disponibles dans votre base de données</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Revision;
