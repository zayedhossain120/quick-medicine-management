"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Eye, Loader2, Search } from "lucide-react";
import { auth } from "@/lib/auth";
import { transactionsApi, dashboardApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { Input } from "@/components/ui/input";
import PrintButton from "@/components/ui/PrintButton";
import DownloadPdfButton from "@/components/ui/DownloadPdfButton";
import { PrintPersonalTransactions } from "@/components/ui/print-personal-transactions";

export default function PersonalLedgerPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const user = auth.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      loadTransactionData(user._id);
    }
  }, []);

  const loadTransactionData = async (memberId: string) => {
    try {
      setLoading(true);
      const [transactionsResponse, statsResponse] = await Promise.all([
        transactionsApi.getAll({ memberId }),
        dashboardApi.getStats(memberId),
      ]);

      setTransactions(transactionsResponse.transactions || []);
      setStats(statsResponse);
    } catch (error) {
      console.error("Failed to load transaction data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      searchTerm === "" ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm);
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

    return matchesSearch && matchesType && matchesDate;
  });

  const handleViewDetails = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsDetailModalOpen(true);
  };

  const TransactionDetailModal = () => (
    <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>
        {selectedTransaction && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Amount</Label>
                <p
                  className={`font-semibold text-lg ${getTransactionColor(
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
                <Label>Type</Label>
                <p className="capitalize">{selectedTransaction.type}</p>
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
                <p className="text-sm bg-gray-50 p-3 rounded">
                  {selectedTransaction.note}
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

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
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewDetails(transaction)}
          >
            <Eye className="h-4 w-4" />
          </Button>
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

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold">My Transaction History</h2>
            <p className="text-gray-600">
              View your complete transaction history
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div>
                <p className="text-sm opacity-80">Total Deposits</p>
                <p className="text-2xl font-bold">
                  ৳{(stats.totalDeposits || 0).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div>
                <p className="text-sm opacity-80">Total Withdrawals</p>
                <p className="text-2xl font-bold">
                  ৳{(stats.totalWithdrawals || 0).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div>
                <p className="text-sm opacity-80">Total Profits</p>
                <p className="text-2xl font-bold">
                  ৳{(stats.totalProfits || 0).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative sm:flex-1  ">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DateRangePicker
                className="w-full sm:w-auto"
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposits</SelectItem>
                  <SelectItem value="withdrawal">Withdrawals</SelectItem>
                  <SelectItem value="profit">Profits</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <PrintButton
                  printContent={
                    <PrintPersonalTransactions
                      transactions={filteredTransactions}
                      userName={currentUser?.name || "User"}
                    />
                  }
                  label="Print"
                  hasIcon
                  className="bg-blue-600 hover:bg-blue-700"
                />
                <DownloadPdfButton
                  pdfContent={
                    <PrintPersonalTransactions
                      transactions={filteredTransactions}
                      userName={currentUser?.name || "User"}
                    />
                  }
                  filename={`${currentUser?.name || "user"}-transactions-${
                    new Date().toISOString().split("T")[0]
                  }.pdf`}
                  label="Download"
                  hasIcon
                  className="bg-green-600 hover:bg-green-700"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>
              Transaction History ({filteredTransactions?.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions?.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No transactions yet
                </h3>
                <p className="text-gray-500">
                  Your transaction history will appear here once you start
                  making deposits and withdrawals.
                </p>
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
                          <th className="text-left p-3">Action</th>
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
                            <td className="p-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(transaction)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
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
      <TransactionDetailModal />
    </AppLayout>
  );
}
