import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Settings } from "lucide-react";
import sandLogo from "@assets/Sand Tech_ Logo_Dark (1)_1760379109163.png";

export default function Welcome() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 bg-background">
      <div className="fade-in flex flex-col items-center w-full max-w-2xl text-center">
        {/* Sand Logo */}
        <div className="mb-12" data-testid="sand-logo">
          <img src={sandLogo} alt="Sand Technologies Logo" className="h-16 w-auto" />
        </div>
        
        <h1 className="text-display mb-6" data-testid="title-welcome">
          Welcome to the Innovative Healthcare Solutions Showcase
        </h1>
        
        <p className="text-h3 text-muted-foreground mb-12" data-testid="description-welcome">
          Discover AI-enabled medical devices and software innovations for frontline healthcare workers.
        </p>

        <Button 
          onClick={() => setLocation("/overview")} 
          className="w-full sm:w-auto h-12 px-8 min-w-[200px] text-body rounded-md shadow-1 hover:shadow-2"
          data-testid="button-begin-tour"
        >
          Begin tour
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        <Button
          variant="ghost"
          onClick={() => setLocation("/admin")}
          className="mt-8 text-muted-foreground hover:text-foreground text-body"
          data-testid="button-admin"
        >
          <Settings className="w-4 h-4 mr-2" />
          Admin panel
        </Button>
      </div>
    </div>
  );
}
