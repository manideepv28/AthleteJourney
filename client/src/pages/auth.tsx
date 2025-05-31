import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Terminal, Loader2, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";

export default function Auth() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    password: "",
    sport: ""
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (auth.isAuthenticated()) {
      setLocation("/");
    }
  }, [setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await auth.login(loginForm.email, loginForm.password);
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerForm.fullName || !registerForm.email || !registerForm.password || !registerForm.sport) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      await auth.register(registerForm);
      toast({
        title: "Account created!",
        description: "Welcome to AthleteTravel. Your account has been created successfully.",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      // Try to login with demo credentials or create a demo user
      try {
        await auth.login("demo@athletetravel.com", "demo123");
      } catch {
        // If demo user doesn't exist, create one
        await auth.register({
          fullName: "Demo Athlete",
          email: "demo@athletetravel.com",
          password: "demo123",
          sport: "Terminal"
        });
      }
      
      toast({
        title: "Demo access granted!",
        description: "You're now logged in as a demo user.",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Demo login failed",
        description: "Please try manual registration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero */}
      <div className="hidden lg:flex lg:flex-1 gradient-bg text-white">
        <div className="flex-1 flex flex-col justify-center px-12">
          <div className="max-w-md">
            <div className="flex items-center mb-8">
              <Terminal className="h-12 w-12 mr-4" />
              <h1 className="text-3xl font-bold">AthleteTravel</h1>
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Travel Smart.<br />Train Harder.
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Find athlete-friendly accommodations, training facilities, and nutrition options wherever your sport takes you.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <p className="text-white/80">Discover athletic events worldwide</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <p className="text-white/80">Plan comprehensive training trips</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <p className="text-white/80">Track performance and health metrics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full">
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Terminal className="h-8 w-8 text-athletic-orange mr-2" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AthleteTravel</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Your athletic travel companion
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {activeTab === "login" ? "Welcome Back" : "Join AthleteTravel"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger 
                    value="login" 
                    className="data-[state=active]:bg-athletic-orange data-[state=active]:text-white"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger 
                    value="register"
                    className="data-[state=active]:bg-athletic-orange data-[state=active]:text-white"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-athletic-orange hover:bg-athletic-orange/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Full Name</Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={registerForm.fullName}
                        onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-sport">Primary Sport</Label>
                      <Select 
                        value={registerForm.sport} 
                        onValueChange={(value) => setRegisterForm({ ...registerForm, sport: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your primary sport" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Terminal">Terminal</SelectItem>
                          <SelectItem value="Cycling">Cycling</SelectItem>
                          <SelectItem value="Swimming">Swimming</SelectItem>
                          <SelectItem value="Triathlon">Triathlon</SelectItem>
                          <SelectItem value="Tennis">Tennis</SelectItem>
                          <SelectItem value="Football">Football</SelectItem>
                          <SelectItem value="Basketball">Basketball</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Create a password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-athletic-orange hover:bg-athletic-orange/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Demo Access */}
              <div className="mt-6 pt-6 border-t">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                >
                  Try Demo Access
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                  Explore the platform without creating an account
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              By signing up, you agree to our{" "}
              <a href="#" className="text-athletic-orange hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-athletic-orange hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
