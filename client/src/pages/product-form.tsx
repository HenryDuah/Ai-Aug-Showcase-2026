import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Upload } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Product, InsertProduct } from "@shared/schema";
import type { UploadResult } from "@uppy/core";
import sectionsData from "@/data/products.json";
import { ObjectUploader } from "@/components/ObjectUploader";

const createProductFormSchema = (isEditMode: boolean) => z.object({
  name: z.string().min(1, "Product name is required"),
  company: z.string().min(1, "Company name is required"),
  type: z.string().min(1, "Product type is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().url("Must be a valid URL"),
  videoUrl: z.string().optional(),
  videoType: z.string().optional(),
  brochureUrl: z.string().optional(),
  website: z.string().optional(),
  theImpact: z.string().min(1, "The Impact is required"),
  sectionId: z.number().min(1).max(5),
  sectionName: z.string().min(1, "Section name is required"),
  features: z.string(),
  onDisplay: z.boolean().optional(),
});

type ProductFormData = z.infer<ReturnType<typeof createProductFormSchema>>;

export default function ProductForm() {
  const { productId } = useParams<{ productId?: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isEditMode = !!productId && productId !== "new";

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    enabled: isEditMode,
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(createProductFormSchema(isEditMode)),
    defaultValues: {
      name: "",
      company: "",
      type: "",
      description: "",
      image: "",
      videoUrl: "",
      videoType: "",
      brochureUrl: "",
      website: "",
      theImpact: "",
      sectionId: 1,
      sectionName: sectionsData.sections[0].name,
      features: "",
      onDisplay: true,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        company: product.company,
        type: product.type,
        description: product.description,
        image: product.image,
        videoUrl: product.videoUrl || "",
        videoType: product.videoType || "",
        brochureUrl: product.brochureUrl || "",
        website: product.website || "",
        theImpact: product.theImpact || "",
        sectionId: product.sectionId,
        sectionName: product.sectionName,
        features: product.features?.join("\n") || "",
        onDisplay: product.onDisplay ?? true,
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
        description: "Product added.",
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
        description: "Product updated.",
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
        } catch (error) {
          toast({
            title: "Error",
            description: "Upload failed.",
            variant: "destructive",
          });
        }
      }
    }
  };

  const handleBrochureUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const uploadURL = result.successful[0].uploadURL;
      if (uploadURL) {
        try {
          const response = await apiRequest("POST", "/api/objects/normalize", { 
            uploadURL: uploadURL.split("?")[0] 
          });
          const data = await response.json();
          form.setValue("brochureUrl", data.normalizedPath);
        } catch (error) {
          toast({
            title: "Error",
            description: "Upload failed.",
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

  if (isLoading && isEditMode) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-body">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background pb-20">
      <div className="bg-muted px-6 py-6 border-b border-border mb-8">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setLocation("/admin")}
            className="text-muted-foreground hover:text-foreground p-0 h-auto font-normal text-body mb-4"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to admin
          </Button>
          <h1 className="text-h1 text-foreground">
            {isEditMode ? "Edit product" : "Add product"}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6">
        <Card className="shadow-1 rounded-lg border-border">
          <CardContent className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-body font-semibold">Product name</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-10 text-body" data-testid="input-name" />
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
                        <FormLabel className="text-body font-semibold">Company</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-10 text-body" data-testid="input-company" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-body font-semibold">Product type</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-10 text-body" data-testid="input-type" />
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
                        <FormLabel className="text-body font-semibold">Section</FormLabel>
                        <Select
                          value={field.value.toString()}
                          onValueChange={handleSectionChange}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10 text-body" data-testid="select-section">
                              <SelectValue />
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
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-body font-semibold">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={4}
                          className="resize-y text-body"
                          data-testid="textarea-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="theImpact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-body font-semibold">The impact</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={3}
                          className="resize-y text-body"
                          data-testid="textarea-the-impact"
                        />
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
                      <FormLabel className="text-body font-semibold">Features (one per line)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={4}
                          className="resize-y text-body"
                          data-testid="textarea-features"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-body font-semibold">Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-10 text-body" data-testid="input-image" />
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
                        <FormLabel className="text-body font-semibold">Website (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-10 text-body" data-testid="input-website" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-body font-semibold">Video URL (Optional)</FormLabel>
                        <FormControl>
                          <div className="flex gap-4 items-center">
                            <Input 
                              {...field} 
                              className="h-10 text-body flex-1"
                              data-testid="input-video-url"
                            />
                            <ObjectUploader
                              maxNumberOfFiles={1}
                              allowedFileTypes={["video/*"]}
                              onGetUploadParameters={handleGetUploadParameters}
                              onComplete={handleUploadComplete}
                              buttonVariant="outline"
                            >
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload video
                              </>
                            </ObjectUploader>
                          </div>
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
                        <FormLabel className="text-body font-semibold">Video type (Optional)</FormLabel>
                        <Select
                          value={field.value || "__NONE__"}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10 text-body" data-testid="select-video-type">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="__NONE__">None</SelectItem>
                            <SelectItem value="Overview Video">Overview</SelectItem>
                            <SelectItem value="Demo Video">Demo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="brochureUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-body font-semibold">Product brochure (Optional)</FormLabel>
                      <FormControl>
                        <div className="flex gap-4 items-center">
                          <Input 
                            {...field} 
                            readOnly
                            className="h-10 text-body bg-muted flex-1"
                            data-testid="input-brochure-url"
                          />
                          <ObjectUploader
                            maxNumberOfFiles={1}
                            allowedFileTypes={[".pdf", "application/pdf"]}
                            onGetUploadParameters={handleGetUploadParameters}
                            onComplete={handleBrochureUploadComplete}
                            buttonVariant="outline"
                          >
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Upload PDF
                            </>
                          </ObjectUploader>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 pt-4 border-t border-border mt-8">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setLocation("/admin")}
                    className="h-12 px-6 text-body"
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="h-12 px-8 text-body shadow-1"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-submit"
                  >
                    {(createMutation.isPending || updateMutation.isPending)
                      ? "Saving..."
                      : isEditMode
                      ? "Save changes"
                      : "Add product"}
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
