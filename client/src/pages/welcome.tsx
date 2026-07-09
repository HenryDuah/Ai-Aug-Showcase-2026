import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Settings } from "lucide-react";
import sandLogo from "@assets/Sand_Monochrome_Primary_Logo-03_1783596847037.png";

export default function Welcome() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-[100dvh] flex flex-col items-start justify-center px-8 md:px-16 bg-background">
      <div className="fade-in flex flex-col items-start w-full max-w-3xl">
        {/* Sand Logo */}
        <div className="mb-16" data-testid="sand-logo">
          <img src={sandLogo} alt="Sand Technologies Logo" className="h-10 w-auto" />
        </div>
        
        <h1 className="text-display mb-8" data-testid="title-welcome">
          Welcome to the Innovative Healthcare Solutions Showcase
        </h1>
        
        <p className="text-h3 text-muted-foreground mb-16 max-w-2xl" data-testid="description-welcome">
          Discover AI-enabled medical devices and software innovations for frontline healthcare workers.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <Button 
            onClick={() => setLocation("/overview")} 
            className="h-12 px-8 min-w-[200px] text-body rounded-sm shadow-1 hover:shadow-2 border border-primary/20"
            data-testid="button-begin-tour"
          >
            Begin tour
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <Button
            variant="ghost"
            onClick={() => setLocation("/admin")}
            className="h-12 text-muted-foreground hover:text-foreground text-body rounded-sm"
            data-testid="button-admin"
          >
            <Settings className="w-4 h-4 mr-2" />
            Admin panel
          </Button>
        </div>
      </div>
    </div>
  );
}
