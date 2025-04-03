
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";

interface Question {
  id: number;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
}

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(189); // 189 seconds timer
  const { toast } = useToast();

  useEffect(() => {
    // Only start the timer if the quiz hasn't been completed
    if (!quizCompleted) {
      const timer = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [quizCompleted]);

  const handleTimeUp = () => {
    // Auto-submit the quiz when time is up
    const finalScore = calculateScore();
    setScore(finalScore);
    setQuizCompleted(true);
    
    toast({
      title: "Temps écoulé !",
      description: `Votre score final est de ${finalScore}/${questions.length * 2} points`,
      variant: "destructive",
    });
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const questions: Question[] = [
    {
      id: 1,
      text: "Quelle est la meilleure approche face à un client mécontent ?",
      options: [
        { id: "a", text: "L'ignorer jusqu'à ce qu'il se calme" },
        { id: "b", text: "Lui demander de rappeler plus tard" },
        { id: "c", text: "L'écouter activement et valider ses préoccupations" },
        { id: "d", text: "Transférer immédiatement l'appel à un supérieur" }
      ],
      correctAnswer: "c"
    },
    {
      id: 2,
      text: "Comment gérer une situation où vous ne connaissez pas la réponse à une question d'un client ?",
      options: [
        { id: "a", text: "Inventer une réponse pour paraître compétent" },
        { id: "b", text: "Admettre que vous ne savez pas et promettre de trouver l'information" },
        { id: "c", text: "Changer de sujet discrètement" },
        { id: "d", text: "Dire au client de chercher lui-même sur internet" }
      ],
      correctAnswer: "b"
    },
    {
      id: 3,
      text: "Quelle est la première étape pour résoudre un problème client ?",
      options: [
        { id: "a", text: "Proposer immédiatement une solution" },
        { id: "b", text: "Blâmer le département responsable" },
        { id: "c", text: "Identifier clairement la nature du problème" },
        { id: "d", text: "Vérifier si d'autres clients ont le même problème" }
      ],
      correctAnswer: "c"
    },
    {
      id: 4,
      text: "Quel est le meilleur moyen de conclure une interaction avec un client ?",
      options: [
        { id: "a", text: "Demander s'il a d'autres questions ou besoins" },
        { id: "b", text: "Terminer rapidement pour passer au client suivant" },
        { id: "c", text: "Proposer systématiquement des produits supplémentaires" },
        { id: "d", text: "Dire au revoir sans plus de formalités" }
      ],
      correctAnswer: "a"
    },
    {
      id: 5,
      text: "Comment prioriser les demandes multiples de clients ?",
      options: [
        { id: "a", text: "Traiter les demandes par ordre d'arrivée" },
        { id: "b", text: "Prioriser les clients qui semblent les plus importants" },
        { id: "c", text: "Évaluer l'urgence et l'impact de chaque demande" },
        { id: "d", text: "Déléguer toutes les demandes à d'autres collègues" }
      ],
      correctAnswer: "c"
    },
    {
      id: 6,
      text: "Quelle est la meilleure façon de communiquer des nouvelles négatives à un client ?",
      options: [
        { id: "a", text: "Par email, pour éviter la confrontation directe" },
        { id: "b", text: "Directement, avec empathie et en proposant des alternatives" },
        { id: "c", text: "En minimisant le problème pour qu'il paraisse moins grave" },
        { id: "d", text: "En laissant un autre service s'en charger" }
      ],
      correctAnswer: "b"
    },
    {
      id: 7,
      text: "Comment réagir face à un client qui vous insulte ?",
      options: [
        { id: "a", text: "Répondre sur le même ton pour établir votre autorité" },
        { id: "b", text: "Raccrocher ou mettre fin à la conversation" },
        { id: "c", text: "Rester calme et professionnel, puis rediriger vers le problème initial" },
        { id: "d", text: "Menacer de signaler son comportement à sa hiérarchie" }
      ],
      correctAnswer: "c"
    },
    {
      id: 8,
      text: "Quelle compétence est la plus importante pour un agent de service client ?",
      options: [
        { id: "a", text: "La capacité à parler rapidement" },
        { id: "b", text: "L'écoute active" },
        { id: "c", text: "La connaissance technique approfondie" },
        { id: "d", text: "La capacité à convaincre les clients d'acheter plus" }
      ],
      correctAnswer: "b"
    },
    {
      id: 9,
      text: "Comment gérer efficacement votre temps lors de périodes de forte affluence ?",
      options: [
        { id: "a", text: "Réduire le temps passé avec chaque client" },
        { id: "b", text: "Ignorer les demandes moins urgentes" },
        { id: "c", text: "Prioriser et organiser les tâches selon leur importance" },
        { id: "d", text: "Travailler plus vite sans prendre de pause" }
      ],
      correctAnswer: "c"
    },
    {
      id: 10,
      text: "Quel est le principal objectif d'un suivi client après la résolution d'un problème ?",
      options: [
        { id: "a", text: "Vérifier que le problème ne réapparaît pas" },
        { id: "b", text: "Avoir l'occasion de vendre d'autres produits" },
        { id: "c", text: "Respecter la procédure de l'entreprise" },
        { id: "d", text: "Montrer à votre manager que vous êtes méthodique" }
      ],
      correctAnswer: "a"
    },
    {
      id: 11,
      text: "Quelle est la meilleure façon d'obtenir des retours clients sur la qualité de service ?",
      options: [
        { id: "a", text: "Insister pour qu'ils complètent un long sondage" },
        { id: "b", text: "Leur demander directement mais brièvement leur niveau de satisfaction" },
        { id: "c", text: "Supposer que l'absence de plainte signifie satisfaction" },
        { id: "d", text: "Leur envoyer de multiples emails de suivi" }
      ],
      correctAnswer: "b"
    },
    {
      id: 12,
      text: "Comment maintenir un bon équilibre entre efficacité et qualité de service ?",
      options: [
        { id: "a", text: "Prioriser toujours l'efficacité, les clients veulent des solutions rapides" },
        { id: "b", text: "Prioriser toujours la qualité, peu importe le temps nécessaire" },
        { id: "c", text: "Adapter l'approche selon la complexité de chaque situation" },
        { id: "d", text: "Suivre strictement les scripts d'appel sans adaptation" }
      ],
      correctAnswer: "c"
    },
    {
      id: 13,
      text: "Quel est le meilleur moyen d'améliorer continuellement vos compétences de service client ?",
      options: [
        { id: "a", text: "Se fier uniquement à votre expérience personnelle" },
        { id: "b", text: "Demander régulièrement des retours et suivre des formations" },
        { id: "c", text: "Observer uniquement les agents les plus performants" },
        { id: "d", text: "Lire des livres théoriques sur le service client" }
      ],
      correctAnswer: "b"
    },
    {
      id: 14,
      text: "Comment gérer une situation où un client demande quelque chose qui va à l'encontre de la politique de l'entreprise ?",
      options: [
        { id: "a", text: "Faire une exception pour éviter les problèmes" },
        { id: "b", text: "Refuser catégoriquement sans explication" },
        { id: "c", text: "Expliquer la politique et proposer des alternatives acceptables" },
        { id: "d", text: "Transférer immédiatement à un manager" }
      ],
      correctAnswer: "c"
    },
    {
      id: 15,
      text: "Quelle approche est préférable lors de la gestion d'un client récurrent ayant des problèmes similaires ?",
      options: [
        { id: "a", text: "Lui conseiller de changer de produit ou service" },
        { id: "b", text: "L'orienter vers l'auto-assistance pour ne plus avoir à traiter ses demandes" },
        { id: "c", text: "Analyser la cause profonde du problème pour trouver une solution permanente" },
        { id: "d", text: "Suggérer qu'il utilise mal le produit" }
      ],
      correctAnswer: "c"
    },
    {
      id: 16,
      text: "Comment utiliser efficacement les outils CRM dans le service client ?",
      options: [
        { id: "a", text: "Enregistrer le minimum d'informations pour gagner du temps" },
        { id: "b", text: "Documenter en détail chaque interaction pour assurer un suivi cohérent" },
        { id: "c", text: "Se concentrer uniquement sur les champs obligatoires" },
        { id: "d", text: "Déléguer la saisie des données à un autre service" }
      ],
      correctAnswer: "b"
    },
    {
      id: 17,
      text: "Quelle est la meilleure façon de gérer les attentes irréalistes d'un client ?",
      options: [
        { id: "a", text: "Promettre de faire de votre mieux, même si c'est impossible" },
        { id: "b", text: "Être honnête sur ce qui est réalisable et proposer des options viables" },
        { id: "c", text: "Dire oui à tout puis laisser un autre service gérer les complications" },
        { id: "d", text: "Suggérer au client de revoir ses attentes à la baisse" }
      ],
      correctAnswer: "b"
    },
    {
      id: 18,
      text: "Comment collaborer efficacement avec d'autres départements pour résoudre les problèmes clients ?",
      options: [
        { id: "a", text: "Transférer simplement le problème et oublier" },
        { id: "b", text: "Communiquer clairement le problème et suivre sa résolution" },
        { id: "c", text: "Insister pour que le client contacte lui-même l'autre département" },
        { id: "d", text: "Blâmer les autres départements pour les délais" }
      ],
      correctAnswer: "b"
    },
    {
      id: 19,
      text: "Quelle est l'importance de la cohérence dans le service client ?",
      options: [
        { id: "a", text: "Peu importante, chaque situation est unique" },
        { id: "b", text: "Cruciale pour la confiance et la fiabilité perçue" },
        { id: "c", text: "Secondaire par rapport à la rapidité" },
        { id: "d", text: "Importante uniquement pour les clients VIP" }
      ],
      correctAnswer: "b"
    },
    {
      id: 20,
      text: "Comment maintenir une attitude positive même après avoir traité des clients difficiles toute la journée ?",
      options: [
        { id: "a", text: "Éviter les clients difficiles en fin de journée" },
        { id: "b", text: "Pratiquer des techniques de gestion du stress et faire de courtes pauses" },
        { id: "c", text: "Raccourcir les appels pour minimiser l'exposition aux situations stressantes" },
        { id: "d", text: "Transférer les clients difficiles à des collègues" }
      ],
      correctAnswer: "b"
    }
  ];

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questions[currentQuestionIndex].id]: value
    });
  };

  const calculateScore = () => {
    let totalScore = 0;
    
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        totalScore += 2; // Chaque réponse correcte vaut 2 points
      }
    });
    
    return totalScore;
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setQuizCompleted(true);
    
    toast({
      title: "Quiz terminé !",
      description: `Votre score: ${finalScore}/${questions.length * 2} points`,
    });
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setScore(null);
    setQuizCompleted(false);
    setTimeRemaining(189); // Reset timer
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = selectedAnswers[currentQuestion.id] || "";
  const isAnswered = !!currentAnswer;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const allQuestionsAnswered = questions.every(q => selectedAnswers[q.id]);

  // Calculate timer progress percentage
  const timerProgress = (timeRemaining / 189) * 100;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Quiz de formation</h1>
      
      {!quizCompleted ? (
        <>
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Question {currentQuestionIndex + 1} sur {questions.length}</span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
          
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <div className="flex items-center text-sm font-medium">
                <Clock className="w-4 h-4 mr-2" />
                <span className={`${timeRemaining < 30 ? 'text-red-500 font-bold' : ''}`}>
                  Temps restant: {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
            <Progress 
              value={timerProgress} 
              className={`w-full ${timeRemaining < 30 ? 'bg-red-200' : ''}`} 
              indicatorClassName={timeRemaining < 30 ? 'bg-red-500' : undefined}
            />
          </div>
          
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
              <CardDescription>{currentQuestion.text}</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={currentAnswer}
                onValueChange={handleAnswerSelect}
                className="space-y-3"
              >
                {currentQuestion.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                    <Label htmlFor={`option-${option.id}`}>{option.text}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Précédent
              </Button>
              
              {isLastQuestion ? (
                <Button 
                  onClick={handleSubmit}
                  disabled={!allQuestionsAnswered}
                >
                  Terminer le quiz
                </Button>
              ) : (
                <Button 
                  onClick={handleNext}
                  disabled={!isAnswered}
                >
                  Suivant
                </Button>
              )}
            </CardFooter>
          </Card>
        </>
      ) : (
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Résultats du quiz</CardTitle>
            <CardDescription>
              Votre score final est de {score} sur {questions.length * 2} points.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress 
                value={(score! / (questions.length * 2)) * 100} 
                className="w-full h-4"
              />
              
              <div className="text-center text-xl font-semibold mt-4">
                {score! >= questions.length * 1.5 ? (
                  <p className="text-green-600">Excellent ! Vous maîtrisez bien les concepts.</p>
                ) : score! >= questions.length ? (
                  <p className="text-yellow-600">Bon travail ! Il y a encore quelques points à améliorer.</p>
                ) : (
                  <p className="text-red-600">Vous devriez revoir certains concepts fondamentaux.</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={resetQuiz}>
              Recommencer le quiz
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Quiz;
