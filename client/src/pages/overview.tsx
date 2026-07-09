import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, ChevronRight, Search, X } from "lucide-react";
import sectionsData from "@/data/products.json";
import type { Product } from "@shared/schema";
import sandLogo from "@assets/Sand_Monochrome_Primary_Logo-03_1783596847037.png";

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
        <div className="bg-secondary border-b border-border px-8 py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-start justify-between mb-12">
              <Button
                variant="ghost"
                onClick={() => setLocation("/")}
                className="text-foreground hover:bg-white/5 p-0 h-auto font-normal text-body"
                data-testid="button-back-welcome"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <img src={sandLogo} alt="Sand Technologies Logo" className="h-6 w-auto opacity-90" data-testid="sand-logo-overview" />
            </div>
            <h1 className="text-display" data-testid="title-lab-overview">Showcase Overview</h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-8 py-8 border-b border-border bg-card">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                type="text"
                placeholder={isLoading ? "Loading products..." : isError ? "Error loading products" : "Search products..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoading || isError}
                className="pl-12 pr-12 h-14 text-body rounded-sm bg-background border-border"
                data-testid="input-search"
              />
              {searchQuery && !isLoading && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 text-muted-foreground"
                  aria-label="Clear search"
                  data-testid="button-clear-search"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <Button 
              onClick={() => setLocation("/feedback")} 
              className="h-14 px-8 rounded-sm text-body bg-gravel text-white hover:bg-gravel/80 border border-gravel whitespace-nowrap"
              data-testid="button-skip-to-feedback"
            >
              Skip tour - Share your thoughts
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Error State */}
        {isError && (
          <div className="px-8 py-12">
            <div className="max-w-6xl mx-auto">
              <Card className="border-destructive bg-transparent shadow-none rounded-sm">
                <CardContent className="p-8">
                  <h3 className="text-h3 text-destructive mb-2" data-testid="text-error">
                    Failed to load products
                  </h3>
                  <p className="text-body text-muted-foreground mb-6">
                    Please check your connection and try again.
                  </p>
                  <Button 
                    onClick={() => refetch()} 
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive/10 rounded-sm"
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
          <div className="px-8 py-12">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-h2 mb-8 text-foreground" data-testid="title-search-results">
                Search Results ({filteredProducts.length})
              </h2>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProducts.map((product) => (
                    <Card 
                      key={product.id} 
                      className="cursor-pointer hover:border-primary transition-colors border border-border bg-card rounded-sm shadow-none"
                      onClick={() => setLocation(`/product/${product.id}`)}
                      data-testid={`card-search-product-${product.id}`}
                    >
                      <CardContent className="p-6 flex gap-6">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-sm flex-shrink-0 bg-muted"
                          data-testid={`img-search-product-${product.id}`}
                        />
                        <div className="flex-1">
                          <h3 className="text-h3 mb-2 line-clamp-1" data-testid={`text-search-name-${product.id}`}>
                            {product.name}
                          </h3>
                          <p className="text-body text-muted-foreground line-clamp-1 mb-2">{product.company}</p>
                          <p className="text-small text-muted-foreground font-mono">{product.sectionName}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-body text-muted-foreground p-8 border border-border rounded-sm bg-card" data-testid="text-no-results">
                  <p>No products found matching "{searchQuery}"</p>
                  <p className="mt-2">Try adjusting your search terms.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        {!showSearchResults && (
          <div className="px-8 py-16">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
              
              <div className="lg:col-span-5">
                <h2 className="text-h2 mb-6 text-foreground" data-testid="title-about-tour">About This Tour</h2>
                <div className="text-[17px] leading-[26px] text-muted-foreground space-y-6">
                  <p data-testid="description-lab-intro-1">
                    Welcome to Sand's Innovative Healthcare Solutions Showcase, where we explore cutting-edge medical innovations empowering frontline healthcare workers to deliver better patient outcomes.
                  </p>
                  <p data-testid="description-lab-intro-2">
                    This interactive tour will guide you through five specialized sections, each showcasing breakthrough technologies designed to improve healthcare outcomes at the frontlines.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7">
                <h2 className="text-h2 mb-8 text-foreground" data-testid="title-tour-sections">Tour Sections</h2>
                
                <div className="mb-12" data-testid="floor-plan">
                  <div className="flex items-center gap-2">
                    {sectionsData.sections.map((_, index) => (
                      <div key={index} className="flex-1 h-1 bg-border relative">
                        {index === 0 && <div className="absolute w-3 h-3 bg-primary rounded-full top-1/2 left-0 -translate-y-1/2"></div>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                  {sectionsData.sections.map((section, index) => (
                    <Card 
                      key={section.id}
                      className="group shadow-none hover:border-primary transition-colors cursor-pointer rounded-sm border-border bg-card"
                      onClick={() => setLocation(`/section/${section.id}`)}
                      data-testid={`section-card-${section.id}`}
                    >
                      <CardContent className="p-6 flex items-center gap-6">
                        <div className="text-small text-muted-foreground group-hover:text-squash transition-colors font-mono flex-shrink-0 w-8">
                          0{section.id}
                        </div>
                        <div className="flex-1 border-l border-border pl-6">
                          <h3 className="text-h3 text-foreground" data-testid={`section-name-${section.id}`}>{section.name}</h3>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button 
                  onClick={() => setLocation("/section/1")} 
                  className="w-full sm:w-auto h-14 px-8 min-w-[200px] text-body rounded-sm"
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
