"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BookOpen,
  User,
  LogOut,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { auth } from "@/lib/auth";

interface SidebarProps {
  userRole: "admin" | "member";
}

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleLogout = () => {
    auth.logout();
    router.push("/");
  };

  const adminMenuItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/members", icon: Users, label: "Members" },
    { href: "/deposits", icon: TrendingUp, label: "Deposits" },
    { href: "/withdrawals", icon: TrendingDown, label: "Withdrawals" },
    { href: "/profits", icon: DollarSign, label: "Profit Sharing" },
    { href: "/ledger", icon: BookOpen, label: "All Transactions" },
  ];

  const memberMenuItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/profile/ledger", icon: BookOpen, label: "My Transactions" },
  ];

  const menuItems = userRole === "admin" ? adminMenuItems : memberMenuItems;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <Link href="/dashboard" className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">Quick Medicine</h1>
        <p className="text-sm text-gray-400 capitalize">{userRole} Portal</p>
      </Link>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
              onClick={() => setIsMobileOpen(false)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
          onClick={handleLogout}
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 top-2 z-50 md:hidden bg-white shadow-md hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 p-0 bg-gray-900 text-white border-gray-700"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="hidden md:flex w-64 bg-gray-900 text-white flex-col">
      <SidebarContent />
    </div>
  );
}
