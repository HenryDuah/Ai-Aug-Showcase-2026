import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Settings } from "lucide-react";

export default function Welcome() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-primary/5 via-background to-accent/10">
      <div className="fade-in flex flex-col items-center">
        {/* Sand Logo Placeholder */}
        <div className="mb-8 w-32 h-32 bg-primary/10 rounded-3xl flex items-center justify-center" data-testid="sand-logo">
          <Activity className="text-6xl text-primary" size={64} />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-primary font-serif" data-testid="title-welcome">
          Welcome to the
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-secondary" data-testid="title-lab-tour">
          AI Lab Guided Tour
        </h2>
        
        <p className="text-lg text-center text-muted-foreground max-w-md mb-12" data-testid="description-welcome">
          Discover innovative medical technologies transforming healthcare
        </p>

        <Button 
          onClick={() => setLocation("/overview")} 
          className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
          data-testid="button-begin-tour"
        >
          Begin Tour
          <ArrowRight className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          onClick={() => setLocation("/admin")}
          className="mt-8 text-muted-foreground hover:text-foreground"
          data-testid="button-admin"
        >
          <Settings className="w-4 h-4 mr-2" />
          Admin Panel
        </Button>
      </div>
    </div>
  );
}
