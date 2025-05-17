
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, X } from "lucide-react";
import QRCode from "react-qr-code";
import { UserTicket } from "@/types/event";

interface QRCodeModalProps {
  selectedTicket: UserTicket;
  isOpen: boolean;
  onClose: () => void;
}

const QRCodeModal = ({ selectedTicket, isOpen, onClose }: QRCodeModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg w-full max-w-md relative overflow-hidden animate-scale-in">
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full h-8 w-8 p-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6 pt-10">
          <h3 className="text-2xl font-bold text-center mb-2">{selectedTicket.event_title}</h3>
          <p className="text-center text-dashboard-muted mb-6">
            {selectedTicket.ticket_type}
          </p>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 flex justify-center mb-4">
            <div className="p-3 bg-white rounded-md shadow-sm">
              <QRCode 
                value={selectedTicket.qr_code} 
                size={200}
                className="mx-auto"
              />
            </div>
          </div>
          
          <p className="text-center font-mono text-sm mt-2 mb-1 break-all px-4">
            {selectedTicket.qr_code}
          </p>
          
          <p className="text-center text-xs text-dashboard-muted mb-4">
            Apresente este QR Code na entrada do evento
          </p>
          
          <div className="flex justify-between items-center text-sm px-4 py-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-primary" />
              <span>{new Date(selectedTicket.event_date).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-primary" />
              <span>{selectedTicket.event_location}</span>
            </div>
          </div>
          
          <Button 
            className="w-full mt-6" 
            onClick={onClose}
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
