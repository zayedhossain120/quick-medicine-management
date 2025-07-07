import type { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  role: "admin" | "member";
  phone?: string;
  joinDate: string;
  dob?: string;
  occupation?: string;
  address?: string;
  image?: string;
  status: "active" | "pending" | "inactive";
  bankDetails?: {
    method: string;
    accountName: string;
    accountNumber: string;
    bankName: string;
    branch: string;
    routingNumber: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  _id?: ObjectId;
  memberId: ObjectId;
  memberName: string;
  memberImage?: string;
  type: "deposit" | "withdrawal" | "profit";
  amount: number;
  date: string;
  method: string;
  status: "pending" | "completed" | "rejected";
  note?: string;
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface DepositRequest {
  _id?: ObjectId;
  memberId: ObjectId;
  memberName: string;
  memberImage?: string;
  amount: number;
  method: string;
  note?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

export interface WithdrawalRequest {
  _id?: ObjectId;
  memberId: ObjectId;
  memberName: string;
  memberImage?: string;
  amount: number;
  method: string;
  note?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}
