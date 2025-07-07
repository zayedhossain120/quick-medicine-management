"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  CreditCard,
  Lock,
  Loader2,
} from "lucide-react";
import { auth } from "@/lib/auth";
import {
  membersApi,
  dashboardApi,
  depositsApi,
  withdrawalsApi,
  authApi,
} from "@/lib/api";
import toast from "react-hot-toast";

// Edit Profile Modal Component
const EditProfileModal = ({
  isOpen,
  onClose,
  editFormData,
  setEditFormData,
  handleUpdateProfile,
  updateLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  editFormData: any;
  setEditFormData: (data: any) => void;
  handleUpdateProfile: (e?: React.FormEvent) => void;
  updateLoading: boolean;
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
      </DialogHeader>
      <form className="space-y-4" onSubmit={handleUpdateProfile}>
        <div>
          <Label htmlFor="editImage">Profile Image URL</Label>
          <Input
            id="editImage"
            placeholder="Enter image URL"
            value={editFormData.image}
            onChange={(e) =>
              setEditFormData((prev: any) => ({
                ...prev,
                image: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <Label htmlFor="editName">Full Name</Label>
          <Input
            id="editName"
            value={editFormData.name}
            onChange={(e) =>
              setEditFormData((prev: any) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <Label htmlFor="editEmail">Email</Label>
          <Input
            id="editEmail"
            type="email"
            value={editFormData.email}
            onChange={(e) =>
              setEditFormData((prev: any) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <Label htmlFor="editPhone">Phone</Label>
          <Input
            id="editPhone"
            value={editFormData.phone}
            onChange={(e) =>
              setEditFormData((prev: any) => ({
                ...prev,
                phone: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <Label htmlFor="editDob">Date of Birth</Label>
          <Input
            id="editDob"
            type="date"
            value={editFormData.dob}
            onChange={(e) =>
              setEditFormData((prev: any) => ({ ...prev, dob: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="editOccupation">Occupation</Label>
          <Input
            id="editOccupation"
            value={editFormData.occupation}
            onChange={(e) =>
              setEditFormData((prev: any) => ({
                ...prev,
                occupation: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <Label htmlFor="editAddress">Address</Label>
          <Textarea
            id="editAddress"
            value={editFormData.address}
            onChange={(e) =>
              setEditFormData((prev: any) => ({
                ...prev,
                address: e.target.value,
              }))
            }
          />
        </div>
        <Button className="w-full" type="submit" disabled={updateLoading}>
          {updateLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Updating Profile...
            </>
          ) : (
            "Update Profile"
          )}
        </Button>
      </form>
    </DialogContent>
  </Dialog>
);

// Bank Details Modal Component
const BankDetailsModal = ({
  isOpen,
  onClose,
  bankFormData,
  setBankFormData,
  handleUpdateBankDetails,
  updateLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  bankFormData: any;
  setBankFormData: (data: any) => void;
  handleUpdateBankDetails: (e?: React.FormEvent) => void;
  updateLoading: boolean;
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Update Bank Details</DialogTitle>
      </DialogHeader>
      <form className="space-y-4" onSubmit={handleUpdateBankDetails}>
        <div>
          <Label htmlFor="bankMethod">Payment Method</Label>
          <Select
            value={bankFormData.method}
            onValueChange={(value) =>
              setBankFormData((prev: any) => ({ ...prev, method: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bkash">bKash</SelectItem>
              <SelectItem value="nagad">Nagad</SelectItem>
              <SelectItem value="rocket">Rocket</SelectItem>
              <SelectItem value="bank">Bank Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="bankAccountName">Account Name</Label>
          <Input
            id="bankAccountName"
            placeholder="Enter account name"
            value={bankFormData.accountName}
            onChange={(e) =>
              setBankFormData((prev: any) => ({
                ...prev,
                accountName: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <Label htmlFor="bankAccountNumber">Account Number</Label>
          <Input
            id="bankAccountNumber"
            placeholder="Enter account number"
            value={bankFormData.accountNumber}
            onChange={(e) =>
              setBankFormData((prev: any) => ({
                ...prev,
                accountNumber: e.target.value,
              }))
            }
          />
        </div>

        {bankFormData.method === "bank" && (
          <>
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                placeholder="Enter bank name"
                value={bankFormData.bankName}
                onChange={(e) =>
                  setBankFormData((prev: any) => ({
                    ...prev,
                    bankName: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="bankBranch">Branch</Label>
              <Input
                id="bankBranch"
                placeholder="Enter branch name"
                value={bankFormData.branch}
                onChange={(e) =>
                  setBankFormData((prev: any) => ({
                    ...prev,
                    branch: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="bankRoutingNumber">Routing Number</Label>
              <Input
                id="bankRoutingNumber"
                placeholder="Enter routing number"
                value={bankFormData.routingNumber}
                onChange={(e) =>
                  setBankFormData((prev: any) => ({
                    ...prev,
                    routingNumber: e.target.value,
                  }))
                }
              />
            </div>
          </>
        )}

        <Button className="w-full" type="submit" disabled={updateLoading}>
          {updateLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Updating Bank Details...
            </>
          ) : (
            "Update Bank Details"
          )}
        </Button>
      </form>
    </DialogContent>
  </Dialog>
);

// Deposit Request Modal Component
const DepositRequestModal = ({
  isOpen,
  onClose,
  depositFormData,
  setDepositFormData,
  handleDepositRequest,
  requestLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  depositFormData: any;
  setDepositFormData: (data: any) => void;
  handleDepositRequest: (e?: React.FormEvent) => void;
  requestLoading: boolean;
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Request Deposit</DialogTitle>
      </DialogHeader>
      <form className="space-y-4" onSubmit={handleDepositRequest}>
        <div>
          <Label htmlFor="depositAmount">Amount</Label>
          <Input
            id="depositAmount"
            type="number"
            placeholder="Enter amount to deposit"
            value={depositFormData.amount}
            onChange={(e) =>
              setDepositFormData((prev: any) => ({
                ...prev,
                amount: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <Label htmlFor="depositMethod">Payment Method</Label>
          <Select
            value={depositFormData.method}
            onValueChange={(value) =>
              setDepositFormData((prev: any) => ({ ...prev, method: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bkash">bKash</SelectItem>
              <SelectItem value="nagad">Nagad</SelectItem>
              <SelectItem value="rocket">Rocket</SelectItem>
              <SelectItem value="bank">Bank Transfer</SelectItem>

              <SelectItem value="cash">Cash</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="depositNote">Note (Optional)</Label>
          <Textarea
            id="depositNote"
            placeholder="Add any notes..."
            value={depositFormData.note}
            onChange={(e) =>
              setDepositFormData((prev: any) => ({
                ...prev,
                note: e.target.value,
              }))
            }
          />
        </div>
        <Button className="w-full" type="submit" disabled={requestLoading}>
          {requestLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting Deposit...
            </>
          ) : (
            "Submit Deposit Request"
          )}
        </Button>
      </form>
    </DialogContent>
  </Dialog>
);

// Withdraw Request Modal Component
const WithdrawRequestModal = ({
  isOpen,
  onClose,
  withdrawFormData,
  setWithdrawFormData,
  handleWithdrawRequest,
  requestLoading,
  balance,
}: {
  isOpen: boolean;
  onClose: () => void;
  withdrawFormData: any;
  setWithdrawFormData: (data: any) => void;
  handleWithdrawRequest: (e?: React.FormEvent) => void;
  requestLoading: boolean;
  balance: number;
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Request Withdrawal</DialogTitle>
      </DialogHeader>
      <form className="space-y-4" onSubmit={handleWithdrawRequest}>
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Available Balance:{" "}
            <span className="font-semibold">৳{balance.toLocaleString()}</span>
          </p>
        </div>
        <div>
          <Label htmlFor="withdrawAmount">Amount</Label>
          <Input
            id="withdrawAmount"
            type="number"
            placeholder="Enter amount to withdraw"
            value={withdrawFormData.amount}
            onChange={(e) =>
              setWithdrawFormData((prev: any) => ({
                ...prev,
                amount: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <Label htmlFor="withdrawMethod">Payment Method</Label>
          <Select
            value={withdrawFormData.method}
            onValueChange={(value) =>
              setWithdrawFormData((prev: any) => ({ ...prev, method: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bkash">bKash</SelectItem>
              <SelectItem value="nagad">Nagad</SelectItem>
              <SelectItem value="rocket">Rocket</SelectItem>
              <SelectItem value="bank">Bank Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="withdrawNote">Reason (Optional)</Label>
          <Textarea
            id="withdrawNote"
            placeholder="Reason for withdrawal..."
            value={withdrawFormData.note}
            onChange={(e) =>
              setWithdrawFormData((prev: any) => ({
                ...prev,
                note: e.target.value,
              }))
            }
          />
        </div>
        <Button className="w-full" type="submit" disabled={requestLoading}>
          {requestLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting Withdrawal...
            </>
          ) : (
            "Submit Withdrawal Request"
          )}
        </Button>
      </form>
    </DialogContent>
  </Dialog>
);

// Change Password Modal Component
const ChangePasswordModal = ({
  isOpen,
  onClose,
  passwordFormData,
  setPasswordFormData,
  handleChangePassword,
  passwordLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  passwordFormData: any;
  setPasswordFormData: (data: any) => void;
  handleChangePassword: (e?: React.FormEvent) => void;
  passwordLoading: boolean;
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Change Password</DialogTitle>
      </DialogHeader>
      <form className="space-y-4" onSubmit={handleChangePassword}>
        <div>
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input
            id="currentPassword"
            type="password"
            placeholder="Enter current password"
            value={passwordFormData.currentPassword}
            onChange={(e) =>
              setPasswordFormData((prev: any) => ({
                ...prev,
                currentPassword: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            value={passwordFormData.newPassword}
            onChange={(e) =>
              setPasswordFormData((prev: any) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={passwordFormData.confirmPassword}
            onChange={(e) =>
              setPasswordFormData((prev: any) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
          />
        </div>
        <Button className="w-full" type="submit" disabled={passwordLoading}>
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
    </DialogContent>
  </Dialog>
);

export default function ProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [memberData, setMemberData] = useState<any>(null);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Form states
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    occupation: "",
    address: "",
    image: "",
  });

  const [bankFormData, setBankFormData] = useState({
    method: "",
    accountName: "",
    accountNumber: "",
    bankName: "",
    branch: "",
    routingNumber: "",
  });

  const [depositFormData, setDepositFormData] = useState({
    amount: "",
    method: "",
    note: "",
  });

  const [withdrawFormData, setWithdrawFormData] = useState({
    amount: "",
    method: "",
    note: "",
  });

  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Reset form data functions
  const resetEditForm = () => {
    if (memberData) {
      setEditFormData({
        name: memberData.name || "",
        email: memberData.email || "",
        phone: memberData.phone || "",
        dob: memberData.dob || "",
        occupation: memberData.occupation || "",
        address: memberData.address || "",
        image: memberData.image || "",
      });
    }
  };

  const resetBankForm = () => {
    if (memberData) {
      setBankFormData({
        method: memberData.bankDetails?.method || "",
        accountName: memberData.bankDetails?.accountName || "",
        accountNumber: memberData.bankDetails?.accountNumber || "",
        bankName: memberData.bankDetails?.bankName || "",
        branch: memberData.bankDetails?.branch || "",
        routingNumber: memberData.bankDetails?.routingNumber || "",
      });
    }
  };

  const resetDepositForm = () => {
    setDepositFormData({ amount: "", method: "", note: "" });
  };

  const resetWithdrawForm = () => {
    setWithdrawFormData({ amount: "", method: "", note: "" });
  };

  const resetPasswordForm = () => {
    setPasswordFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // Modal open handlers with form reset
  const openEditModal = () => {
    resetEditForm();
    setIsEditModalOpen(true);
  };

  const openBankModal = () => {
    resetBankForm();
    setIsBankModalOpen(true);
  };

  const openDepositModal = () => {
    resetDepositForm();
    setIsDepositModalOpen(true);
  };

  const openWithdrawModal = () => {
    resetWithdrawForm();
    setIsWithdrawModalOpen(true);
  };

  const openPasswordModal = () => {
    resetPasswordForm();
    setIsPasswordModalOpen(true);
  };

  // Modal close handlers
  const closeEditModal = () => setIsEditModalOpen(false);
  const closeBankModal = () => setIsBankModalOpen(false);
  const closeDepositModal = () => setIsDepositModalOpen(false);
  const closeWithdrawModal = () => setIsWithdrawModalOpen(false);
  const closePasswordModal = () => setIsPasswordModalOpen(false);

  useEffect(() => {
    const user = auth.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      loadProfileData(user._id);
    }
  }, []);

  const loadProfileData = async (memberId: string) => {
    try {
      setLoading(true);
      const [memberResponse, statsResponse] = await Promise.all([
        membersApi.getById(memberId),
        dashboardApi.getStats(memberId),
      ]);

      setMemberData(memberResponse.member);
      setStats(statsResponse);

      // Set form data
      const member = memberResponse.member;
      setEditFormData({
        name: member.name || "",
        email: member.email || "",
        phone: member.phone || "",
        dob: member.dob || "",
        occupation: member.occupation || "",
        address: member.address || "",
        image: member.image || "",
      });

      setBankFormData({
        method: member.bankDetails?.method || "",
        accountName: member.bankDetails?.accountName || "",
        accountNumber: member.bankDetails?.accountNumber || "",
        bankName: member.bankDetails?.bankName || "",
        branch: member.bankDetails?.branch || "",
        routingNumber: member.bankDetails?.routingNumber || "",
      });
    } catch (error) {
      toast.error("Failed to load profile data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setUpdateLoading(true);
    let success = false;
    try {
      await membersApi.update(currentUser._id, editFormData);
      await new Promise((res) => setTimeout(res, 1000));
      success = true;
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setUpdateLoading(false);
      if (success) {
        closeEditModal();
        toast.success("Your profile has been updated successfully.");
        await loadProfileData(currentUser._id);
      }
    }
  };

  const handleUpdateBankDetails = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setUpdateLoading(true);
    let success = false;
    try {
      await membersApi.update(currentUser._id, { bankDetails: bankFormData });
      await new Promise((res) => setTimeout(res, 1000));
      success = true;
    } catch (error) {
      toast.error("Failed to update bank details. Please try again.");
    } finally {
      setUpdateLoading(false);
      if (success) {
        closeBankModal();
        toast.success("Your bank details have been updated successfully.");
        await loadProfileData(currentUser._id);
      }
    }
  };

  const handleDepositRequest = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!depositFormData.amount || !depositFormData.method) {
      toast.error("Amount and method are required.");
      return;
    }
    setRequestLoading(true);
    let success = false;
    try {
      await depositsApi.requestDeposit({
        memberId: currentUser._id,
        amount: depositFormData.amount,
        method: depositFormData.method,
        note: depositFormData.note,
      });
      await new Promise((res) => setTimeout(res, 1000));
      success = true;
    } catch (error) {
      toast.error("Failed to submit deposit request. Please try again.");
    } finally {
      setRequestLoading(false);
      if (success) {
        closeDepositModal();
        toast.success("Your deposit request has been submitted.");
        await loadProfileData(currentUser._id);
      }
    }
  };

  const handleWithdrawRequest = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!withdrawFormData.amount || !withdrawFormData.method) {
      toast.error("Amount and method are required.");
      return;
    }
    const withdrawAmount = Number.parseFloat(withdrawFormData.amount);
    if (withdrawAmount > (stats.balance || 0)) {
      if (
        !confirm(
          `Warning: Withdrawal amount (৳${withdrawAmount}) exceeds your balance (৳${
            stats.balance || 0
          }). Continue anyway?`
        )
      ) {
        return;
      }
    }
    setRequestLoading(true);
    let success = false;
    try {
      await withdrawalsApi.requestWithdrawal({
        memberId: currentUser._id,
        amount: withdrawFormData.amount,
        method: withdrawFormData.method,
        note: withdrawFormData.note,
      });
      await new Promise((res) => setTimeout(res, 1000));
      success = true;
    } catch (error) {
      toast.error("Failed to submit withdrawal request. Please try again.");
    } finally {
      setRequestLoading(false);
      if (success) {
        closeWithdrawModal();
        toast.success("Your withdrawal request has been submitted.");
        await loadProfileData(currentUser._id);
      }
    }
  };

  const handleChangePassword = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (
      !passwordFormData.currentPassword ||
      !passwordFormData.newPassword ||
      !passwordFormData.confirmPassword
    ) {
      toast.error("All password fields are required.");
      return;
    }
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    if (passwordFormData.newPassword?.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }
    setPasswordLoading(true);
    let success = false;
    try {
      await authApi.changePassword({
        currentPassword: passwordFormData.currentPassword,
        newPassword: passwordFormData.newPassword,
        confirmPassword: passwordFormData.confirmPassword,
        email: currentUser.email,
      });
      await new Promise((res) => setTimeout(res, 1000));
      success = true;
    } catch (error) {
      toast.error("Failed to change password. Please try again.");
    } finally {
      setPasswordLoading(false);
      if (success) {
        closePasswordModal();
        toast.success("Your password has been changed successfully.");
      }
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

  if (!memberData) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Profile not found
          </h3>
          <p className="text-gray-500">
            Unable to load your profile information.
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">My Balance</p>
                  <p className="text-2xl font-bold">
                    ৳{(stats.balance || 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Total Deposits</p>
                  <p className="text-2xl font-bold">
                    ৳{(stats.totalDeposits || 0).toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Total Withdrawals</p>
                  <p className="text-2xl font-bold">
                    ৳{(stats.totalWithdrawals || 0).toLocaleString()}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Total Profits</p>
                  <p className="text-2xl font-bold">
                    ৳{(stats.totalProfits || 0).toLocaleString()}
                  </p>
                </div>
                <Plus className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Profile Information */}
          <Card className="xl:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                <Button size="sm" variant="outline" onClick={openEditModal}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={memberData.image || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">
                    {memberData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{memberData.name}</h3>
                <p className="text-gray-500">ID: {memberData._id}</p>
                <Badge variant="default">{memberData.status}</Badge>
              </div>

              <div className="space-y-3 pt-4 border-t">
                {memberData.email && (
                  <div>
                    <Label className="text-xs text-gray-500">EMAIL</Label>
                    <p className="text-sm">{memberData.email}</p>
                  </div>
                )}
                {memberData.phone && (
                  <div>
                    <Label className="text-xs text-gray-500">PHONE</Label>
                    <p className="text-sm">{memberData.phone}</p>
                  </div>
                )}
                {memberData.joinDate && (
                  <div>
                    <Label className="text-xs text-gray-500">JOIN DATE</Label>
                    <p className="text-sm">{memberData.joinDate}</p>
                  </div>
                )}
                {memberData.dob && (
                  <div>
                    <Label className="text-xs text-gray-500">
                      DATE OF BIRTH
                    </Label>
                    <p className="text-sm">{memberData.dob}</p>
                  </div>
                )}
                {memberData.occupation && (
                  <div>
                    <Label className="text-xs text-gray-500">OCCUPATION</Label>
                    <p className="text-sm">{memberData.occupation}</p>
                  </div>
                )}
                {memberData.address && (
                  <div>
                    <Label className="text-xs text-gray-500">ADDRESS</Label>
                    <p className="text-sm">{memberData.address}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
                onClick={openDepositModal}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Request Deposit
              </Button>
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
                onClick={openWithdrawModal}
              >
                <TrendingDown className="h-4 w-4 mr-2" />
                Request Withdrawal
              </Button>
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
                onClick={openBankModal}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Update Bank Details
              </Button>
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
                onClick={openPasswordModal}
              >
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Bank Details</CardTitle>
                <Button size="sm" variant="outline" onClick={openBankModal}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs text-gray-500">PAYMENT METHOD</Label>
                <p className="text-sm capitalize">
                  {memberData.bankDetails?.method || "Not set"}
                </p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">ACCOUNT NAME</Label>
                <p className="text-sm">
                  {memberData.bankDetails?.accountName || "Not set"}
                </p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">ACCOUNT NUMBER</Label>
                <p className="text-sm">
                  {memberData.bankDetails?.accountNumber || "Not set"}
                </p>
              </div>
              {memberData.bankDetails?.method === "bank" && (
                <>
                  <div>
                    <Label className="text-xs text-gray-500">BANK NAME</Label>
                    <p className="text-sm">
                      {memberData.bankDetails?.bankName || "Not set"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">BRANCH</Label>
                    <p className="text-sm">
                      {memberData.bankDetails?.branch || "Not set"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">
                      ROUTING NUMBER
                    </Label>
                    <p className="text-sm">
                      {memberData.bankDetails?.routingNumber || "Not set"}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Modals */}
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          editFormData={editFormData}
          setEditFormData={setEditFormData}
          handleUpdateProfile={handleUpdateProfile}
          updateLoading={updateLoading}
        />
        <BankDetailsModal
          isOpen={isBankModalOpen}
          onClose={closeBankModal}
          bankFormData={bankFormData}
          setBankFormData={setBankFormData}
          handleUpdateBankDetails={handleUpdateBankDetails}
          updateLoading={updateLoading}
        />
        <DepositRequestModal
          isOpen={isDepositModalOpen}
          onClose={closeDepositModal}
          depositFormData={depositFormData}
          setDepositFormData={setDepositFormData}
          handleDepositRequest={handleDepositRequest}
          requestLoading={requestLoading}
        />
        <WithdrawRequestModal
          isOpen={isWithdrawModalOpen}
          onClose={closeWithdrawModal}
          withdrawFormData={withdrawFormData}
          setWithdrawFormData={setWithdrawFormData}
          handleWithdrawRequest={handleWithdrawRequest}
          requestLoading={requestLoading}
          balance={stats.balance || 0}
        />
        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={closePasswordModal}
          passwordFormData={passwordFormData}
          setPasswordFormData={setPasswordFormData}
          handleChangePassword={handleChangePassword}
          passwordLoading={passwordLoading}
        />
      </div>
    </AppLayout>
  );
}
