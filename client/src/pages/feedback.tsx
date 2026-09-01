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
import sandLogo from "@assets/Sand_Monochrome_Primary_Logo-03_1783596847037.png";

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
      standoutSolutions: "",
      contextOpportunity: "",
      realWorldChallenges: "",
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
      <div className="min-h-[100dvh] bg-background flex items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center">
          <div className="w-16 h-16 border border-border rounded-full flex items-center justify-center mx-auto mb-12">
            <CheckCircle className="text-foreground" size={24} />
          </div>
          <h1 className="text-display mb-6" data-testid="thank-you-title">Submission complete</h1>
          <p className="text-h3 text-muted-foreground mb-12 max-w-md mx-auto" data-testid="thank-you-message">
            We appreciate you taking the time to share your thoughts about the lab tour. Your input helps us improve the experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              variant="outline"
              onClick={resetForm}
              className="h-14 px-8 text-body rounded-sm border-border hover:bg-white/5"
              data-testid="button-more-feedback"
            >
              Submit more feedback
            </Button>
            <Button 
              onClick={() => setLocation("/")}
              className="h-14 px-8 text-body rounded-sm"
              data-testid="button-return-start"
            >
              Return to start
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background pb-32">
      <div className="fade-in">
        <div className="bg-secondary border-b border-border px-8 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start justify-between mb-16">
              <Button
                variant="ghost"
                onClick={() => setLocation("/overview")}
                className="text-foreground hover:bg-white/5 p-0 h-auto font-normal text-body"
                data-testid="button-back-overview"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to overview
              </Button>
              <img src={sandLogo} alt="Sand Technologies Logo" className="h-6 w-auto opacity-90" data-testid="sand-logo-feedback" />
            </div>
            <h1 className="text-display" data-testid="title-feedback">Share your thoughts</h1>
          </div>
        </div>

        <div className="px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
              
              <div className="space-y-8">
                <div className="border-b border-border pb-4">
                  <h2 className="text-h2 text-foreground" data-testid="title-your-info">
                    Your information
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="visitorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-small text-muted-foreground">
                          Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your name"
                            className="h-14 text-body bg-card border-border rounded-sm"
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
                        <FormLabel className="text-small text-muted-foreground">
                          Company <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Your organization"
                            className="h-14 text-body bg-card border-border rounded-sm"
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
                        <FormLabel className="text-small text-muted-foreground">Email (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="your.email@example.com"
                            className="h-14 text-body bg-card border-border rounded-sm"
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
                        <FormLabel className="text-small text-muted-foreground">Phone number (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            placeholder="Enter your phone number"
                            className="h-14 text-body bg-card border-border rounded-sm"
                            data-testid="input-phone"
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div className="border-b border-border pb-4">
                  <h2 className="text-h2 text-foreground block">
                    Feedback
                  </h2>
                  <p className="text-body text-muted-foreground mt-2">
                    Share your thoughts on the use of AI devices and solutions for frontline healthcare.
                  </p>
                </div>
                {([
                  ["standoutSolutions", "Which one or two solutions stood out most to you, and why?"],
                  ["contextOpportunity", "What use case, problem, or opportunity could these solutions address in your context?"],
                  ["realWorldChallenges", "What challenges or constraints might affect their use in real-world settings?"],
                  ["comments", "Any other comments"],
                ] as const).map(([name, label]) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-small text-muted-foreground">{label} (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={4}
                            className="resize-y text-body bg-card border-border rounded-sm p-4"
                            data-testid={`textarea-${name}`}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <Button 
                type="submit" 
                className="w-full md:w-auto min-w-[240px] h-14 text-body rounded-sm"
                disabled={submitFeedback.isPending}
                data-testid="button-submit-feedback"
              >
                {submitFeedback.isPending ? (
                  "Submitting..."
                ) : (
                  <>
                    <NotebookPen className="w-5 h-5 mr-3" />
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
