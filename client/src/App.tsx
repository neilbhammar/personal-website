import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import UltraMinimal from "@/pages/UltraMinimal";
import Gallery from "@/pages/Gallery";
import { useEffect } from "react";

function Router() {
  // Implement smooth scrolling
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    // Clean up
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return (
    <Switch>
      <Route path="/" component={UltraMinimal} />
      <Route path="/gallery" component={Gallery} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
