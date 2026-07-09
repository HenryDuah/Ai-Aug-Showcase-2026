import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { X, CheckCircle, FileText, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ImageOverlay from "@/components/image-overlay";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

const productFeedbackFormSchema = z.object({
  visitorName: z.string().optional(),
  visitorEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  comments: z.string().optional(),
});

type ProductFeedbackFormData = z.infer<typeof productFeedbackFormSchema>;

export default function ProductDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showImageOverlay, setShowImageOverlay] = useState(false);
  const [showBrochure, setShowBrochure] = useState(false);
  
  const productId = params.productId;

  const feedbackForm = useForm<ProductFeedbackFormData>({
    resolver: zodResolver(productFeedbackFormSchema),
    defaultValues: {
      visitorName: "",
      visitorEmail: "",
      comments: "",
    },
  });

  const feedbackMutation = useMutation({
    mutationFn: async (data: ProductFeedbackFormData) => {
      const response = await apiRequest("POST", "/api/product-feedback", {
        productId,
        visitorName: data.visitorName || null,
        visitorEmail: data.visitorEmail || null,
        comments: data.comments || null,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Thank you",
        description: "Feedback submitted.",
      });
      feedbackForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit feedback.",
        variant: "destructive",
      });
    },
  });

  const trackView = async () => {
    if (productId) {
      try {
        await apiRequest("POST", `/api/products/${productId}/track-view`, {});
      } catch (error) {
        console.error("Failed to track view:", error);
      }
    }
  };

  const trackVideoClick = async () => {
    if (productId) {
      try {
        await apiRequest("POST", `/api/products/${productId}/track-video-click`, {});
      } catch (error) {
        console.error("Failed to track video click:", error);
      }
    }
  };

  const trackWebsiteClick = async () => {
    if (productId) {
      try {
        await apiRequest("POST", `/api/products/${productId}/track-website-click`, {});
      } catch (error) {
        console.error("Failed to track website click:", error);
      }
    }
  };
  
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", productId],
  });

  useEffect(() => {
    if (product) {
      trackView();
    }
  }, [product?.id]);

  const handleClose = () => {
    if (product) {
      setLocation(`/section/${product.sectionId}`);
    } else {
      setLocation("/overview");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-background">
        <div className="bg-secondary px-8 py-8 border-b border-border">
          <Skeleton className="h-6 w-24 mb-6 bg-muted" />
          <Skeleton className="h-10 w-3/4 mb-4 bg-muted" />
          <Skeleton className="h-6 w-1/2 bg-muted" />
        </div>
        <div className="px-8 py-12 space-y-8 max-w-4xl mx-auto">
          <Skeleton className="aspect-video w-full rounded-sm bg-muted" />
          <Skeleton className="h-32 w-full rounded-sm bg-muted" />
          <Skeleton className="h-48 w-full rounded-sm bg-muted" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center border border-border p-12 rounded-sm bg-card">
          <h2 className="text-display mb-4" data-testid="product-not-found">Product not found</h2>
          <p className="text-body text-muted-foreground mb-8">The requested product could not be found.</p>
          <Button onClick={() => setLocation("/overview")} data-testid="button-back-overview" className="h-14 w-full text-body rounded-sm">
            Back to overview
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background pb-32">
      <div className="fade-in">
        <div className="bg-secondary px-8 py-10 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={handleClose}
              className="text-foreground hover:bg-white/5 mb-10 p-0 h-auto font-normal text-body"
              data-testid="button-close-product"
            >
              <X className="w-5 h-5 mr-3" />
              Close
            </Button>
            
            <div className="flex gap-4 items-center mb-6">
              <span className="text-small font-mono border border-border px-3 py-1 rounded-sm text-muted-foreground uppercase" data-testid="product-type">
                {product.type}
              </span>
            </div>
            
            <h1 className="text-display mb-4" data-testid="product-name">{product.name}</h1>
            <p className="text-h2 text-muted-foreground" data-testid="product-company">{product.company}</p>
          </div>
        </div>

        <div className="px-8 py-12">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Product Image */}
            <div 
              className="aspect-video bg-card rounded-sm overflow-hidden cursor-pointer border border-border"
              onClick={() => setShowImageOverlay(true)}
              data-testid="product-image-container"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                data-testid="product-image"
              />
            </div>

            {/* Description */}
            <div className="border-b border-border pb-12">
              <h3 className="text-small font-mono text-muted-foreground mb-6">DESCRIPTION</h3>
              <p className="text-h3 text-foreground font-normal leading-relaxed max-w-3xl" data-testid="product-description">
                {product.description}
              </p>
            </div>

            {/* Product Video */}
            {product.videoUrl && (
              <div className="border-b border-border pb-12">
                <h3 className="text-small font-mono text-muted-foreground mb-6 flex justify-between items-end">
                  <span>PRODUCT VIDEO</span>
                  {product.videoType && <span data-testid="product-video-type">{product.videoType}</span>}
                </h3>
                <div className="aspect-video rounded-sm overflow-hidden bg-black border border-border">
                  {product.videoUrl.includes('youtube.com') || product.videoUrl.includes('youtu.be') ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={product.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                      title="Product video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      data-testid="product-video-youtube"
                      onClick={trackVideoClick}
                    />
                  ) : product.videoUrl.includes('vimeo.com') ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={product.videoUrl.replace('vimeo.com/', 'player.vimeo.com/video/')}
                      title="Product video"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      data-testid="product-video-vimeo"
                      onClick={trackVideoClick}
                    />
                  ) : (
                    <video
                      controls
                      preload="metadata"
                      className="w-full h-full object-contain"
                      onPlay={trackVideoClick}
                      data-testid="product-video"
                    >
                      <source src={product.videoUrl} type="video/mp4" />
                      <source src={product.videoUrl} type="video/webm" />
                      <source src={product.videoUrl} type="video/ogg" />
                    </video>
                  )}
                </div>
              </div>
            )}

            {/* The Impact & Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-border pb-12">
              {product.theImpact && (
                <div>
                  <h3 className="text-small font-mono text-muted-foreground mb-6">THE IMPACT</h3>
                  <p className="text-body text-foreground leading-relaxed" data-testid="product-impact">
                    {product.theImpact}
                  </p>
                </div>
              )}

              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="text-small font-mono text-muted-foreground mb-6">KEY FEATURES</h3>
                  <ul className="space-y-4" data-testid="product-features">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-body text-foreground" data-testid={`feature-${index}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Resources */}
            {(product.brochureUrl || product.website) && (
              <div className="border-b border-border pb-12">
                <h3 className="text-small font-mono text-muted-foreground mb-6">RESOURCES</h3>
                <div className="flex flex-col sm:flex-row gap-6">
                  {product.brochureUrl && (
                    <Button 
                      variant="outline"
                      onClick={() => setShowBrochure(true)}
                      className="h-14 px-8 text-body rounded-sm border-border hover:bg-white/5 flex-1 sm:flex-none justify-start"
                      data-testid="button-view-brochure"
                    >
                      <FileText className="w-5 h-5 mr-3 text-muted-foreground" />
                      View brochure
                    </Button>
                  )}
                  {product.website && (
                    <a 
                      href={product.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={trackWebsiteClick}
                      className="flex-1 sm:flex-none" 
                    >
                      <Button 
                        variant="outline"
                        className="w-full h-14 px-8 text-body rounded-sm border-border hover:bg-white/5 justify-start text-primary"
                        data-testid="product-website"
                      >
                        Visit external site
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Product Feedback */}
            <div className="bg-card border border-border rounded-sm p-8 md:p-12 mb-20">
              <h3 className="text-h2 text-foreground mb-4 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-muted-foreground" />
                Share your views
              </h3>
              <p className="text-body text-muted-foreground mb-8">Optional product feedback.</p>
              
              <Form {...feedbackForm}>
                <form onSubmit={feedbackForm.handleSubmit((data) => feedbackMutation.mutate(data))} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={feedbackForm.control}
                      name="visitorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-small text-muted-foreground">Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Your name" className="h-14 bg-background border-border" data-testid="input-product-feedback-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={feedbackForm.control}
                      name="visitorEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-small text-muted-foreground">Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="your.email@example.com" className="h-14 bg-background border-border" data-testid="input-product-feedback-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={feedbackForm.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-small text-muted-foreground">Feedback</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Share your thoughts about this product..."
                            rows={5}
                            className="resize-y bg-background border-border p-4"
                            data-testid="textarea-product-feedback-comments"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="h-14 px-8 text-body rounded-sm" 
                    disabled={feedbackMutation.isPending}
                    data-testid="button-submit-product-feedback"
                  >
                    {feedbackMutation.isPending ? "Submitting..." : "Submit feedback"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>

        {/* Navigation Chrome */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-6 z-10">
          <div className="max-w-4xl mx-auto flex justify-end">
            <Button 
              onClick={handleClose}
              className="h-14 px-8 text-body rounded-sm bg-gravel text-white hover:bg-gravel/80 border border-gravel"
              data-testid="button-close-return-section"
            >
              <X className="w-5 h-5 mr-3" />
              Close product
            </Button>
          </div>
        </div>

        {/* Image Overlay */}
        <ImageOverlay
          isOpen={showImageOverlay}
          imageUrl={product.image}
          altText={product.name}
          onClose={() => setShowImageOverlay(false)}
        />

        {/* Brochure Dialog */}
        <Dialog open={showBrochure} onOpenChange={setShowBrochure}>
          <DialogContent className="max-w-5xl h-[90vh] p-0 rounded-sm border-border bg-background overflow-hidden flex flex-col">
            <DialogHeader className="p-6 border-b border-border bg-secondary flex-shrink-0">
              <DialogTitle className="flex items-center gap-3 text-h3 text-foreground">
                <FileText className="text-muted-foreground" size={24} />
                Product brochure
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 bg-black w-full relative">
              <iframe
                src={product.brochureUrl || ""}
                className="absolute inset-0 w-full h-full border-0"
                title="Product Brochure"
                data-testid="brochure-viewer"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
