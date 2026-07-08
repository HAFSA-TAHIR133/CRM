// SignupPage.jsx
import { GalleryVerticalEnd,Users } from "lucide-react";
import { SignupForm } from "@/pages/signup/signup-form";

export default function SignupPage() {
  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-cover bg-center relative antialiased"
      style={{ 
        // A rich, foggy teal mountain landscape to match your reference image perfectly
        backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80')` 
      }}
    >
      {/* Dark overlay mask to increase card visibility and contrast */}
      <div className="absolute inset-0 bg-teal-950/20 backdrop-brightness-[0.85]"></div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex w-full max-w-[420px] flex-col gap-4">

        {/* Logo / Brand */}
        <a href="/" className="flex items-center gap-2 self-center font-bold text-white tracking-wide text-sm drop-shadow-sm mb-2">
          <div className="flex size-7 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md border border-white/20 text-white">
            <Users className="size-4" />
          </div>

          {/* image icon */}
          {/* <img 
            src="/path-to-your-logo.png" 
            alt="Logo" 
            className="w-8 h-8 object-contain" 
          /> */}


          <span className="uppercase tracking-widest text-xl text-center">Welcome To CRM System</span>
        </a>

        {/* Signup Form */}
        <SignupForm />

      </div>
    </div>
  );
}