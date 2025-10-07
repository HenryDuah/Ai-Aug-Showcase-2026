import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import Welcome from "@/pages/welcome";
import Overview from "@/pages/overview";
import Section from "@/pages/section";
import ProductDetail from "@/pages/product-detail";
import Feedback from "@/pages/feedback";
import Login from "@/pages/login";
import Admin from "@/pages/admin";
import Analytics from "@/pages/analytics";
import QRCodes from "@/pages/qr-codes";
import ProductForm from "@/pages/product-form";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/overview" component={Overview} />
      <Route path="/section/:sectionId" component={Section} />
      <Route path="/product/:productId" component={ProductDetail} />
      <Route path="/feedback" component={Feedback} />
      <Route path="/login" component={Login} />
      <ProtectedRoute path="/admin" component={Admin} />
      <ProtectedRoute path="/admin/products/:productId/edit" component={ProductForm} />
      <ProtectedRoute path="/admin/products/new" component={ProductForm} />
      <ProtectedRoute path="/analytics" component={Analytics} />
      <ProtectedRoute path="/qr-codes" component={QRCodes} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
