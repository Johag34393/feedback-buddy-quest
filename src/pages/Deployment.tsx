
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import { Copy, QrCode, Link as LinkIcon, Share2, ExternalLink } from "lucide-react";

const Deployment = () => {
  const [appUrl, setAppUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    // Get the current URL of the application
    const url = window.location.origin;
    setAppUrl(url);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl)
      .then(() => {
        setCopied(true);
        toast.success("Lien copié dans le presse-papier");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error("Impossible de copier le lien");
      });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "EPHATA",
          text: "Accédez à l'application EPHATA",
          url: appUrl,
        });
        toast.success("Lien partagé avec succès");
      } catch (error) {
        toast.error("Erreur lors du partage");
      }
    } else {
      toast.info("La fonctionnalité de partage n'est pas disponible sur votre appareil");
      handleCopyLink();
    }
  };

  const handleOpenLink = () => {
    window.open(appUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold text-primary mb-6 text-center">Déploiement de l'application</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Lien public
          </CardTitle>
          <CardDescription>
            Votre application est actuellement {isPublic ? "publique" : "privée"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
            <p className="text-green-800 font-medium">Application déployée avec succès!</p>
            <p className="text-green-700 text-sm mt-1">Le lien ci-dessous est accessible publiquement.</p>
          </div>
          
          <div className="flex items-center">
            <Input 
              readOnly 
              value={appUrl} 
              className="flex-1 bg-gray-50"
            />
            <Button 
              onClick={handleCopyLink}
              variant="outline" 
              size="icon"
              className="ml-2"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button 
              onClick={handleOpenLink}
              variant="outline" 
              size="icon"
              className="ml-2"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          {copied && (
            <p className="text-sm text-green-600 mt-2">Copié!</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button onClick={handleShare} variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Partager
          </Button>
          <Button onClick={handleOpenLink}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Ouvrir le lien
          </Button>
        </CardFooter>
      </Card>
      
      <Tabs defaultValue="qrcode" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="qrcode">
            <QrCode className="mr-2 h-4 w-4" />
            QR Code
          </TabsTrigger>
          <TabsTrigger value="link">
            <LinkIcon className="mr-2 h-4 w-4" />
            Lien URL
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="qrcode" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>QR Code d'accès</CardTitle>
              <CardDescription>
                Scannez ce QR code pour accéder directement à l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="p-4 bg-white rounded-lg shadow-inner mb-4">
                <QRCode 
                  value={appUrl} 
                  size={200}
                  level="H"
                  className="mx-auto"
                />
              </div>
              <p className="text-sm text-gray-500 text-center mb-4">
                Ce QR code redirige vers: <span className="font-medium">{appUrl}</span>
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={handleShare} variant="outline" className="mr-2">
                <Share2 className="mr-2 h-4 w-4" />
                Partager
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="link" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lien de déploiement</CardTitle>
              <CardDescription>
                Partagez ce lien pour permettre aux utilisateurs d'accéder à l'application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Input 
                  readOnly 
                  value={appUrl} 
                  className="flex-1"
                />
                <Button 
                  onClick={handleCopyLink}
                  variant="outline" 
                  size="icon"
                  className="ml-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              {copied && (
                <p className="text-sm text-green-600 mt-2">Copié!</p>
              )}
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Instructions pour le déploiement:</h3>
                <ol className="list-decimal pl-5 text-sm space-y-2">
                  <li>Partagez le lien ci-dessus avec les utilisateurs</li>
                  <li>Les utilisateurs devront se connecter avec un code d'accès ou OTP</li>
                  <li>Assurez-vous que les visiteurs ont les codes nécessaires</li>
                  <li>Pour générer des codes, connectez-vous avec le compte administrateur</li>
                </ol>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Partager le lien
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Deployment;
