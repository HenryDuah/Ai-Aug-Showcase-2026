import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Video } from "lucide-react";
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
      className="product-card overflow-hidden cursor-pointer hover:shadow-lg transition-all h-full flex flex-col"
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
        {product.videoUrl && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Video className="w-3 h-3" />
            Video
          </div>
        )}
      </div>
      <CardContent className="p-4 md:p-5 flex-1 flex flex-col">
        <h3 className="text-lg md:text-xl font-bold text-foreground mb-1 md:mb-2 line-clamp-2" data-testid={`product-name-${product.id}`}>
          {product.name} - {product.type}
        </h3>
        <p className="text-xs md:text-sm font-semibold text-primary mb-2 md:mb-3" data-testid={`product-company-${product.id}`}>
          {product.company}
        </p>
        <p className="text-foreground/80 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 line-clamp-3 flex-1" data-testid={`product-description-${product.id}`}>
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs text-muted-foreground flex items-center gap-1 line-clamp-1" data-testid={`product-type-${product.id}`}>
            <span className="w-1 h-1 bg-muted-foreground rounded-full flex-shrink-0"></span>
            {product.type}
          </span>
          <ChevronRight className="text-primary w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}
