import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Users, MessageSquare, TrendingUp, Download } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import type { Feedback, Product } from "@shared/schema";

export default function Analytics() {
  const { data: feedbackData, isLoading: feedbackLoading } = useQuery<Feedback[]>({
    queryKey: ['/api/feedback'],
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  if (feedbackLoading || productsLoading) {
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

  const totalSubmissions = feedbackData?.length || 0;
  const totalVisitors = feedbackData?.filter(f => f.visitorName)?.length || 0;
  const averageProductsSelected = feedbackData && feedbackData.length > 0
    ? (feedbackData.reduce((acc, f) => acc + (f.interestingProducts?.length || 0), 0) / feedbackData.length).toFixed(1)
    : 0;

  // Calculate popular products
  const productInterestCount = new Map<string, number>();
  feedbackData?.forEach(f => {
    f.interestingProducts?.forEach(productId => {
      productInterestCount.set(productId, (productInterestCount.get(productId) || 0) + 1);
    });
  });

  const popularProducts = Array.from(productInterestCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([productId, count]) => {
      const product = products?.find(p => p.id === productId);
      return { product, count };
    })
    .filter(item => item.product);

  // Get recent feedback
  const recentFeedback = feedbackData
    ?.slice()
    .sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime())
    .slice(0, 5) || [];

  const exportFeedback = () => {
    window.location.href = '/api/feedback/export';
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
          <Button 
            onClick={exportFeedback}
            variant="outline"
            className="gap-2"
            disabled={!feedbackData || feedbackData.length === 0}
            data-testid="button-export"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card data-testid="card-stat-submissions">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-submissions">{totalSubmissions}</div>
              <p className="text-xs text-muted-foreground">Feedback entries collected</p>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-visitors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Identified Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-visitors">{totalVisitors}</div>
              <p className="text-xs text-muted-foreground">Visitors who provided their name</p>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-avgproducts">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Products Selected</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-avg-products">{averageProductsSelected}</div>
              <p className="text-xs text-muted-foreground">Per feedback submission</p>
            </CardContent>
          </Card>
        </div>

        {/* Popular Products */}
        <Card className="mb-8" data-testid="card-popular-products">
          <CardHeader>
            <CardTitle>Most Interesting Products</CardTitle>
            <CardDescription>Top 5 products selected by visitors</CardDescription>
          </CardHeader>
          <CardContent>
            {popularProducts.length > 0 ? (
              <div className="space-y-4">
                {popularProducts.map(({ product, count }, index) => (
                  <div key={product!.id} className="flex items-center gap-4" data-testid={`row-product-${product!.id}`}>
                    <div className="flex-shrink-0 w-8 text-center font-bold text-2xl text-gray-400">
                      {index + 1}
                    </div>
                    <img 
                      src={product!.image} 
                      alt={product!.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      data-testid={`img-product-${product!.id}`}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white" data-testid={`text-product-name-${product!.id}`}>
                        {product!.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{product!.company}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400" data-testid={`text-count-${product!.id}`}>
                        {count}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">selections</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8" data-testid="text-no-data">No product selections yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card data-testid="card-recent-feedback">
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
            <CardDescription>Latest submissions from visitors</CardDescription>
          </CardHeader>
          <CardContent>
            {recentFeedback.length > 0 ? (
              <div className="space-y-4">
                {recentFeedback.map((item) => (
                  <div key={item.id} className="border-b last:border-0 pb-4 last:pb-0" data-testid={`feedback-${item.id}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white" data-testid={`text-visitor-${item.id}`}>
                          {item.visitorName || "Anonymous"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.visitorEmail || "No email provided"}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500" data-testid={`text-date-${item.id}`}>
                        {new Date(item.submittedAt || "").toLocaleDateString()}
                      </p>
                    </div>
                    {item.comments && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2" data-testid={`text-comments-${item.id}`}>
                        "{item.comments}"
                      </p>
                    )}
                    {item.interestingProducts && item.interestingProducts.length > 0 && (
                      <p className="text-xs text-gray-600 dark:text-gray-400" data-testid={`text-products-${item.id}`}>
                        Interested in: {item.interestingProducts.length} product(s)
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8" data-testid="text-no-feedback">No feedback submissions yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
