"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import TopBar from "./top-bar";
import { auth, type User } from "@/lib/auth";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const currentUser = auth.getCurrentUser();

    if (!currentUser || !auth.isAuthenticated()) {
      router.push("/");
      return;
    }

    setUser(currentUser);
    setLoading(false);
  }, [router]);

  const getPageTitle = () => {
    const path = pathname.split("/")[1];
    switch (path) {
      case "dashboard":
        return "Dashboard";
      case "members":
        return "Members";
      case "deposits":
        return "Deposits";
      case "withdrawals":
        return "Withdrawals";
      case "profits":
        return "Profit Sharing";
      case "ledger":
        return "All Transactions";
      case "profile":
        return "Profile";
      case "settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={user.role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          title={getPageTitle()}
          user={{
            ...user,
            id: (user as any)._id,
            image: user.image || "",
          }}
        />
        <main className="flex-1 overflow-auto p-4 md:p-6 pt-16 md:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}
