# Mutual Fund Management System

A modern, responsive web application for managing mutual fund operations with separate admin and member portals.

## Features

### Admin Portal

- **Dashboard**: Overview of total balance, members, deposits, withdrawals, and profits
- **Member Management**: Add, edit, view, and manage member profiles
- **Deposit Management**: Handle member deposits and approve deposit requests
- **Withdrawal Management**: Process withdrawals and approve withdrawal requests
- **Profit Sharing**: Distribute profits to members
- **Transaction Ledger**: Complete transaction history across the system
- **Profile Management**: Update admin profile information and change password
  - Update profile photo, name, phone, occupation, and address
  - Change password securely
  - Email cannot be modified for security reasons

### Member Portal

- **Dashboard**: Personal balance, deposits, withdrawals, and profits overview
- **Profile Management**: Update personal information and bank details
- **Transaction History**: View personal transaction history
- **Request System**: Submit deposit and withdrawal requests

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **UI Components**: Radix UI primitives with custom styling
- **Database**: MongoDB with native driver

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd mutual-fund-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   \`\`\`env

   # MongoDB Connection

   MONGODB_URI=mongodb://localhost:27017/mutual_fund_db

   # or for MongoDB Atlas:

   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mutual_fund_db

   # JWT Secret (use a strong secret in production)

   JWT_SECRET=your-super-secret-jwt-key-here

   # Next.js API URL

   NEXT_PUBLIC_API_URL=http://localhost:3000
   \`\`\`

4. **Set up the database with demo data**
   \`\`\`bash
   npm run setup-db
   \`\`\`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Demo Credentials

After running the database setup, you can use these credentials:

### Admin Access

- **Email**: admin@demo.com
- **Password**: admin123

### Member Access

- **Email**: john@demo.com
- **Password**: member123
- **Email**: jane@demo.com
- **Password**: member123
- **Email**: mike@demo.com
- **Password**: member123
- **Email**: sarah@demo.com
- **Password**: member123

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/change-password` - Change password (requires email)
- `POST /api/auth/admin/change-password` - Admin password change (no email required)
- `GET /api/auth/profile` - Get admin profile
- `PUT /api/auth/profile` - Update admin profile

### Members

- `GET /api/members` - Get all members (with pagination and filters)
- `POST /api/members` - Create new member
- `GET /api/members/[id]` - Get member by ID
- `PUT /api/members/[id]` - Update member
- `DELETE /api/members/[id]` - Delete member

### Transactions

- `GET /api/transactions` - Get all transactions (with filters)
- `POST /api/transactions` - Create new transaction

### Deposits

- `GET /api/deposits` - Get deposits and pending requests
- `POST /api/deposits` - Create new deposit
- `POST /api/deposits/request` - Submit deposit request
- `POST /api/deposits/approve/[id]` - Approve deposit request
- `POST /api/deposits/decline/[id]` - Decline deposit request

### Withdrawals

- `GET /api/withdrawals` - Get withdrawals and pending requests
- `POST /api/withdrawals` - Create new withdrawal
- `POST /api/withdrawals/request` - Submit withdrawal request
- `POST /api/withdrawals/approve/[id]` - Approve withdrawal request
- `POST /api/withdrawals/decline/[id]` - Decline withdrawal request

### Profits

- `GET /api/profits` - Get all profit distributions
- `POST /api/profits`
# quick-medicine-management
# quick-medicine-management
