import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImageOverlayProps {
  isOpen: boolean;
  imageUrl: string;
  altText: string;
  onClose: () => void;
}

export default function ImageOverlay({ isOpen, imageUrl, altText, onClose }: ImageOverlayProps) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-5"
      onClick={handleOverlayClick}
      data-testid="image-overlay"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 z-10"
        data-testid="button-close-overlay"
      >
        <X className="w-6 h-6" />
      </Button>
      
      <img
        src={imageUrl}
        alt={altText}
        className="max-w-full max-h-full object-contain"
        data-testid="overlay-image"
      />
    </div>
  );
}
