import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { signIn, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);

    if (error) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      return;
    }

    navigate(isAdmin ? "/hq/dashboard" : "/client/1");
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <nav className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
        <div className="text-sm tracking-[0.2em] font-black text-muted-foreground">GESTALT</div>
        <div className="flex gap-6 text-[11px] tracking-[0.18em]">
          {["HOME", "PRICING", "CASE STUDIES", "BOOK"].map((item) => (
            <span key={item} className="text-muted-foreground cursor-pointer hover:text-foreground">{item}</span>
          ))}
          <span className="font-medium">LOGIN</span>
          <span className="text-muted-foreground cursor-pointer hover:text-foreground">CONTACT</span>
        </div>
      </nav>

      <div className="text-center pt-12 pb-6 text-[11px] tracking-[0.18em]">
        <span className="text-muted-foreground/60">GESTALT</span>
        <span className="text-muted-foreground/60 mx-1.5">/</span>
        <span>SIGN-IN</span>
      </div>

      <form onSubmit={handleSubmit} className="max-w-sm mx-auto px-6 pb-16">
        <h1 className="text-center text-[22px] tracking-[0.12em] font-extrabold mb-10">LOGIN TO YOUR ACCOUNT</h1>

        <Input
          type="email"
          placeholder="EMAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-3 h-[42px] tracking-[0.18em] text-[11px]"
        />

        <div className="relative mb-7">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-[42px] tracking-[0.18em] text-[11px] pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <Button type="submit" disabled={submitting} className="w-full h-[42px] tracking-[0.2em] text-xs mb-4">
          {submitting ? "SIGNING IN..." : "SIGN-IN"}
        </Button>

        <div className="text-center text-[10px] tracking-[0.18em] text-muted-foreground mb-12 cursor-pointer hover:text-foreground">
          FORGOT PASSWORD?
        </div>

        <div className="text-center">
          <div className="text-sm text-foreground/80 mb-1.5">Don't have an account?</div>
          <div className="text-[10px] tracking-[0.18em]">
            <span className="text-muted-foreground">CREATE ONE </span>
            <Link to="/create-account" className="text-gold font-medium">'HERE'</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
