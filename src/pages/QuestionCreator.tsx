import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, QrCode, Link } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import QRCode from 'react-qr-code';
import { toast } from "sonner";

interface QuestionOption {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  correctAnswerId: string;
}

interface QuestionSet {
  id: string;
  title: string;
  questions: Question[];
  createdAt: string;
}

const QuestionCreator = () => {
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [currentQuestionSet, setCurrentQuestionSet] = useState<string>("");
  const [currentQuestionSetTitle, setCurrentQuestionSetTitle] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [options, setOptions] = useState<QuestionOption[]>([
    { id: "a", text: "" },
    { id: "b", text: "" },
    { id: "c", text: "" },
    { id: "d", text: "" },
  ]);
  const [correctAnswerId, setCorrectAnswerId] = useState<string>("a");
  const [deploymentURL, setDeploymentURL] = useState<string>("https://ephata.lovable.app");
  const { toast } = useToast();

  useEffect(() => {
    const savedQuestionSets = localStorage.getItem("questionSets");
    if (savedQuestionSets) {
      const parsedSets = JSON.parse(savedQuestionSets);
      setQuestionSets(parsedSets);
      
      if (parsedSets.length > 0) {
        setCurrentQuestionSet(parsedSets[0].id);
        setCurrentQuestionSetTitle(parsedSets[0].title);
        setQuestions(parsedSets[0].questions);
      }
    }
  }, []);

  const handleOptionChange = (id: string, value: string) => {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, text: value } : option
      )
    );
  };

  const createNewQuestionSet = () => {
    if (!currentQuestionSetTitle.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez donner un titre à l'ensemble de questions",
        variant: "destructive",
      });
      return;
    }

    if (questionSets.length >= 100) {
      toast({
        title: "Limite atteinte",
        description: "Vous avez atteint la limite de 100 ensembles de questions",
        variant: "destructive",
      });
      return;
    }

    const newSetId = `set-${Date.now()}`;
    const newSet: QuestionSet = {
      id: newSetId,
      title: currentQuestionSetTitle,
      questions: [],
      createdAt: new Date().toISOString(),
    };

    const updatedSets = [...questionSets, newSet];
    setQuestionSets(updatedSets);
    setCurrentQuestionSet(newSetId);
    setQuestions([]);
    
    localStorage.setItem("questionSets", JSON.stringify(updatedSets));
    
    toast({
      title: "Ensemble créé",
      description: `Nouvel ensemble de questions "${currentQuestionSetTitle}" créé avec succès`,
    });
  };

  const switchQuestionSet = (setId: string) => {
    const selectedSet = questionSets.find(set => set.id === setId);
    if (selectedSet) {
      setCurrentQuestionSet(setId);
      setCurrentQuestionSetTitle(selectedSet.title);
      setQuestions(selectedSet.questions);
    }
  };

  const deleteQuestionSet = (setId: string) => {
    const updatedSets = questionSets.filter(set => set.id !== setId);
    setQuestionSets(updatedSets);
    
    if (currentQuestionSet === setId) {
      if (updatedSets.length > 0) {
        setCurrentQuestionSet(updatedSets[0].id);
        setCurrentQuestionSetTitle(updatedSets[0].title);
        setQuestions(updatedSets[0].questions);
      } else {
        setCurrentQuestionSet("");
        setCurrentQuestionSetTitle("");
        setQuestions([]);
      }
    }
    
    localStorage.setItem("questionSets", JSON.stringify(updatedSets));
    
    toast({
      title: "Ensemble supprimé",
      description: "L'ensemble de questions a été supprimé avec succès",
    });
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

    if (!currentQuestionSet) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord créer ou sélectionner un ensemble de questions",
        variant: "destructive",
      });
      return;
    }

    if (questions.length >= 10) {
      toast({
        title: "Limite atteinte",
        description: "Chaque ensemble est limité à 10 questions",
        variant: "destructive",
      });
      return;
    }

    const newQuestion = {
      id: `q-${Date.now()}`,
      text: currentQuestion,
      options: [...options],
      correctAnswerId,
    };

    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    
    const updatedSets = questionSets.map(set => 
      set.id === currentQuestionSet 
        ? { ...set, questions: updatedQuestions } 
        : set
    );
    setQuestionSets(updatedSets);
    
    localStorage.setItem("questionSets", JSON.stringify(updatedSets));
    
    const allQuestions = [];
    for (const set of updatedSets) {
      if (set.questions && set.questions.length > 0) {
        allQuestions.push(...set.questions);
      }
    }
    localStorage.setItem("quizQuestions", JSON.stringify(allQuestions));
    
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
    
    toast.success("Question ajoutée au système de révision");
  };

  const deleteQuestion = (questionId: string) => {
    const updatedQuestions = questions.filter(q => q.id !== questionId);
    setQuestions(updatedQuestions);
    
    const updatedSets = questionSets.map(set => 
      set.id === currentQuestionSet 
        ? { ...set, questions: updatedQuestions } 
        : set
    );
    setQuestionSets(updatedSets);
    
    localStorage.setItem("questionSets", JSON.stringify(updatedSets));
    
    const allQuestions = [];
    for (const set of updatedSets) {
      if (set.questions && set.questions.length > 0) {
        allQuestions.push(...set.questions);
      }
    }
    localStorage.setItem("quizQuestions", JSON.stringify(allQuestions));
    
    toast({
      title: "Question supprimée",
      description: "La question a été supprimée avec succès",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Gestion des Questions EPHATA</h1>
      
      <Tabs defaultValue="create" className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Créer des Questions</TabsTrigger>
          <TabsTrigger value="manage">Gérer les Ensembles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="space-y-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ensemble de Questions</CardTitle>
              <CardDescription>
                Sélectionnez un ensemble existant ou créez-en un nouveau
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="set-title">Titre de l'ensemble</Label>
                  <Input 
                    id="set-title" 
                    value={currentQuestionSetTitle}
                    onChange={e => setCurrentQuestionSetTitle(e.target.value)}
                    placeholder="ex: Formation service client - Module 1"
                  />
                </div>
                <Button 
                  className="mt-8" 
                  onClick={createNewQuestionSet}
                  disabled={!currentQuestionSetTitle.trim()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Créer un nouvel ensemble
                </Button>
              </div>
              
              {questionSets.length > 0 && (
                <div>
                  <Label>Ensembles existants</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                    {questionSets.map(set => (
                      <Button 
                        key={set.id} 
                        variant={currentQuestionSet === set.id ? "default" : "outline"}
                        className="justify-start overflow-hidden"
                        onClick={() => switchQuestionSet(set.id)}
                      >
                        {set.title} ({set.questions.length}/10)
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {currentQuestionSet && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Nouvelle question pour "{currentQuestionSetTitle}"</CardTitle>
                <CardDescription>
                  Créez une nouvelle question avec 4 options et sélectionnez la bonne réponse
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="question">Question ({questions.length}/10)</Label>
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
          )}

          {questions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Questions créées pour "{currentQuestionSetTitle}"</CardTitle>
                <CardDescription>
                  Aperçu des questions que vous avez créées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questions.map((q, index) => (
                    <div key={q.id} className="border rounded-md p-4 relative">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        onClick={() => deleteQuestion(q.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      
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
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gérer les Ensembles de Questions</CardTitle>
              <CardDescription>
                Vous avez créé {questionSets.length} ensembles sur 100 possibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              {questionSets.length === 0 ? (
                <div className="text-center p-6 text-muted-foreground">
                  Aucun ensemble de questions n'a encore été créé.
                </div>
              ) : (
                <div className="grid gap-4">
                  {questionSets.map(set => (
                    <Card key={set.id} className="relative overflow-hidden border">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{set.title}</CardTitle>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => deleteQuestionSet(set.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardDescription>
                          Créé le {new Date(set.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p>Contient {set.questions.length} questions sur 10 possibles</p>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => switchQuestionSet(set.id)}
                        >
                          Modifier cet ensemble
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Déploiement de l'application</CardTitle>
              <CardDescription>
                Partagez votre application EPHATA avec d'autres utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 space-y-2 w-full">
                  <Label htmlFor="deployment-url">URL de déploiement</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="deployment-url" 
                      value={deploymentURL}
                      readOnly
                    />
                    <Button 
                      onClick={() => {
                        navigator.clipboard.writeText(deploymentURL);
                        toast({
                          title: "URL copiée",
                          description: "L'URL de déploiement a été copiée dans le presse-papier",
                        });
                      }}
                      variant="outline"
                    >
                      <Link className="h-4 w-4 mr-2" />
                      Copier
                    </Button>
                  </div>
                </div>
              
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <QrCode className="h-4 w-4 mr-2" />
                      Voir QR Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>QR Code EPHATA</DialogTitle>
                      <DialogDescription>
                        Scannez ce QR code pour accéder à l'application
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-center p-4">
                      <QRCode 
                        value={deploymentURL} 
                        size={256}
                        level="H"
                      />
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={() => {
                          const canvas = document.querySelector("canvas");
                          if (canvas) {
                            const link = document.createElement("a");
                            link.download = "ephata-qrcode.png";
                            link.href = canvas.toDataURL("image/png");
                            link.click();
                          }
                        }}
                        className="w-full"
                      >
                        Télécharger le QR Code
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuestionCreator;
