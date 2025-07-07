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
  Eye,
  StickyNote,
  DollarSign,
  Loader2,
  Trash,
} from "lucide-react";
import { profitsApi } from "@/lib/api";
import PrintButton from "@/components/ui/PrintButton";
import DownloadPdfButton from "@/components/ui/DownloadPdfButton";
import { PrintProfits } from "@/components/ui/print-profits";
import toast from "react-hot-toast";

export default function ProfitsPage() {
  const router = useRouter();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProfit, setSelectedProfit] = useState<any>(null);
  const [profits, setProfits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const profitsResponse = await profitsApi.getAll();
      setProfits(profitsResponse.profits || []);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
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

  const handleDeleteProfit = async () => {
    if (pendingDeleteId) {
      setDeleteLoading(pendingDeleteId);
      try {
        await profitsApi.delete(pendingDeleteId);
        await loadData();
        toast.success("Profit share deleted successfully");
      } catch (error) {
        toast.error("Failed to delete profit share");
      } finally {
        setDeleteLoading(null);
        closeDeleteModal();
      }
    }
  };

  const ProfitDetailModal = () => (
    <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profit Share Details</DialogTitle>
        </DialogHeader>
        {selectedProfit && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <Avatar>
                <AvatarImage
                  src={selectedProfit.memberImage || "/placeholder.svg"}
                />
                <AvatarFallback>
                  {selectedProfit.memberName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{selectedProfit.memberName}</h3>
                <p className="text-sm text-gray-500">Member</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Profit Amount</Label>
                <p className="font-semibold text-lg text-green-600">
                  +৳{selectedProfit.amount}
                </p>
              </div>
              <div>
                <Label>Date</Label>
                <p>{selectedProfit.date}</p>
              </div>
              <div>
                <Label>Distribution Method</Label>
                <p className="capitalize">{selectedProfit.method}</p>
              </div>
              <div>
                <Label>Status</Label>
                <Badge variant="default" className="bg-green-600">
                  {selectedProfit.status}
                </Badge>
              </div>
            </div>

            {selectedProfit.note && (
              <div>
                <Label>Note</Label>
                <p className="text-sm bg-green-50 p-3 rounded">
                  {selectedProfit.note}
                </p>
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
            <h2 className="text-lg font-semibold">Profit Sharing</h2>
            <p className="text-gray-600">
              Manage profit distribution to members
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DownloadPdfButton
              className="bg-green-600 hover:bg-green-700"
              hasIcon
              label="Download"
              pdfContent={<PrintProfits profits={profits} />}
              filename="profits-report.pdf"
            />
            <PrintButton
              label="Print"
              hasIcon
              className="bg-blue-500"
              printContent={<PrintProfits profits={profits} />}
            />
            <Button onClick={() => router.push("/profits/add")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Profit Share
            </Button>
          </div>
        </div>

        {/* All Profits Shared */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[clamp(16px,2.5vw,18px)]">
              All Profits Shared
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profits?.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No profits shared yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Profit distributions will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {profits?.map((profit) => (
                  <div
                    key={profit._id}
                    className="flex items-center justify-between p-3 bg-[#f7f7f7] rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={profit.memberImage || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          {profit.memberName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{profit.memberName}</p>
                        <p className="text-sm text-gray-500">{profit.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          +৳{profit.amount}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {profit.method}
                        </p>
                      </div>
                      {profit.note && (
                        <StickyNote className="h-4 w-4 text-gray-400" />
                      )}
                      <div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedProfit(profit);
                            setIsDetailModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => openDeleteModal(profit._id)}
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

        <ProfitDetailModal />

        {/* Confirmation Modal for Delete */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Profit</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-center">
              Are you sure you want to delete this profit share?
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeDeleteModal}>
                No
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteProfit}
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
