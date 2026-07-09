import { useQuery } from "@tanstack/react-query";
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
      <div className="min-h-[100dvh] bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-12 w-64 mb-12 bg-muted" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Skeleton className="h-40 rounded-sm bg-muted" />
            <Skeleton className="h-40 rounded-sm bg-muted" />
            <Skeleton className="h-40 rounded-sm bg-muted" />
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
    <div className="min-h-[100dvh] bg-background pb-32">
      <div className="bg-secondary px-8 py-8 border-b border-border mb-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="hover:bg-white/5 rounded-sm" data-testid="button-back">
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </Button>
            </Link>
            <h1 className="text-display text-foreground">Analytics</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8">
        <div className="mb-16">
          <h2 className="text-small font-mono text-muted-foreground mb-6">ENGAGEMENT METRICS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-border bg-card p-8 rounded-sm" data-testid="card-stat-views">
              <div className="flex items-center justify-between mb-6 text-muted-foreground">
                <span className="text-small font-mono">PRODUCT VIEWS</span>
                <Eye className="h-5 w-5" />
              </div>
              <div className="text-[48px] leading-[56px] font-mono font-bold text-destructive" data-testid="text-total-views">{totalViews.toLocaleString()}</div>
            </div>

            <div className="border border-border bg-card p-8 rounded-sm" data-testid="card-stat-video-clicks">
              <div className="flex items-center justify-between mb-6 text-muted-foreground">
                <span className="text-small font-mono">VIDEO CLICKS</span>
                <Video className="h-5 w-5" />
              </div>
              <div className="text-[48px] leading-[56px] font-mono font-bold text-warning" data-testid="text-total-video-clicks">{totalVideoClicks.toLocaleString()}</div>
            </div>

            <div className="border border-border bg-card p-8 rounded-sm" data-testid="card-stat-website-clicks">
              <div className="flex items-center justify-between mb-6 text-muted-foreground">
                <span className="text-small font-mono">WEBSITE CLICKS</span>
                <ExternalLink className="h-5 w-5" />
              </div>
              <div className="text-[48px] leading-[56px] font-mono font-bold text-foreground" data-testid="text-total-website-clicks">{totalWebsiteClicks.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-small font-mono text-muted-foreground mb-6">FEEDBACK SUMMARY</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-border bg-card p-8 rounded-sm" data-testid="card-general-feedback">
              <div className="flex items-center justify-between mb-6 text-muted-foreground">
                <span className="text-small font-mono">TOUR FEEDBACK</span>
                <MessageSquare className="h-5 w-5" />
              </div>
              <div className="text-[48px] leading-[56px] font-mono font-bold text-foreground mb-8" data-testid="text-general-feedback">{totalGeneralFeedback.toLocaleString()}</div>
              <Button 
                onClick={exportGeneralFeedback}
                variant="outline"
                className="w-full h-12 gap-3 text-body rounded-sm border-border hover:bg-white/5"
                disabled={totalGeneralFeedback === 0}
                data-testid="button-export-general-feedback"
              >
                <Download className="h-4 w-4 text-muted-foreground" />
                Export CSV
              </Button>
            </div>

            <div className="border border-border bg-card p-8 rounded-sm" data-testid="card-product-feedback">
              <div className="flex items-center justify-between mb-6 text-muted-foreground">
                <span className="text-small font-mono">PRODUCT FEEDBACK</span>
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="text-[48px] leading-[56px] font-mono font-bold text-foreground mb-8" data-testid="text-product-feedback">{totalProductFeedback.toLocaleString()}</div>
              <Button 
                onClick={exportProductFeedback}
                variant="outline"
                className="w-full h-12 gap-3 text-body rounded-sm border-border hover:bg-white/5"
                disabled={totalProductFeedback === 0}
                data-testid="button-export-product-feedback"
              >
                <Download className="h-4 w-4 text-muted-foreground" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="border border-border bg-card rounded-sm" data-testid="card-most-viewed">
            <div className="p-6 border-b border-border bg-background">
              <h3 className="text-small font-mono text-muted-foreground">TOP PRODUCTS BY VIEW</h3>
            </div>
            {mostViewedProducts.length > 0 ? (
              <div className="divide-y divide-border">
                {mostViewedProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-6 p-6" data-testid={`row-viewed-product-${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-sm object-cover flex-shrink-0 bg-muted"
                      data-testid={`img-product-${product.id}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-h3 text-foreground truncate mb-1" data-testid={`text-product-name-${product.id}`}>
                        {product.name}
                      </p>
                      <p className="text-body text-muted-foreground truncate">{product.company}</p>
                    </div>
                    <div className="text-right pl-4">
                      <p className="text-metric text-destructive" data-testid={`text-views-${product.id}`}>
                        {product.viewCount?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-body text-muted-foreground" data-testid="text-no-views">
                No views recorded.
              </div>
            )}
          </div>

          <div className="border border-border bg-card rounded-sm" data-testid="card-most-feedback">
            <div className="p-6 border-b border-border bg-background">
              <h3 className="text-small font-mono text-muted-foreground">TOP PRODUCTS BY FEEDBACK</h3>
            </div>
            {mostFeedbackProducts.length > 0 ? (
              <div className="divide-y divide-border">
                {mostFeedbackProducts.map(({ product, count }) => (
                  <div key={product.id} className="flex items-center gap-6 p-6" data-testid={`row-feedback-product-${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-sm object-cover flex-shrink-0 bg-muted"
                      data-testid={`img-feedback-product-${product.id}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-h3 text-foreground truncate mb-1" data-testid={`text-feedback-product-name-${product.id}`}>
                        {product.name}
                      </p>
                      <p className="text-body text-muted-foreground truncate">{product.company}</p>
                    </div>
                    <div className="text-right pl-4">
                      <p className="text-metric text-warning" data-testid={`text-feedback-count-${product.id}`}>
                        {count.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-body text-muted-foreground" data-testid="text-no-product-feedback">
                No product feedback recorded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
