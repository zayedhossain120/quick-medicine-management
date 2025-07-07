"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Grid,
  List,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { membersApi } from "@/lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

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
          <div>
            <Label htmlFor="editPassword">Change Password</Label>
            <Input
              id="editPassword"
              type="password"
              placeholder="Leave blank to keep unchanged"
              value={editFormData.password || ""}
              onChange={(e) =>
                setEditFormData((prev: any) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              autoComplete="new-password"
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
                value={editFormData.bankDetails.method}
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
                value={editFormData.bankDetails.accountName}
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
                value={editFormData.bankDetails.accountNumber}
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
            {editFormData.bankDetails.method === "bank" && (
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

export default function MembersPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [memberToEdit, setMemberToEdit] = useState<any>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalMembers, setTotalMembers] = useState(0);

  // #> Edit form state
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    occupation: "",
    address: "",
    image: "",
    password: "",
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
    loadMembers(currentPage, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  const loadMembers = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await membersApi.getAll({ page, limit });
      setMembers(response.members || []);
      setTotalMembers(response.total || 0);
    } catch (error) {
      toast.error("Failed to load members. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) {
      return;
    }

    try {
      setDeleteLoading(memberToDelete);
      await membersApi.delete(memberToDelete);
      await loadMembers();
      toast.success("Member deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete member. Please try again.");
    } finally {
      setDeleteLoading(null);
      setIsDeleteDialogOpen(false);
      setMemberToDelete(null);
    }
  };

  const handleUpdateMember = async () => {
    if (!memberToEdit) return;
    try {
      setUpdateLoading(true);
      let updatePayload: any;
      if (editFormData.password) {
        updatePayload = { ...editFormData };
      } else {
        // Exclude password if empty
        const { password, ...rest } = editFormData;
        updatePayload = rest;
      }
      await membersApi.update(memberToEdit._id, updatePayload);
      await loadMembers();
      setIsEditModalOpen(false);
      setMemberToEdit(null);
      toast.success("The member profile was updated successfully.");
    } catch (error: any) {
      toast.error(
        error?.message || "Failed to update member. Please try again."
      );
    } finally {
      setUpdateLoading(false);
      setEditFormData((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleEdit = (member: any) => {
    setMemberToEdit(member);
    setEditFormData({
      name: member.name || "",
      email: member.email || "",
      phone: member.phone || "",
      dob: member.dob ? new Date(member.dob).toISOString().split("T")[0] : "",
      occupation: member.occupation || "",
      address: member.address || "",
      image: member.image || "",
      password: "",
      bankDetails: {
        method: member.bankDetails?.method || "",
        accountName: member.bankDetails?.accountName || "",
        accountNumber: member.bankDetails?.accountNumber || "",
        bankName: member.bankDetails?.bankName || "",
        branch: member.bankDetails?.branch || "",
        routingNumber: member.bankDetails?.routingNumber || "",
      },
    });
    setIsEditModalOpen(true);
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const MemberCard = ({ member }: { member: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={member.image || "/placeholder.svg"} />
              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{member.name}</h3>
              {/* <p className="text-sm text-gray-500">ID: {member._id}</p> */}
              <p className="text-xs text-gray-400">Joined: {member.joinDate}</p>
            </div>
          </div>
          <Badge variant={member.status === "active" ? "default" : "secondary"}>
            {member.status}
          </Badge>
        </div>

        <div className="space-y-1 mb-3">
          <p className="text-sm">{member.email}</p>
          <p className="text-sm">{member.phone}</p>
          <p className="font-semibold text-lg">
            ৳{(member.balance || 0).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Link href={`/members/${member._id}`} className="flex-1">
            <Button
              size="sm"
              variant="outline"
              className="w-full bg-transparent"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </Link>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={() => handleEdit(member)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700 bg-transparent"
            onClick={() => {
              setMemberToDelete(member._id);
              setIsDeleteDialogOpen(true);
            }}
            disabled={deleteLoading === member._id || member.balance > 0}
          >
            {deleteLoading === member._id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const MemberRow = ({ member }: { member: any }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
      <div className="flex flex-col gap-y-2.5 items-start">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={member.image || "/placeholder.svg"} />
            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{member.name}</h3>
            <p className="text-sm text-gray-500">{member.email}</p>
            <p className="text-xs text-gray-400">Joined: {member.joinDate}</p>
          </div>
        </div>
        <div className="md:hidden flex space-x-2">
          <Link href={`/members/${member._id}`}>
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={() => handleEdit(member)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700 bg-transparent"
            onClick={() => {
              setMemberToDelete(member._id);
              setIsDeleteDialogOpen(true);
            }}
            disabled={deleteLoading === member._id || member.balance > 0}
          >
            {deleteLoading === member._id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="font-semibold">
            ৳{(member.balance || 0).toLocaleString()}
          </p>
          <Badge variant={member.status === "active" ? "default" : "secondary"}>
            {member.status}
          </Badge>
        </div>
        <div className="md:flex hidden space-x-2">
          <Link href={`/members/${member._id}`}>
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={() => handleEdit(member)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700 bg-transparent"
            onClick={() => {
              setMemberToDelete(member._id);
              setIsDeleteDialogOpen(true);
            }}
            disabled={deleteLoading === member._id}
          >
            {deleteLoading === member._id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  // Pagination logic
  const totalPages = Math.ceil(totalMembers / pageSize);
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

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
            <h2 className="text-lg font-semibold">Members Management</h2>
            <p className="text-gray-600">Manage all members</p>
          </div>
          <Button onClick={() => router.push("/members/add")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>

        {/* Filters and Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              {/* Page size selector */}
              <Select
                value={String(pageSize)}
                onValueChange={(v) => setPageSize(Number(v))}
              >
                <SelectTrigger className="w-24 ml-2">
                  <SelectValue placeholder="Page size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Members Display */}
        {filteredMembers?.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    No members found
                  </h3>
                  <p className="text-gray-500">
                    Get started by adding your first member.
                  </p>
                </div>
                <Button onClick={() => router.push("/members/add")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Member
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(325px,1fr))] grid-rows-[masonry]">
            {filteredMembers?.map((member) => (
              <MemberCard key={member._id} member={member} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMembers?.map((member) => (
              <MemberRow key={member._id} member={member} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => canGoPrev && setCurrentPage(currentPage - 1)}
              disabled={!canGoPrev}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={page === currentPage ? "font-bold" : ""}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => canGoNext && setCurrentPage(currentPage + 1)}
              disabled={!canGoNext}
            >
              Next
            </Button>
            <span className="ml-4 text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}
      </div>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              member and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMember}
              disabled={!!deleteLoading}
            >
              {deleteLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Continue"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <EditProfileModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        handleUpdateMember={handleUpdateMember}
        updateLoading={updateLoading}
      />
    </AppLayout>
  );
}
