import { AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-background p-8">
      <div className="w-full max-w-md text-center border border-border bg-card p-12 rounded-sm">
        <div className="flex items-center justify-center gap-4 mb-8">
          <AlertTriangle className="h-10 w-10 text-warning flex-shrink-0" />
        </div>
        <h1 className="text-display text-foreground mb-6">Page not found</h1>

        <p className="text-body text-muted-foreground mb-12">
          The requested screen does not exist. Verify the URL or return to the active tour.
        </p>
        
        <Link href="/">
          <Button className="w-full h-14 text-body rounded-sm">
            Return to start
          </Button>
        </Link>
      </div>
    </div>
  );
}
