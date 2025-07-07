import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");

    const db = await getDatabase();

    if (memberId && ObjectId.isValid(memberId)) {
      // Get member-specific stats
      const transactions = await db
        .collection("transactions")
        .find({ memberId: new ObjectId(memberId), status: "completed" })
        .toArray();

      const deposits = transactions
        .filter((t) => t.type === "deposit")
        .reduce((sum, t) => sum + t.amount, 0);

      const withdrawals = transactions
        .filter((t) => t.type === "withdrawal")
        .reduce((sum, t) => sum + t.amount, 0);

      const profits = transactions
        .filter((t) => t.type === "profit")
        .reduce((sum, t) => sum + t.amount, 0);

      const balance = deposits + profits - withdrawals;

      return NextResponse.json({
        balance,
        totalDeposits: deposits,
        totalWithdrawals: withdrawals,
        totalProfits: profits,
      });
    } else {
      // Get admin dashboard stats
      const [
        totalMembers,
        completedTransactions,
        recentMembers,
        recentDeposits,
        recentTransactions,
      ] = await Promise.all([
        db.collection("users").countDocuments({ role: "member" }),
        db.collection("transactions").find({ status: "completed" }).toArray(),
        db
          .collection("users")
          .find({ role: "member" })
          .sort({ createdAt: -1 })
          .limit(5)
          .project({ password: 0 })
          .toArray(),
        db
          .collection("transactions")
          .find({ type: "deposit", status: "completed" })
          .sort({ createdAt: -1 })
          .limit(5)
          .toArray(),
        db
          .collection("transactions")
          .find({ status: "completed" })
          .sort({ createdAt: -1 })
          .limit(5)
          .toArray(),
      ]);

      const totalDeposits = completedTransactions
        .filter((t) => t.type === "deposit")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalWithdrawals = completedTransactions
        .filter((t) => t.type === "withdrawal")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalProfits = completedTransactions
        .filter((t) => t.type === "profit")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalBalance = totalDeposits + totalProfits - totalWithdrawals;

      // Calculate balance for recent members
      const recentMembersWithBalance = await Promise.all(
        recentMembers.map(async (member) => {
          const memberTransactions = completedTransactions.filter(
            (t) => t.memberId.toString() === member._id.toString()
          );

          const memberDeposits = memberTransactions
            .filter((t) => t.type === "deposit")
            .reduce((sum, t) => sum + t.amount, 0);

          const memberWithdrawals = memberTransactions
            .filter((t) => t.type === "withdrawal")
            .reduce((sum, t) => sum + t.amount, 0);

          const memberProfits = memberTransactions
            .filter((t) => t.type === "profit")
            .reduce((sum, t) => sum + t.amount, 0);

          const memberBalance =
            memberDeposits + memberProfits - memberWithdrawals;

          return {
            ...member,
            balance: memberBalance,
          };
        })
      );

      return NextResponse.json({
        totalBalance,
        totalMembers,
        totalDeposits,
        totalWithdrawals,
        totalProfits,
        recentMembers: recentMembersWithBalance,
        recentDeposits,
        recentTransactions,
      });
    }
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
