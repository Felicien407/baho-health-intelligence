import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    // Mock login
    setTimeout(() => {
      if (email === "admin@healthdash.rw" && password === "admin123") {
        localStorage.setItem("healthdash_auth", JSON.stringify({ email, role: "admin" }));
        navigate("/dashboard");
      } else {
        toast({ title: "Invalid credentials", description: "Use admin@healthdash.rw / admin123", variant: "destructive" });
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-primary-foreground/20"
              style={{
                width: `${200 + i * 120}px`, height: `${200 + i * 120}px`,
                top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                animationDelay: `${i * 150}ms`,
              }}
            />
          ))}
        </div>
        <div className="relative z-10 text-center px-12 space-y-6 animate-fade-in-up">
          <div className="h-16 w-16 rounded-2xl bg-accent flex items-center justify-center mx-auto shadow-lg">
            <Activity className="h-8 w-8 text-accent-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground leading-tight">
            Health Dashboard<br />Rwanda
          </h1>
          <p className="text-primary-foreground/60 text-sm max-w-sm mx-auto leading-relaxed">
            National disease surveillance, outbreak prediction, and healthcare management platform.
          </p>
          <div className="flex justify-center gap-8 pt-4">
            {[
              { val: "1,247", lbl: "Hospitals" },
              { val: "30", lbl: "Districts" },
              { val: "13.2M", lbl: "Citizens" },
            ].map(s => (
              <div key={s.lbl} className="text-center">
                <p className="text-xl font-bold text-accent">{s.val}</p>
                <p className="text-[10px] uppercase tracking-widest text-primary-foreground/40">{s.lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-8 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">HealthDash</span>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your admin account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium">Email</Label>
              <Input id="email" type="email" placeholder="admin@healthdash.rw" value={email} onChange={e => setEmail(e.target.value)} className="h-10" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="h-10 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-[10px] text-muted-foreground">
            Demo: admin@healthdash.rw / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
