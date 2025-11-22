// backend/utils/mpesa.js

import axios from 'axios';

// --- HELPER FUNCTIONS ---

// ... (getDarajaBaseURL is unchanged)
const getDarajaBaseURL = () => {
  return process.env.DARAJA_ENV === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';
};

// ... (getTimestamp is unchanged)
const getTimestamp = () => {
  const date = new Date();
  const pad = (num) => num.toString().padStart(2, '0');
  return (
    `${date.getFullYear()}` +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
};

// Function to get a Daraja API access token (with better logging)
export const getDarajaToken = async () => {
  console.log('--- Attempting to get Daraja Token ---');
  const key = process.env.DARAJA_CONSUMER_KEY;
  const secret = process.env.DARAJA_CONSUMER_SECRET;
  const auth = Buffer.from(`${key}:${secret}`).toString('base64');
  const url = `${getDarajaBaseURL()}/oauth/v1/generate?grant_type=client_credentials`;

  console.log(`Using Consumer Key (first 5 chars): ${key.substring(0, 5)}`);
  console.log('Token URL:', url);

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    console.log('--- Successfully got Daraja Token ---');
    return response.data.access_token;
  } catch (error) {
    console.error('--- DARAZA TOKEN ERROR ---');
    if (error.response) {
      console.error('Error Response Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error Message:', error.message);
    }
    console.error('--- END OF DARAZA TOKEN ERROR ---');
    throw new Error('Failed to get M-Pesa access token');
  }
};

// --- STK PUSH (SAVINGS) ---

export const initiateSTKPush = async (phone, amount, accountReference) => {
  const token = await getDarajaToken();
  const timestamp = getTimestamp();
  const shortcode = process.env.DARAJA_SHORTCODE;
  const passkey = process.env.DARAJA_PASSKEY;

  // Create STK push password
  const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');

  // Format phone number to 254...
  const formattedPhone = phone.startsWith('0') ? `254${phone.slice(1)}` : phone;

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline', // or 'CustomerBuyGoodsOnline'
    Amount: amount,
    PartyA: formattedPhone,
    PartyB: shortcode,
    PhoneNumber: formattedPhone,
    CallBackURL: process.env.STK_CALLBACK_URL,
    AccountReference: accountReference,
    TransactionDesc: 'FinGrow Savings Deposit',
  };

  try {
    const response = await axios.post(
      `${getDarajaBaseURL()}/mpesa/stkpush/v1/processrequest`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // Return the STK push response (contains CheckoutRequestID)
    return response.data;
  } catch (error) {
    console.error('--- STK PUSH ERROR ---');
    if (error.response) {
      console.error('STK API Response Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error Message:', error.message);
    }
    console.error('--- END OF STK PUSH ERROR ---');
    throw new Error('Failed to initiate STK push');
  }
};

// --- B2C (LOAN DISBURSEMENT) ---

export const initiateB2C = async (phone, amount, loanId) => {
  const token = await getDarajaToken();
  
  // Format phone number to 254...
  const formattedPhone = phone.startsWith('0') ? `254${phone.slice(1)}` : phone;

  const payload = {
    InitiatorName: process.env.B2C_INITIATOR_NAME,
    SecurityCredential: process.env.B2C_SECURITY_CREDENTIAL,
    CommandID: 'BusinessPayment', // or 'SalaryPayment', 'PromotionPayment'
    Amount: amount,
    PartyA: process.env.B2C_SHORTCODE,
    PartyB: formattedPhone,
    Remarks: `FinGrow Loan Disbursement (ID: ${loanId})`,
    QueueTimeOutURL: process.env.B2C_QUEUE_TIMEOUT_URL,
    ResultURL: process.env.B2C_RESULT_URL,
    Occasion: 'Welfare Loan',
  };

  try {
    const response = await axios.post(
      `${getDarajaBaseURL()}/mpesa/b2c/v1/paymentrequest`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // Return the B2C response (contains ConversationID)
    return response.data;
  } catch (error) {
    console.error('--- B2C ERROR ---');
    if (error.response) {
      console.error('B2C API Response Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error Message:', error.message);
    }
    console.error('--- END OF B2C ERROR ---');
    throw new Error('Failed to initiate B2C disbursement');
  }
};