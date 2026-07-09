import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Info, MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/product-card";
import sectionsData from "@/data/products.json";
import type { Product } from "@shared/schema";
import sandLogo from "@assets/Sand Tech_ Logo_Light_1760649606645.png";

export default function Section() {
  const params = useParams();
  const [, setLocation] = useLocation();
  
  const sectionId = parseInt(params.sectionId || "1");
  const section = sectionsData.sections.find(s => s.id === sectionId);
  
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/section", sectionId],
  });

  if (!section) {
    setLocation("/overview");
    return null;
  }

  const handleBackToOverview = () => {
    setLocation("/overview");
  };

  const handlePrevious = () => {
    if (sectionId === 1) {
      setLocation("/overview");
    } else {
      setLocation(`/section/${sectionId - 1}`);
    }
  };

  const handleNext = () => {
    if (sectionId === 5) {
      setLocation("/feedback");
    } else {
      setLocation(`/section/${sectionId + 1}`);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background pb-24">
      <div className="fade-in">
        {/* Section Header */}
        <div className="bg-primary text-primary-foreground px-6 py-6 md:py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-start justify-between mb-8">
              <Button
                variant="ghost"
                onClick={handleBackToOverview}
                className="text-primary-foreground hover:text-primary-foreground hover:bg-white/10 p-0 h-auto font-normal text-body"
                data-testid={`button-back-section-${sectionId}`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to overview
              </Button>
              <img src={sandLogo} alt="Sand Technologies Logo" className="h-8 w-auto" data-testid={`sand-logo-section-${sectionId}`} />
            </div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-md flex items-center justify-center text-h2 font-mono" data-testid={`section-number-${sectionId}`}>
                {sectionId}
              </div>
              <h1 className="text-h1" data-testid={`section-title-${sectionId}`}>{section.name}</h1>
            </div>
            
            {/* Progress Indicator */}
            <div className="flex gap-1" data-testid="progress-indicator">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full flex-1 ${
                    index + 1 === sectionId ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="px-6 py-8 max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-body text-muted-foreground">
            <Info className="w-4 h-4" />
            <span>Tap on any product card to view details</span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="shadow-1 rounded-lg">
                  <Skeleton className="aspect-video w-full rounded-t-lg rounded-b-none" />
                  <CardContent className="p-5">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onTap={() => setLocation(`/product/${product.id}`)}
                />
              ))}
            </div>
          ) : (
            <Card className="shadow-1 rounded-lg border-neutral-200">
              <CardContent className="p-6">
                <h3 className="text-h3 text-foreground mb-2" data-testid="coming-soon-title">No products available</h3>
                <p className="text-body text-muted-foreground" data-testid="coming-soon-description">
                  Products for this section have not been added yet.
                </p>
                <Button 
                  onClick={handleNext}
                  className="mt-6 h-10 px-4 text-body"
                >
                  Continue to next section
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Section Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-2 z-10">
          <div className="max-w-6xl mx-auto flex gap-4">
            <Button 
              variant="outline"
              onClick={handlePrevious}
              className="flex-1 h-12 text-body"
              data-testid={`button-previous-${sectionId}`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {sectionId === 1 ? "Overview" : "Previous"}
            </Button>
            <Button 
              onClick={handleNext}
              className="flex-1 h-12 text-body"
              data-testid={`button-next-${sectionId}`}
            >
              {sectionId === 5 ? "Share your thoughts" : "Next section"}
              {sectionId === 5 ? <MessageCircle className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
