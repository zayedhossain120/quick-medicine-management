"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { withdrawalsApi, membersApi } from "@/lib/api";
import toast from "react-hot-toast";

export default function AddWithdrawalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [membersLoading, setMembersLoading] = useState(true);
  const [members, setMembers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    memberId: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    method: "",
    note: "",
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const response = await membersApi.getAll();
      setMembers(response.members || []);
    } catch (error) {
      toast.error("Failed to load members. Please refresh the page.");
    } finally {
      setMembersLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.memberId || !formData.amount || !formData.method) {
      toast.error("Member, amount, and method are required");
      return;
    }

    const selectedMember = members.find((m) => m._id === formData.memberId);
    const withdrawalAmount = Number.parseFloat(formData.amount);

    if (selectedMember && withdrawalAmount > (selectedMember.balance || 0)) {
      if (
        !confirm(
          `Warning: Withdrawal amount (৳${withdrawalAmount}) exceeds member's balance (৳${
            selectedMember.balance || 0
          }). Continue anyway?`
        )
      ) {
        return;
      }
    }

    try {
      setLoading(true);
      await withdrawalsApi.create(formData);
      toast.success("Withdrawal added successfully!");
      router.push("/withdrawals");
    } catch (error) {
      toast.error("Failed to add withdrawal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedMember = members.find((m) => m._id === formData.memberId);
  const withdrawalAmount = Number.parseFloat(formData.amount) || 0;
  const memberBalance = selectedMember?.balance || 0;
  const isOverBalance = withdrawalAmount > memberBalance;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-[clamp(18px,2.5vw,20px)] font-bold">
              Add New Withdrawal
            </h1>
            <p className="text-gray-600 text-[clamp(12px,2.5vw,14px)]">
              Record a member withdrawal
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[clamp(16px,2.5vw,20px)]">
              Withdrawal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Member Selection */}
              <div>
                <Label htmlFor="member">Select Member *</Label>
                <Select
                  value={formData.memberId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, memberId: value }))
                  }
                  disabled={membersLoading}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        membersLoading ? "Loading members..." : "Choose member"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {members?.map((member) => (
                      <SelectItem key={member._id} value={member._id}>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={member.image || "/placeholder.svg"}
                            />
                            <AvatarFallback>
                              {member.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{member.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Member Preview */}
              {selectedMember && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={selectedMember.image || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {selectedMember.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedMember.name}</p>
                      <p className="text-sm text-gray-500">
                        {selectedMember.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        Available Balance: ৳{memberBalance.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Balance Warning */}
              {isOverBalance && selectedMember && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-red-800 font-medium">
                        Insufficient Balance
                      </p>
                      <p className="text-red-700 text-sm">
                        Withdrawal amount (৳{withdrawalAmount.toLocaleString()})
                        exceeds available balance (৳
                        {memberBalance.toLocaleString()})
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Withdrawal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="method">Payment Method *</Label>
                <Select
                  value={formData.method}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, method: value }))
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
                <Label htmlFor="note">Note (Optional)</Label>
                <Textarea
                  id="note"
                  placeholder="Add any notes about this withdrawal..."
                  value={formData.note}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, note: e.target.value }))
                  }
                  rows={3}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading || membersLoading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding Withdrawal...
                    </>
                  ) : (
                    "Add Withdrawal"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
