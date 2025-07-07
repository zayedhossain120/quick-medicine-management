"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Label } from "@/components/ui/label";
import {
  Plus,
  Check,
  X,
  Eye,
  StickyNote,
  TrendingUp,
  Loader2,
  Trash,
} from "lucide-react";
import { depositsApi } from "@/lib/api";
import PrintButton from "@/components/ui/PrintButton";
import DownloadPdfButton from "@/components/ui/DownloadPdfButton";
import { PrintDeposits } from "@/components/ui/print-deposits";
import toast from "react-hot-toast";

export default function DepositsPage() {
  const router = useRouter();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState<any>(null);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [depositRequests, setDepositRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [approveLoading, setApproveLoading] = useState<string | null>(null);
  const [declineLoading, setDeclineLoading] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingDeclineId, setPendingDeclineId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const depositsResponse = await depositsApi.getAll();
      setDeposits(depositsResponse.deposits || []);
      setDepositRequests(depositsResponse.pendingRequests || []);
    } catch (error) {
      toast.error("Failed to load deposits data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (id: string) => {
    try {
      setApproveLoading(id);
      await depositsApi.approve(id);
      await loadData();
      toast.success("Deposit request approved successfully!");
    } catch (error) {
      toast.error("Failed to approve deposit. Please try again.");
    } finally {
      setApproveLoading(null);
    }
  };
  const handleDeclineRequest = async (id: string) => {
    try {
      await depositsApi.decline(id);
      await loadData();
      toast.success("Deposit request declined successfully!");
    } catch (error) {
      toast.error("Failed to decline deposit. Please try again.");
    }
  };

  const openConfirmModal = (id: string) => {
    setPendingDeclineId(id);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setPendingDeclineId(null);
    setIsConfirmModalOpen(false);
  };

  const confirmDecline = async () => {
    if (pendingDeclineId) {
      setDeclineLoading(pendingDeclineId);
      await handleDeclineRequest(pendingDeclineId);
      setDeclineLoading(null);
      closeConfirmModal();
    }
  };

  const openDeleteModal = (id: string) => {
    setPendingDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setPendingDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteDeposit = async () => {
    if (pendingDeleteId) {
      setDeleteLoading(pendingDeleteId);
      try {
        await depositsApi.delete(pendingDeleteId);
        await loadData();
        toast.success("Deposit deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete deposit. Please try again.");
      } finally {
        setDeleteLoading(null);
        closeDeleteModal();
      }
    }
  };

  const DepositDetailModal = () => (
    <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit Details</DialogTitle>
        </DialogHeader>
        {selectedDeposit && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Avatar>
                <AvatarImage
                  src={selectedDeposit.memberImage || "/placeholder.svg"}
                />
                <AvatarFallback>
                  {selectedDeposit.memberName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{selectedDeposit.memberName}</h3>
                <p className="text-sm text-gray-500">Member</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Amount</Label>
                <p className="font-semibold text-lg">
                  ৳{selectedDeposit.amount}
                </p>
              </div>
              <div>
                <Label>Date</Label>
                <p>{selectedDeposit.date}</p>
              </div>
              <div>
                <Label>Payment Method</Label>
                <p className="capitalize">{selectedDeposit.method}</p>
              </div>
              <div>
                <Label>Status</Label>
                <Badge
                  variant={
                    selectedDeposit.status === "completed"
                      ? "default"
                      : "secondary"
                  }
                >
                  {selectedDeposit.status}
                </Badge>
              </div>
            </div>

            {selectedDeposit.note && (
              <div>
                <Label>Note</Label>
                <p className="text-sm bg-gray-50 p-3 rounded">
                  {selectedDeposit.note}
                </p>
              </div>
            )}

            {selectedDeposit.status === "pending" && (
              <div className="flex space-x-2 pt-4">
                <Button
                  className="flex-1"
                  size="sm"
                  onClick={() => handleApproveRequest(selectedDeposit._id)}
                  disabled={approveLoading === selectedDeposit._id}
                >
                  {approveLoading === selectedDeposit._id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => openConfirmModal(selectedDeposit._id)}
                  variant="outline"
                  className="flex-1 bg-transparent"
                  size="sm"
                  disabled={declineLoading === selectedDeposit._id}
                >
                  {declineLoading === selectedDeposit._id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Declining...
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-1" />
                      Decline
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
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
            <h2 className="text-lg font-semibold">Deposit Management</h2>
            <p className="text-gray-600">Manage member deposits and requests</p>
          </div>
          <div className="flex items-center gap-2">
            <DownloadPdfButton
              className="bg-green-600 hover:bg-green-700"
              hasIcon
              label="Download"
              pdfContent={<PrintDeposits deposits={deposits} />}
              filename="deposits-report.pdf"
            />
            <PrintButton
              label="Print"
              hasIcon
              className="bg-blue-500"
              printContent={<PrintDeposits deposits={deposits} />}
            />
            <Button onClick={() => router.push("/deposits/add")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Deposit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* All Deposits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[clamp(16px,2.5vw,20px)]">
                All Deposits
              </CardTitle>
            </CardHeader>
            <CardContent>
              {deposits?.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No deposits yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Deposits will appear here once members start investing.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {deposits?.map((deposit) => (
                    <div
                      key={deposit._id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-[#f7f7f7] rounded-lg hover:bg-gray-50 space-y-3 sm:space-y-0"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={deposit.memberImage || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {deposit.memberName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{deposit.memberName}</p>
                          <p className="text-sm text-gray-500">
                            {deposit.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full sm:w-auto space-x-2">
                        <div className="text-left sm:text-right">
                          <p className="font-semibold">৳{deposit.amount}</p>
                          <p className="text-xs text-gray-500 capitalize">
                            {deposit.method}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {deposit.note && (
                            <StickyNote className="h-4 w-4 text-gray-400" />
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedDeposit(deposit);
                              setIsDetailModalOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => openDeleteModal(deposit._id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Deposit Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[clamp(16px,2.5vw,20px)]">
                Pending Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {depositRequests?.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No pending requests
                  </h3>
                  <p className="text-gray-500">
                    Deposit requests from members will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {depositRequests?.map((request) => (
                    <div
                      key={request._id}
                      className="p-4 border rounded-lg bg-yellow-50 border-yellow-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage
                              src={request.memberImage || "/placeholder.svg"}
                            />
                            <AvatarFallback>
                              {request.memberName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{request.memberName}</p>
                            <p className="text-sm text-gray-500">
                              {request.date}
                            </p>
                          </div>
                        </div>
                        {request.note && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedDeposit(request);
                              setIsDetailModalOpen(true);
                            }}
                          >
                            <StickyNote className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-lg">
                            ৳{request.amount}
                          </p>
                          <p className="text-sm text-gray-500 capitalize">
                            {request.method}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApproveRequest(request._id)}
                            disabled={approveLoading === request._id}
                          >
                            {approveLoading === request._id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                Approving...
                              </>
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => openConfirmModal(request._id)}
                            disabled={declineLoading === request._id}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                          >
                            {declineLoading === request._id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                Declining...
                              </>
                            ) : (
                              <>
                                <X className="h-4 w-4 mr-1" />
                                Decline
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DepositDetailModal />

        {/* Confirmation Modal for Decline */}
        <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Decline</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-center">
              Are you really want to delete this request?
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeConfirmModal}>
                No
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDecline}
                disabled={declineLoading === pendingDeclineId}
              >
                {declineLoading === pendingDeclineId ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Declining...
                  </>
                ) : (
                  "Yes"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Confirmation Modal for Delete */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Deposit</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-center">
              Are you sure you want to delete this deposit?
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeDeleteModal}>
                No
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteDeposit}
                disabled={deleteLoading === pendingDeleteId}
              >
                {deleteLoading === pendingDeleteId ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Yes"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
