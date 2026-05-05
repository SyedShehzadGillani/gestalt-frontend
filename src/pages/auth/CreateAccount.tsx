import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const STRENGTH = {
  0: { label: "", color: "transparent", width: 0 },
  1: { label: "WEAK", color: "hsl(var(--destructive))", width: 33 },
  2: { label: "MEDIUM", color: "hsl(var(--gold))", width: 66 },
  3: { label: "STRONG", color: "hsl(142 70% 45%)", width: 100 },
} as const;

export default function CreateAccount() {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const passwordStrength = useMemo<0 | 1 | 2 | 3>(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password) && password.length >= 12) score++;
    return Math.min(score, 3) as 0 | 1 | 2 | 3;
  }, [password]);

  const strength = STRENGTH[passwordStrength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const fullName = `${firstName} ${lastName}`.trim();
    const { error } = await signUp(email, password, fullName);
    setSubmitting(false);
    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Account created", description: "Check your email to confirm." });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <nav className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
        <div className="text-sm tracking-[0.2em] font-black text-muted-foreground">GESTALT</div>
        <div className="flex gap-6 text-[11px] tracking-[0.18em]">
          {["HOME", "PRICING", "CASE STUDIES", "BOOK"].map((item) => (
            <span key={item} className="text-muted-foreground cursor-pointer hover:text-foreground">{item}</span>
          ))}
          <Link to="/login" className="text-foreground font-medium">LOGIN</Link>
          <span className="text-muted-foreground cursor-pointer hover:text-foreground">CONTACT</span>
        </div>
      </nav>

      <div className="text-center pt-12 pb-6 text-[11px] tracking-[0.18em]">
        <span className="text-muted-foreground/60">GESTALT</span>
        <span className="text-muted-foreground/60 mx-1.5">/</span>
        <span>CREATE ACCOUNT</span>
      </div>

      <form onSubmit={handleSubmit} className="max-w-sm mx-auto px-6 pb-16">
        <h1 className="text-center text-[22px] tracking-[0.12em] font-extrabold mb-10">CREATE AN ACCOUNT</h1>

        <div className="text-[11px] tracking-[0.18em] text-muted-foreground font-medium mb-2.5">NAME</div>

        <Input
          type="text"
          placeholder="FIRST NAME"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="mb-2.5 h-[42px] tracking-[0.18em] text-[11px]"
        />
        <Input
          type="text"
          placeholder="LAST NAME"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="mb-2.5 h-[42px] tracking-[0.18em] text-[11px]"
        />
        <Input
          type="email"
          placeholder="EMAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-2.5 h-[42px] tracking-[0.18em] text-[11px]"
        />
        <Input
          type="password"
          placeholder="PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-2.5 h-[42px] tracking-[0.18em] text-[11px]"
        />

        {password && (
          <>
            <div className="h-0.5 bg-border mb-1 -mt-1.5">
              <div
                className="h-0.5 transition-all duration-300"
                style={{ width: `${strength.width}%`, background: strength.color }}
              />
            </div>
            <div className="text-[10px] tracking-[0.18em] mb-3" style={{ color: strength.color }}>
              {strength.label}
            </div>
          </>
        )}

        <Input
          type="password"
          placeholder="CONFIRM PASSWORD"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="mb-8 h-[42px] tracking-[0.18em] text-[11px]"
        />

        <Button type="submit" disabled={submitting} className="w-full h-[42px] tracking-[0.2em] text-xs">
          {submitting ? "CREATING..." : "SET UP ACCOUNT"}
        </Button>

        <div className="text-center text-[10px] tracking-[0.18em] mt-6">
          <span className="text-muted-foreground">ALREADY HAVE AN ACCOUNT? </span>
          <Link to="/login" className="text-gold font-medium">SIGN IN</Link>
        </div>
      </form>
    </div>
  );
}
