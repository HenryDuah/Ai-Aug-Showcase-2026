import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Info, MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/product-card";
import sectionsData from "@/data/products.json";
import type { Product } from "@shared/schema";
import sandLogo from "@assets/Sand_Monochrome_Primary_Logo-03_1783596847037.png";

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
    <div className="min-h-[100dvh] bg-background pb-32">
      <div className="fade-in">
        {/* Section Header */}
        <div className="bg-gravel border-b border-border px-8 py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-start justify-between mb-16">
              <Button
                variant="ghost"
                onClick={handleBackToOverview}
                className="text-foreground hover:bg-white/5 p-0 h-auto font-normal text-body"
                data-testid={`button-back-section-${sectionId}`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to overview
              </Button>
              <img src={sandLogo} alt="Sand Technologies Logo" className="h-6 w-auto opacity-90" data-testid={`sand-logo-section-${sectionId}`} />
            </div>
            
            <div className="flex items-end gap-6 mb-12 border-l-2 border-primary pl-6">
              <div className="text-small font-mono text-squash pb-2" data-testid={`section-number-${sectionId}`}>
                SEC 0{sectionId}
              </div>
              <h1 className="text-display" data-testid={`section-title-${sectionId}`}>{section.name}</h1>
            </div>
            
            {/* Progress Indicator */}
            <div className="flex gap-2 max-w-md" data-testid="progress-indicator">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 ${
                    index + 1 === sectionId ? 'bg-primary' : 'bg-border'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="px-8 py-16 max-w-6xl mx-auto space-y-10">
          <div className="flex items-center gap-3 text-small text-coral font-mono">
            <Info className="w-4 h-4" />
            <span>Tap on any product card to view details</span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="bg-card border-border rounded-sm">
                  <Skeleton className="aspect-video w-full rounded-t-sm rounded-b-none bg-muted" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-4 bg-muted" />
                    <Skeleton className="h-4 w-1/2 mb-6 bg-muted" />
                    <Skeleton className="h-4 w-full mb-2 bg-muted" />
                    <Skeleton className="h-4 w-full mb-2 bg-muted" />
                    <Skeleton className="h-4 w-3/4 bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onTap={() => setLocation(`/product/${product.id}`)}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-card shadow-none rounded-sm border-border">
              <CardContent className="p-12 text-center">
                <h3 className="text-h3 text-foreground mb-4" data-testid="coming-soon-title">No products available</h3>
                <p className="text-body text-muted-foreground mb-8" data-testid="coming-soon-description">
                  Products for this section have not been added yet.
                </p>
                <Button 
                  onClick={handleNext}
                  className="h-12 px-8 text-body rounded-sm"
                >
                  Continue to next section
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Section Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-6 z-10">
          <div className="max-w-6xl mx-auto flex gap-6">
            <Button 
              variant="outline"
              onClick={handlePrevious}
              className="flex-1 h-14 text-body rounded-sm border-border hover:bg-white/5"
              data-testid={`button-previous-${sectionId}`}
            >
              <ArrowLeft className="w-5 h-5 mr-3" />
              {sectionId === 1 ? "Overview" : "Previous"}
            </Button>
            <Button 
              onClick={handleNext}
              className="flex-1 h-14 text-body rounded-sm"
              data-testid={`button-next-${sectionId}`}
            >
              {sectionId === 5 ? "Share your thoughts" : "Next section"}
              {sectionId === 5 ? <MessageCircle className="w-5 h-5 ml-3" /> : <ArrowRight className="w-5 h-5 ml-3" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
