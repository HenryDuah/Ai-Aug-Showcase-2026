import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Settings } from "lucide-react";
import sandLogo from "@assets/Sand Tech_ Logo_Dark (1)_1760379109163.png";

export default function Welcome() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-primary/5 via-background to-accent/10">
      <div className="fade-in flex flex-col items-center">
        {/* Sand Logo */}
        <div className="mb-8" data-testid="sand-logo">
          <img src={sandLogo} alt="Sand Technologies Logo" className="h-24 md:h-32 w-auto" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary font-serif" data-testid="title-welcome">
          Welcome to the Innovative Healthcare Solutions Showcase
        </h1>
        
        <p className="text-lg md:text-xl text-center text-muted-foreground max-w-2xl mb-12" data-testid="description-welcome">
          Discover AI-enabled Medical Devices and Software Innovations for Frontline Healthcare workers
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
