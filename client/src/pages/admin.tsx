import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Settings, BarChart, QrCode, LogOut, Plus, Pencil, Trash2 } from "lucide-react";
import { useLocation, Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import type { Product } from "@shared/schema";
import sectionsData from "@/data/products.json";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { logoutMutation } = useAuth();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const toggleDisplay = useMutation({
    mutationFn: async ({ id, onDisplay }: { id: string; onDisplay: boolean }) => {
      const response = await apiRequest("PATCH", `/api/products/${id}/display`, { onDisplay });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Updated",
        description: "Display status updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update display status.",
        variant: "destructive",
      });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/products/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Deleted",
        description: "Product removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    },
  });

  const productsBySection = sectionsData.sections.map((section) => ({
    ...section,
    products: products?.filter((p) => p.sectionId === section.id) || [],
  }));

  return (
    <div className="min-h-[100dvh] bg-background pb-20">
      <div className="fade-in">
        <div className="bg-muted px-6 py-6 border-b border-border">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                onClick={() => setLocation("/")}
                className="text-muted-foreground hover:text-foreground p-0 h-auto font-normal text-body"
                data-testid="button-back-home"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to tour
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  logoutMutation.mutate();
                  setLocation("/login");
                }}
                className="text-muted-foreground hover:text-foreground p-0 h-auto font-normal text-body"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Settings className="w-8 h-8 text-foreground" />
              <div>
                <h1 className="text-h1 text-foreground" data-testid="title-admin">Admin panel</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 max-w-6xl mx-auto">
          <Card className="mb-8 shadow-1 rounded-lg border-border">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <p className="text-body text-muted-foreground">
                  Manage products, view analytics, and download resources.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/admin/products/new">
                    <Button className="h-10 text-body shadow-1" data-testid="button-new-product">
                      <Plus className="w-4 h-4 mr-2" />
                      Add product
                    </Button>
                  </Link>
                  <Link href="/analytics">
                    <Button variant="outline" className="h-10 text-body" data-testid="button-analytics">
                      <BarChart className="w-4 h-4 mr-2" />
                      Analytics
                    </Button>
                  </Link>
                  <Link href="/qr-codes">
                    <Button variant="outline" className="h-10 text-body" data-testid="button-qr-codes">
                      <QrCode className="w-4 h-4 mr-2" />
                      QR codes
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-body text-muted-foreground">Loading products...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {productsBySection.map((section) => (
                <div key={section.id}>
                  <h2 className="text-h2 mb-4 text-foreground" data-testid={`admin-section-${section.id}`}>
                    Section {section.id}: {section.name}
                  </h2>
                  <Card className="shadow-1 rounded-lg border-border">
                    <CardContent className="p-0">
                      {section.products.length === 0 ? (
                        <div className="p-6 text-body text-muted-foreground text-center">
                          No products configured for this section.
                        </div>
                      ) : (
                        <div className="divide-y divide-border">
                          {section.products.map((product) => (
                            <div
                              key={product.id}
                              className={`flex items-center justify-between p-4 ${
                                product.onDisplay ? "bg-card" : "bg-muted"
                              }`}
                              data-testid={`admin-product-${product.id}`}
                            >
                              <div className="flex-1 pr-4">
                                <h3 className="text-body font-semibold text-foreground flex items-center gap-2" data-testid={`admin-product-name-${product.id}`}>
                                  {product.name}
                                  {!product.onDisplay && (
                                    <span className="text-small bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded-sm font-normal">
                                      Hidden
                                    </span>
                                  )}
                                </h3>
                                <p className="text-small text-muted-foreground">
                                  {product.company} &middot; {product.type}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 md:gap-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-small text-muted-foreground" data-testid={`admin-status-${product.id}`}>
                                    {product.onDisplay ? "Visible" : "Hidden"}
                                  </span>
                                  <Switch
                                    checked={product.onDisplay || false}
                                    onCheckedChange={(checked) =>
                                      toggleDisplay.mutate({ id: product.id, onDisplay: checked })
                                    }
                                    disabled={toggleDisplay.isPending}
                                    data-testid={`admin-toggle-${product.id}`}
                                  />
                                </div>
                                <div className="flex items-center">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setLocation(`/admin/products/${product.id}/edit`)}
                                    aria-label="Edit product"
                                    data-testid={`button-edit-${product.id}`}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => {
                                      if (confirm(`Delete "${product.name}" permanently?`)) {
                                        deleteProduct.mutate(product.id);
                                      }
                                    }}
                                    disabled={deleteProduct.isPending}
                                    aria-label="Delete product"
                                    data-testid={`button-delete-${product.id}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
