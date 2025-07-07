# MongoDB Database Schema

This document outlines the complete database schema for the Mutual Fund Management System.

## Database Name
`mutual_fund_db`

## Collections

### 1. users
Stores all user information (both admins and members)

\`\`\`javascript
{
  _id: ObjectId,                    // MongoDB auto-generated ID
  name: String,                     // Full name
  email: String,                    // Email (unique index)
  password: String,                 // Plain text password (as requested)
  role: String,                     // "admin" or "member"
  phone: String,                    // Phone number (optional)
  joinDate: String,                 // Date in YYYY-MM-DD format
  dob: String,                      // Date of birth in YYYY-MM-DD format (optional)
  occupation: String,               // Job/occupation (optional)
  address: String,                  // Full address (optional)
  image: String,                    // Profile image URL (optional)
  status: String,                   // "active", "pending", or "inactive"
  bankDetails: {                    // Bank/payment information
    method: String,                 // "bank", "bkash", "nagad", "rocket", "card"
    accountNumber: String,          // Account number
    bankName: String,               // Bank name
    routingNumber: String           // Routing number (for bank transfers)
  },
  createdAt: Date,                  // Creation timestamp
  updatedAt: Date                   // Last update timestamp
}
\`\`\`

**Indexes:**
- `{ email: 1 }` (unique)

**Sample Admin User:**
\`\`\`javascript
{
  name: "Admin User",
  email: "admin@company.com",
  password: "admin123",
  role: "admin",
  phone: "+1234567890",
  joinDate: "2024-01-01",
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date()
}
\`\`\`

**Sample Member User:**
\`\`\`javascript
{
  name: "John Doe",
  email: "john@example.com", 
  password: "member123",
  role: "member",
  phone: "+1234567891",
  joinDate: "2024-01-15",
  dob: "1990-05-15",
  occupation: "Software Engineer",
  address: "123 Main St, City, State 12345",
  status: "active",
  bankDetails: {
    method: "bkash",
    accountNumber: "01712345678",
    bankName: "bKash",
    routingNumber: ""
  },
  createdAt: new Date(),
  updatedAt: new Date()
}
\`\`\`

### 2. transactions
Stores all completed transactions (deposits, withdrawals, profits)

\`\`\`javascript
{
  _id: ObjectId,                    // MongoDB auto-generated ID
  memberId: ObjectId,               // Reference to users._id
  memberName: String,               // Member's name (for quick access)
  memberImage: String,              // Member's profile image URL (optional)
  type: String,                     // "deposit", "withdrawal", or "profit"
  amount: Number,                   // Transaction amount
  date: String,                     // Transaction date in YYYY-MM-DD format
  method: String,                   // Payment method used
  status: String,                   // "pending", "completed", or "rejected"
  note: String,                     // Additional notes (optional)
  createdBy: ObjectId,              // ID of user who created this transaction
  createdAt: Date,                  // Creation timestamp
  updatedAt: Date                   // Last update timestamp
}
\`\`\`

**Indexes:**
- `{ memberId: 1 }`
- `{ type: 1 }`
- `{ status: 1 }`
- `{ createdAt: -1 }`

**Sample Transaction:**
\`\`\`javascript
{
  memberId: ObjectId("..."),
  memberName: "John Doe",
  memberImage: "https://example.com/profile.jpg",
  type: "deposit",
  amount: 1000,
  date: "2024-01-20",
  method: "bkash",
  status: "completed",
  note: "Initial investment",
  createdBy: ObjectId("..."),
  createdAt: new Date(),
  updatedAt: new Date()
}
\`\`\`

### 3. deposit_requests
Stores pending deposit requests from members

\`\`\`javascript
{
  _id: ObjectId,                    // MongoDB auto-generated ID
  memberId: ObjectId,               // Reference to users._id
  memberName: String,               // Member's name
  memberImage: String,              // Member's profile image URL (optional)
  amount: Number,                   // Requested deposit amount
  method: String,                   // Preferred payment method
  note: String,                     // Request note (optional)
  status: String,                   // "pending", "approved", or "rejected"
  createdAt: Date,                  // Request creation timestamp
  updatedAt: Date                   // Last update timestamp
}
\`\`\`

**Indexes:**
- `{ memberId: 1 }`
- `{ status: 1 }`

**Sample Deposit Request:**
\`\`\`javascript
{
  memberId: ObjectId("..."),
  memberName: "John Doe",
  memberImage: "https://example.com/profile.jpg",
  amount: 1500,
  method: "nagad",
  note: "Additional investment for Q1",
  status: "pending",
  createdAt: new Date(),
  updatedAt: new Date()
}
\`\`\`

### 4. withdrawal_requests
Stores pending withdrawal requests from members

\`\`\`javascript
{
  _id: ObjectId,                    // MongoDB auto-generated ID
  memberId: ObjectId,               // Reference to users._id
  memberName: String,               // Member's name
  memberImage: String,              // Member's profile image URL (optional)
  amount: Number,                   // Requested withdrawal amount
  method: String,                   // Preferred payment method
  note: String,                     // Request note/reason (optional)
  status: String,                   // "pending", "approved", or "rejected"
  createdAt: Date,                  // Request creation timestamp
  updatedAt: Date                   // Last update timestamp
}
\`\`\`

**Indexes:**
- `{ memberId: 1 }`
- `{ status: 1 }`

**Sample Withdrawal Request:**
\`\`\`javascript
{
  memberId: ObjectId("..."),
  memberName: "John Doe", 
  memberImage: "https://example.com/profile.jpg",
  amount: 500,
  method: "bkash",
  note: "Emergency withdrawal",
  status: "pending",
  createdAt: new Date(),
  updatedAt: new Date()
}
\`\`\`

## MongoDB Commands

### Connect to Database
\`\`\`bash
# Local MongoDB
mongosh mongodb://localhost:27017/mutual_fund_db

# MongoDB Atlas
mongosh "mongodb+srv://username:password@cluster.mongodb.net/mutual_fund_db"
\`\`\`

### Create Admin User
\`\`\`javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@company.com",
  password: "admin123",
  role: "admin",
  phone: "+1234567890",
  joinDate: "2024-01-01",
  status: "active",
  bankDetails: {
    method: "bank",
    accountNumber: "",
    bankName: "",
    routingNumber: ""
  },
  createdAt: new Date(),
  updatedAt: new Date()
})
\`\`\`

### Create Member User
\`\`\`javascript
db.users.insertOne({
  name: "John Doe",
  email: "john@example.com",
  password: "member123", 
  role: "member",
  phone: "+1234567891",
  joinDate: "2024-01-15",
  dob: "1990-05-15",
  occupation: "Software Engineer",
  address: "123 Main St, City, State 12345",
  status: "active",
  bankDetails: {
    method: "bkash",
    accountNumber: "01712345678",
    bankName: "bKash",
    routingNumber: ""
  },
  createdAt: new Date(),
  updatedAt: new Date()
})
\`\`\`

### Create Transaction
\`\`\`javascript
// First get the member's ObjectId
const member = db.users.findOne({email: "john@example.com"})

// Then create transaction
db.transactions.insertOne({
  memberId: member._id,
  memberName: member.name,
  memberImage: member.image || "",
  type: "deposit",
  amount: 1000,
  date: "2024-01-20",
  method: "bkash",
  status: "completed",
  note: "Initial deposit",
  createdBy: member._id,
  createdAt: new Date(),
  updatedAt: new Date()
})
\`\`\`

### Useful Queries

\`\`\`javascript
// Get all users
db.users.find()

// Get all members
db.users.find({role: "member"})

// Get member's transactions
db.transactions.find({memberId: ObjectId("...")})

// Get pending deposit requests
db.deposit_requests.find({status: "pending"})

// Calculate member balance
const memberId = ObjectId("...")
const transactions = db.transactions.find({
  memberId: memberId, 
  status: "completed"
}).toArray()

let balance = 0
transactions.forEach(t => {
  if (t.type === "deposit" || t.type === "profit") {
    balance += t.amount
  } else if (t.type === "withdrawal") {
    balance -= t.amount
  }
})
console.log("Member balance:", balance)
\`\`\`

## Important Notes

1. **Passwords**: Currently stored as plain text as requested
2. **ObjectId References**: Use proper ObjectId when referencing between collections
3. **Indexes**: All necessary indexes are created automatically
4. **Date Format**: Use YYYY-MM-DD format for date strings
5. **Status Values**: Use exact strings as shown in schema
6. **Role Values**: Only "admin" and "member" are supported

## Environment Variables Required

\`\`\`env
MONGODB_URI=mongodb://localhost:27017/mutual_fund_db
JWT_SECRET=your-jwt-secret-key
NEXT_PUBLIC_API_URL=http://localhost:3000
