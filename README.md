# 💼 FinGrow - MERN Welfare Management System

FinGrow is a **full-stack digital welfare management platform** built using the **MERN stack** (MongoDB, Express.js, React, Node.js).  
It provides a clean, modern interface for welfare members to **manage their savings**, **apply for loans**, and **track their financial progress**.  

The platform automates core welfare operations with:
- **M-Pesa Daraja APIs** for seamless mobile money deposits and disbursements.
- **Nodemailer** for automated email notifications.

---

## 🌐 Screenshot
<!-- Replace the link below with an actual screenshot of your landing page -->
![Landing Page Screenshot](https://your-screenshot-url.com)

---

## 🚀 Core Features

### 🔐 Authentication
- Secure JWT (JSON Web Token) authentication.
- Password hashing using **bcrypt**.
- Role-based access (Member vs. Admin).

### 💰 Savings Management
- Members can make direct deposits through **M-Pesa STK Push**.
- Real-time balance and transaction tracking.

### 🏦 Loan Workflow
- Members can request loans online.
- Admins review, approve, or decline requests.
- Approved loans automatically disbursed via **M-Pesa B2C**.
- Automatic **5% interest calculation** on approved loans.

### 📊 User Dashboard
- Personalized view showing:
  - Total savings
  - Loan status
  - Transaction history

### 🧭 Admin Dashboard
- Comprehensive overview of:
  - All members
  - Loan requests
  - Deposits and disbursements

### ✉️ Email Notifications
Automated emails (via Nodemailer) are sent for:
- User Registration  
- Savings Deposit  
- Loan Request  
- Loan Approval / Rejection  
- Loan Disbursement  

### 📬 Public Contact Form
A public-facing contact page allows anyone to message the admin.  
Messages are saved in the database and trigger email notifications.

---

## 🧰 Technology Stack

| Layer        | Technology |
|---------------|-------------|
| **Frontend** | React (Vite) + Tailwind CSS |
| **Backend**  | Node.js + Express.js |
| **Database** | MongoDB Atlas |
| **Payments** | Safaricom M-Pesa Daraja API (STK Push & B2C) |
| **Email**    | Nodemailer (using Gmail transport) |

---

## 📂 Project Structure