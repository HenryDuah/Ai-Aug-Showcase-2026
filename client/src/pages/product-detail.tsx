import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ArrowLeft, ArrowRight, Tag, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ImageOverlay from "@/components/image-overlay";
import { useState } from "react";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [showImageOverlay, setShowImageOverlay] = useState(false);
  
  const productId = params.productId;
  
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", productId],
  });

  const handleClose = () => {
    if (product) {
      setLocation(`/section/${product.sectionId}`);
    } else {
      setLocation("/overview");
    }
  };

  const handlePreviousSection = () => {
    if (product && product.sectionId > 1) {
      setLocation(`/section/${product.sectionId - 1}`);
    } else {
      setLocation("/overview");
    }
  };

  const handleNextSection = () => {
    if (product && product.sectionId < 5) {
      setLocation(`/section/${product.sectionId + 1}`);
    } else {
      setLocation("/feedback");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-6">
          <Skeleton className="h-6 w-16 mb-4 bg-white/20" />
          <Skeleton className="h-8 w-3/4 mb-2 bg-white/20" />
          <Skeleton className="h-5 w-1/2 bg-white/20" />
        </div>
        <div className="px-6 py-6 space-y-6">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold text-foreground mb-2" data-testid="product-not-found">Product Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested product could not be found.</p>
            <Button onClick={() => setLocation("/overview")} data-testid="button-back-overview">
              Back to Overview
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="fade-in">
        <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-6">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="text-white mb-4 p-0 h-auto font-normal"
            data-testid="button-close-product"
          >
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
          <h1 className="text-3xl font-bold mb-2" data-testid="product-name">{product.name}</h1>
          <p className="text-white/90 text-lg" data-testid="product-company">{product.company}</p>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Product Image */}
          <div 
            className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl overflow-hidden cursor-pointer"
            onClick={() => setShowImageOverlay(true)}
            data-testid="product-image-container"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              data-testid="product-image"
            />
          </div>

          {/* Product Type */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Tag className="text-primary text-xl flex-shrink-0" size={20} />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Product Type</p>
                  <p className="font-semibold text-foreground" data-testid="product-type">{product.type}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardContent className="pt-5">
              <h3 className="text-lg font-bold text-foreground mb-3">Description</h3>
              <p className="text-foreground/80 leading-relaxed" data-testid="product-description">
                {product.description}
              </p>
            </CardContent>
          </Card>

          {/* Product Video */}
          {product.videoUrl && (
            <Card>
              <CardContent className="pt-5">
                <h3 className="text-lg font-bold text-foreground mb-3">Product Video</h3>
                {product.videoUrl.includes('youtube.com') || product.videoUrl.includes('youtu.be') ? (
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={product.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                      title="Product video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      data-testid="product-video-youtube"
                    />
                  </div>
                ) : product.videoUrl.includes('vimeo.com') ? (
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={product.videoUrl.replace('vimeo.com/', 'player.vimeo.com/video/')}
                      title="Product video"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      data-testid="product-video-vimeo"
                    />
                  </div>
                ) : (
                  <div className="aspect-video">
                    <video
                      controls
                      preload="metadata"
                      className="w-full h-full rounded-lg object-contain bg-black"
                      data-testid="product-video"
                    >
                      <source src={product.videoUrl} type="video/mp4" />
                      <source src={product.videoUrl} type="video/webm" />
                      <source src={product.videoUrl} type="video/ogg" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* The Impact */}
          {product.theImpact && (
            <Card>
              <CardContent className="pt-5">
                <h3 className="text-lg font-bold text-foreground mb-3">The Impact</h3>
                <p className="text-foreground/80 leading-relaxed" data-testid="product-impact">
                  {product.theImpact}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Key Features */}
          {product.features && product.features.length > 0 && (
            <Card>
              <CardContent className="pt-5">
                <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle className="text-primary" size={20} />
                  Key Features
                </h3>
                <ul className="space-y-2" data-testid="product-features">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="text-primary mt-1 flex-shrink-0" size={16} />
                      <span className="text-foreground/80" data-testid={`feature-${index}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-border p-4 shadow-lg">
          <div className="flex gap-3">
            <Button 
              variant="secondary"
              onClick={handlePreviousSection}
              className="flex-1"
              data-testid="button-previous-section"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous Section
            </Button>
            <Button 
              onClick={handleNextSection}
              className="flex-1"
              data-testid="button-next-section"
            >
              Next Section
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Image Overlay */}
        <ImageOverlay
          isOpen={showImageOverlay}
          imageUrl={product.image}
          altText={product.name}
          onClose={() => setShowImageOverlay(false)}
        />
      </div>
    </div>
  );
}
