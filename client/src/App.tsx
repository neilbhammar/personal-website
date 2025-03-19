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
import UnbakedThoughtsRedirect from "@/pages/unbaked-thoughts-redirect";
import TestPage from "@/pages/test-page";
import SimpleThoughts from "@/pages/simple-thoughts";
import Thoughts from "@/pages/thoughts";

// Router component handles which page to show based on the current URL
function Router() {
  // Enable smooth scrolling when the page loads
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

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
      
      {/* Multiple variations of the problematic route */}
      <Route path="/unbaked-thoughts" component={UnbakedThoughts} />
      <Route path="/unbakedthoughts" component={UnbakedThoughts} /> {/* Try without hyphen */}
      <Route path="/unbaked" component={UnbakedThoughtsRedirect} />
      
      {/* Test route to see if it's path-specific */}
      <Route path="/test-page" component={TestPage} />
      <Route path="/simple-thoughts" component={SimpleThoughts} />
      <Route path="/thoughts" component={Thoughts} />
      
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
