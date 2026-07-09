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
import { X, Tag, CheckCircle, FileText, MessageSquare } from "lucide-react";
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
        <div className="bg-primary text-primary-foreground px-6 py-6">
          <Skeleton className="h-6 w-16 mb-4 bg-white/20" />
          <Skeleton className="h-8 w-3/4 mb-2 bg-white/20" />
          <Skeleton className="h-5 w-1/2 bg-white/20" />
        </div>
        <div className="px-6 py-6 space-y-6 max-w-4xl mx-auto">
          <Skeleton className="aspect-video w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-1 rounded-lg">
          <CardContent className="pt-6 text-center">
            <h2 className="text-h2 text-foreground mb-2" data-testid="product-not-found">Product not found</h2>
            <p className="text-body text-muted-foreground mb-6">The requested product could not be found.</p>
            <Button onClick={() => setLocation("/overview")} data-testid="button-back-overview" className="h-12 w-full text-body">
              Back to overview
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background pb-24">
      <div className="fade-in">
        <div className="bg-primary text-primary-foreground px-6 py-6 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={handleClose}
              className="text-primary-foreground hover:text-primary-foreground hover:bg-white/10 mb-4 p-0 h-auto font-normal text-body"
              data-testid="button-close-product"
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
            <h1 className="text-h1 mb-2" data-testid="product-name">{product.name}</h1>
            <p className="text-h3 opacity-90" data-testid="product-company">{product.company}</p>
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Product Image */}
            <div 
              className="aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setShowImageOverlay(true)}
              data-testid="product-image-container"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="product-image"
              />
            </div>

            {/* Product Type */}
            <Card className="shadow-1 rounded-lg border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Tag className="text-primary text-xl flex-shrink-0" size={20} />
                  <div>
                    <p className="text-small text-muted-foreground mb-1">Product type</p>
                    <p className="text-body font-semibold text-foreground" data-testid="product-type">{product.type}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="shadow-1 rounded-lg border-border">
              <CardContent className="p-5 md:p-6">
                <h3 className="text-h3 text-foreground mb-3">Description</h3>
                <p className="text-body text-muted-foreground leading-relaxed" data-testid="product-description">
                  {product.description}
                </p>
              </CardContent>
            </Card>

            {/* Product Video */}
            {product.videoUrl && (
              <Card className="shadow-1 rounded-lg border-border">
                <CardContent className="p-5 md:p-6">
                  <h3 className="text-h3 text-foreground mb-1">Product video</h3>
                  {product.videoType && (
                    <p className="text-small text-muted-foreground mb-4" data-testid="product-video-type">
                      {product.videoType}
                    </p>
                  )}
                  {!product.videoType && <div className="mb-4"></div>}
                  {product.videoUrl.includes('youtube.com') || product.videoUrl.includes('youtu.be') ? (
                    <div className="aspect-video rounded-lg overflow-hidden bg-neutral-900" onClick={trackVideoClick}>
                      <iframe
                        width="100%"
                        height="100%"
                        src={product.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                        title="Product video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        data-testid="product-video-youtube"
                      />
                    </div>
                  ) : product.videoUrl.includes('vimeo.com') ? (
                    <div className="aspect-video rounded-lg overflow-hidden bg-neutral-900" onClick={trackVideoClick}>
                      <iframe
                        width="100%"
                        height="100%"
                        src={product.videoUrl.replace('vimeo.com/', 'player.vimeo.com/video/')}
                        title="Product video"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        data-testid="product-video-vimeo"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video rounded-lg overflow-hidden bg-neutral-900">
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
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* The Impact */}
            {product.theImpact && (
              <Card className="shadow-1 rounded-lg border-border">
                <CardContent className="p-5 md:p-6">
                  <h3 className="text-h3 text-foreground mb-3">The impact</h3>
                  <p className="text-body text-muted-foreground leading-relaxed" data-testid="product-impact">
                    {product.theImpact}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Product Brochure */}
            {product.brochureUrl && (
              <Card className="shadow-1 rounded-lg border-border">
                <CardContent className="p-5 md:p-6">
                  <h3 className="text-h3 text-foreground mb-4 flex items-center gap-2">
                    <FileText className="text-primary" size={20} />
                    Product brochure
                  </h3>
                  <Button 
                    variant="outline"
                    onClick={() => setShowBrochure(true)}
                    className="w-full sm:w-auto h-12 text-body"
                    data-testid="button-view-brochure"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View brochure
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Key Features */}
            {product.features && product.features.length > 0 && (
              <Card className="shadow-1 rounded-lg border-border">
                <CardContent className="p-5 md:p-6">
                  <h3 className="text-h3 text-foreground mb-4 flex items-center gap-2">
                    <CheckCircle className="text-primary" size={20} />
                    Key features
                  </h3>
                  <ul className="space-y-3" data-testid="product-features">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="text-primary mt-0.5 flex-shrink-0" size={16} />
                        <span className="text-body text-muted-foreground" data-testid={`feature-${index}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Website */}
            {product.website && (
              <Card className="shadow-1 rounded-lg border-border">
                <CardContent className="p-5 md:p-6">
                  <div>
                    <p className="text-small text-muted-foreground mb-1">Website</p>
                    <a 
                      href={product.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={trackWebsiteClick}
                      className="text-body font-semibold text-primary hover:underline" 
                      data-testid="product-website"
                    >
                      Visit external site
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Product Feedback */}
            <Card className="mb-20 shadow-1 rounded-lg border-border">
              <CardContent className="p-5 md:p-6">
                <h3 className="text-h3 text-foreground mb-4 flex items-center gap-2">
                  <MessageSquare className="text-primary" size={20} />
                  Share your views
                </h3>
                <p className="text-body text-muted-foreground mb-6">Optional product feedback.</p>
                <Form {...feedbackForm}>
                  <form onSubmit={feedbackForm.handleSubmit((data) => feedbackMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={feedbackForm.control}
                      name="visitorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-body">Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Your name" className="h-12" data-testid="input-product-feedback-name" />
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
                          <FormLabel className="text-body">Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="your.email@example.com" className="h-12" data-testid="input-product-feedback-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={feedbackForm.control}
                      name="comments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-body">Feedback</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Share your thoughts about this product..."
                              rows={4}
                              className="resize-y"
                              data-testid="textarea-product-feedback-comments"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-body" 
                      disabled={feedbackMutation.isPending}
                      data-testid="button-submit-product-feedback"
                    >
                      {feedbackMutation.isPending ? "Submitting..." : "Submit feedback"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-2 z-10">
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="outline"
              onClick={handleClose}
              className="w-full h-12 text-body"
              data-testid="button-close-return-section"
            >
              <X className="w-4 h-4 mr-2" />
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
          <DialogContent className="max-w-4xl max-h-[90vh] p-0 rounded-lg overflow-hidden">
            <DialogHeader className="p-4 border-b border-border bg-muted">
              <DialogTitle className="flex items-center gap-2 text-h3">
                <FileText className="text-primary" size={20} />
                Product brochure
              </DialogTitle>
            </DialogHeader>
            <div className="h-[70vh]">
              <iframe
                src={product.brochureUrl || ""}
                className="w-full h-full border-0"
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
