import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      className="product-card overflow-hidden cursor-pointer hover:shadow-lg transition-all h-full flex flex-col rounded-2xl border"
      onClick={onTap}
      data-testid={`product-card-${product.id}`}
    >
      <div 
        className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden"
        onClick={handleImageClick}
      >
        <img 
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          data-testid={`product-image-${product.id}`}
        />
        {product.videoUrl && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Video className="w-3 h-3" />
            Video
          </div>
        )}
      </div>
      <CardContent className="p-4 md:p-5 flex-1 flex flex-col gap-2">
        <h3 className="text-lg md:text-xl font-bold text-foreground line-clamp-2" data-testid={`product-name-${product.id}`}>
          {product.name}
        </h3>
        
        <p className="text-xs md:text-sm font-semibold text-primary" data-testid={`product-company-${product.id}`}>
          {product.company}
        </p>
        
        <p className="text-foreground/80 text-xs md:text-sm leading-relaxed line-clamp-2 flex-shrink-0" data-testid={`product-description-${product.id}`}>
          {product.description}
        </p>
        
        {product.useCase && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground" data-testid={`product-usecase-${product.id}`}>
            <span className="font-medium">Use Case:</span>
            <span>{product.useCase}</span>
          </div>
        )}
        
        {product.healthcareTags && product.healthcareTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1" data-testid={`product-tags-${product.id}`}>
            {product.healthcareTags.slice(0, 3).map((tag: string) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-[10px] px-2 py-0.5 rounded-full"
              >
                {tag}
              </Badge>
            ))}
            {product.healthcareTags.length > 3 && (
              <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full">
                +{product.healthcareTags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-end mt-auto pt-2">
          <ChevronRight className="text-primary w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}
