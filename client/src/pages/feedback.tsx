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
        title: "Thank you",
        description: "Feedback submitted.",
      });
      window.scrollTo(0, 0);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit feedback.",
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
      <div className="min-h-[100dvh] bg-background">
        <div className="bg-primary text-primary-foreground px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-h1 mb-2" data-testid="title-thank-you">Thank you</h1>
            <p className="text-body opacity-90">Your feedback has been recorded</p>
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="border border-border shadow-1 rounded-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-success" size={32} />
                </div>
                <h2 className="text-h2 text-foreground mb-4" data-testid="thank-you-title">Submission complete</h2>
                <p className="text-body text-muted-foreground mb-8 max-w-md mx-auto" data-testid="thank-you-message">
                  We appreciate you taking the time to share your thoughts about the lab tour. Your input helps us improve the experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    variant="outline"
                    onClick={resetForm}
                    className="h-12 px-6 text-body"
                    data-testid="button-more-feedback"
                  >
                    Submit more feedback
                  </Button>
                  <Button 
                    onClick={() => setLocation("/")}
                    className="h-12 px-6 text-body"
                    data-testid="button-return-start"
                  >
                    Return to start
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background pb-20">
      <div className="fade-in">
        <div className="bg-primary text-primary-foreground px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start justify-between mb-8">
              <Button
                variant="ghost"
                onClick={() => setLocation("/overview")}
                className="text-primary-foreground hover:text-primary-foreground hover:bg-white/10 p-0 h-auto font-normal text-body"
                data-testid="button-back-overview"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to overview
              </Button>
              <img src={sandLogo} alt="Sand Technologies Logo" className="h-8 w-auto" data-testid="sand-logo-feedback" />
            </div>
            <h1 className="text-h1" data-testid="title-feedback">Share your thoughts</h1>
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <Card className="shadow-1 rounded-lg border-border">
                <CardContent className="p-6">
                  <h2 className="text-h2 text-foreground mb-6" data-testid="title-your-info">
                    Your information
                  </h2>
                  
                  <div className="space-y-5">
                    <FormField
                      control={form.control}
                      name="visitorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-body font-semibold">
                            Name <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your name"
                              className="h-12 text-body"
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
                          <FormLabel className="text-body font-semibold">
                            Company <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Your organization"
                              className="h-12 text-body"
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
                          <FormLabel className="text-body font-semibold">Email (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="your.email@example.com"
                              className="h-12 text-body"
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
                          <FormLabel className="text-body font-semibold">Phone number (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="tel"
                              placeholder="Enter your phone number"
                              className="h-12 text-body"
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

              <Card className="shadow-1 rounded-lg border-border">
                <CardContent className="p-6">
                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-h3 text-foreground mb-2 block">
                          Feedback
                        </FormLabel>
                        <p className="text-body text-muted-foreground mb-4">
                          Share your thoughts on the use of AI devices and solutions for frontline healthcare.
                        </p>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={6}
                            placeholder=""
                            className="resize-y text-body"
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

              <Button 
                type="submit" 
                className="w-full h-14 text-body font-semibold shadow-1"
                disabled={submitFeedback.isPending}
                data-testid="button-submit-feedback"
              >
                {submitFeedback.isPending ? (
                  "Submitting..."
                ) : (
                  <>
                    <NotebookPen className="w-5 h-5 mr-2" />
                    Submit feedback
                  </>
                )}
              </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
