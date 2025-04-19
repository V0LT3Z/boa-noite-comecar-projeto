
import React from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface PixQRCodeProps {
  amount: number;
  onConfirm?: () => Promise<void>;
  isSubmitting?: boolean;
}

const PixQRCode = ({ amount, onConfirm, isSubmitting = false }: PixQRCodeProps) => {
  // Mock PIX code - in a real app, this would come from a payment gateway
  const pixCode = `00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426655440000520400005303986540${amount.toFixed(2).replace('.', '')}5802BR5913Ticket Hub SA6008Sao Paulo62070503***6304E2CA`;

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center p-6 space-y-6">
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold mb-2">Pagamento via PIX</h3>
          <p className="text-gray-500">Escaneie o QR code abaixo para pagar R$ {amount.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg">
          <QRCode value={pixCode} size={200} />
        </div>
        
        <div className="w-full max-w-xs space-y-4">
          <p className="text-center text-sm text-gray-500">
            Após o pagamento, o status da compra será atualizado automaticamente em instantes.
          </p>
          
          {onConfirm && (
            <Button 
              onClick={onConfirm}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Processando..." : "Confirmar pagamento"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PixQRCode;
