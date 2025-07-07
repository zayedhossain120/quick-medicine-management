"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Eye, Loader2 } from "lucide-react";
import { transactionsApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { PrintTransactions } from "@/components/ui/print-transactions";
import PrintButton from "@/components/ui/PrintButton";
import DownloadPdfButton from "@/components/ui/DownloadPdfButton";
import { PdfTransactions } from "@/components/ui/pdf-transactions";

export default function LedgerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionsApi.getAll();
      setTransactions(response.transactions || []);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.memberName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;

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

    return matchesSearch && matchesType && matchesStatus && matchesDate;
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
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Avatar>
                <AvatarImage
                  src={selectedTransaction.memberImage || "/placeholder.svg"}
                />
                <AvatarFallback>
                  {selectedTransaction.memberName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">
                  {selectedTransaction.memberName}
                </h3>
                <p className="text-sm text-gray-500">Member</p>
              </div>
            </div>

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
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={transaction.memberImage || "/placeholder.svg"}
              />
              <AvatarFallback>
                {transaction.memberName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{transaction.memberName}</p>
              <p className="text-sm text-gray-500 capitalize">
                {transaction.type}
              </p>
              <p className="text-xs text-gray-400">{transaction.date}</p>
            </div>
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
          <div>
            <p
              className={`font-semibold text-lg ${getTransactionColor(
                transaction.type
              )}`}
            >
              {getTransactionSign(transaction.type)}৳{transaction.amount}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {transaction.method}
            </p>
          </div>
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
            <h2 className="text-lg font-semibold">All Transactions</h2>
            <p className="text-gray-600">
              Complete transaction history across the system
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DownloadPdfButton
              className="bg-green-600 hover:bg-green-700"
              hasIcon
              label="Download"
              pdfContent={
                <PdfTransactions transactions={filteredTransactions} />
              }
              filename="transactions-report.pdf"
            />
            <PrintButton
              className="bg-blue-500"
              hasIcon
              label="Print"
              printContent={
                <PrintTransactions transactions={filteredTransactions} />
              }
            />
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by member name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DateRangePicker
                className="w-full"
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full ">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposits</SelectItem>
                  <SelectItem value="withdrawal">Withdrawals</SelectItem>
                  <SelectItem value="profit">Profits</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full ">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[clamp(16px,2.5vw,18px)]">
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
                  No transactions found
                </h3>
                <p className="text-gray-500">
                  {transactions?.length === 0
                    ? "Transaction history will appear here once you start adding deposits, withdrawals, and profits."
                    : "Try adjusting your search or filter criteria."}
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
                          <th className="text-left p-3">Member</th>
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
                            <td className="p-3">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={
                                      transaction.memberImage ||
                                      "/placeholder.svg"
                                    }
                                  />
                                  <AvatarFallback>
                                    {transaction.memberName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">
                                  {transaction.memberName}
                                </span>
                              </div>
                            </td>
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
