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
      className="fixed inset-0 bg-neutral-900/95 z-50 flex items-center justify-center p-5"
      onClick={handleOverlayClick}
      data-testid="image-overlay"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 bg-neutral-800 text-white hover:bg-neutral-700 z-10 rounded-md"
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
