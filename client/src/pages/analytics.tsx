import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          </div>
        </div>

        {/* Engagement Stats */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Engagement Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card data-testid="card-stat-views">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Product Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-views">{totalViews}</div>
              <p className="text-xs text-muted-foreground">Times products were viewed</p>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-video-clicks">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Video Clicks</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-video-clicks">{totalVideoClicks}</div>
              <p className="text-xs text-muted-foreground">Times videos were played</p>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-website-clicks">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Website Clicks</CardTitle>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-website-clicks">{totalWebsiteClicks}</div>
              <p className="text-xs text-muted-foreground">Times websites were visited</p>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Stats */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Feedback Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card data-testid="card-general-feedback">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">General Feedback</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2" data-testid="text-general-feedback">{totalGeneralFeedback}</div>
              <p className="text-xs text-muted-foreground mb-4">Tour feedback submissions</p>
              <Button 
                onClick={exportGeneralFeedback}
                variant="outline"
                size="sm"
                className="w-full gap-2"
                disabled={totalGeneralFeedback === 0}
                data-testid="button-export-general-feedback"
              >
                <Download className="h-4 w-4" />
                Download General Feedback CSV
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-product-feedback">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Product-Specific Feedback</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2" data-testid="text-product-feedback">{totalProductFeedback}</div>
              <p className="text-xs text-muted-foreground mb-4">Product feedback submissions</p>
              <Button 
                onClick={exportProductFeedback}
                variant="outline"
                size="sm"
                className="w-full gap-2"
                disabled={totalProductFeedback === 0}
                data-testid="button-export-product-feedback"
              >
                <Download className="h-4 w-4" />
                Download Product Feedback CSV
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Most Viewed Products */}
        <Card className="mb-8" data-testid="card-most-viewed">
          <CardHeader>
            <CardTitle>Most Viewed Products</CardTitle>
            <CardDescription>Products with the most page views</CardDescription>
          </CardHeader>
          <CardContent>
            {mostViewedProducts.length > 0 ? (
              <div className="space-y-4">
                {mostViewedProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4" data-testid={`row-viewed-product-${product.id}`}>
                    <div className="flex-shrink-0 w-8 text-center font-bold text-2xl text-gray-400">
                      {index + 1}
                    </div>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      data-testid={`img-product-${product.id}`}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white" data-testid={`text-product-name-${product.id}`}>
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{product.company}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400" data-testid={`text-views-${product.id}`}>
                        {product.viewCount}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">views</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8" data-testid="text-no-views">No product views yet</p>
            )}
          </CardContent>
        </Card>

        {/* Products with Most Feedback */}
        <Card data-testid="card-most-feedback">
          <CardHeader>
            <CardTitle>Products with Most Feedback</CardTitle>
            <CardDescription>Products receiving the most visitor feedback</CardDescription>
          </CardHeader>
          <CardContent>
            {mostFeedbackProducts.length > 0 ? (
              <div className="space-y-4">
                {mostFeedbackProducts.map(({ product, count }, index) => (
                  <div key={product.id} className="flex items-center gap-4" data-testid={`row-feedback-product-${product.id}`}>
                    <div className="flex-shrink-0 w-8 text-center font-bold text-2xl text-gray-400">
                      {index + 1}
                    </div>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      data-testid={`img-feedback-product-${product.id}`}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white" data-testid={`text-feedback-product-name-${product.id}`}>
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{product.company}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400" data-testid={`text-feedback-count-${product.id}`}>
                        {count}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">feedback</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8" data-testid="text-no-product-feedback">No product feedback yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
