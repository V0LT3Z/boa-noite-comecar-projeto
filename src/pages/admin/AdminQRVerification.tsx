import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Check, X, Camera, CameraOff } from "lucide-react";
import { verifyTicketQR } from "@/services/orders";
import { QRVerification } from "@/types/admin";
import { useQRScanner } from "@/hooks/use-qr-scanner";

const AdminQRVerification = () => {
  const [manualCode, setManualCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [scanResult, setScanResult] = useState<QRVerification | null>(null);

  const verifyCode = async (code: string) => {
    setIsVerifying(true);
    
    try {
      const result = await verifyTicketQR(code);
      setScanResult(result);
      
      if (result.valid) {
        toast({
          title: "Ingresso válido",
          description: "O ingresso foi verificado com sucesso.",
        });
      } else {
        toast({
          title: result.message,
          description: "Por favor, verifique o código informado.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao verificar ingresso:", error);
      toast({
        title: "Erro na verificação",
        description: "Ocorreu um erro ao verificar o ingresso.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleManualCheck = () => verifyCode(manualCode);

  const { isScanning, startScanning, stopScanning, isMobileApp } = useQRScanner(
    (decodedText) => verifyCode(decodedText)
  );

  const handleStartCamera = () => {
    setScanResult(null);
    startScanning();
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
                {isMobileApp 
                  ? "Tire uma foto do QR Code do ingresso."
                  : "Utilize a câmera para escanear o QR Code do ingresso."
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              {isScanning && !isMobileApp ? (
                <div className="w-full max-w-xs aspect-square">
                  <div id="reader"></div>
                </div>
              ) : (
                <div className="w-full max-w-xs aspect-square border-2 border-dashed rounded-md flex items-center justify-center bg-muted/30">
                  <Button onClick={handleStartCamera} className="gap-2">
                    <Camera className="h-5 w-5" />
                    {isMobileApp ? "Tirar foto" : "Iniciar câmera"}
                  </Button>
                </div>
              )}
            </CardContent>
            {isScanning && !isMobileApp && (
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full gap-2" 
                  onClick={stopScanning}
                >
                  <CameraOff className="h-5 w-5" />
                  Parar câmera
                </Button>
              </CardFooter>
            )}
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
                <p>Digite o código QR do ingresso para verificação.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleManualCheck} 
                className="w-full"
                disabled={isVerifying || !manualCode}
              >
                {isVerifying ? "Verificando..." : "Verificar"}
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
