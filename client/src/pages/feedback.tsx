import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, NotebookPen, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertFeedbackSchema } from "@shared/schema";
import type { InsertFeedback } from "@shared/schema";
import { z } from "zod";
import sandLogo from "@assets/Sand Tech_ Logo_Light_1760649606645.png";

const feedbackFormSchema = insertFeedbackSchema;

type FeedbackForm = z.infer<typeof feedbackFormSchema>;

export default function Feedback() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showThankYou, setShowThankYou] = useState(false);

  const form = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      visitorName: "",
      visitorCompany: "",
      visitorEmail: "",
      visitorPhone: "",
      comments: "",
    },
  });

  const submitFeedback = useMutation({
    mutationFn: async (data: InsertFeedback) => {
      const response = await apiRequest("POST", "/api/feedback", data);
      return response.json();
    },
    onSuccess: () => {
      setShowThankYou(true);
      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted successfully.",
      });
      window.scrollTo(0, 0);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
      console.error("Feedback submission error:", error);
    },
  });

  const onSubmit = (data: FeedbackForm) => {
    submitFeedback.mutate(data);
  };

  const resetForm = () => {
    form.reset();
    setShowThankYou(false);
    window.scrollTo(0, 0);
  };

  if (showThankYou) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="title-thank-you">Thank You!</h1>
          <p className="text-white/90">Your feedback has been submitted</p>
        </div>

        <div className="px-6 py-6">
          <Card className="border-2 border-primary">
            <CardContent className="pt-8 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-primary" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3" data-testid="thank-you-title">Thank You!</h2>
              <p className="text-foreground/80 mb-6" data-testid="thank-you-message">
                Your feedback has been submitted successfully. We appreciate you taking the time 
                to share your thoughts about the AI Lab tour.
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="secondary"
                  onClick={resetForm}
                  className="flex-1"
                  data-testid="button-more-feedback"
                >
                  Submit More Feedback
                </Button>
                <Button 
                  onClick={() => setLocation("/")}
                  className="flex-1"
                  data-testid="button-return-start"
                >
                  Return to Start
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="fade-in">
        <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-8">
          <div className="flex items-start justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/overview")}
              className="text-white p-0 h-auto font-normal"
              data-testid="button-back-overview"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Overview
            </Button>
            <img src={sandLogo} alt="Sand Technologies Logo" className="h-12 w-auto" data-testid="sand-logo-feedback" />
          </div>
          <h1 className="text-3xl font-bold" data-testid="title-feedback">Share your Thoughts</h1>
        </div>

        <div className="px-6 py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardContent className="pt-5">
                  <h3 className="text-lg font-bold text-foreground mb-4" data-testid="title-your-info">
                    Your Information
                  </h3>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="visitorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-foreground">
                            Name <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your name"
                              data-testid="input-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="visitorCompany"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-foreground">
                            Company <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Your organization"
                              data-testid="input-company"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="visitorEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-foreground">Email (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="your.email@example.com"
                              data-testid="input-email"
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="visitorPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-foreground">Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="tel"
                              placeholder="Enter your phone number"
                              data-testid="input-phone"
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Comments */}
              <Card>
                <CardContent className="pt-5">
                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-bold text-foreground">
                          Share your thoughts on the use of AI devices and solutions for frontline healthcare
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={5}
                            placeholder=""
                            className="resize-none"
                            data-testid="textarea-comments"
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                disabled={submitFeedback.isPending}
                data-testid="button-submit-feedback"
              >
                {submitFeedback.isPending ? (
                  "Submitting..."
                ) : (
                  <>
                    <NotebookPen className="w-5 h-5 mr-2" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
