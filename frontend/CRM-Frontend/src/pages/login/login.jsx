import { Users } from "lucide-react";
import { LoginForm } from "@/pages/login/login-form";

export default function LoginPage() {
  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-cover bg-center relative antialiased"
      style={{ 
        // Using the same scenic nature backdrop image for a matching experience
        backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80')` 
      }}
    >
      {/* Ambient overlay tint mask */}
      <div className="absolute inset-0 bg-teal-950/20 backdrop-brightness-[0.85]"></div>

      {/* Changed max-w-sm to max-w-[420px] to prevent compression bugs */}
      <div className="relative z-10 flex w-full max-w-[420px] flex-col gap-4">
        
        {/* CRM System Branding Header with the recommended Users icon */}
        <a 
          href="/" 
          className="flex items-center gap-3 self-center font-bold text-white tracking-wide mb-2"
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-teal-300 shadow-sm">
            <Users className="size-5" />
          </div>
          <span className="uppercase tracking-widest text-xl text-white text-center">Welcome To CRM System</span>
        </a>

        {/* Login Form card wrapper */}
        <LoginForm />
      </div>
    </div>
  );
}