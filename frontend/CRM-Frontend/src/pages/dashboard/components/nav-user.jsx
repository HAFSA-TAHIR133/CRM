import { useRef, useState } from "react";
import { LogOut, Camera, ChevronDown, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthContext } from "@/context/authContext";
import api from "@/lib/axios";
import { toast } from "sonner";

const API_BASE = "http://localhost:8000";

export function getAvatarUrl(avatar) {
  if (!avatar) return "";
  if (avatar.startsWith("http")) return avatar;
  return `${API_BASE}${avatar}`;
}

export function NavUser({ user, onAvatarUpdate }) {
  const fileInputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { handleLogout } = useAuthContext();
  const userRole = (localStorage.getItem("role") || "user").toLowerCase();
  const avatarSrc = getAvatarUrl(user?.avatar || localStorage.getItem("avatar"));

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await api.put("/users/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = res.data.data;
      if (onAvatarUpdate) onAvatarUpdate(updatedUser);
      toast.success("Profile picture updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload picture");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onLogout = () => {
    setOpen(false);
    handleLogout();
    window.location.href = "/login";
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
      />

      <Button
        variant="ghost"
        onClick={() => setOpen(true)}
        className="h-10 px-2 gap-2 rounded-xl hover:bg-slate-50 flex items-center"
      >
        <Avatar className="h-8 w-8 rounded-lg border border-[#b2d8d8]">
          <AvatarImage src={avatarSrc} alt={user?.name} className="object-cover" />
          <AvatarFallback className="bg-[#008080] text-white font-bold uppercase text-xs rounded-lg">
            {user?.name?.slice(0, 2) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="hidden sm:flex flex-col items-start text-left leading-tight">
          <span className="text-sm font-semibold text-[#004c4c] truncate max-w-[120px]">{user?.name}</span>
          <span className="text-[11px] text-slate-400 capitalize">{userRole}</span>
        </div>
        <ChevronDown className="h-4 w-4 text-slate-400 hidden sm:block" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-sm rounded-2xl border border-slate-100 p-0 overflow-hidden shadow-2xl"
        >
          {/* Custom blurred backdrop is handled by DialogOverlay — strengthen blur */}
          <div className="relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="bg-gradient-to-br from-[#004c4c] to-[#008080] px-6 pt-8 pb-6 text-center">
              <Avatar className="h-20 w-20 mx-auto rounded-2xl border-4 border-white/30 shadow-lg">
                <AvatarImage src={avatarSrc} className="object-cover" />
                <AvatarFallback className="bg-[#006666] text-white font-bold text-xl rounded-2xl">
                  {user?.name?.slice(0, 2) || "U"}
                </AvatarFallback>
              </Avatar>
              <DialogHeader className="mt-4 space-y-1">
                <DialogTitle className="text-white text-lg font-bold">{user?.name}</DialogTitle>
                <p className="text-[#b2d8d8] text-sm">{user?.email}</p>
                <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-white/15 text-white text-xs font-semibold capitalize">
                  {userRole}
                </span>
              </DialogHeader>
            </div>

            <div className="p-4 space-y-2 bg-white">
              <Button
                variant="outline"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-11 rounded-xl border-slate-200 text-[#006666] font-semibold hover:bg-[#b2d8d8]/10 hover:border-[#b2d8d8] flex items-center justify-center gap-2"
              >
                <Camera className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload profile picture"}
              </Button>

              <Button
                variant="outline"
                onClick={onLogout}
                className="w-full h-11 rounded-xl border-red-100 text-red-600 font-semibold hover:bg-red-50 hover:border-red-200 flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
