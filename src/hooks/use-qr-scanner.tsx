
import { useState, useEffect } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Capacitor } from '@capacitor/core';

export const useQRScanner = (onScanSuccess: (text: string) => void) => {
  const [isScanning, setIsScanning] = useState(false);
  const isMobileApp = Capacitor.getPlatform() === 'ios' || Capacitor.getPlatform() === 'android';

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    if (isScanning && !isMobileApp) {
      scanner = new Html5QrcodeScanner(
        "reader",
        { 
          fps: 10,
          qrbox: {width: 250, height: 250},
          aspectRatio: 1,
        },
        false
      );

      scanner.render(
        (decodedText) => {
          setIsScanning(false);
          onScanSuccess(decodedText);
        },
        (error) => console.error(error)
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [isScanning, isMobileApp, onScanSuccess]);

  const startScanning = async () => {
    if (isMobileApp) {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Base64,
        });
        
        // Em um ambiente real, você precisaria processar a imagem base64
        // e decodificar o QR code. Por enquanto, vamos apenas simular
        // que encontramos um QR code na imagem
        const mockQRCode = "MOCK-QR-CODE-" + Date.now();
        onScanSuccess(mockQRCode);
      } catch (error) {
        console.error('Erro ao acessar a câmera:', error);
      }
    } else {
      setIsScanning(true);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  return {
    isScanning,
    startScanning,
    stopScanning,
    isMobileApp
  };
};
