import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Mail, Lock, User, AlertCircle } from "lucide-react";
import gestaltLogo from "@/assets/gestalt-logo.svg";

export default function HQLogin() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error } = await signIn(loginEmail, loginPassword);

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    // Navigation will be handled by the auth state change
    navigate("/hq/dashboard");
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(signupEmail, signupPassword, signupName);

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setSignupSuccess(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 hq-theme">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[hsl(var(--hq-accent))]/10 mb-4">
            <img
              src={gestaltLogo}
              alt="GESTALT"
              className="w-10 h-10"
              style={{ filter: "brightness(0) saturate(100%) invert(45%) sepia(50%) saturate(500%) hue-rotate(240deg)" }}
            />
          </div>
          <h1 className="text-2xl font-bold">GESTALT HQ</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Platform Administration Portal
          </p>
        </div>

        <Card className="rounded-none border-border">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-[hsl(var(--hq-accent))]" />
              <CardTitle>Admin Access</CardTitle>
            </div>
            <CardDescription>
              Sign in to access the administration portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {signupSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-500/10 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Account Created!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your account has been created. You can now sign in.
                </p>
                <p className="text-sm text-muted-foreground">
                  Note: Admin access must be granted by a super admin.
                </p>
                <Button
                  onClick={() => setSignupSuccess(false)}
                  className="mt-4 rounded-none bg-[hsl(var(--hq-accent))] hover:bg-[hsl(var(--hq-accent))]/90"
                >
                  Go to Login
                </Button>
              </div>
            ) : (
              <Tabs defaultValue="login">
                <TabsList className="w-full rounded-none mb-6">
                  <TabsTrigger value="login" className="flex-1 rounded-none">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="flex-1 rounded-none">
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label className="mb-1.5 block">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="admin@example.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="rounded-none pl-9"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="mb-1.5 block">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="rounded-none pl-9"
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full rounded-none bg-[hsl(var(--hq-accent))] hover:bg-[hsl(var(--hq-accent))]/90"
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                      <Label className="mb-1.5 block">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="John Doe"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          className="rounded-none pl-9"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="mb-1.5 block">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="admin@example.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="rounded-none pl-9"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="mb-1.5 block">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="rounded-none pl-9"
                          required
                          minLength={6}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Minimum 6 characters
                      </p>
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full rounded-none bg-[hsl(var(--hq-accent))] hover:bg-[hsl(var(--hq-accent))]/90"
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      After signup, an admin must grant you access to the HQ portal.
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Protected area. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
