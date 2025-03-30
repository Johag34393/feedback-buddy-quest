
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface QuestionOption {
  id: string;
  text: string;
}

interface Question {
  id: number;
  text: string;
  options: QuestionOption[];
  correctAnswerId: string;
}

const QuestionCreator = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [options, setOptions] = useState<QuestionOption[]>([
    { id: "a", text: "" },
    { id: "b", text: "" },
    { id: "c", text: "" },
    { id: "d", text: "" },
  ]);
  const [correctAnswerId, setCorrectAnswerId] = useState<string>("a");
  const { toast } = useToast();

  const handleOptionChange = (id: string, value: string) => {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, text: value } : option
      )
    );
  };

  const addQuestion = () => {
    if (!currentQuestion.trim()) {
      toast({
        title: "Erreur",
        description: "La question ne peut pas être vide",
        variant: "destructive",
      });
      return;
    }

    if (options.some((option) => !option.text.trim())) {
      toast({
        title: "Erreur",
        description: "Toutes les options doivent être remplies",
        variant: "destructive",
      });
      return;
    }

    const newQuestion: Question = {
      id: questions.length + 1,
      text: currentQuestion,
      options: [...options],
      correctAnswerId,
    };

    setQuestions([...questions, newQuestion]);
    
    // Reset form
    setCurrentQuestion("");
    setOptions([
      { id: "a", text: "" },
      { id: "b", text: "" },
      { id: "c", text: "" },
      { id: "d", text: "" },
    ]);
    setCorrectAnswerId("a");

    toast({
      title: "Question ajoutée",
      description: `Question ${questions.length + 1} sur 10 ajoutée avec succès`,
    });

    // Si c'est la 10ème question, sauvegarde et affiche un message
    if (questions.length === 9) {
      saveQuiz();
    }
  };

  const saveQuiz = () => {
    // Dans une vraie application, nous sauvegarderions dans une base de données
    // Pour cet exemple, sauvegardons dans localStorage
    localStorage.setItem("quizQuestions", JSON.stringify([...questions]));
    
    toast({
      title: "Quiz sauvegardé",
      description: "Votre quiz de 10 questions a été sauvegardé avec succès",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Créateur de Questions</h1>
      
      <div className="mb-4">
        <p className="text-lg font-medium">
          Questions créées: {questions.length} / 10
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Nouvelle question</CardTitle>
          <CardDescription>
            Créez une nouvelle question avec 4 options et sélectionnez la bonne réponse
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              placeholder="Saisissez votre question ici..."
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid gap-4">
            <Label>Options de réponse</Label>
            {options.map((option) => (
              <div key={option.id} className="flex items-start space-x-2">
                <div className="w-10 h-10 flex items-center justify-center bg-primary text-primary-foreground rounded-md font-bold">
                  {option.id.toUpperCase()}
                </div>
                <div className="flex-1">
                  <Input
                    placeholder={`Option ${option.id.toUpperCase()}`}
                    value={option.text}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="correctAnswer">Réponse correcte</Label>
            <select
              id="correctAnswer"
              value={correctAnswerId}
              onChange={(e) => setCorrectAnswerId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  Option {option.id.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setCurrentQuestion("");
              setOptions([
                { id: "a", text: "" },
                { id: "b", text: "" },
                { id: "c", text: "" },
                { id: "d", text: "" },
              ]);
            }}
          >
            Réinitialiser
          </Button>
          <Button 
            onClick={addQuestion}
            disabled={questions.length >= 10}
          >
            Ajouter la question
          </Button>
        </CardFooter>
      </Card>

      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Questions créées</CardTitle>
            <CardDescription>
              Aperçu des questions que vous avez créées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div key={q.id} className="border rounded-md p-4">
                  <p className="font-medium mb-2">
                    Question {index + 1}: {q.text}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {q.options.map((option) => (
                      <div 
                        key={option.id} 
                        className={`p-2 rounded-md ${
                          option.id === q.correctAnswerId 
                            ? "bg-green-100 border border-green-500" 
                            : "bg-gray-50"
                        }`}
                      >
                        <span className="font-medium">{option.id.toUpperCase()}:</span> {option.text}
                        {option.id === q.correctAnswerId && (
                          <span className="ml-2 text-green-600">(Correcte)</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              onClick={saveQuiz} 
              disabled={questions.length < 10}
              className="w-full md:w-auto"
            >
              {questions.length < 10 
                ? `Ajoutez encore ${10 - questions.length} question(s)` 
                : "Sauvegarder le quiz"
              }
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default QuestionCreator;
