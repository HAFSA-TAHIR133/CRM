import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetLink("");

    try {
      const res = await axios.post("http://localhost:8000/api/v1/auth/forgot-password", { email });
      toast.success(res.data.message || "Reset link sent");

      if (res.data.resetUrl) {
        setResetLink(res.data.resetUrl);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-cover bg-center relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80')`
      }}
    >
      <div className="absolute inset-0 bg-teal-950/25 backdrop-brightness-[0.80] backdrop-blur-[2px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-teal-300">
            <Users className="size-5" />
          </div>
          <span className="uppercase tracking-widest text-xs font-black text-white/90">Reset Password</span>
        </div>

        <Card className="bg-slate-900/20 backdrop-blur-xl border border-white/20 rounded-[2rem] text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold">Forgot Password</CardTitle>
            <CardDescription className="text-white/60 text-xs">
              Enter your email and we'll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 px-5 bg-white/10 border-white/20 rounded-full text-white placeholder:text-white/40"
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-white hover:bg-white/90 text-slate-900 font-bold rounded-full"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            {resetLink && (
              <div className="mt-4 p-3 bg-white/10 rounded-xl text-xs text-white/80">
                <p className="mb-2">Use this link to reset your password:</p>
                <Link to={resetLink} className="text-teal-300 hover:underline break-all font-semibold">
                  {resetLink}
                </Link>
              </div>
            )}

            <p className="text-center text-xs text-white/70 mt-4">
              <Link to="/login" className="text-teal-300 hover:underline font-semibold">Back to login</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
