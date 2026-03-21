import Link from "next/link";
import { Home, Heart, ClipboardList, User } from "lucide-react";

export default function BottomNav() {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-50">
      {/* 
        This is a floating curved bottom nav.
        Using a soft orange gradient and thick top corners to emulate the "wavy" look naturally. 
      */}
      <div className="mx-auto w-full max-w-md h-[88px] bg-gradient-to-r from-timtour-primary to-timtour-secondary rounded-t-[40px] shadow-[0_-10px_40px_rgba(255,107,53,0.3)] flex items-center justify-between px-8 text-white relative">
        <Link href="/" className="flex flex-col items-center justify-center pt-2 gap-1 group">
          <div className="p-2 rounded-full bg-white/20 blur-0 transition-all group-hover:scale-110">
            <Home className="w-6 h-6 fill-white stroke-white" />
          </div>
        </Link>
        <Link href="/favorites" className="flex flex-col items-center justify-center p-2 pt-4 transition-all hover:-translate-y-1">
          <Heart className="w-6 h-6 stroke-white stroke-[2.5px]" />
        </Link>
        <Link href="/bookings" className="flex flex-col items-center justify-center p-2 pt-4 transition-all hover:-translate-y-1">
          <ClipboardList className="w-6 h-6 stroke-white stroke-[2.5px]" />
        </Link>
        <Link href="/profile" className="flex flex-col items-center justify-center p-2 pt-4 transition-all hover:-translate-y-1">
          <User className="w-6 h-6 stroke-white stroke-[2.5px]" />
        </Link>
      </div>
    </div>
  );
}
