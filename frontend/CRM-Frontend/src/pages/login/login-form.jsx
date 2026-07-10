import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/context/authContext";

export function LoginForm({ className, ...props }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { handleLogin } = useAuthContext();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/v1/auth/login", data);

      // 1. Core Token Management Strategy
      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken || "");

      // 2. Safe User Object Extraction Matrix
      const user = res.data.user || res.data.data?.user || {};
      
      const role = user.role || res.data.role || "user";
      const userId = user.id || user._id || res.data.userId || "";
      const name = user.name || res.data.name || "User";

      const userData = {
        id: userId,
        name: name,
        role: role,
        email: user.email || data.email,
        avatar: user.avatar || ""
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);
      if (user.avatar) localStorage.setItem("avatar", user.avatar);

      handleLogin(res.data.accessToken, userData);

      toast.success("Welcome back! Login successful.");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
      <Card className="w-full bg-slate-900/20 backdrop-blur-xl border border-white/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-4 sm:p-6 text-white">
        <CardHeader className="space-y-1 text-center pb-4">
          <CardTitle className="text-xl font-bold uppercase tracking-widest text-white">
            Log In
          </CardTitle>
          <CardDescription className="text-white/60 text-xs">
            Enter your credentials to access the CRM
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <FieldGroup className="flex flex-col gap-4 w-full">
              <Field className="flex flex-col gap-1 w-full">
                <Input
                  id="email"
                  type="email"
                  placeholder="username / email address"
                  className="w-full h-12 px-5 bg-white/10 border-white/20 rounded-full text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:bg-slate-900/40 transition-colors"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && <p className="text-xs text-rose-300 px-4 font-semibold mt-0.5">{errors.email.message}</p>}
              </Field>

              <Field className="flex flex-col gap-1 w-full">
                <Input
                  id="password"
                  type="password"
                  placeholder="password"
                  className="w-full h-12 px-5 bg-white/10 border-white/20 rounded-full text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:bg-slate-900/40 transition-colors"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && <p className="text-xs text-rose-300 px-4 font-semibold mt-0.5">{errors.password.message}</p>}
                <div className="text-right px-1">
                  <Link to="/forgot-password" className="text-xs text-teal-300 hover:text-teal-200 hover:underline font-semibold">
                    Forgot password?
                  </Link>
                </div>
              </Field>

              <Button 
                type="submit" 
                className="w-full h-12 bg-white hover:bg-white/90 text-slate-900 font-extrabold uppercase tracking-wider rounded-full shadow-md active:scale-[0.99] transition-all"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : "Log In"}
              </Button>

              <FieldDescription className="text-center text-xs text-white/70 mt-2">
                Don't have an account?{" "}
                <Link to="/signup" className="font-bold text-teal-300 hover:text-teal-200 hover:underline transition-colors ml-0.5">Sign up</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}