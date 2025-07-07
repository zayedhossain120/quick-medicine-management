"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Plus,
  Loader2,
  Eye,
} from "lucide-react";
import { auth } from "@/lib/auth";
import {
  dashboardApi,
  transactionsApi,
  depositsApi,
  withdrawalsApi,
} from "@/lib/api";
import toast from "react-hot-toast";

interface DashboardStats {
  totalBalance?: number;
  totalMembers?: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalProfits: number;
  balance?: number;
  recentMembers?: any[];
  recentDeposits?: any[];
  recentTransactions?: any[];
}

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
  handleDepositRequest: () => void;
  requestLoading: boolean;
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Request Deposit</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
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
        <Button
          className="w-full"
          onClick={handleDepositRequest}
          disabled={requestLoading}
        >
          {requestLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Deposit Request"
          )}
        </Button>
      </div>
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
  handleWithdrawRequest: () => void;
  requestLoading: boolean;
  balance: number;
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Request Withdrawal</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Available Balance:{" "}
            <span className="font-semibold">৳{balance.toLocaleString()}</span>
          </p>
          {balance <= 0 && (
            <p className="text-xs text-red-600 mt-2">
              You have no available balance for withdrawal.
            </p>
          )}
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
        <Button
          className="w-full"
          onClick={handleWithdrawRequest}
          disabled={requestLoading || balance <= 0}
        >
          {requestLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Withdrawal Request"
          )}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default function Dashboard() {
  const [userRole, setUserRole] = useState<"admin" | "member">("admin");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalProfits: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);

  // Modal states
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // Form states
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

  // Reset form data functions
  const resetDepositForm = () => {
    setDepositFormData({ amount: "", method: "", note: "" });
  };

  const resetWithdrawForm = () => {
    setWithdrawFormData({ amount: "", method: "", note: "" });
  };

  // Modal open handlers with form reset
  const openDepositModal = () => {
    resetDepositForm();
    setIsDepositModalOpen(true);
  };

  const openWithdrawModal = () => {
    resetWithdrawForm();
    setIsWithdrawModalOpen(true);
  };

  // Modal close handlers
  const closeDepositModal = () => setIsDepositModalOpen(false);
  const closeWithdrawModal = () => setIsWithdrawModalOpen(false);

  useEffect(() => {
    const user = auth.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setUserRole(user.role);
      loadDashboardData(user.role === "member" ? user._id : undefined);
    }
  }, []);

  const loadDashboardData = async (memberId?: string) => {
    try {
      setLoading(true);
      const [statsData, transactionsData] = await Promise.all([
        dashboardApi.getStats(memberId),
        memberId
          ? transactionsApi.getAll({ memberId, limit: 5 })
          : Promise.resolve({ transactions: [] }),
      ]);
      setStats(statsData);
      if (memberId) {
        setRecentTransactions(transactionsData.transactions || []);
      }
    } catch (error) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleDepositRequest = async () => {
    if (!depositFormData.amount || !depositFormData.method) {
      toast.error("Amount and method are required.");
      return;
    }

    try {
      setRequestLoading(true);
      await depositsApi.requestDeposit({
        memberId: currentUser._id,
        amount: depositFormData.amount,
        method: depositFormData.method,
        note: depositFormData.note,
      });

      resetDepositForm();
      closeDepositModal();
      toast.success("Your deposit request has been submitted.");
      // Reload dashboard data to update stats
      await loadDashboardData(currentUser._id);
    } catch (error) {
      toast.error("Failed to submit deposit request. Please try again.");
    } finally {
      setRequestLoading(false);
    }
  };

  const handleWithdrawRequest = async () => {
    if (!withdrawFormData.amount || !withdrawFormData.method) {
      toast.error("Amount and method are required.");
      return;
    }

    const withdrawAmount = Number.parseFloat(withdrawFormData.amount);
    if (withdrawAmount > (stats.balance || 0)) {
      if (
        !confirm(
          `Warning: Withdrawal amount (৳৳{withdrawAmount}) exceeds your balance (৳৳{
            stats.balance || 0
          }). Continue anyway?`
        )
      ) {
        return;
      }
    }

    try {
      setRequestLoading(true);
      await withdrawalsApi.requestWithdrawal({
        memberId: currentUser._id,
        amount: withdrawFormData.amount,
        method: withdrawFormData.method,
        note: withdrawFormData.note,
      });

      resetWithdrawForm();
      closeWithdrawModal();
      toast.success("Your withdrawal request has been submitted.");
      // Reload dashboard data to update stats
      await loadDashboardData(currentUser._id);
    } catch (error) {
      toast.error("Failed to submit withdrawal request. Please try again.");
    } finally {
      setRequestLoading(false);
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "text-green-600";
      case "withdrawal":
        return "text-red-600";
      case "profit":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getTransactionSign = (type: string) => {
    switch (type) {
      case "deposit":
        return "+";
      case "withdrawal":
        return "-";
      case "profit":
        return "+";
      default:
        return "";
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

  const AdminDashboard = () => (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{(stats.totalBalance || 0).toLocaleString()}
            </div>
            <p className="text-xs opacity-80">
              Deposits + Profits - Withdrawals
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers || 0}</div>
            <p className="text-xs opacity-80">Active members</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Deposits
            </CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{stats.totalDeposits.toLocaleString()}
            </div>
            <p className="text-xs opacity-80">All time deposits</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Withdrawals
            </CardTitle>
            <TrendingDown className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{stats.totalWithdrawals.toLocaleString()}
            </div>
            <p className="text-xs opacity-80">All time withdrawals</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Members and Deposits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Members */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-[clamp(14px,2vw,18px)]">
              Recent Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!stats.recentMembers || stats.recentMembers?.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  No members yet
                </h3>
                <p className="text-xs text-gray-500">
                  Recent members will appear here once you start adding them.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentMembers?.map((member) => (
                  <div
                    key={member._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-[#f7f7f7] rounded-lg space-y-2 sm:space-y-0"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.image || "/placeholder.svg"} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                        <p className="text-xs text-gray-400">
                          Joined: {member.joinDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end">
                      <p className="font-semibold text-sm">
                        ৳{(member.balance || 0).toLocaleString()}
                      </p>
                      <Badge
                        variant={
                          member.status === "active" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {member.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Deposits */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-[clamp(14px,2vw,18px)]">
              Recent Deposits
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!stats.recentDeposits || stats.recentDeposits?.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  No deposits yet
                </h3>
                <p className="text-xs text-gray-500">
                  Recent deposits will appear here once members start investing.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentDeposits?.map((deposit) => (
                  <div
                    key={deposit._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-[#f7f7f7] rounded-lg space-y-2 sm:space-y-0"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={deposit.memberImage || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          {deposit.memberName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {deposit.memberName}
                        </p>
                        <p className="text-xs text-gray-500">{deposit.date}</p>
                        <p className="text-xs text-gray-400 capitalize">
                          {deposit.method}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end">
                      <p className="font-semibold text-sm text-green-600">
                        +৳{deposit.amount.toLocaleString()}
                      </p>
                      <Badge variant="default" className="text-xs">
                        {deposit.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-[clamp(14px,2vw,18px)]">
              Recent Transactions
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = "/ledger")}
            >
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!stats.recentTransactions ||
          stats.recentTransactions?.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                No transactions yet
              </h3>
              <p className="text-xs text-gray-500">
                Recent transactions will appear here once members start making
                transactions.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentTransactions?.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-3 bg-[#f7f7f7] rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={transaction.memberImage || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {transaction.memberName?.charAt(0) || "T"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm capitalize">
                        {transaction.memberName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {transaction.type}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        {transaction.method} • {transaction.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p
                        className={`font-semibold text-sm ${getTransactionColor(
                          transaction.type
                        )}`}
                      >
                        {getTransactionSign(transaction.type)}৳
                        {transaction.amount.toLocaleString()}
                      </p>
                      <Badge
                        variant={
                          transaction.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const MemberDashboard = () => (
    <div className="space-y-4">
      {/* Member Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Balance</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{(stats.balance || 0).toLocaleString()}
            </div>
            <p className="text-xs opacity-80">Current balance</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Deposits
            </CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{stats.totalDeposits.toLocaleString()}
            </div>
            <p className="text-xs opacity-80">All deposits</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Withdrawals
            </CardTitle>
            <TrendingDown className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{stats.totalWithdrawals.toLocaleString()}
            </div>
            <p className="text-xs opacity-80">All withdrawals</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profits</CardTitle>
            <Plus className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{stats.totalProfits.toLocaleString()}
            </div>
            <p className="text-xs opacity-80">Profit earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={openDepositModal}
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div>
                  <h3 className="font-medium">Request Deposit</h3>
                  <p className="text-sm text-gray-500">
                    Add funds to your account
                  </p>
                </div>
              </div>
            </Card>
            <Card
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={openWithdrawModal}
            >
              <div className="flex items-center space-x-3">
                <TrendingDown className="h-8 w-8 text-red-500" />
                <div>
                  <h3 className="font-medium">Request Withdrawal</h3>
                  <p className="text-sm text-gray-500">
                    Withdraw funds from account
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Transactions</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = "/profile/ledger")}
            >
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentTransactions?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTransactions?.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium capitalize">
                        {transaction.type}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transaction.date}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        {transaction.method}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p
                        className={`font-semibold ৳{getTransactionColor(
                          transaction.type
                        )}`}
                      >
                        {getTransactionSign(transaction.type)}৳
                        {transaction.amount}
                      </p>
                      <Badge
                        variant={
                          transaction.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <AppLayout>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      {userRole === "admin" ? <AdminDashboard /> : <MemberDashboard />}

      {/* Modals */}
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
    </AppLayout>
  );
}
