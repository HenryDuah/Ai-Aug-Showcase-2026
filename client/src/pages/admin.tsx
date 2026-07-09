import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Settings, BarChart, QrCode, LogOut, Plus, Pencil, Trash2 } from "lucide-react";
import { useLocation, Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import type { Product } from "@shared/schema";
import sectionsData from "@/data/products.json";
import sandLogo from "@assets/Sand_Monochrome_Primary_Logo-03_1783596847037.png";

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
    <div className="min-h-[100dvh] bg-background pb-32">
      <div className="fade-in">
        <div className="bg-secondary px-8 py-8 border-b border-border">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <Button
                variant="ghost"
                onClick={() => setLocation("/")}
                className="text-foreground hover:bg-white/5 p-0 h-auto font-normal text-body"
                data-testid="button-back-home"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to tour
              </Button>
              <div className="flex items-center gap-6">
                <img src={sandLogo} alt="Sand Tech Logo" className="h-6 w-auto opacity-90 hidden sm:block" />
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
            </div>
            <div className="flex items-center gap-6">
              <Settings className="w-10 h-10 text-muted-foreground" />
              <h1 className="text-display text-foreground" data-testid="title-admin">Admin panel</h1>
            </div>
          </div>
        </div>

        <div className="px-8 py-12 max-w-6xl mx-auto">
          <div className="mb-16 border border-border bg-card p-8 rounded-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <p className="text-body text-muted-foreground max-w-xl">
              Manage products across tour sections, view visitor analytics, and generate QR codes for physical lab displays.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/admin/products/new">
                <Button className="h-12 px-6 text-body rounded-sm" data-testid="button-new-product">
                  <Plus className="w-4 h-4 mr-2" />
                  Add product
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="outline" className="h-12 px-6 text-body rounded-sm border-border hover:bg-white/5" data-testid="button-analytics">
                  <BarChart className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </Link>
              <Link href="/qr-codes">
                <Button variant="outline" className="h-12 px-6 text-body rounded-sm border-border hover:bg-white/5" data-testid="button-qr-codes">
                  <QrCode className="w-4 h-4 mr-2" />
                  QR codes
                </Button>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="py-24 border border-border border-dashed rounded-sm flex justify-center">
              <p className="text-small font-mono text-muted-foreground">LOADING PRODUCTS...</p>
            </div>
          ) : (
            <div className="space-y-16">
              {productsBySection.map((section) => (
                <div key={section.id}>
                  <div className="border-b border-border pb-4 mb-6 flex items-center gap-4">
                    <span className="text-small font-mono text-muted-foreground">SEC 0{section.id}</span>
                    <h2 className="text-h2 text-foreground" data-testid={`admin-section-${section.id}`}>
                      {section.name}
                    </h2>
                  </div>
                  
                  {section.products.length === 0 ? (
                    <div className="p-8 border border-border border-dashed rounded-sm text-body text-muted-foreground text-center bg-card/50">
                      No products configured for this section.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {section.products.map((product) => (
                        <div
                          key={product.id}
                          className={`flex items-center justify-between p-6 border border-border rounded-sm transition-colors ${
                            product.onDisplay ? "bg-card hover:border-primary/50" : "bg-background opacity-75"
                          }`}
                          data-testid={`admin-product-${product.id}`}
                        >
                          <div className="flex-1 pr-6 border-r border-border mr-6">
                            <h3 className="text-h3 text-foreground flex items-center gap-4 mb-2" data-testid={`admin-product-name-${product.id}`}>
                              {product.name}
                              {!product.onDisplay && (
                                <span className="text-small font-mono bg-neutral-900 border border-border text-muted-foreground px-2 py-1 rounded-sm">
                                  HIDDEN
                                </span>
                              )}
                            </h3>
                            <p className="text-body text-muted-foreground">
                              {product.company} <span className="mx-2 opacity-50">/</span> {product.type}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-8">
                            <div className="flex flex-col items-end gap-2">
                              <span className="text-small font-mono text-muted-foreground uppercase" data-testid={`admin-status-${product.id}`}>
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
                            <div className="flex items-center gap-2 pl-6 border-l border-border">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-10 w-10 text-foreground hover:bg-white/5 rounded-sm"
                                onClick={() => setLocation(`/admin/products/${product.id}/edit`)}
                                aria-label="Edit product"
                                data-testid={`button-edit-${product.id}`}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-sm"
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
