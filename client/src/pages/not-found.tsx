import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md shadow-2 rounded-lg border-border">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <AlertTriangle className="h-8 w-8 text-warning flex-shrink-0" />
            <h1 className="text-h2 text-foreground">Page not found</h1>
          </div>

          <p className="text-body text-muted-foreground mb-8">
            The requested screen does not exist. Verify the URL or return to the active tour.
          </p>
          
          <Link href="/">
            <Button className="w-full h-12 text-body shadow-1">
              Return to start
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
