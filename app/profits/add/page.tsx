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
import { ArrowLeft, Loader2 } from "lucide-react";
import { profitsApi, membersApi } from "@/lib/api";
import toast from "react-hot-toast";

export default function AddProfitPage() {
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
      toast.error("Failed to load members data");
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

    try {
      setLoading(true);
      await profitsApi.create(formData);
      toast.success("Profit share added successfully");
      router.push("/profits");
    } catch (error) {
      console.error("Failed to add profit:", error);
      toast.error("Failed to add profit share. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedMember = members.find((m) => m._id === formData.memberId);

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
              Add Profit Share
            </h1>
            <p className="text-gray-600 text-[clamp(14px,2.5vw,14px)]">
              Distribute profit to a member
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[clamp(16px,2.5vw,20px)]">
              Profit Distribution
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
                <div className="p-4 bg-green-50 rounded-lg">
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
                        Current Balance: ৳
                        {(selectedMember.balance || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Profit Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="amount">Profit Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter profit amount"
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
                <Label htmlFor="method">Distribution Method *</Label>
                <Select
                  value={formData.method}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, method: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select distribution method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System Credit</SelectItem>
                    <SelectItem value="bkash">bKash</SelectItem>
                    <SelectItem value="nagad">Nagad</SelectItem>
                    <SelectItem value="rocket">Rocket</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  placeholder="Add profit distribution note (e.g., Monthly profit share - January 2024)..."
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
                      Adding Profit...
                    </>
                  ) : (
                    "Add Profit Share"
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
