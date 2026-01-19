import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Upload, ChevronDown, ChevronUp } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Product, InsertProduct } from "@shared/schema";
import { 
  HEALTHCARE_TAGS, 
  STAGE_OF_DEVELOPMENT, 
  VIDEO_TYPES,
  OFFLINE_CAPABILITY_OPTIONS,
  REGULATORY_APPROVALS,
  COMPLIANCE_CERTIFICATIONS,
  USER_TYPES
} from "@shared/schema";
import type { UploadResult } from "@uppy/core";
import sectionsData from "@/data/products.json";
import { ObjectUploader } from "@/components/ObjectUploader";

const createProductFormSchema = (isEditMode: boolean) => z.object({
  name: z.string().min(1, "Product name is required"),
  oneLineDescription: z.string().optional(),
  company: z.string().min(1, "Company name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().url("Must be a valid URL"),
  videoUrl: z.string().optional(),
  videoType: z.string().optional(),
  website: z.string().optional(),
  sectionId: z.number().min(1).max(5),
  sectionName: z.string().min(1, "Section name is required"),
  features: z.string(),
  onDisplay: z.boolean().optional(),
  useCase: z.string().optional(),
  healthcareTags: z.array(z.string()).optional(),
  stageOfDevelopment: z.array(z.string()).optional(),
  geography: z.string().optional(),
  reportedOutcomes: z.string().optional(),
  dataCollected: z.string().optional(),
  offlineCapability: z.string().optional(),
  integration: z.string().optional(),
  regulatoryApprovals: z.array(z.string()).optional(),
  complianceCertifications: z.array(z.string()).optional(),
  whatsInTheBox: z.string().optional(),
  componentWeight: z.string().optional(),
  powerBattery: z.string().optional(),
  connectivity: z.string().optional(),
  environmentalConditions: z.string().optional(),
  userTypes: z.array(z.string()).optional(),
  cost: z.string().optional(),
  strengths: z.string().optional(),
  considerations: z.string().optional(),
});

type ProductFormData = z.infer<ReturnType<typeof createProductFormSchema>>;

export default function ProductForm() {
  const { productId } = useParams<{ productId?: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isEditMode = !!productId && productId !== "new";
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    classification: true,
    evidence: false,
    technical: false,
    hardware: false,
    regulatory: false,
    users: false,
    evaluation: false,
    media: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    enabled: isEditMode,
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(createProductFormSchema(isEditMode)),
    defaultValues: {
      name: "",
      oneLineDescription: "",
      company: "",
      description: "",
      image: "",
      videoUrl: "",
      videoType: "",
      website: "",
      sectionId: 1,
      sectionName: "",
      features: "",
      onDisplay: true,
      useCase: "",
      healthcareTags: [],
      stageOfDevelopment: [],
      geography: "",
      reportedOutcomes: "",
      dataCollected: "",
      offlineCapability: "",
      integration: "",
      regulatoryApprovals: [],
      complianceCertifications: [],
      whatsInTheBox: "",
      componentWeight: "",
      powerBattery: "",
      connectivity: "",
      environmentalConditions: "",
      userTypes: [],
      cost: "",
      strengths: "",
      considerations: "",
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        oneLineDescription: product.oneLineDescription || "",
        company: product.company,
        description: product.description,
        image: product.image,
        videoUrl: product.videoUrl || "",
        videoType: product.videoType || "",
        website: product.website || "",
        sectionId: product.sectionId,
        sectionName: product.sectionName,
        features: product.features?.join("\n") || "",
        onDisplay: product.onDisplay ?? true,
        useCase: product.useCase || "",
        healthcareTags: product.healthcareTags || [],
        stageOfDevelopment: product.stageOfDevelopment || [],
        geography: product.geography || "",
        reportedOutcomes: product.reportedOutcomes || "",
        dataCollected: product.dataCollected?.join("\n") || "",
        offlineCapability: product.offlineCapability || "",
        integration: product.integration?.join("\n") || "",
        regulatoryApprovals: product.regulatoryApprovals || [],
        complianceCertifications: product.complianceCertifications || [],
        whatsInTheBox: product.whatsInTheBox || "",
        componentWeight: product.componentWeight || "",
        powerBattery: product.powerBattery || "",
        connectivity: product.connectivity || "",
        environmentalConditions: product.environmentalConditions || "",
        userTypes: product.userTypes || [],
        cost: product.cost || "",
        strengths: product.strengths || "",
        considerations: product.considerations || "",
      });
    }
  }, [product, form]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      const response = await apiRequest("POST", "/api/products", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product created successfully.",
      });
      setLocation("/admin");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create product.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Product>) => {
      const response = await apiRequest("PATCH", `/api/products/${productId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product updated successfully.",
      });
      setLocation("/admin");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update product.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProductFormData) => {
    const cleanVideoUrl = data.videoUrl?.trim() && data.videoUrl.toLowerCase() !== "none" 
      ? data.videoUrl 
      : null;
    const cleanVideoType = data.videoType?.trim() && 
      data.videoType.toLowerCase() !== "none" && 
      data.videoType !== "" &&
      data.videoType !== "__NONE__"
        ? data.videoType 
        : null;

    const productData = {
      ...data,
      features: data.features.split("\n").filter(f => f.trim()),
      videoUrl: cleanVideoUrl,
      videoType: cleanVideoType,
      oneLineDescription: data.oneLineDescription || null,
      useCase: data.useCase || null,
      healthcareTags: data.healthcareTags?.length ? data.healthcareTags : null,
      stageOfDevelopment: data.stageOfDevelopment?.length ? data.stageOfDevelopment : null,
      geography: data.geography || null,
      reportedOutcomes: data.reportedOutcomes || null,
      dataCollected: data.dataCollected?.split("\n").filter(d => d.trim()) || null,
      offlineCapability: data.offlineCapability || null,
      integration: data.integration?.split("\n").filter(i => i.trim()) || null,
      regulatoryApprovals: data.regulatoryApprovals?.length ? data.regulatoryApprovals : null,
      complianceCertifications: data.complianceCertifications?.length ? data.complianceCertifications : null,
      whatsInTheBox: data.whatsInTheBox || null,
      componentWeight: data.componentWeight || null,
      powerBattery: data.powerBattery || null,
      connectivity: data.connectivity || null,
      environmentalConditions: data.environmentalConditions || null,
      userTypes: data.userTypes?.length ? data.userTypes : null,
      cost: data.cost || null,
      strengths: data.strengths || null,
      considerations: data.considerations || null,
    };

    if (isEditMode) {
      updateMutation.mutate(productData);
    } else {
      createMutation.mutate(productData as InsertProduct);
    }
  };

  const handleGetUploadParameters = async () => {
    const response = await apiRequest("POST", "/api/objects/upload");
    const data = await response.json();
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const uploadURL = result.successful[0].uploadURL;
      if (uploadURL) {
        try {
          const response = await apiRequest("POST", "/api/objects/normalize", { 
            uploadURL: uploadURL.split("?")[0] 
          });
          const data = await response.json();
          form.setValue("videoUrl", data.normalizedPath);
          toast({
            title: "Success",
            description: "Video file uploaded successfully.",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to process uploaded video.",
            variant: "destructive",
          });
        }
      }
    }
  };

  const handleSectionChange = (sectionId: string) => {
    const section = sectionsData.sections.find(s => s.id === parseInt(sectionId));
    if (section) {
      form.setValue("sectionId", section.id);
      form.setValue("sectionName", section.name);
    }
  };

  const SectionHeader = ({ title, section, description }: { title: string; section: string; description?: string }) => (
    <button 
      type="button"
      className="w-full flex items-center justify-between cursor-pointer py-3 px-4 bg-muted/50 rounded-lg mb-4 text-left"
      onClick={() => toggleSection(section)}
      data-testid={`section-toggle-${section}`}
    >
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {expandedSections[section] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
  );

  if (isLoading && isEditMode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setLocation("/admin")}
          className="mb-4"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? "Edit Product" : "Add New Product"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Basic Information */}
                <div>
                  <SectionHeader title="Basic Information" section="basic" description="Core product details" />
                  {expandedSections.basic && (
                    <div className="space-y-4 pl-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter product name" data-testid="input-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter company name" data-testid="input-company" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="https://example.com" data-testid="input-website" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="oneLineDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>One-Line Description</FormLabel>
                            <FormDescription>Brief description shown on product cards next to the product name</FormDescription>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Portable ultrasound for maternal care" data-testid="input-one-line-description" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sectionId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Section *</FormLabel>
                            <Select value={field.value.toString()} onValueChange={handleSectionChange}>
                              <FormControl>
                                <SelectTrigger data-testid="select-section">
                                  <SelectValue placeholder="Select a section" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {sectionsData.sections.map((section) => (
                                  <SelectItem key={section.id} value={section.id.toString()}>
                                    Section {section.id}: {section.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description *</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Enter product description" rows={4} data-testid="textarea-description" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="https://example.com/image.jpg" data-testid="input-image" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="features"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Key Features (one per line)</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" rows={4} data-testid="textarea-features" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <Separator />

                {/* Classification */}
                <div>
                  <SectionHeader title="Classification" section="classification" description="Use case and healthcare tags" />
                  {expandedSections.classification && (
                    <div className="space-y-4 pl-2">
                      <FormField
                        control={form.control}
                        name="useCase"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Use Case</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Prenatal care monitoring, Disease screening" data-testid="input-usecase" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="healthcareTags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Healthcare Tags</FormLabel>
                            <FormDescription>Select all that apply</FormDescription>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                              {HEALTHCARE_TAGS.map((tag) => (
                                <div key={tag} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`tag-${tag}`}
                                    checked={field.value?.includes(tag)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      if (checked) {
                                        field.onChange([...current, tag]);
                                      } else {
                                        field.onChange(current.filter((t: string) => t !== tag));
                                      }
                                    }}
                                  />
                                  <label htmlFor={`tag-${tag}`} className="text-sm cursor-pointer">{tag}</label>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <Separator />

                {/* Evidence & Deployment */}
                <div>
                  <SectionHeader title="Evidence & Deployment" section="evidence" description="Stage, geography, and outcomes" />
                  {expandedSections.evidence && (
                    <div className="space-y-4 pl-2">
                      <FormField
                        control={form.control}
                        name="stageOfDevelopment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stage of Development</FormLabel>
                            <FormDescription>Select all that apply</FormDescription>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                              {STAGE_OF_DEVELOPMENT.map((stage) => (
                                <div key={stage} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`stage-${stage}`}
                                    checked={field.value?.includes(stage)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      if (checked) {
                                        field.onChange([...current, stage]);
                                      } else {
                                        field.onChange(current.filter((s: string) => s !== stage));
                                      }
                                    }}
                                  />
                                  <label htmlFor={`stage-${stage}`} className="text-sm cursor-pointer">{stage}</label>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="geography"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Geography</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Kenya, Nigeria, Ghana" data-testid="input-geography" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="reportedOutcomes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reported Outcomes</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Describe the reported outcomes and evidence" rows={3} data-testid="textarea-outcomes" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <Separator />

                {/* Technical Specifications */}
                <div>
                  <SectionHeader title="Technical Specifications" section="technical" description="Data, connectivity, and integration" />
                  {expandedSections.technical && (
                    <div className="space-y-4 pl-2">
                      <FormField
                        control={form.control}
                        name="dataCollected"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data Collected (one per line)</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Blood pressure&#10;Heart rate&#10;Temperature" rows={3} data-testid="textarea-data-collected" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="offlineCapability"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Offline Capability</FormLabel>
                            <Select value={field.value || ""} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger data-testid="select-offline">
                                  <SelectValue placeholder="Select offline capability" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {OFFLINE_CAPABILITY_OPTIONS.map((option) => (
                                  <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="integration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Integration (one per line)</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="DHIS2&#10;OpenMRS&#10;HL7 FHIR" rows={3} data-testid="textarea-integration" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <Separator />

                {/* Hardware Specifications */}
                <div>
                  <SectionHeader title="Hardware Specifications" section="hardware" description="Physical device details" />
                  {expandedSections.hardware && (
                    <div className="space-y-4 pl-2">
                      <FormField
                        control={form.control}
                        name="whatsInTheBox"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>What's in the Box</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="List all components included" rows={3} data-testid="textarea-whats-in-box" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="componentWeight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Component Weight</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., 250g" data-testid="input-weight" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="powerBattery"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Power/Battery</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Rechargeable Li-ion, 8 hours battery life" data-testid="input-power" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="connectivity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Connectivity</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Bluetooth 5.0, WiFi, USB-C" data-testid="input-connectivity" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="environmentalConditions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Environmental Conditions</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Operating temp: 10-40°C, Humidity: 20-80%" data-testid="input-environmental" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <Separator />

                {/* Regulatory & Compliance */}
                <div>
                  <SectionHeader title="Regulatory & Compliance" section="regulatory" description="Approvals and certifications" />
                  {expandedSections.regulatory && (
                    <div className="space-y-4 pl-2">
                      <FormField
                        control={form.control}
                        name="regulatoryApprovals"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Regulatory Approvals</FormLabel>
                            <FormDescription>Select all that apply</FormDescription>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                              {REGULATORY_APPROVALS.map((approval) => (
                                <div key={approval} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`approval-${approval}`}
                                    checked={field.value?.includes(approval)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      if (checked) {
                                        field.onChange([...current, approval]);
                                      } else {
                                        field.onChange(current.filter((a: string) => a !== approval));
                                      }
                                    }}
                                  />
                                  <label htmlFor={`approval-${approval}`} className="text-sm cursor-pointer">{approval}</label>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="complianceCertifications"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Compliance Certifications</FormLabel>
                            <FormDescription>Select all that apply</FormDescription>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                              {COMPLIANCE_CERTIFICATIONS.map((cert) => (
                                <div key={cert} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`cert-${cert}`}
                                    checked={field.value?.includes(cert)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      if (checked) {
                                        field.onChange([...current, cert]);
                                      } else {
                                        field.onChange(current.filter((c: string) => c !== cert));
                                      }
                                    }}
                                  />
                                  <label htmlFor={`cert-${cert}`} className="text-sm cursor-pointer">{cert}</label>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <Separator />

                {/* User Information */}
                <div>
                  <SectionHeader title="User Information" section="users" description="Target users and cost" />
                  {expandedSections.users && (
                    <div className="space-y-4 pl-2">
                      <FormField
                        control={form.control}
                        name="userTypes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Intended User Types</FormLabel>
                            <FormDescription>Select all that apply</FormDescription>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                              {USER_TYPES.map((user) => (
                                <div key={user} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`user-${user}`}
                                    checked={field.value?.includes(user)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      if (checked) {
                                        field.onChange([...current, user]);
                                      } else {
                                        field.onChange(current.filter((u: string) => u !== user));
                                      }
                                    }}
                                  />
                                  <label htmlFor={`user-${user}`} className="text-sm cursor-pointer">{user}</label>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cost Information</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., $500 per unit, subscription model" data-testid="input-cost" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <Separator />

                {/* Evaluation */}
                <div>
                  <SectionHeader title="Strengths & Considerations" section="evaluation" description="Product evaluation notes" />
                  {expandedSections.evaluation && (
                    <div className="space-y-4 pl-2">
                      <FormField
                        control={form.control}
                        name="strengths"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Strengths</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="What are the key strengths of this product?" rows={3} data-testid="textarea-strengths" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="considerations"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Considerations</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="What should users consider or be aware of?" rows={3} data-testid="textarea-considerations" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <Separator />

                {/* Media */}
                <div>
                  <SectionHeader title="Media" section="media" description="Video uploads" />
                  {expandedSections.media && (
                    <div className="space-y-4 pl-2">
                      <FormField
                        control={form.control}
                        name="videoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Video URL</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter YouTube or Vimeo video URL" data-testid="input-video-url" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="videoType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Video Type</FormLabel>
                            <Select value={field.value || "__NONE__"} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger data-testid="select-video-type">
                                  <SelectValue placeholder="Select video type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="__NONE__">No video type</SelectItem>
                                {VIDEO_TYPES.map((type) => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-submit"
                  >
                    {(createMutation.isPending || updateMutation.isPending)
                      ? "Saving..."
                      : isEditMode
                      ? "Update Product"
                      : "Add Product"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/admin")}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
