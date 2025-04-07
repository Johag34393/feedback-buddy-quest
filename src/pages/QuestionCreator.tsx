import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from 'uuid';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Trash2, Plus, Edit } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";

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
  const [newSetTitle, setNewSetTitle] = useState("");
  const [selectedSet, setSelectedSet] = useState<QuestionSet | null>(null);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newOptionText, setNewOptionText] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    loadQuestionSets();
  }, []);

  useEffect(() => {
    if (selectedSet) {
      setQuestions(selectedSet.questions);
    } else {
      setQuestions([]);
    }
  }, [selectedSet]);

  const loadQuestionSets = () => {
    const savedSets = localStorage.getItem("questionSets");
    if (savedSets) {
      setQuestionSets(JSON.parse(savedSets));
    }
  };

  const saveQuestionSets = (sets: QuestionSet[]) => {
    localStorage.setItem("questionSets", JSON.stringify(sets));
    loadQuestionSets();
  };

  const handleCreateSet = () => {
    if (newSetTitle.trim() === "") {
      toast({
        title: "Erreur",
        description: "Le titre de l'ensemble ne peut pas être vide.",
        variant: "destructive",
      });
      return;
    }

    const newSet: QuestionSet = {
      id: uuidv4(),
      title: newSetTitle,
      questions: [],
      createdAt: new Date().toISOString(),
    };

    const updatedSets = [...questionSets, newSet];
    setQuestionSets(updatedSets);
    saveQuestionSets(updatedSets);
    setNewSetTitle("");
    toast({
      title: "Succès",
      description: "L'ensemble de questions a été créé avec succès.",
      variant: "default",
    });
  };

  const handleSelectSet = (setId: string) => {
    const set = questionSets.find((set) => set.id === setId);
    setSelectedSet(set || null);
  };

  const handleAddQuestion = () => {
    if (!selectedSet) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un ensemble de questions.",
        variant: "destructive",
      });
      return;
    }

    if (newQuestionText.trim() === "") {
      toast({
        title: "Erreur",
        description: "Le texte de la question ne peut pas être vide.",
        variant: "destructive",
      });
      return;
    }

    const newQuestion: Question = {
      id: uuidv4(),
      text: newQuestionText,
      options: [],
      correctAnswerId: "",
    };

    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);

    const updatedSets = questionSets.map((set) =>
      set.id === selectedSet.id ? { ...set, questions: updatedQuestions } : set
    );
    setQuestionSets(updatedSets);
    saveQuestionSets(updatedSets);
    setNewQuestionText("");
    toast({
      title: "Succès",
      description: "La question a été ajoutée avec succès.",
      variant: "default",
    });
  };

  const handleAddOption = (questionId: string) => {
    if (newOptionText.trim() === "") {
      toast({
        title: "Erreur",
        description: "Le texte de l'option ne peut pas être vide.",
        variant: "destructive",
      });
      return;
    }

    const newOption: QuestionOption = {
      id: uuidv4(),
      text: newOptionText,
    };

    const updatedQuestions = questions.map((question) => {
      if (question.id === questionId) {
        return {
          ...question,
          options: [...question.options, newOption],
        };
      }
      return question;
    });
    setQuestions(updatedQuestions);

    const updatedSets = questionSets.map((set) =>
      set.id === selectedSet?.id
        ? { ...set, questions: updatedQuestions }
        : set
    );
    setQuestionSets(updatedSets);
    saveQuestionSets(updatedSets);
    setNewOptionText("");
    toast({
      title: "Succès",
      description: "L'option a été ajoutée avec succès.",
      variant: "default",
    });
  };

  const handleDeleteOption = (questionId: string, optionId: string) => {
    const updatedQuestions = questions.map((question) => {
      if (question.id === questionId) {
        return {
          ...question,
          options: question.options.filter((option) => option.id !== optionId),
        };
      }
      return question;
    });
    setQuestions(updatedQuestions);

    const updatedSets = questionSets.map((set) =>
      set.id === selectedSet?.id
        ? { ...set, questions: updatedQuestions }
        : set
    );
    setQuestionSets(updatedSets);
    saveQuestionSets(updatedSets);
    toast({
      title: "Succès",
      description: "L'option a été supprimée avec succès.",
      variant: "default",
    });
  };

  const handleSetCorrectAnswer = (questionId: string, optionId: string) => {
    const updatedQuestions = questions.map((question) => {
      if (question.id === questionId) {
        return {
          ...question,
          correctAnswerId: optionId,
        };
      }
      return question;
    });
    setQuestions(updatedQuestions);

    const updatedSets = questionSets.map((set) =>
      set.id === selectedSet?.id
        ? { ...set, questions: updatedQuestions }
        : set
    );
    setQuestionSets(updatedSets);
    saveQuestionSets(updatedSets);
    toast({
      title: "Succès",
      description: "La réponse correcte a été définie avec succès.",
      variant: "default",
    });
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setNewQuestionText(question.text);
  };

  const handleUpdateQuestion = () => {
    if (!editingQuestion) return;

    if (newQuestionText.trim() === "") {
      toast({
        title: "Erreur",
        description: "Le texte de la question ne peut pas être vide.",
        variant: "destructive",
      });
      return;
    }

    const updatedQuestions = questions.map((question) => {
      if (question.id === editingQuestion.id) {
        return {
          ...question,
          text: newQuestionText,
        };
      }
      return question;
    });
    setQuestions(updatedQuestions);

    const updatedSets = questionSets.map((set) =>
      set.id === selectedSet?.id
        ? { ...set, questions: updatedQuestions }
        : set
    );
    setQuestionSets(updatedSets);
    saveQuestionSets(updatedSets);
    setEditingQuestion(null);
    setNewQuestionText("");
    toast({
      title: "Succès",
      description: "La question a été mise à jour avec succès.",
      variant: "default",
    });
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestionToDelete(questionId);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteQuestion = () => {
    if (!questionToDelete) return;

    const updatedQuestions = questions.filter(
      (question) => question.id !== questionToDelete
    );
    setQuestions(updatedQuestions);

    const updatedSets = questionSets.map((set) =>
      set.id === selectedSet?.id
        ? { ...set, questions: updatedQuestions }
        : set
    );
    setQuestionSets(updatedSets);
    saveQuestionSets(updatedSets);
    setShowDeleteConfirmation(false);
    setQuestionToDelete(null);
    toast({
      title: "Succès",
      description: "La question a été supprimée avec succès.",
      variant: "default",
    });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsImporting(true);
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const jsonString = reader.result as string;
        const importedQuestions: Question[] = JSON.parse(jsonString);

        // Validation de la structure des questions importées
        if (!Array.isArray(importedQuestions) || importedQuestions.some(q => !q.text || !Array.isArray(q.options) || !q.correctAnswerId)) {
          throw new Error("Le fichier JSON ne contient pas une liste de questions valide.");
        }

        const updatedQuestions = [...questions, ...importedQuestions];
        setQuestions(updatedQuestions);

        const updatedSets = questionSets.map((set) =>
          set.id === selectedSet?.id
            ? { ...set, questions: updatedQuestions }
            : set
        );
        setQuestionSets(updatedSets);
        saveQuestionSets(updatedSets);
        toast({
          title: "Succès",
          description: "Les questions ont été importées avec succès.",
          variant: "default",
        });
      } catch (error) {
        console.error("Erreur lors de l'importation des questions:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors de l'importation des questions. Veuillez vérifier le format du fichier JSON.",
          variant: "destructive",
        });
      } finally {
        setIsImporting(false);
      }
    };

    reader.onerror = () => {
      setIsImporting(false);
      toast({
        title: "Erreur",
        description: "Erreur lors de la lecture du fichier.",
        variant: "destructive",
      });
    };

    reader.readAsText(file);
  }, [questions, questionSets, selectedSet, saveQuestionSets]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {
    'application/json': ['.json']
  } });

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Gestionnaire de questions</h1>

      {/* Création et sélection d'un ensemble de questions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Créer un ensemble de questions</CardTitle>
          <CardDescription>
            Créez un nouvel ensemble pour organiser vos questions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="setTitle">Titre de l'ensemble</Label>
            <Input
              id="setTitle"
              placeholder="Nommez votre ensemble"
              value={newSetTitle}
              onChange={(e) => setNewSetTitle(e.target.value)}
            />
          </div>
          <Button onClick={handleCreateSet}>Créer un ensemble</Button>
        </CardContent>
      </Card>

      {/* Sélection d'un ensemble existant */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sélectionner un ensemble existant</CardTitle>
          <CardDescription>
            Choisissez un ensemble pour gérer ses questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {questionSets.map((set) => (
              <Button
                key={set.id}
                variant={selectedSet?.id === set.id ? "default" : "outline"}
                onClick={() => handleSelectSet(set.id)}
              >
                {set.title}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedSet && (
        <>
          {/* Ajout et édition de questions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingQuestion ? "Modifier la question" : "Ajouter une question"}
              </CardTitle>
              <CardDescription>
                {editingQuestion
                  ? "Modifiez le texte de la question sélectionnée."
                  : "Ajoutez une nouvelle question à l'ensemble."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="questionText">Texte de la question</Label>
                <Textarea
                  id="questionText"
                  placeholder="Entrez votre question ici"
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                />
              </div>
              <Button
                onClick={editingQuestion ? handleUpdateQuestion : handleAddQuestion}
              >
                {editingQuestion ? "Mettre à jour la question" : "Ajouter une question"}
              </Button>
            </CardContent>
          </Card>

          {/* Ajout d'options à une question */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ajouter une option</CardTitle>
              <CardDescription>
                Ajoutez des options à la question sélectionnée.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="optionText">Texte de l'option</Label>
                <Input
                  id="optionText"
                  placeholder="Entrez une option"
                  value={newOptionText}
                  onChange={(e) => setNewOptionText(e.target.value)}
                />
              </div>
              <Button onClick={() => handleAddOption("")}>
                Ajouter une option
              </Button>
            </CardContent>
          </Card>

          {/* Importation de questions depuis un fichier JSON */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Importer des questions depuis un fichier JSON</CardTitle>
              <CardDescription>
                Importez une liste de questions depuis un fichier JSON.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                {
                  isDragActive ?
                    <p>Déposez les fichiers ici ...</p> :
                    <p>Glissez-déposez des fichiers ici, ou cliquez pour sélectionner des fichiers</p>
                }
              </div>
              {isImporting && <p>Importation en cours...</p>}
            </CardContent>
          </Card>

          {/* Affichage des questions existantes */}
          <Card>
            <CardHeader>
              <CardTitle>Questions existantes</CardTitle>
              <CardDescription>
                Gérez les questions de l'ensemble sélectionné.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Options</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell>{question.text}</TableCell>
                      <TableCell>
                        <ul>
                          {question.options.map((option) => (
                            <li key={option.id} className="flex items-center justify-between">
                              {option.text}
                              <div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleSetCorrectAnswer(question.id, option.id)
                                  }
                                >
                                  {question.correctAnswerId === option.id
                                    ? "Correct"
                                    : "Définir comme correct"}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleDeleteOption(question.id, option.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </li>
                          ))}
                          <li className="mt-2">
                            <Input
                              type="text"
                              placeholder="Nouvelle option"
                              value={newOptionText}
                              onChange={(e) => setNewOptionText(e.target.value)}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-1"
                              onClick={() => handleAddOption(question.id)}
                            >
                              Ajouter une option
                            </Button>
                          </li>
                        </ul>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditQuestion(question)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {/* Confirmation de suppression d'une question */}
      <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr(e) ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera la question de manière permanente.
              Voulez-vous continuer ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirmation(false)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteQuestion}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuestionCreator;
