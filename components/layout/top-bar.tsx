"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  role: "admin" | "member";
}

interface TopBarProps {
  title: string;
  user: User;
}

export default function TopBar({ title, user }: TopBarProps) {
  const router = useRouter();
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 relative z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Space for mobile menu button */}
          <div className="w-10 md:w-0"></div>
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        </div>

        {user.role === "admin" ? (
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <div
                className="cursor-pointer flex items-center space-x-3"
                onMouseEnter={() => setPopoverOpen(true)}
                onMouseLeave={() => setPopoverOpen(false)}
              >
                <Avatar className="h-8 w-8 md:h-10 md:w-10">
                  <AvatarImage
                    src={user.image || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-32 p-2 flex justify-center"
              onMouseEnter={() => setPopoverOpen(true)}
              onMouseLeave={() => setPopoverOpen(false)}
            >
              <Link
                className="flex items-center gap-2 hover:bg-gray-100 rounded p-2 w-full"
                href="/settings"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </PopoverContent>
          </Popover>
        ) : (
          // For members, just show the user info without settings
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 md:h-10 md:w-10">
              <AvatarImage
                src={user.image || "/placeholder.svg"}
                alt={user.name}
              />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
