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
    onTap();
  };

  return (
    <Card 
      className="product-card overflow-hidden cursor-pointer hover:shadow-2 transition-all h-full flex flex-col shadow-1 border-border"
      onClick={onTap}
      data-testid={`product-card-${product.id}`}
    >
      <div 
        className="aspect-video bg-muted relative overflow-hidden"
        onClick={handleImageClick}
      >
        <img 
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          data-testid={`product-image-${product.id}`}
        />
        {product.videoUrl && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded text-small font-semibold flex items-center gap-1 shadow-1">
            <Video className="w-3 h-3" />
            Video
          </div>
        )}
      </div>
      <CardContent className="p-4 md:p-5 flex-1 flex flex-col bg-card">
        <h3 className="text-h3 text-foreground mb-1 line-clamp-2" data-testid={`product-name-${product.id}`}>
          {product.name}
        </h3>
        <p className="text-body font-semibold text-primary mb-2 md:mb-3" data-testid={`product-company-${product.id}`}>
          {product.company}
        </p>
        <p className="text-body text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1" data-testid={`product-description-${product.id}`}>
          {product.description}
        </p>
        <div className="flex items-center justify-end mt-auto">
          <ChevronRight className="text-primary w-5 h-5 flex-shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}
