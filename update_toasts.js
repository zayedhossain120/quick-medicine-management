// Temporary script to update toast calls
// This will help us update all remaining toast calls in profile page

const fs = require("fs");
const path = require("path");

const profilePath = path.join(__dirname, "app", "profile", "page.tsx");
let content = fs.readFileSync(profilePath, "utf8");

// Update all remaining toast calls
const replacements = [
  // Bank details validation
  {
    from: `toast({
        title: "Missing fields",
        description: "Amount and method are required.",
      });`,
    to: `toast.error("Amount and method are required.");`,
  },
  // Bank details success
  {
    from: `toast({
        title: "Bank details updated",
        description: "Your bank details have been updated successfully.",
      });`,
    to: `toast.success("Your bank details have been updated successfully.");`,
  },
  // Deposit validation
  {
    from: `toast({
        title: "Missing fields",
        description: "Amount and method are required.",
      });`,
    to: `toast.error("Amount and method are required.");`,
  },
  // Deposit success
  {
    from: `toast({
        title: "Deposit requested",
        description: "Your deposit request has been submitted.",
      });`,
    to: `toast.success("Your deposit request has been submitted.");`,
  },
  // Deposit error
  {
    from: `toast({
        title: "Request failed",
        description: "Failed to submit deposit request. Please try again.",
      });`,
    to: `toast.error("Failed to submit deposit request. Please try again.");`,
  },
  // Withdraw validation
  {
    from: `toast({
        title: "Missing fields",
        description: "Amount and method are required.",
      });`,
    to: `toast.error("Amount and method are required.");`,
  },
  // Withdraw success
  {
    from: `toast({
        title: "Withdrawal requested",
        description: "Your withdrawal request has been submitted.",
      });`,
    to: `toast.success("Your withdrawal request has been submitted.");`,
  },
  // Withdraw error
  {
    from: `toast({
        title: "Request failed",
        description: "Failed to submit withdrawal request. Please try again.",
      });`,
    to: `toast.error("Failed to submit withdrawal request. Please try again.");`,
  },
  // Password validation
  {
    from: `toast({
        title: "Missing fields",
        description: "All password fields are required.",
      });`,
    to: `toast.error("All password fields are required.");`,
  },
  // Password mismatch
  {
    from: `toast({
        title: "Password mismatch",
        description: "New password and confirm password do not match.",
      });`,
    to: `toast.error("New password and confirm password do not match.");`,
  },
  // Password too short
  {
    from: `toast({
        title: "Password too short",
        description: "New password must be at least 6 characters long.",
      });`,
    to: `toast.error("New password must be at least 6 characters long.");`,
  },
  // Password change success
  {
    from: `toast({
        title: "Password changed",
        description: "Your password has been changed successfully.",
      });`,
    to: `toast.success("Your password has been changed successfully.");`,
  },
];

replacements.forEach((replacement) => {
  content = content.replace(replacement.from, replacement.to);
});

fs.writeFileSync(profilePath, content);
console.log("Updated profile page toast calls");
