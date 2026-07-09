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
      className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-8"
      onClick={handleOverlayClick}
      data-testid="image-overlay"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-8 right-8 w-14 h-14 bg-secondary text-foreground hover:bg-card border border-border rounded-sm z-10"
        data-testid="button-close-overlay"
      >
        <X className="w-6 h-6" />
      </Button>
      
      <img
        src={imageUrl}
        alt={altText}
        className="max-w-full max-h-full object-contain shadow-2 border border-border"
        data-testid="overlay-image"
      />
    </div>
  );
}
