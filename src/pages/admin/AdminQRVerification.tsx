
import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Check, X, Scan } from "lucide-react";

const AdminQRVerification = () => {
  const [manualCode, setManualCode] = useState("");
  const [scanResult, setScanResult] = useState<null | {
    valid: boolean;
    message: string;
    ticketInfo?: {
      eventName: string;
      ticketType: string;
      userName: string;
    };
  }>(null);

  const handleManualCheck = () => {
    if (!manualCode) {
      toast({
        title: "Código vazio",
        description: "Por favor, insira um código para verificação.",
        variant: "destructive",
      });
      return;
    }

    // Simulate verification - in a real app this would check against a database
    if (manualCode === "VALID123") {
      setScanResult({
        valid: true,
        message: "Ingresso válido!",
        ticketInfo: {
          eventName: "Festival de Verão 2025",
          ticketType: "VIP",
          userName: "Maria Silva",
        },
      });
      
      toast({
        title: "Ingresso válido",
        description: "O ingresso foi verificado com sucesso.",
        variant: "default",
      });
    } else if (manualCode === "USED123") {
      setScanResult({
        valid: false,
        message: "Ingresso já utilizado!",
        ticketInfo: {
          eventName: "Festival de Verão 2025",
          ticketType: "VIP",
          userName: "João Santos",
        },
      });
      
      toast({
        title: "Ingresso já utilizado",
        description: "Este ingresso já foi utilizado anteriormente.",
        variant: "destructive",
      });
    } else {
      setScanResult({
        valid: false,
        message: "Ingresso inválido!",
      });
      
      toast({
        title: "Ingresso inválido",
        description: "O código informado não corresponde a um ingresso válido.",
        variant: "destructive",
      });
    }
  };

  const handleStartCamera = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A leitura por câmera será implementada em breve.",
      variant: "default",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Verificação de QR Code</h1>
          <p className="text-muted-foreground">
            Verifique ingressos através da leitura de QR Code ou inserção manual de código.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Leitura de QR Code</CardTitle>
              <CardDescription>
                Utilize a câmera para escanear o QR Code do ingresso.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <div className="w-full max-w-xs aspect-square border-2 border-dashed rounded-md flex items-center justify-center bg-muted/30">
                <Button onClick={handleStartCamera} className="gap-2">
                  <Scan className="h-5 w-5" />
                  Iniciar câmera
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verificação Manual</CardTitle>
              <CardDescription>
                Insira o código do ingresso manualmente para verificação.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Digite o código do ingresso"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
              />
              <div className="text-xs text-muted-foreground">
                <p>Para teste, utilize os códigos:</p>
                <ul className="list-disc pl-4 mt-1">
                  <li>VALID123 (válido)</li>
                  <li>USED123 (já utilizado)</li>
                  <li>Qualquer outro (inválido)</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleManualCheck} className="w-full">
                Verificar
              </Button>
            </CardFooter>
          </Card>
        </div>

        {scanResult && (
          <Card className={scanResult.valid ? "border-green-500" : "border-red-500"}>
            <CardHeader className={scanResult.valid ? "bg-green-50" : "bg-red-50"}>
              <div className="flex items-center gap-2">
                {scanResult.valid ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <X className="h-5 w-5 text-red-600" />
                )}
                <CardTitle className={scanResult.valid ? "text-green-600" : "text-red-600"}>
                  {scanResult.message}
                </CardTitle>
              </div>
            </CardHeader>
            {scanResult.ticketInfo && (
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Evento:</div>
                  <div>{scanResult.ticketInfo.eventName}</div>
                  
                  <div className="font-medium">Tipo de ingresso:</div>
                  <div>{scanResult.ticketInfo.ticketType}</div>
                  
                  <div className="font-medium">Nome:</div>
                  <div>{scanResult.ticketInfo.userName}</div>
                </div>
              </CardContent>
            )}
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminQRVerification;
