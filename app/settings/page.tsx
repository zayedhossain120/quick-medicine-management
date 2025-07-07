"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AppLayout from "@/components/layout/app-layout";
import { auth, User } from "@/lib/auth";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
const SettingsPage = () => {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  const loadUserData = async () => {
    try {
      setLoading(true);
      const currentUser = auth.getCurrentUser();
      if (currentUser) {
        // Fetch fresh user data from API
        const profileData = await authApi.getProfile();
        const updatedUser = { ...currentUser, ...profileData.profile };
        setUser(updatedUser);

        // Update localStorage with fresh data
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
      // Fallback to current user data if API fails
      const currentUser = auth.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentUser = auth.getCurrentUser();

    if (!currentUser || !auth.isAuthenticated()) {
      router.push("/");
      return;
    }

    // Check if user is admin, if not redirect to dashboard
    if (currentUser.role !== "admin") {
      toast.success("Only administrators can access the settings page.");
      router.push("/dashboard");
      return;
    }

    loadUserData();
  }, [router, toast]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setProfileLoading(true);
    try {
      await authApi.updateProfile({
        name: user.name,
        image: user.image,
        phone: user.phone,
        address: user.address,
      });

      toast.success("Your profile information has been updated successfully.");

      // Reload user data to reflect changes
      await loadUserData();
    } catch (error: any) {
      toast.error("Failed to update profile information");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any previous errors
    setPasswordError("");

    if (passwords.new !== passwords.confirm) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    if (passwords.new?.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await authApi.changeAdminPassword({
        currentPassword: passwords.current,
        newPassword: passwords.new,
        confirmPassword: passwords.confirm,
      });

      if (response?.data?.acknowledged) {
        toast.success(response?.message);
        setPasswords({ current: "", new: "", confirm: "" });
        setPasswordError("");
      }
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to change password. Please try again.";

      setPasswordError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto py-8 px-2 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Admin Info Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[clamp(18px,2.5vw,22px)]">
                Admin Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="flex flex-col items-center gap-2 pb-2">
                  <img
                    src={user?.image || "/placeholder-user.jpg"}
                    alt="Admin Avatar"
                    className="w-24 h-24 rounded-full object-cover border"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="image">Profile Image URL</Label>
                  <Input
                    id="image"
                    value={user?.image || ""}
                    onChange={(e) =>
                      setUser({ ...user, image: e.target.value } as User)
                    }
                    placeholder="Enter image URL"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={user?.name || ""}
                    onChange={(e) =>
                      setUser({ ...user, name: e.target.value } as User)
                    }
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={user?.phone || ""}
                    onChange={(e) =>
                      setUser({ ...user, phone: e.target.value } as User)
                    }
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={user?.address || ""}
                    onChange={(e) =>
                      setUser({ ...user, address: e.target.value } as User)
                    }
                    placeholder="Enter your address"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={profileLoading}
                >
                  {profileLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Change Password Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[clamp(18px,2.5vw,22px)]">
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              {passwordError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{passwordError}</p>
                </div>
              )}
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="current">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current"
                      type={showPassword.current ? "text" : "password"}
                      value={passwords.current}
                      onChange={(e) =>
                        setPasswords({ ...passwords, current: e.target.value })
                      }
                      required
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                      tabIndex={-1}
                      onClick={() =>
                        setShowPassword((p) => ({ ...p, current: !p.current }))
                      }
                    >
                      {showPassword.current ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new"
                      type={showPassword.new ? "text" : "password"}
                      value={passwords.new}
                      onChange={(e) =>
                        setPasswords({ ...passwords, new: e.target.value })
                      }
                      required
                      placeholder="Enter new password"
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                      tabIndex={-1}
                      onClick={() =>
                        setShowPassword((p) => ({ ...p, new: !p.new }))
                      }
                    >
                      {showPassword.new ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirm">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm"
                      type={showPassword.confirm ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={(e) =>
                        setPasswords({ ...passwords, confirm: e.target.value })
                      }
                      required
                      placeholder="Confirm new password"
                      className={
                        passwords.confirm && passwords.new !== passwords.confirm
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                      tabIndex={-1}
                      onClick={() =>
                        setShowPassword((p) => ({ ...p, confirm: !p.confirm }))
                      }
                    >
                      {showPassword.confirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwords.confirm && passwords.new !== passwords.confirm && (
                    <p className="text-xs text-red-500 mt-1">
                      Passwords do not match
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
