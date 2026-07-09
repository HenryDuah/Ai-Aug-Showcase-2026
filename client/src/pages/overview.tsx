import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, ChevronRight, Search, X } from "lucide-react";
import sectionsData from "@/data/products.json";
import type { Product } from "@shared/schema";
import sandLogo from "@assets/Sand Tech_ Logo_Light_1760649606645.png";

export default function Overview() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: products, isLoading, isError, refetch } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const filteredProducts = products?.filter(product => 
    product.onDisplay && (
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ) || [];

  const showSearchResults = searchQuery.trim().length > 0 && !isLoading && !isError;
  
  return (
    <div className="min-h-[100dvh] bg-background">
      <div className="fade-in">
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-6 py-6 md:py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start justify-between mb-8">
              <Button
                variant="ghost"
                onClick={() => setLocation("/")}
                className="text-primary-foreground hover:text-primary-foreground hover:bg-white/10 p-0 h-auto font-normal text-body"
                data-testid="button-back-welcome"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <img src={sandLogo} alt="Sand Technologies Logo" className="h-8 w-auto" data-testid="sand-logo-overview" />
            </div>
            <h1 className="text-h1" data-testid="title-lab-overview">Showcase Overview</h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-6 border-b border-border bg-card">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                type="text"
                placeholder={isLoading ? "Loading products..." : isError ? "Error loading products" : "Search products..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoading || isError}
                className="pl-10 pr-10 h-12 text-body rounded-md bg-white border-neutral-200"
                data-testid="input-search"
              />
              {searchQuery && !isLoading && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 text-muted-foreground"
                  aria-label="Clear search"
                  data-testid="button-clear-search"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <Button 
              variant="outline"
              onClick={() => setLocation("/feedback")} 
              className="h-12 px-6 rounded-md text-body shadow-1"
              data-testid="button-skip-to-feedback"
            >
              Skip tour - Share your thoughts
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Error State */}
        {isError && (
          <div className="px-6 py-8">
            <div className="max-w-4xl mx-auto">
              <Card className="border-destructive shadow-1 rounded-lg">
                <CardContent className="p-6">
                  <h3 className="text-h3 text-destructive mb-2" data-testid="text-error">
                    Failed to load products
                  </h3>
                  <p className="text-body text-muted-foreground mb-4">
                    Please check your connection and try again.
                  </p>
                  <Button 
                    onClick={() => refetch()} 
                    variant="outline"
                    data-testid="button-retry"
                  >
                    Retry
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Search Results */}
        {showSearchResults && !isError && (
          <div className="px-6 py-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-h2 mb-6 text-foreground" data-testid="title-search-results">
                Search Results ({filteredProducts.length})
              </h2>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProducts.map((product) => (
                    <Card 
                      key={product.id} 
                      className="cursor-pointer hover:shadow-2 transition-shadow shadow-1 rounded-lg"
                      onClick={() => setLocation(`/product/${product.id}`)}
                      data-testid={`card-search-product-${product.id}`}
                    >
                      <CardContent className="p-4 flex gap-4">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-md flex-shrink-0 bg-muted"
                          data-testid={`img-search-product-${product.id}`}
                        />
                        <div className="flex-1">
                          <h3 className="text-h3 mb-1 line-clamp-1" data-testid={`text-search-name-${product.id}`}>
                            {product.name}
                          </h3>
                          <p className="text-body text-muted-foreground line-clamp-1 mb-1">{product.company}</p>
                          <p className="text-small text-muted-foreground">{product.sectionName}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-body text-muted-foreground" data-testid="text-no-results">
                  <p>No products found matching "{searchQuery}"</p>
                  <p>Try adjusting your search terms.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        {!showSearchResults && (
          <div className="px-6 py-8">
            <div className="max-w-4xl mx-auto">
              
              <div className="mb-12">
                <h2 className="text-h2 mb-4 text-foreground" data-testid="title-about-tour">About This Tour</h2>
                <div className="text-body text-foreground space-y-4 max-w-3xl">
                  <p data-testid="description-lab-intro-1">
                    Welcome to Sand's Innovative Healthcare Solutions Showcase, where we explore cutting-edge medical innovations empowering frontline healthcare workers to deliver better patient outcomes.
                  </p>
                  <p data-testid="description-lab-intro-2">
                    This interactive tour will guide you through five specialized sections, each showcasing breakthrough technologies designed to improve healthcare outcomes at the frontlines.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-h2 mb-6 text-foreground" data-testid="title-tour-sections">Tour Sections</h2>
                
                <div className="mb-8" data-testid="floor-plan">
                  <div className="flex items-center gap-1 bg-muted p-1 rounded-full">
                    {sectionsData.sections.map((_, index) => (
                      <div key={index} className="flex-1 h-2 rounded-full relative">
                        {index === 0 && <div className="absolute w-4 h-4 bg-white border-2 border-primary rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-1"></div>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {sectionsData.sections.map((section, index) => (
                    <Card 
                      key={section.id}
                      className="shadow-1 hover:shadow-2 transition-shadow cursor-pointer rounded-lg border-neutral-200"
                      onClick={() => setLocation(`/section/${section.id}`)}
                      data-testid={`section-card-${section.id}`}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-h3 text-foreground font-mono flex-shrink-0">
                          {section.id}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-h3 text-foreground" data-testid={`section-name-${section.id}`}>{section.name}</h3>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button 
                  onClick={() => setLocation("/section/1")} 
                  className="w-full sm:w-auto h-12 px-8 min-w-[200px] text-body rounded-md shadow-1"
                  data-testid="button-start-section-1"
                >
                  Start with section 1: Maternal
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
