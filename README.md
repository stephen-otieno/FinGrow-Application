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
```
fingrow/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── utils/ # emailService.js, mpesa.js, etc.
│ ├── server.js
│ ├── .env
│ └── package.json
│
└── frontend/
├── src/
│ ├── api/
│ ├── components/
│ ├── context/
│ ├── pages/
│ └── App.jsx
├── .env
└── package.json

```

## ⚙️ Getting Started

Follow these steps to set up FinGrow on your local machine.

### 🧾 Prerequisites
- Node.js (v16 or later)  
- MongoDB Atlas account  
- Safaricom Daraja Developer Account  
- [ngrok](https://ngrok.com/) (for M-Pesa callback testing)  
- Gmail Account (with an **App Password** for Nodemailer)

---

## 🛠️ 1. Backend Setup

### Clone the Repository
```
git clone https://github.com/your-username/fingrow.git
cd fingrow/backend
```
### Install Dependencies
```
npm install
```

### Environment Variables
Create a .env file inside the backend/ folder and add:

# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_atlas_connection_string

# Auth
JWT_SECRET=your_super_secret_jwt_key

# Email (Use Gmail App Password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# M-Pesa C2B (Savings Deposit STK Push)
DARAJA_ENV=sandbox
DARAJA_CONSUMER_KEY=your_daraja_consumer_key
DARAJA_CONSUMER_SECRET=your_daraja_consumer_secret
DARAJA_SHORTCODE=your_app_shortcode
DARAJA_PASSKEY=your_app_lipa_na_mpesa_passkey
STK_CALLBACK_URL=https://your-ngrok-url.ngrok-free.app/api/mpesa/stk/callback

# M-Pesa B2C (Loan Disbursement)
B2C_INITIATOR_NAME=your_initiator_name
B2C_SECURITY_CREDENTIAL=your_generated_b2c_security_credential
B2C_SHORTCODE=your_app_shortcode
B2C_QUEUE_TIMEOUT_URL=https://your-ngrok-url.ngrok-free.app/api/mpesa/b2c/queue
B2C_RESULT_URL=https://your-ngrok-url.ngrok-free.app/api/mpesa/b2c/result


### 💡 Tip: Create a new app in the Daraja Portal
 that has both “Lipa Na M-PESA” and “M-PESA B2C” APIs enabled.
Use its credentials for the variables above.

## 💻 2. Frontend Setup
Navigate to Frontend
```
cd ../frontend
```
Install Dependencies
```
npm install
```
Create a .env File
VITE_API_URL=http://localhost:5000

🏃‍♂️ Running the Application Locally

You’ll need three terminals open:

🧩 Terminal 1 — Backend
```
cd fingrow/backend
npm run server
```

API runs at http://localhost:5000

🧩 Terminal 2 — Frontend
```
cd fingrow/frontend
npm run dev
```

App runs at http://localhost:5173

🧩 Terminal 3 — Ngrok (for Daraja callbacks)
```
ngrok http 5000
```

Copy your ngrok https URL (e.g., https://random-name.ngrok-free.app)
and update it in your backend .env for all callback URLs.

Restart your backend after updating .env.

### 🧮 Example User Flow

Member registers an account → receives confirmation email.

Member logs in → dashboard shows savings and loan info.

Member deposits via M-Pesa STK push → balance updates automatically.

Member requests a loan → admin reviews and approves.

Approved loan disbursed automatically via M-Pesa B2C.

All transactions and notifications logged and emailed.


