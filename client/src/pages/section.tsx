import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, InfoIcon, List, MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/product-card";
import sectionsData from "@/data/products.json";
import type { Product } from "@shared/schema";

const sectionGradients = [
  "from-primary to-chart-3",
  "from-chart-2 to-chart-1", 
  "from-chart-1 to-chart-2",
  "from-chart-4 to-chart-3",
  "from-secondary to-chart-4"
];

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

  const progressDots = Array.from({ length: 5 }, (_, index) => (
    <div
      key={index}
      className={`h-1 rounded-full flex-1 ${
        index + 1 === sectionId ? 'bg-white' : 'bg-white/30'
      }`}
    />
  ));

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="fade-in">
        {/* Section Header */}
        <div className={`bg-gradient-to-r ${sectionGradients[sectionId - 1]} text-white px-6 py-8`}>
          <Button
            variant="ghost"
            onClick={handleBackToOverview}
            className="text-white mb-4 p-0 h-auto font-normal"
            data-testid={`button-back-section-${sectionId}`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Overview
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-2xl" data-testid={`section-number-${sectionId}`}>
              {sectionId}
            </div>
            <h1 className="text-3xl font-bold" data-testid={`section-title-${sectionId}`}>{section.name}</h1>
          </div>
          <p className="text-white/90" data-testid={`section-description-${sectionId}`}>{section.description}</p>
          
          {/* Progress Indicator */}
          <div className="mt-4 flex gap-2" data-testid="progress-indicator">
            {progressDots}
          </div>
        </div>

        {/* Products Grid */}
        <div className="px-6 py-6 space-y-6">
          <p className="text-sm text-muted-foreground flex items-center gap-2" data-testid="tap-instruction">
            <InfoIcon className="w-4 h-4" />
            Tap on any product card to view details
          </p>

          {isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <CardContent className="p-5">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="space-y-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onTap={() => setLocation(`/product/${product.id}`)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <InfoIcon className="text-primary text-2xl mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-foreground mb-2" data-testid="coming-soon-title">Coming Soon</h4>
                    <p className="text-sm text-foreground/80" data-testid="coming-soon-description">
                      More innovative products will be added to this section. 
                      Check back regularly for updates on the latest technologies.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Section Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-border p-4 shadow-lg">
          <div className="flex gap-3">
            <Button 
              variant="secondary"
              onClick={handlePrevious}
              className="flex-1"
              data-testid={`button-previous-${sectionId}`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {sectionId === 1 ? "Overview" : "Previous"}
            </Button>
            <Button 
              onClick={handleNext}
              className="flex-1"
              data-testid={`button-next-${sectionId}`}
            >
              {sectionId === 5 ? "Give Feedback" : "Next Section"}
              {sectionId === 5 ? <MessageCircle className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
