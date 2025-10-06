import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, List, ChevronRight } from "lucide-react";
import sectionsData from "@/data/products.json";

const sectionColors = [
  "bg-primary text-primary-foreground",
  "bg-chart-2 text-white",
  "bg-chart-1 text-white", 
  "bg-chart-4 text-white",
  "bg-secondary text-secondary-foreground"
];

export default function Overview() {
  const [, setLocation] = useLocation();
  
  return (
    <div className="min-h-screen bg-background">
      <div className="fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-white mb-4 p-0 h-auto font-normal"
            data-testid="button-back-welcome"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-2" data-testid="title-lab-overview">AI Lab Overview</h1>
          <p className="text-white/90" data-testid="subtitle-explore-sections">Explore five innovative sections</p>
        </div>

        {/* Lab Introduction */}
        <div className="px-6 py-6 bg-card">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 text-foreground" data-testid="title-about-tour">About This Tour</h2>
              <p className="text-foreground/80 leading-relaxed mb-4" data-testid="description-lab-intro-1">
                Welcome to Sand's AI Lab, where cutting-edge medical innovations come together. 
                This interactive tour will guide you through five specialized sections, each showcasing 
                breakthrough technologies designed to improve healthcare outcomes.
              </p>
              <p className="text-foreground/80 leading-relaxed" data-testid="description-lab-intro-2">
                Take your time exploring each section, view product details, and listen to audio guides 
                to learn more about these transformative medical solutions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Floor Plan Visualization */}
        <div className="px-6 py-6">
          <h3 className="text-xl font-bold mb-6 text-foreground" data-testid="title-tour-sections">Tour Sections</h3>
          
          <Card className="mb-6">
            <CardContent className="pt-6">
              {/* Visual Floor Plan */}
              <div className="flex items-center gap-2 mb-6" data-testid="floor-plan">
                {sectionsData.sections.map((_, index) => (
                  <div key={index} className="flex-1 relative">
                    <div className={`floor-plan-section ${index === 0 ? 'active' : ''}`}>
                      {index === 0 && <div className="floor-plan-dot"></div>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Section Cards */}
              <div className="space-y-3">
                {sectionsData.sections.map((section, index) => (
                  <div 
                    key={section.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border-l-4 ${
                      index === 0 
                        ? 'bg-primary/5 border-primary' 
                        : 'bg-muted border-muted'
                    }`}
                    data-testid={`section-card-${section.id}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 ${sectionColors[index]}`}>
                      {section.id}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground" data-testid={`section-name-${section.id}`}>{section.name}</h4>
                      <p className="text-sm text-muted-foreground" data-testid={`section-description-${section.id}`}>{section.description}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 ${index === 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={() => setLocation("/section/1")} 
            className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-lg text-lg font-semibold shadow-md hover:shadow-lg transition-all"
            data-testid="button-start-section-1"
          >
            Start with Section 1: Maternal
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
