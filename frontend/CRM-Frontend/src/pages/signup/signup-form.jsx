import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

export function SignupForm(props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/auth/signup",
        {
          name: data.name,
          email: data.email,
          password: data.password,
        }
      );

      toast.success(res.data.message || "Account created successfully!", { position: "top-center" });   
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      {...props}
      className="w-full bg-slate-900/20 backdrop-blur-xl border border-white/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-4 sm:p-6 text-white"
    >
      <CardHeader className="space-y-1 text-center pb-4">
        <CardTitle className="text-xl font-bold uppercase tracking-widest text-white">
          Sign Up
        </CardTitle>
        <CardDescription className="text-white/60 text-xs">
          Create your account to access the system
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <FieldGroup className="flex flex-col gap-3.5 w-full">

            {/* Name */}
            <Field className="flex flex-col gap-1 w-full">
              <Input
                id="name"
                type="text"
                placeholder="username / full name"
                className="w-full h-12 px-5 bg-white/10 border-white/20 rounded-full text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:bg-slate-900/40 transition-colors text-sm"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
              />
              {errors.name && (
                <p className="text-xs font-semibold text-rose-300 px-4 mt-0.5">
                  {errors.name.message}
                </p>
              )}
            </Field>

            {/* Email */}
            <Field className="flex flex-col gap-1 w-full">
              <Input
                id="email"
                type="email"
                placeholder="email address"
                className="w-full h-12 px-5 bg-white/10 border-white/20 rounded-full text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:bg-slate-900/40 transition-colors text-sm"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                    message: "Please enter a valid email",
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs font-semibold text-rose-300 px-4 mt-0.5">
                  {errors.email.message}
                </p>
              )}
            </Field>

            {/* Password */}
            <Field className="flex flex-col gap-1 w-full">
              <Input
                id="password"
                type="password"
                placeholder="password"
                className="w-full h-12 px-5 bg-white/10 border-white/20 rounded-full text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:bg-slate-900/40 transition-colors text-sm"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-xs font-semibold text-rose-300 px-4 mt-0.5">
                  {errors.password.message}
                </p>
              )}
            </Field>

            {/* Confirm Password */}
            <Field className="flex flex-col gap-1 w-full">
              <Input
                id="confirmPassword"
                type="password"
                placeholder="confirm password"
                className="w-full h-12 px-5 bg-white/10 border-white/20 rounded-full text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:bg-slate-900/40 transition-colors text-sm"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-xs font-semibold text-rose-300 px-4 mt-0.5">
                  {errors.confirmPassword.message}
                </p>
              )}
            </Field>

            {/* Action Buttons Group */}
            <FieldGroup className="pt-2 flex flex-col gap-3 w-full">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-white hover:bg-white/90 text-slate-900 font-extrabold uppercase tracking-wider rounded-full shadow-md active:scale-[0.99] transition-all text-sm"
              >
                {loading ? (
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : "Sign Up"}
              </Button>

              <Button
                variant="outline"
                type="button"
                className="w-full h-12 bg-white/5 border-white/20 hover:bg-white/10 text-white rounded-full transition-all text-sm"
              >
                Sign up with Google
              </Button>

              <FieldDescription className="text-center text-xs text-white/70 mt-2">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-teal-300 hover:text-teal-200 hover:underline underline-offset-4 transition-colors ml-0.5"
                >
                  Sign in
                </Link>
              </FieldDescription>
            </FieldGroup>

          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}