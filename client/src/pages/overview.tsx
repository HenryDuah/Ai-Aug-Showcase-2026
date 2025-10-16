import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, ChevronRight, Search, X } from "lucide-react";
import sectionsData from "@/data/products.json";
import type { Product } from "@shared/schema";
import sandLogo from "@assets/Sand Tech_ Logo_Dark (1)_1760379109163.png";

const sectionColors = [
  "bg-primary text-primary-foreground",
  "bg-chart-2 text-white",
  "bg-chart-1 text-white", 
  "bg-chart-4 text-white",
  "bg-secondary text-secondary-foreground"
];

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
    <div className="min-h-screen bg-background">
      <div className="fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-8">
          <div className="flex items-start justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="text-white p-0 h-auto font-normal"
              data-testid="button-back-welcome"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <img src={sandLogo} alt="Sand Technologies Logo" className="h-12 w-auto" data-testid="sand-logo-overview" />
          </div>
          <h1 className="text-3xl font-bold mb-2" data-testid="title-lab-overview">Showcase Overview</h1>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-6 bg-card">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                type="text"
                placeholder={isLoading ? "Loading products..." : isError ? "Error loading products" : "Search products by name, company, type, or description..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoading || isError}
                className="pl-10 pr-10 py-6 text-base"
                data-testid="input-search"
              />
              {searchQuery && !isLoading && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  data-testid="button-clear-search"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Error State */}
        {isError && (
          <div className="px-6 py-6">
            <div className="max-w-4xl mx-auto">
              <Card className="border-destructive">
                <CardContent className="pt-6 text-center">
                  <p className="text-destructive font-semibold mb-3" data-testid="text-error">
                    Failed to load products for search
                  </p>
                  <p className="text-muted-foreground text-sm mb-4">
                    Unable to fetch product data. You can still browse sections below.
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
          <div className="px-6 py-6">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-bold mb-4 text-foreground" data-testid="title-search-results">
                Search Results ({filteredProducts.length})
              </h3>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProducts.map((product) => (
                    <Card 
                      key={product.id} 
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setLocation(`/product/${product.id}`)}
                      data-testid={`card-search-product-${product.id}`}
                    >
                      <CardContent className="p-4 flex gap-4">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                          data-testid={`img-search-product-${product.id}`}
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-foreground mb-1" data-testid={`text-search-name-${product.id}`}>
                            {product.name}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">{product.company}</p>
                          <p className="text-xs text-muted-foreground">{product.sectionName}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground" data-testid="text-no-results">
                    No products found matching "{searchQuery}"
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Lab Introduction */}
        {!showSearchResults && (
          <div className="px-6 py-6 bg-card">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4 text-foreground" data-testid="title-about-tour">About This Tour</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4" data-testid="description-lab-intro-1">
                    Welcome to Sand's <span className="font-bold">Innovative Healthcare Solutions Showcase</span>, where we explore cutting-edge medical innovations empowering frontline healthcare workers to deliver better patient outcomes.
                  </p>
                  <p className="text-foreground/80 leading-relaxed mb-4" data-testid="description-lab-intro-2">
                    This interactive tour will guide you through five specialized sections, each showcasing breakthrough technologies designed to improve healthcare outcomes at the frontlines.
                  </p>
                  <p className="text-foreground/80 leading-relaxed" data-testid="description-lab-intro-3">
                    Take your time exploring each section, view product details, and watch product demo videos to learn more about these transformative medical solutions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Floor Plan Visualization */}
        {!showSearchResults && (
          <div className="px-6 py-6">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-bold mb-6 text-foreground" data-testid="title-tour-sections">Tour Sections</h3>
              
              <Card className="mb-6">
              <CardContent className="pt-6">
                {/* Visual Floor Plan */}
                <div className="flex items-center gap-2 mb-6" data-testid="floor-plan">
                  {sectionsData.sections.map((_, index) => (
                    <div key={index} className="flex-1 relative">
                      <div className={`floor-plan-section ${index === 0 ? 'active' : ''}`}>
                        {index === 0 && <div className="floor-plan-dot"></div>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Section Cards */}
                <div className="space-y-3">
                  {sectionsData.sections.map((section, index) => (
                    <div 
                      key={section.id}
                      onClick={() => setLocation(`/section/${section.id}`)}
                      className={`flex items-center gap-4 p-4 rounded-lg border-l-4 cursor-pointer transition-all hover:shadow-md ${
                        index === 0 
                          ? 'bg-primary/5 border-primary hover:bg-primary/10' 
                          : 'bg-muted border-muted hover:bg-muted/80'
                      }`}
                      data-testid={`section-card-${section.id}`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 ${sectionColors[index]}`}>
                        {section.id}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground" data-testid={`section-name-${section.id}`}>{section.name}</h4>
                      </div>
                      <ChevronRight className={`w-5 h-5 ${index === 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => setLocation("/section/1")} 
                  className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-lg text-lg font-semibold shadow-md hover:shadow-lg transition-all"
                  data-testid="button-start-section-1"
                >
                  Start with Section 1: Maternal
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  onClick={() => setLocation("/feedback")} 
                  variant="outline"
                  className="w-full px-6 py-4 rounded-lg text-lg font-semibold shadow-md hover:shadow-lg transition-all"
                  data-testid="button-skip-to-feedback"
                >
                  Skip Tour - Share Your Thoughts
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
