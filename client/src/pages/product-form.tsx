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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Upload, X } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Product, InsertProduct } from "@shared/schema";
import type { UploadResult } from "@uppy/core";
import sectionsData from "@/data/products.json";
import { ObjectUploader } from "@/components/ObjectUploader";

const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  company: z.string().min(1, "Company name is required"),
  type: z.string().min(1, "Product type is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().url("Must be a valid URL"),
  sectionId: z.number().min(1).max(5),
  sectionName: z.string().min(1, "Section name is required"),
  features: z.string(),
  onDisplay: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof productFormSchema>;

export default function ProductForm() {
  const { productId } = useParams<{ productId?: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isEditMode = productId !== "new";
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string>("");

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    enabled: isEditMode,
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      company: "",
      type: "",
      description: "",
      image: "",
      sectionId: 1,
      sectionName: "",
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
        sectionId: product.sectionId,
        sectionName: product.sectionName,
        features: product.features?.join("\n") || "",
        onDisplay: product.onDisplay ?? true,
      });
      setUploadedAudioUrl(product.audioUrl || "");
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
    const productData = {
      ...data,
      audioUrl: uploadedAudioUrl || undefined,
      features: data.features.split("\n").filter(f => f.trim()),
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

  const handleUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const uploadURL = result.successful[0].uploadURL;
      if (uploadURL) {
        const objectPath = uploadURL.split("?")[0];
        const pathParts = objectPath.split("/");
        const objectId = pathParts[pathParts.length - 1];
        const audioPath = `/objects/uploads/${objectId}`;
        setUploadedAudioUrl(audioPath);
        toast({
          title: "Success",
          description: "Audio file uploaded successfully.",
        });
      }
    }
  };

  const handleRemoveAudio = () => {
    setUploadedAudioUrl("");
    toast({
      title: "Removed",
      description: "Audio file removed.",
    });
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
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-3xl mx-auto">
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
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
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter company name" data-testid="input-company" />
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
                      <FormLabel>Product Type</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter product type" data-testid="input-type" />
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
                      <FormLabel>Section</FormLabel>
                      <Select
                        value={field.value.toString()}
                        onValueChange={handleSectionChange}
                      >
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter product description"
                          rows={4}
                          data-testid="textarea-description"
                        />
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
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/image.jpg" data-testid="input-image" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Audio Guide (Optional)</label>
                  <div className="flex flex-col gap-2">
                    {uploadedAudioUrl ? (
                      <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <audio controls src={uploadedAudioUrl} className="flex-1 h-10" data-testid="audio-preview" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveAudio}
                          data-testid="button-remove-audio"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <ObjectUploader
                        maxNumberOfFiles={1}
                        maxFileSize={10485760}
                        allowedFileTypes={[".mp3", ".wav", ".ogg", ".m4a", "audio/*"]}
                        onGetUploadParameters={handleGetUploadParameters}
                        onComplete={handleUploadComplete}
                      >
                        <div className="flex items-center gap-2" data-testid="button-upload-audio">
                          <Upload className="w-4 h-4" />
                          <span>Upload Audio File</span>
                        </div>
                      </ObjectUploader>
                    )}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="features"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Features (one per line)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                          rows={5}
                          data-testid="textarea-features"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                      : "Save"}
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
