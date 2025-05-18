
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";

interface ImageUploadSectionProps {
  previewImage: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setPreviewImage: (image: string | null) => void;
  setValue: (name: string, value: string) => void;
}

const ImageUploadSection = ({ 
  previewImage, 
  handleImageChange, 
  setPreviewImage, 
  setValue 
}: ImageUploadSectionProps) => {
  return (
    <div className="space-y-2">
      <FormLabel>Banner do Evento</FormLabel>
      <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed rounded-lg">
        {previewImage ? (
          <div className="relative w-full max-w-md">
            <img 
              src={previewImage} 
              alt="Banner preview" 
              className="w-full h-auto rounded-lg object-cover" 
              style={{ maxHeight: "200px" }}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => {
                setPreviewImage(null);
                setValue("bannerUrl", "");
              }}
            >
              Remover
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="w-10 h-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Arraste e solte ou clique para selecionar uma imagem
            </p>
          </div>
        )}
        <div className="w-full">
          <Input
            id="banner"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUploadSection;
