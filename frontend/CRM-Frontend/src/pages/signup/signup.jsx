import { Users } from "lucide-react";
import { SignupForm } from "@/pages/signup/signup-form";

export default function SignupPage() {
  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-cover bg-center relative antialiased select-none"
      style={{ 
        backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80')` 
      }}
    >
      {/* Dark Ambient Overlay Tint Mask */}
      <div className="absolute inset-0 bg-teal-950/25 backdrop-brightness-[0.80] backdrop-blur-[2px]"></div>

      {/* Main Content Constraint Wrapper */}
      <div className="relative z-10 flex w-full max-w-[420px] flex-col gap-3">

        {/* System Branding Header */}
        <div className="flex flex-col items-center gap-2 self-center mb-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-teal-300 shadow-xl">
            <Users className="size-5 stroke-[2.5]" />
          </div>
          <span className="uppercase tracking-widest text-xs font-black text-white/90 text-center mt-1">
            CRM Portal Gateway
          </span>
        </div>

        {/* Signup Form */}
        <SignupForm />

      </div>
    </div>
  );
}