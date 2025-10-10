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
        description: "Product display status updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update product display status.",
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
        description: "Product deleted successfully.",
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
    products: products?.filter((p) => p.sectionId === section.id && p.onDisplay) || [],
  }));

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="fade-in">
        <div className="bg-gradient-to-r from-chart-4 to-secondary text-white px-6 py-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="text-white p-0 h-auto font-normal"
              data-testid="button-back-home"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tour
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                logoutMutation.mutate();
                setLocation("/login");
              }}
              className="text-white p-0 h-auto font-normal"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold" data-testid="title-admin">Admin Panel</h1>
              <p className="text-white/90">Manage products and settings</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <p className="text-foreground/80 mb-4">
                Manage products, toggle visibility, and access admin tools. Changes are saved automatically.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/admin/products/new">
                  <Button className="gap-2" data-testid="button-new-product">
                    <Plus className="w-4 h-4" />
                    Add New Product
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button variant="outline" className="gap-2" data-testid="button-analytics">
                    <BarChart className="w-4 h-4" />
                    View Analytics
                  </Button>
                </Link>
                <Link href="/qr-codes">
                  <Button variant="outline" className="gap-2" data-testid="button-qr-codes">
                    <QrCode className="w-4 h-4" />
                    QR Codes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {productsBySection.map((section) => (
                <Card key={section.id}>
                  <CardHeader>
                    <h2 className="text-xl font-bold text-foreground" data-testid={`admin-section-${section.id}`}>
                      Section {section.id}: {section.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </CardHeader>
                  <CardContent>
                    {section.products.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No products in this section</p>
                    ) : (
                      <div className="space-y-3">
                        {section.products.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between p-4 bg-accent/50 rounded-lg"
                            data-testid={`admin-product-${product.id}`}
                          >
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground" data-testid={`admin-product-name-${product.id}`}>
                                {product.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {product.company} - {product.type}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-foreground mr-2" data-testid={`admin-status-${product.id}`}>
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
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setLocation(`/admin/products/${product.id}/edit`)}
                                data-testid={`button-edit-${product.id}`}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                                    deleteProduct.mutate(product.id);
                                  }
                                }}
                                disabled={deleteProduct.isPending}
                                data-testid={`button-delete-${product.id}`}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
