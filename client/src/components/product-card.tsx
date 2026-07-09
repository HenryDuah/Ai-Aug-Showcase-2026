import { ChevronRight, Video } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onTap: () => void;
}

export default function ProductCard({ product, onTap }: ProductCardProps) {
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTap();
  };

  return (
    <div 
      className="product-card overflow-hidden cursor-pointer hover:border-primary transition-colors h-full flex flex-col border border-border bg-card rounded-sm"
      onClick={onTap}
      data-testid={`product-card-${product.id}`}
    >
      <div 
        className="aspect-video bg-secondary relative overflow-hidden"
        onClick={handleImageClick}
      >
        <img 
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
          data-testid={`product-image-${product.id}`}
        />
        {product.videoUrl && (
          <div className="absolute top-4 right-4 bg-background border border-border text-foreground px-3 py-1.5 rounded-sm text-small font-mono flex items-center gap-2">
            <Video className="w-3.5 h-3.5 text-primary" />
            VIDEO
          </div>
        )}
      </div>
      <div className="p-6 md:p-8 flex-1 flex flex-col">
        <h3 className="text-h3 text-foreground mb-2 line-clamp-2" data-testid={`product-name-${product.id}`}>
          {product.name}
        </h3>
        <p className="text-body text-muted-foreground mb-6" data-testid={`product-company-${product.id}`}>
          {product.company}
        </p>
        <p className="text-body text-muted-foreground leading-relaxed mb-8 line-clamp-3 flex-1" data-testid={`product-description-${product.id}`}>
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-border">
          <span className="text-small font-mono text-muted-foreground uppercase">{product.type}</span>
          <ChevronRight className="text-muted-foreground w-5 h-5 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}
