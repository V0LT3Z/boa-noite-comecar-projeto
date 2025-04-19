
import { useState } from "react";
import QRCode from "react-qr-code";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PixQRCodeProps {
  pixCode: string;
  amount?: number;
}

const PixQRCode = ({ pixCode, amount }: PixQRCodeProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 border">
      <QRCode value={pixCode} size={256} level="H" />
      {amount && (
        <p className="mt-2 text-lg font-semibold">
          Valor: R$ {amount.toFixed(2)}
        </p>
      )}
      <p className="mt-4 text-sm text-gray-600">
        Escaneie o código QR acima ou copie o código PIX abaixo:
      </p>
      <div className="flex items-center mt-4">
        <input
          type="text"
          value={pixCode}
          readOnly
          className="px-4 py-2 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full md:w-64"
        />
        <Button
          variant="outline"
          size="sm"
          className="ml-2"
          onClick={handleCopyClick}
          disabled={copied}
        >
          {copied ? (
            <>
              Copiado <Check className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Copiar <Copy className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PixQRCode;
