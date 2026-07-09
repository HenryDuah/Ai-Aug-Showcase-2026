import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Eye, Video, ExternalLink, MessageSquare, Download, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import type { Feedback, ProductFeedback, Product } from "@shared/schema";

export default function Analytics() {
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: feedbackData, isLoading: feedbackLoading } = useQuery<Feedback[]>({
    queryKey: ['/api/feedback'],
  });

  const { data: productFeedbackData, isLoading: productFeedbackLoading } = useQuery<ProductFeedback[]>({
    queryKey: ['/api/product-feedback'],
  });

  if (productsLoading || feedbackLoading || productFeedbackLoading) {
    return (
      <div className="min-h-[100dvh] bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // Calculate totals
  const totalViews = products?.reduce((sum, p) => sum + (p.viewCount ?? 0), 0) || 0;
  const totalVideoClicks = products?.reduce((sum, p) => sum + (p.videoClickCount ?? 0), 0) || 0;
  const totalWebsiteClicks = products?.reduce((sum, p) => sum + (p.websiteClickCount ?? 0), 0) || 0;
  const totalGeneralFeedback = feedbackData?.length || 0;
  const totalProductFeedback = productFeedbackData?.length || 0;

  // Most viewed products
  const mostViewedProducts = [...(products || [])]
    .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
    .slice(0, 5)
    .filter(p => (p.viewCount ?? 0) > 0);

  // Product feedback counts
  const productFeedbackCounts = new Map<string, number>();
  productFeedbackData?.forEach(f => {
    productFeedbackCounts.set(f.productId, (productFeedbackCounts.get(f.productId) || 0) + 1);
  });

  const mostFeedbackProducts = [...(products || [])]
    .map(p => ({
      product: p,
      count: productFeedbackCounts.get(p.id) || 0
    }))
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const exportGeneralFeedback = () => {
    window.location.href = '/api/feedback/export';
  };

  const exportProductFeedback = () => {
    window.location.href = '/api/product-feedback/export';
  };

  return (
    <div className="min-h-[100dvh] bg-background pb-20">
      <div className="bg-muted px-6 py-6 border-b border-border mb-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="hover:bg-neutral-200" data-testid="button-back">
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </Button>
            </Link>
            <h1 className="text-h1 text-foreground">Analytics</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-h2 text-foreground mb-4">Engagement metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="shadow-1 rounded-lg border-border" data-testid="card-stat-views">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4 text-muted-foreground">
                <span className="text-body font-semibold text-foreground">Product views</span>
                <Eye className="h-4 w-4" />
              </div>
              <div className="text-metric text-foreground" data-testid="text-total-views">{totalViews.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="shadow-1 rounded-lg border-border" data-testid="card-stat-video-clicks">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4 text-muted-foreground">
                <span className="text-body font-semibold text-foreground">Video clicks</span>
                <Video className="h-4 w-4" />
              </div>
              <div className="text-metric text-foreground" data-testid="text-total-video-clicks">{totalVideoClicks.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="shadow-1 rounded-lg border-border" data-testid="card-stat-website-clicks">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4 text-muted-foreground">
                <span className="text-body font-semibold text-foreground">Website clicks</span>
                <ExternalLink className="h-4 w-4" />
              </div>
              <div className="text-metric text-foreground" data-testid="text-total-website-clicks">{totalWebsiteClicks.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-h2 text-foreground mb-4">Feedback summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="shadow-1 rounded-lg border-border" data-testid="card-general-feedback">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4 text-muted-foreground">
                <span className="text-body font-semibold text-foreground">Tour feedback</span>
                <MessageSquare className="h-4 w-4" />
              </div>
              <div className="text-metric text-foreground mb-6" data-testid="text-general-feedback">{totalGeneralFeedback.toLocaleString()}</div>
              <Button 
                onClick={exportGeneralFeedback}
                variant="outline"
                className="w-full h-10 gap-2 text-body"
                disabled={totalGeneralFeedback === 0}
                data-testid="button-export-general-feedback"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-1 rounded-lg border-border" data-testid="card-product-feedback">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4 text-muted-foreground">
                <span className="text-body font-semibold text-foreground">Product feedback</span>
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="text-metric text-foreground mb-6" data-testid="text-product-feedback">{totalProductFeedback.toLocaleString()}</div>
              <Button 
                onClick={exportProductFeedback}
                variant="outline"
                className="w-full h-10 gap-2 text-body"
                disabled={totalProductFeedback === 0}
                data-testid="button-export-product-feedback"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-1 rounded-lg border-border" data-testid="card-most-viewed">
            <CardContent className="p-0">
              <div className="p-6 border-b border-border bg-muted/30">
                <h3 className="text-h3 text-foreground">Top products by view</h3>
              </div>
              {mostViewedProducts.length > 0 ? (
                <div className="divide-y divide-border">
                  {mostViewedProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-4" data-testid={`row-viewed-product-${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                        data-testid={`img-product-${product.id}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-body font-semibold text-foreground truncate" data-testid={`text-product-name-${product.id}`}>
                          {product.name}
                        </p>
                        <p className="text-small text-muted-foreground truncate">{product.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-metric text-foreground" style={{fontSize: '20px', lineHeight: '28px'}} data-testid={`text-views-${product.id}`}>
                          {product.viewCount?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-body text-muted-foreground" data-testid="text-no-views">
                  No views recorded.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-1 rounded-lg border-border" data-testid="card-most-feedback">
            <CardContent className="p-0">
              <div className="p-6 border-b border-border bg-muted/30">
                <h3 className="text-h3 text-foreground">Top products by feedback</h3>
              </div>
              {mostFeedbackProducts.length > 0 ? (
                <div className="divide-y divide-border">
                  {mostFeedbackProducts.map(({ product, count }) => (
                    <div key={product.id} className="flex items-center gap-4 p-4" data-testid={`row-feedback-product-${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                        data-testid={`img-feedback-product-${product.id}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-body font-semibold text-foreground truncate" data-testid={`text-feedback-product-name-${product.id}`}>
                          {product.name}
                        </p>
                        <p className="text-small text-muted-foreground truncate">{product.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-metric text-foreground" style={{fontSize: '20px', lineHeight: '28px'}} data-testid={`text-feedback-count-${product.id}`}>
                          {count.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-body text-muted-foreground" data-testid="text-no-product-feedback">
                  No product feedback recorded.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
