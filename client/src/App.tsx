import { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation";
import { AuthModal } from "@/components/auth-modal";
import { LoadingOverlay } from "@/components/loading-overlay";
import { auth } from "@/lib/auth";

// Pages
import Dashboard from "@/pages/dashboard";
import Events from "@/pages/events";
import PlanTrip from "@/pages/plan-trip";
import Tracking from "@/pages/tracking";
import Auth from "@/pages/auth";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(auth.isAuthenticated());
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  if (isLoading) {
    return <LoadingOverlay isVisible={true} message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Redirect to="/auth" />;
  }

  return <>{children}</>;
}

function Router() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated());

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(auth.isAuthenticated());
    };
    
    // Check auth status on mount and after potential auth changes
    checkAuth();
    
    // Listen for storage changes (in case user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleAuthModalClose = () => {
    setAuthModalOpen(false);
    setIsAuthenticated(auth.isAuthenticated());
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onAuthModalOpen={() => setAuthModalOpen(true)} />
      
      <main>
        <Switch>
          {/* Public auth route */}
          <Route path="/auth" component={Auth} />
          
          {/* Protected routes */}
          <Route path="/">
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </Route>
          
          <Route path="/events">
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          </Route>
          
          <Route path="/plan-trip">
            <ProtectedRoute>
              <PlanTrip />
            </ProtectedRoute>
          </Route>
          
          <Route path="/tracking">
            <ProtectedRoute>
              <Tracking />
            </ProtectedRoute>
          </Route>
          
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </main>

      {/* Auth Modal */}
      <AuthModal 
        open={authModalOpen && !isAuthenticated} 
        onOpenChange={handleAuthModalClose} 
      />
      
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
