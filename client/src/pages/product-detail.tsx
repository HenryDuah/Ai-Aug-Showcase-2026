import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  X, Tag, CheckCircle, FileText, MessageSquare, Globe, MapPin, 
  BarChart3, Wifi, Cpu, Shield, Users, DollarSign, ThumbsUp, 
  AlertCircle, Video, Package, Battery, Signal, Thermometer, Play
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ImageOverlay from "@/components/image-overlay";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";
import { VISITOR_ROLES } from "@shared/schema";

const productFeedbackFormSchema = z.object({
  visitorName: z.string().optional(),
  visitorEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  visitorRole: z.string().optional(),
  visitorRoleOther: z.string().optional(),
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
      visitorRole: "",
      visitorRoleOther: "",
      comments: "",
    },
  });

  const watchedRole = feedbackForm.watch("visitorRole");

  const feedbackMutation = useMutation({
    mutationFn: async (data: ProductFeedbackFormData) => {
      const response = await apiRequest("POST", "/api/product-feedback", {
        productId,
        visitorName: data.visitorName || null,
        visitorEmail: data.visitorEmail || null,
        visitorRole: data.visitorRole || null,
        visitorRoleOther: data.visitorRole === "Other" ? data.visitorRoleOther || null : null,
        comments: data.comments || null,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted successfully.",
      });
      feedbackForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
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
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-6">
          <Skeleton className="h-6 w-16 mb-4 bg-white/20" />
          <Skeleton className="h-8 w-3/4 mb-2 bg-white/20" />
          <Skeleton className="h-5 w-1/2 bg-white/20" />
        </div>
        <div className="px-6 py-6 space-y-6">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold text-foreground mb-2" data-testid="product-not-found">Product Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested product could not be found.</p>
            <Button onClick={() => setLocation("/overview")} data-testid="button-back-overview">
              Back to Overview
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasEvidenceData = product.stageOfDevelopment?.length || product.geography || product.reportedOutcomes;
  const hasTechnicalData = product.dataCollected?.length || product.offlineCapability || product.integration?.length;
  const hasHardwareData = product.whatsInTheBox || product.componentWeight || product.powerBattery || product.connectivity || product.environmentalConditions;
  const hasRegulatoryData = product.regulatoryApprovals?.length || product.complianceCertifications?.length;
  const hasUserData = product.userTypes?.length || product.cost;
  const hasStrengthsData = product.strengths || product.considerations;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-6">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="text-white mb-4 p-0 h-auto font-normal hover:bg-white/10"
            data-testid="button-close-product"
          >
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold mb-2" data-testid="product-name">{product.name}</h1>
          <p className="text-white/90 text-lg" data-testid="product-company">{product.company}</p>
        </div>

        <div className="px-4 md:px-6 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Always Visible Section */}
            <Card className="overflow-hidden">
              <div 
                className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden cursor-pointer"
                onClick={() => setShowImageOverlay(true)}
                data-testid="product-image-container"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  data-testid="product-image"
                />
              </div>
              <CardContent className="pt-5 space-y-4">
                {/* Product Type */}
                <div className="flex items-center gap-2">
                  <Tag className="text-primary flex-shrink-0" size={18} />
                  <span className="text-sm text-muted-foreground">Product Type:</span>
                  <span className="font-semibold text-foreground" data-testid="product-type">{product.type}</span>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Description</h3>
                  <p className="text-foreground/80 leading-relaxed" data-testid="product-description">
                    {product.description}
                  </p>
                </div>

                {/* Use Case */}
                {product.useCase && (
                  <div className="flex items-start gap-2">
                    <Globe className="text-primary flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <span className="text-sm text-muted-foreground block">Use Case</span>
                      <span className="font-medium text-foreground" data-testid="product-usecase">{product.useCase}</span>
                    </div>
                  </div>
                )}

                {/* Healthcare Tags */}
                {product.healthcareTags && product.healthcareTags.length > 0 && (
                  <div className="flex flex-wrap gap-2" data-testid="product-healthcare-tags">
                    {product.healthcareTags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="rounded-full">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Expandable Sections */}
            <Accordion type="multiple" className="space-y-3">
              
              {/* The Impact */}
              {product.theImpact && (
                <AccordionItem value="impact" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="text-primary" size={20} />
                      <span className="font-semibold">The Impact</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <p className="text-foreground/80 leading-relaxed" data-testid="product-impact">
                      {product.theImpact}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Product Video */}
              {product.videoUrl && (
                <AccordionItem value="video" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <Video className="text-primary" size={20} />
                      <span className="font-semibold">Product Video</span>
                      {product.videoType && (
                        <Badge variant="outline" className="ml-2 text-xs">{product.videoType}</Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    {product.videoUrl.includes('youtube.com') || product.videoUrl.includes('youtu.be') ? (
                      <div className="aspect-video rounded-lg overflow-hidden" onClick={trackVideoClick}>
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
                      <div className="aspect-video rounded-lg overflow-hidden" onClick={trackVideoClick}>
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
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <video
                          controls
                          preload="metadata"
                          className="w-full h-full object-contain bg-black"
                          onPlay={trackVideoClick}
                          data-testid="product-video"
                        >
                          <source src={product.videoUrl} type="video/mp4" />
                          <source src={product.videoUrl} type="video/webm" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Evidence & Deployment */}
              {hasEvidenceData && (
                <AccordionItem value="evidence" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="text-primary" size={20} />
                      <span className="font-semibold">Evidence & Deployment</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 space-y-4">
                    {product.stageOfDevelopment && product.stageOfDevelopment.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Stage of Development</h4>
                        <div className="flex flex-wrap gap-2" data-testid="product-stage">
                          {product.stageOfDevelopment.map((stage: string) => (
                            <Badge key={stage} variant="outline" className="rounded-full">{stage}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {product.geography && (
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-1">Geography</h4>
                        <p className="text-foreground/80" data-testid="product-geography">{product.geography}</p>
                      </div>
                    )}
                    {product.reportedOutcomes && (
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-1">Reported Outcomes</h4>
                        <p className="text-foreground/80 leading-relaxed" data-testid="product-outcomes">{product.reportedOutcomes}</p>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Technical Specifications */}
              {hasTechnicalData && (
                <AccordionItem value="technical" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <Cpu className="text-primary" size={20} />
                      <span className="font-semibold">Technical Specifications</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 space-y-4">
                    {product.dataCollected && product.dataCollected.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Data Collected</h4>
                        <div className="flex flex-wrap gap-2" data-testid="product-data-collected">
                          {product.dataCollected.map((data: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="rounded-full">{data}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {product.offlineCapability && (
                      <div className="flex items-center gap-2">
                        <Wifi className="text-muted-foreground" size={16} />
                        <span className="text-sm text-muted-foreground">Offline Capability:</span>
                        <Badge variant={product.offlineCapability === 'Yes' ? 'default' : 'outline'} data-testid="product-offline">
                          {product.offlineCapability}
                        </Badge>
                      </div>
                    )}
                    {product.integration && product.integration.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Integration</h4>
                        <div className="flex flex-wrap gap-2" data-testid="product-integration">
                          {product.integration.map((item: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="rounded-full">{item}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Hardware Specifications */}
              {hasHardwareData && (
                <AccordionItem value="hardware" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <Package className="text-primary" size={20} />
                      <span className="font-semibold">Hardware Specifications</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 space-y-3">
                    {product.whatsInTheBox && (
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-1">What's in the Box</h4>
                        <p className="text-foreground/80" data-testid="product-box-contents">{product.whatsInTheBox}</p>
                      </div>
                    )}
                    {product.componentWeight && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Weight:</span>
                        <span className="text-foreground" data-testid="product-weight">{product.componentWeight}</span>
                      </div>
                    )}
                    {product.powerBattery && (
                      <div className="flex items-start gap-2">
                        <Battery className="text-muted-foreground flex-shrink-0 mt-0.5" size={16} />
                        <div>
                          <span className="text-sm text-muted-foreground block">Power/Battery</span>
                          <span className="text-foreground" data-testid="product-power">{product.powerBattery}</span>
                        </div>
                      </div>
                    )}
                    {product.connectivity && (
                      <div className="flex items-start gap-2">
                        <Signal className="text-muted-foreground flex-shrink-0 mt-0.5" size={16} />
                        <div>
                          <span className="text-sm text-muted-foreground block">Connectivity</span>
                          <span className="text-foreground" data-testid="product-connectivity">{product.connectivity}</span>
                        </div>
                      </div>
                    )}
                    {product.environmentalConditions && (
                      <div className="flex items-start gap-2">
                        <Thermometer className="text-muted-foreground flex-shrink-0 mt-0.5" size={16} />
                        <div>
                          <span className="text-sm text-muted-foreground block">Environmental Conditions</span>
                          <span className="text-foreground" data-testid="product-environment">{product.environmentalConditions}</span>
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Regulatory & Compliance */}
              {hasRegulatoryData && (
                <AccordionItem value="regulatory" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <Shield className="text-primary" size={20} />
                      <span className="font-semibold">Regulatory & Compliance</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 space-y-4">
                    {product.regulatoryApprovals && product.regulatoryApprovals.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Regulatory Approvals</h4>
                        <div className="flex flex-wrap gap-2" data-testid="product-regulatory">
                          {product.regulatoryApprovals.map((approval: string) => (
                            <Badge key={approval} variant="default" className="rounded-full">{approval}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {product.complianceCertifications && product.complianceCertifications.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Compliance Certifications</h4>
                        <div className="flex flex-wrap gap-2" data-testid="product-compliance">
                          {product.complianceCertifications.map((cert: string) => (
                            <Badge key={cert} variant="outline" className="rounded-full">{cert}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* User Information */}
              {hasUserData && (
                <AccordionItem value="users" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <Users className="text-primary" size={20} />
                      <span className="font-semibold">User Information</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 space-y-4">
                    {product.userTypes && product.userTypes.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Intended Users</h4>
                        <div className="flex flex-wrap gap-2" data-testid="product-user-types">
                          {product.userTypes.map((user: string) => (
                            <Badge key={user} variant="secondary" className="rounded-full">{user}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {product.cost && (
                      <div className="flex items-start gap-2">
                        <DollarSign className="text-muted-foreground flex-shrink-0 mt-0.5" size={16} />
                        <div>
                          <span className="text-sm text-muted-foreground block">Cost Information</span>
                          <span className="text-foreground" data-testid="product-cost">{product.cost}</span>
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Strengths & Considerations */}
              {hasStrengthsData && (
                <AccordionItem value="strengths" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <ThumbsUp className="text-primary" size={20} />
                      <span className="font-semibold">Strengths & Considerations</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 space-y-4">
                    {product.strengths && (
                      <div>
                        <h4 className="text-sm font-semibold text-green-600 mb-1 flex items-center gap-1">
                          <ThumbsUp size={14} /> Strengths
                        </h4>
                        <p className="text-foreground/80 leading-relaxed" data-testid="product-strengths">{product.strengths}</p>
                      </div>
                    )}
                    {product.considerations && (
                      <div>
                        <h4 className="text-sm font-semibold text-amber-600 mb-1 flex items-center gap-1">
                          <AlertCircle size={14} /> Considerations
                        </h4>
                        <p className="text-foreground/80 leading-relaxed" data-testid="product-considerations">{product.considerations}</p>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Key Features */}
              {product.features && product.features.length > 0 && (
                <AccordionItem value="features" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-primary" size={20} />
                      <span className="font-semibold">Key Features</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <ul className="space-y-2" data-testid="product-features">
                      {product.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="text-primary mt-1 flex-shrink-0" size={16} />
                          <span className="text-foreground/80" data-testid={`feature-${index}`}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Product Brochure */}
              {product.brochureUrl && (
                <AccordionItem value="brochure" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="text-primary" size={20} />
                      <span className="font-semibold">Product Brochure</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <Button 
                      variant="outline"
                      onClick={() => setShowBrochure(true)}
                      className="w-full sm:w-auto"
                      data-testid="button-view-brochure"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Brochure (PDF)
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Website */}
              {product.website && (
                <AccordionItem value="website" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <Globe className="text-primary" size={20} />
                      <span className="font-semibold">Website</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <a 
                      href={product.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={trackWebsiteClick}
                      className="text-primary hover:underline flex items-center gap-2" 
                      data-testid="product-website"
                    >
                      <Globe size={16} />
                      Visit Product Website
                    </a>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>

            {/* Product Feedback */}
            <Card className="mb-8">
              <CardContent className="pt-5">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <MessageSquare className="text-primary" size={20} />
                  Share your views on this product (Optional)
                </h3>
                <Form {...feedbackForm}>
                  <form onSubmit={feedbackForm.handleSubmit((data) => feedbackMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={feedbackForm.control}
                      name="visitorRole"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Who are you? (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-visitor-role">
                                <SelectValue placeholder="Select your role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {VISITOR_ROLES.map((role) => (
                                <SelectItem key={role} value={role} data-testid={`role-option-${role}`}>
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {watchedRole === "Other" && (
                      <FormField
                        control={feedbackForm.control}
                        name="visitorRoleOther"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Please specify your role</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Your role" data-testid="input-visitor-role-other" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={feedbackForm.control}
                      name="visitorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Your name" data-testid="input-product-feedback-name" />
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
                          <FormLabel>Email (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="your.email@example.com" data-testid="input-product-feedback-email" />
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
                          <FormLabel>Your Feedback (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Share your thoughts about this product..."
                              rows={4}
                              data-testid="textarea-product-feedback-comments"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={feedbackMutation.isPending}
                      data-testid="button-submit-product-feedback"
                    >
                      {feedbackMutation.isPending ? "Submitting..." : "Submit Feedback"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Fixed Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t-2 border-border p-4 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <Button 
              onClick={handleClose}
              className="w-full"
              data-testid="button-close-return-section"
            >
              <X className="w-4 h-4 mr-2" />
              Close
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
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <DialogHeader className="p-6 pb-4">
              <DialogTitle className="flex items-center gap-2">
                <FileText className="text-primary" size={24} />
                Product Brochure
              </DialogTitle>
            </DialogHeader>
            <div className="px-6 pb-6 h-[70vh]">
              <iframe
                src={product.brochureUrl || ""}
                className="w-full h-full rounded-lg border"
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
