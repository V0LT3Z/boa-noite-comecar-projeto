
interface PixQRCodeProps {
  amount: number;
  onComplete: () => void;
  isSubmitting: boolean;
}

const PixQRCode = ({ amount, onComplete, isSubmitting }: PixQRCodeProps) => {
  const pixQRCodeURL = `https://chart.googleapis.com/chart?cht=qr&chl=00020126330014BR.GOV.BCB.PIX0111EXAMPLE1234520400005303986540${amount.toFixed(2).replace('.', '')}5802BR5913EventPayment6008Sao Paulo62070503***6304${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}&chs=300x300&choe=UTF-8&chld=L|2`;

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="text-center space-y-4">
        <p className="font-medium text-lg">QR Code para pagamento PIX</p>
        <div className="flex justify-center">
          <img 
            src={pixQRCodeURL} 
            alt="QR Code PIX" 
            className="border p-2 bg-white rounded-lg" 
            width={200} 
            height={200}
          />
        </div>
        <div className="text-sm text-gray-500 mt-2">
          <p>Escaneie o QR Code acima com o aplicativo do seu banco</p>
          <p>Valor a pagar: <span className="font-semibold">R$ {amount.toFixed(2)}</span></p>
        </div>
        <div className="border-t pt-3 mt-3">
          <p className="font-medium">Instruções:</p>
          <ol className="text-sm text-left list-decimal pl-5 pt-2">
            <li>Abra o aplicativo do seu banco</li>
            <li>Selecione a opção PIX</li>
            <li>Escaneie o QR Code</li>
            <li>Confirme as informações e o valor</li>
            <li>Finalize o pagamento</li>
          </ol>
        </div>
        
        <Button 
          onClick={onComplete} 
          disabled={isSubmitting} 
          className="w-full bg-gradient-primary text-white"
        >
          {isSubmitting ? "Processando..." : "Confirmar Pagamento"}
        </Button>
      </div>
    </div>
  );
};

export default PixQRCode;
