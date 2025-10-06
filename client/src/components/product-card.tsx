import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Headphones } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onTap: () => void;
}

export default function ProductCard({ product, onTap }: ProductCardProps) {
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Could show full-screen image here
    onTap();
  };

  return (
    <Card 
      className="product-card overflow-hidden cursor-pointer hover:shadow-lg transition-all"
      onClick={onTap}
      data-testid={`product-card-${product.id}`}
    >
      <div 
        className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden"
        onClick={handleImageClick}
      >
        <img 
          src={product.image}
          alt={`${product.name} - ${product.type}`}
          className="w-full h-full object-cover"
          data-testid={`product-image-${product.id}`}
        />
        {product.audioUrl && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Headphones className="w-3 h-3" />
            Audio Available
          </div>
        )}
      </div>
      <CardContent className="p-5">
        <h3 className="text-xl font-bold text-foreground mb-2" data-testid={`product-name-${product.id}`}>
          {product.name}
        </h3>
        <p className="text-sm font-semibold text-primary mb-3" data-testid={`product-company-${product.id}`}>
          {product.company}
        </p>
        <p className="text-foreground/80 text-sm leading-relaxed mb-4" data-testid={`product-description-${product.id}`}>
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1" data-testid={`product-type-${product.id}`}>
            <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
            {product.type}
          </span>
          <ChevronRight className="text-primary w-5 h-5" />
        </div>
      </CardContent>
    </Card>
  );
}
