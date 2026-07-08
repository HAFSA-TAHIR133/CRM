import { useState } from "react"; 
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom"; 
import axios from "axios";
import { toast } from "sonner"; 

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({ className, ...props }) {
  const [loading, setLoading] = useState(false); // Track button loading states
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Connects  to  port
      const res = await axios.post("http://localhost:8000/api/v1/auth/login", data);

      // Save user session tracks to localStorage
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful!");
      navigate("/dashboard"); // Redirect upon successful authentication
    } catch (error) {
      // Pulls out custom error messages sent back by your error codes module
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
      {/* Frosted glass styling identical to the signup card */}
      <Card className="w-full bg-slate-900/20 backdrop-blur-xl border border-white/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-4 sm:p-6 text-white">
        <CardHeader className="space-y-1 text-center pb-4">
          <CardTitle className="text-xl font-bold uppercase tracking-widest text-white">
            Log In
          </CardTitle>
          <CardDescription className="text-white/60 text-xs">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <FieldGroup className="flex flex-col gap-4 w-full">

              {/* Email Field */}
              <Field className="flex flex-col gap-1 w-full">
                <Input
                  id="email"
                  type="email"
                  placeholder="username / email address"
                  className="w-full h-12 px-5 bg-white/10 border-white/20 rounded-full text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:bg-white/15 transition-all text-sm"
                  disabled={loading}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                      message: "Please enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-xs font-medium text-rose-300 px-3 mt-0.5">
                     {errors.email.message}
                  </p>
                )}
              </Field>

              {/* Password Field */}
              <Field className="flex flex-col gap-1 w-full">
                <div className="relative w-full">
                  <Input
                    id="password"
                    type="password"
                    placeholder="password"
                    className="w-full h-12 px-5 bg-white/10 border-white/20 rounded-full text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:bg-white/15 transition-all text-sm"
                    disabled={loading}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                  />
                </div>
                
                {/* Clean inline alternative for forgot password links in a glass box layout */}
                <div className="flex justify-end px-2 mt-2">
                  <a
                    href="#"
                    className="text-xs text-white/60 hover:text-white underline-offset-4 hover:underline transition-colors"
                  >
                    Forgot your password?
                  </a>
                </div>

                {errors.password && (
                  <p className="text-xs font-medium text-rose-300 px-3 mt-0.5">
                     {errors.password.message}
                  </p>
                )}
              </Field>

              {/* Action Buttons */}
              <FieldGroup className="pt-2 flex flex-col gap-3 w-full">
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-white hover:bg-white/90 text-slate-900 font-extrabold uppercase tracking-wider rounded-full transition-all text-sm shadow-md"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Log In"}
                </Button>

                <Button
                  variant="outline"
                  type="button"
                  className="w-full h-12 bg-white/5 border-white/20 hover:bg-white/10 text-white rounded-full transition-all text-sm"
                  disabled={loading}
                >
                  Login with Google
                </Button>

                <FieldDescription className="text-center text-xs text-white/70 mt-2">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-bold text-white hover:underline underline-offset-4"
                  >
                    Sign up
                  </Link>
                </FieldDescription>
              </FieldGroup>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}