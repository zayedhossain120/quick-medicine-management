"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  Edit,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { membersApi, transactionsApi } from "@/lib/api";
import PrintButton from "@/components/ui/PrintButton";
import DownloadPdfButton from "@/components/ui/DownloadPdfButton";
import { PrintMemberTransactions } from "@/components/ui/print-member-transactions";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

const EditProfileModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
  editFormData,
  setEditFormData,
  handleUpdateMember,
  updateLoading,
}: {
  isEditModalOpen: boolean;
  setIsEditModalOpen: (isOpen: boolean) => void;
  editFormData: any;
  setEditFormData: (data: any) => void;
  handleUpdateMember: () => void;
  updateLoading: boolean;
}) => (
  <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Member Profile</DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={editFormData.image || "/placeholder.svg"}
              alt="Preview"
            />
            <AvatarFallback className="text-lg">
              {editFormData.name
                ? editFormData.name.charAt(0).toUpperCase()
                : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="w-full max-w-md">
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
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                setEditFormData((prev: any) => ({
                  ...prev,
                  dob: e.target.value,
                }))
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
        </div>

        {/* Address */}
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
            rows={3}
          />
        </div>

        {/* Bank Details */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">Bank Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="editMethod">Payment Method</Label>
              <Select
                value={editFormData?.bankDetails?.method}
                onValueChange={(value) =>
                  setEditFormData((prev: any) => ({
                    ...prev,
                    bankDetails: { ...prev.bankDetails, method: value },
                  }))
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
              <Label htmlFor="editAccountName">Account Name</Label>
              <Input
                id="editAccountName"
                value={editFormData?.bankDetails?.accountName}
                onChange={(e) =>
                  setEditFormData((prev: any) => ({
                    ...prev,
                    bankDetails: {
                      ...prev.bankDetails,
                      accountName: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="editAccountNumber">Account Number</Label>
              <Input
                id="editAccountNumber"
                value={editFormData?.bankDetails?.accountNumber}
                onChange={(e) =>
                  setEditFormData((prev: any) => ({
                    ...prev,
                    bankDetails: {
                      ...prev.bankDetails,
                      accountNumber: e.target.value,
                    },
                  }))
                }
              />
            </div>
            {editFormData?.bankDetails?.method === "bank" && (
              <>
                <div>
                  <Label htmlFor="editBankName">Bank Name</Label>
                  <Input
                    id="editBankName"
                    value={editFormData.bankDetails.bankName}
                    onChange={(e) =>
                      setEditFormData((prev: any) => ({
                        ...prev,
                        bankDetails: {
                          ...prev.bankDetails,
                          bankName: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="editBranch">Branch</Label>
                  <Input
                    id="editBranch"
                    value={editFormData.bankDetails.branch}
                    onChange={(e) =>
                      setEditFormData((prev: any) => ({
                        ...prev,
                        bankDetails: {
                          ...prev.bankDetails,
                          branch: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="editRoutingNumber">Routing Number</Label>
                  <Input
                    id="editRoutingNumber"
                    value={editFormData.bankDetails.routingNumber}
                    onChange={(e) =>
                      setEditFormData((prev: any) => ({
                        ...prev,
                        bankDetails: {
                          ...prev.bankDetails,
                          routingNumber: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <Button
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={() => setIsEditModalOpen(false)}
            disabled={updateLoading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleUpdateMember}
            disabled={updateLoading}
          >
            {updateLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Member"
            )}
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [member, setMember] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState("all");

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    occupation: "",
    address: "",
    image: "",
    bankDetails: {
      method: "",
      accountName: "",
      accountNumber: "",
      bankName: "",
      branch: "",
      routingNumber: "",
    },
  });

  useEffect(() => {
    if (params.id) {
      loadMemberData();
    }
  }, [params.id]);

  const loadMemberData = async () => {
    try {
      setLoading(true);
      const [memberResponse, transactionsResponse] = await Promise.all([
        membersApi.getById(params.id as string),
        transactionsApi.getAll({ memberId: params.id as string }),
      ]);

      setMember(memberResponse.member);
      setTransactions(transactionsResponse.transactions || []);

      // Set edit form data
      setEditFormData({
        name: memberResponse.member.name || "",
        email: memberResponse.member.email || "",
        phone: memberResponse.member.phone || "",
        dob: memberResponse.member.dob || "",
        occupation: memberResponse.member.occupation || "",
        address: memberResponse.member.address || "",
        image: memberResponse.member.image || "",
        bankDetails: {
          method: memberResponse.member.bankDetails?.method || "",
          accountName: memberResponse.member.bankDetails?.accountName || "",
          accountNumber: memberResponse.member.bankDetails?.accountNumber || "",
          bankName: memberResponse.member.bankDetails?.bankName || "",
          branch: memberResponse.member.bankDetails?.branch || "",
          routingNumber: memberResponse.member.bankDetails?.routingNumber || "",
        },
      });
    } catch (error) {
      console.error("Failed to load member data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMember = async () => {
    try {
      setUpdateLoading(true);
      await membersApi.update(params.id as string, editFormData);
      await loadMemberData(); // Reload data
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update member:", error);
      alert("Failed to update member. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;

    // Date range filtering
    let matchesDate = true;
    if (dateRange?.from || dateRange?.to) {
      const transactionDate = new Date(transaction.date);
      if (dateRange.from && transactionDate < dateRange.from) {
        matchesDate = false;
      }
      if (dateRange.to && transactionDate > dateRange.to) {
        matchesDate = false;
      }
    }

    return matchesType && matchesDate;
  });

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

  const TransactionModal = () => (
    <Dialog
      open={isTransactionModalOpen}
      onOpenChange={setIsTransactionModalOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>
        {selectedTransaction && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <p className="capitalize font-medium">
                  {selectedTransaction.type}
                </p>
              </div>
              <div>
                <Label>Amount</Label>
                <p
                  className={`font-semibold ${getTransactionColor(
                    selectedTransaction.type
                  )}`}
                >
                  {getTransactionSign(selectedTransaction.type)}৳
                  {selectedTransaction.amount}
                </p>
              </div>
              <div>
                <Label>Date</Label>
                <p>{selectedTransaction.date}</p>
              </div>
              <div>
                <Label>Method</Label>
                <p className="capitalize">{selectedTransaction.method}</p>
              </div>
              <div>
                <Label>Status</Label>
                <Badge
                  variant={
                    selectedTransaction.status === "completed"
                      ? "default"
                      : "secondary"
                  }
                >
                  {selectedTransaction.status}
                </Badge>
              </div>
            </div>
            {selectedTransaction.note && (
              <div>
                <Label>Note</Label>
                <p>{selectedTransaction.note}</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  const TransactionCard = ({ transaction }: { transaction: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-medium capitalize">{transaction.type}</p>
            <p className="text-sm text-gray-500">{transaction.date}</p>
            <p className="text-xs text-gray-400 capitalize">
              {transaction.method}
            </p>
          </div>
          <Badge
            variant={
              transaction.status === "completed" ? "default" : "secondary"
            }
          >
            {transaction.status}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <p
            className={`font-semibold text-lg ${getTransactionColor(
              transaction.type
            )}`}
          >
            {getTransactionSign(transaction.type)}৳{transaction.amount}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!member) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Member not found
          </h3>
          <p className="text-gray-500 mb-4">
            The member you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/members")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Members
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/members")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{member.name}</h1>
            <p className="text-gray-600">Member Details</p>
          </div>
        </div>

        {/* Member Profile */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Profile Info */}
          <Card className="xl:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={member.image || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-gray-500">ID: {member._id}</p>
                <Badge
                  variant={member.status === "active" ? "default" : "secondary"}
                >
                  {member.status}
                </Badge>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div>
                  <Label className="text-xs text-gray-500">EMAIL</Label>
                  <p className="text-sm">{member.email}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">PHONE</Label>
                  <p className="text-sm">{member.phone || "Not set"}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">JOIN DATE</Label>
                  <p className="text-sm">{member.joinDate}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">DATE OF BIRTH</Label>
                  <p className="text-sm">{member.dob || "Not set"}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">OCCUPATION</Label>
                  <p className="text-sm">{member.occupation || "Not set"}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">ADDRESS</Label>
                  <p className="text-sm">{member.address || "Not set"}</p>
                </div>
              </div>

              {/* Bank Details */}
              <div className="pt-4 border-t">
                <Label className="text-xs text-gray-500">BANK DETAILS</Label>
                <div className="mt-2 space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Method:</span>{" "}
                    {member.bankDetails?.method || "Not set"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Account Name:</span>{" "}
                    {member.bankDetails?.accountName || "Not set"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Account Number:</span>{" "}
                    {member.bankDetails?.accountNumber || "Not set"}
                  </p>
                  {member.bankDetails?.method === "bank" && (
                    <>
                      <p className="text-sm">
                        <span className="font-medium">Bank:</span>{" "}
                        {member.bankDetails?.bankName || "Not set"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Branch:</span>{" "}
                        {member.bankDetails?.branch || "Not set"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Routing:</span>{" "}
                        {member.bankDetails?.routingNumber || "Not set"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats and Transactions */}
          <div className="xl:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs opacity-80">Balance</p>
                      <p className="text-lg font-bold">
                        ৳{(member.balance || 0).toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs opacity-80">Deposits</p>
                      <p className="text-lg font-bold">
                        ৳{(member.totalDeposits || 0).toLocaleString()}
                      </p>
                    </div>
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs opacity-80">Withdrawals</p>
                      <p className="text-lg font-bold">
                        ৳{(member.totalWithdrawals || 0).toLocaleString()}
                      </p>
                    </div>
                    <TrendingDown className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs opacity-80">Profits</p>
                      <p className="text-lg font-bold">
                        ৳{(member.totalProfits || 0).toLocaleString()}
                      </p>
                    </div>
                    <Plus className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transaction History */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle>Transaction History</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex gap-2">
                      <DateRangePicker
                        dateRange={dateRange}
                        onDateRangeChange={setDateRange}
                      />
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="deposit">Deposits</SelectItem>
                          <SelectItem value="withdrawal">
                            Withdrawals
                          </SelectItem>
                          <SelectItem value="profit">Profits</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <PrintButton
                        printContent={
                          <PrintMemberTransactions
                            transactions={filteredTransactions}
                            memberName={member.name}
                          />
                        }
                        label="Print"
                        hasIcon
                        className="bg-blue-600 hover:bg-blue-700"
                      />
                      <DownloadPdfButton
                        pdfContent={
                          <PrintMemberTransactions
                            transactions={filteredTransactions}
                            memberName={member.name}
                          />
                        }
                        filename={`${member.name}-transactions-${
                          new Date().toISOString().split("T")[0]
                        }.pdf`}
                        label="Download"
                        hasIcon
                        className="bg-green-600 hover:bg-green-700"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredTransactions?.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No transactions found</p>
                  </div>
                ) : (
                  <>
                    {/* Mobile View - Cards */}
                    <div className="block md:hidden">
                      <div className="grid grid-cols-1 gap-4">
                        {filteredTransactions?.map((transaction) => (
                          <TransactionCard
                            key={transaction._id}
                            transaction={transaction}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Desktop View - Table */}
                    <div className="hidden md:block">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-3">Type</th>
                              <th className="text-left p-3">Amount</th>
                              <th className="text-left p-3">Date</th>
                              <th className="text-left p-3">Method</th>
                              <th className="text-left p-3">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredTransactions?.map((transaction) => (
                              <tr
                                key={transaction._id}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="p-3 capitalize">
                                  {transaction.type}
                                </td>
                                <td className="p-3">
                                  <span
                                    className={`font-semibold ${getTransactionColor(
                                      transaction.type
                                    )}`}
                                  >
                                    {getTransactionSign(transaction.type)}৳
                                    {transaction.amount}
                                  </span>
                                </td>
                                <td className="p-3">{transaction.date}</td>
                                <td className="p-3 capitalize">
                                  {transaction.method}
                                </td>
                                <td className="p-3">
                                  <Badge
                                    variant={
                                      transaction.status === "completed"
                                        ? "default"
                                        : "secondary"
                                    }
                                  >
                                    {transaction.status}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <EditProfileModal
          isEditModalOpen={isEditModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          editFormData={editFormData}
          setEditFormData={setEditFormData}
          handleUpdateMember={handleUpdateMember}
          updateLoading={updateLoading}
        />
        <TransactionModal />
      </div>
    </AppLayout>
  );
}
