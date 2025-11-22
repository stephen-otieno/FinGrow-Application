# FinGrow - Digital Welfare Management Platform

FinGrow is a full-stack MERN web application designed to digitize and automate the operations of informal welfare groups ("Chamas"). It streamlines savings, loan processing, and record-keeping through real-time dashboards and seamless M-Pesa integration.

---
🔗 Quick Links

🚀 View Live Application > https://fingrow-iota.vercel.app/

📊 View Pitch Deck > https://www.canva.com/design/DAG4rFojGCA/rz18FaRjaNQQ2_EJbun9nA/view?utm_content=DAG4rFojGCA&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h3eb5209f29

---

## 🚀 Project Overview

Traditional welfare groups often struggle with:

- Manual record-keeping
- Lack of transparency
- Delayed loan processing

*FinGrow* addresses these challenges by offering:

- *Real-time Transparency*: Members can view their savings and loan status 24/7.
- *Automated Transactions*: Integrated with Safaricom Daraja API for instant savings (STK Push) and loan disbursements (B2C).
- *Admin Efficiency*: A dedicated dashboard for approving loans and monitoring group finances.

---

## 🛠 Tech Stack

| Layer       | Technology |
|-------------|------------|
| Frontend    | React.js (Vite), Tailwind CSS, React Router v6 |
| Backend     | Node.js, Express.js |
| Database    | MongoDB Atlas (Mongoose) |
| Payments    | Safaricom M-Pesa Daraja API (C2B & B2C) |
| Email       | Nodemailer (Gmail SMTP) |
| Testing     | Ngrok (for webhook testing) |

---

## Project Structure
```

fingrow/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── .env
│   └── vite.config.js
└── README.md
```

## ✨ Key Features

- *User Authentication*: Secure Sign Up/Login with JWT & bcrypt.
- *Savings Management*: Members deposit funds via M-Pesa STK Push.
- *Loan Workflow*:
  - Members request loans via the dashboard.
  - Admins approve/decline requests.
  - Approved loans are disbursed via M-Pesa B2C API.
- *Loan Repayment*: Members repay loans via M-Pesa; balances update automatically.
- *Dashboards*:
  - User: View savings, active loans, and transaction history.
  - Admin: Manage users, approve loans, and monitor system-wide stats.
- *Notifications*: Automated emails for registration, deposits, loan status, and disbursements.

---

## 🖼 Screenshot
### Landing page
<img width="1905" height="819" alt="image" src="https://github.com/user-attachments/assets/ff45a8f4-3848-44ec-a6a1-b0385539b6ae" />

### user dashboard
<img width="1919" height="875" alt="image" src="https://github.com/user-attachments/assets/192673d4-cbfc-4efb-b84a-fb73497e8ca5" />

## admin dashboard
<img width="1919" height="871" alt="image" src="https://github.com/user-attachments/assets/c7ae5ac6-cef8-4e09-8c6b-f7ab57a04bec" />

---

## ⚙ Installation & Setup

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas Account
- Safaricom Developer Account (Daraja Sandbox)
- Ngrok (for webhook testing)

### 1. Clone the Repository

```
git clone https://github.com/your-username/fingrow.git
cd fingrow
```

### 2. Backend Setup

```
cd backend
npm install

```
Create a .env file in the backend directory:

env
# Server
```
PORT=5000
NODE_ENV=development
```
# Database
```
MONGO_URI=your_mongodb_connection_string
```
# Auth
```
JWT_SECRET=your_jwt_secret_key
```
# Email Service
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_google_app_password
```
# M-Pesa Configuration
```
DARAJA_ENV=sandbox
DARAJA_CONSUMER_KEY=your_consumer_key
DARAJA_CONSUMER_SECRET=your_consumer_secret
DARAJA_SHORTCODE=174379
DARAJA_PASSKEY=your_lipa_na_mpesa_online_passkey
```
# M-Pesa B2C
```
B2C_INITIATOR_NAME=testapi
B2C_SECURITY_CREDENTIAL=your_generated_security_credential
B2C_SHORTCODE=174379
```
# Callback URLs (replace with your Ngrok URL)
```
MPESA_CALLBACK_URL=https://your-ngrok-url.ngrok-free.app/api/mpesa/callback
B2C_QUEUE_TIMEOUT_URL=https://your-ngrok-url.ngrok-free.app/api/mpesa/b2c/queue
B2C_RESULT_URL=https://your-ngrok-url.ngrok-free.app/api/mpesa/b2c/result
```

### 3. Frontend Setup

```
cd ../frontend
npm install
```

Create a .env file in the frontend directory:

env
```
VITE_API_URL=http://localhost:5000

```
---

## 🏃‍♂ Running the Application

Run the following in separate terminals:

### Terminal 1: Backend

```
cd backend
npm run server
```

### Terminal 2: Frontend

```
cd frontend
npm run dev
```

### Terminal 3: Ngrok

```
ngrok http 5000
```

Update the .env file with the Ngrok HTTPS URL and restart the backend server.

---

## 🔑 Admin Access

By default, users register as "members". To promote a user to admin:

1. Open MongoDB Compass or Atlas.
2. Navigate to the users collection.
3. Find the user document.
4. Change the role field from "member" to "admin".

---

## 🧪 Testing M-Pesa (Sandbox)

- *Savings (STK Push)*: Trigger a deposit from the User Dashboard using a test number or the Daraja simulator.
- *Loan Disbursement*:
  - Request a loan as a user.
  - Use test number 254708374149 for disbursement.
  - Approve the loan from the Admin Dashboard.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.
