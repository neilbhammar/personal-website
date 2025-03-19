// This is our main app component that controls what page to show based on the URL
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import UltraMinimal from "@/pages/UltraMinimal";
import Projects from "@/pages/projects";
import { useEffect } from "react";
import BlogPost from "@/pages/blog/index";
import UnbakedThoughts from "@/pages/unbaked-thoughts";

// Router component handles which page to show based on the current URL
function Router() {
  // Enable smooth scrolling when the page loads
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    
    // Add debug logging
    console.log('Current path:', window.location.pathname);

    // Clean up the smooth scrolling when component unmounts
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return (
    <Switch>
      {/* Show the UltraMinimal page when user visits the home page "/" */}
      <Route path="/" component={UltraMinimal} />
      <Route path="/projects" component={Projects} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route 
        path="/unbaked-thoughts" 
        component={() => {
          console.log('UnbakedThoughts route matched');
          return <UnbakedThoughts />;
        }} 
      />
      {/* Show the NotFound page for any other URL */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Main App component that wraps everything with necessary providers
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      {/* Toaster shows pop-up notifications */}
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
