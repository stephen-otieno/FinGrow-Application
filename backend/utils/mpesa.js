import axios from 'axios';

// --- HELPER FUNCTIONS ---

// Function to get the Daraja API base URL
const getDarajaBaseURL = () => {
  return process.env.DARAJA_ENV === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';
};

// Function to get a Daraja API access token
export const getDarajaToken = async () => {
  console.log('--- Attempting to get Daraja Token ---'); // New Log
  const key = process.env.DARAJA_CONSUMER_KEY;
  const secret = process.env.DARAJA_CONSUMER_SECRET;

  if (!key || !secret) {
    console.error('FATAL: DARAJA_CONSUMER_KEY or DARAJA_CONSUMER_SECRET is missing from .env');
    throw new Error('Missing M-Pesa credentials in .env file');
  }

  // New Log: Let's check the first few chars of the key
  console.log('Using Consumer Key (first 5 chars):', key.substring(0, 5));

  const auth = Buffer.from(`${key}:${secret}`).toString('base64');
  const url = `${getDarajaBaseURL()}/oauth/v1/generate?grant_type=client_credentials`;
  console.log('Token URL:', url); // New Log

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    console.log('--- Successfully got Daraja Token ---'); // New Log
    return response.data.access_token;
  } catch (error) {
    // --- THIS IS THE CRITICAL LOGGING ---
    console.error('--- ERROR GETTING DARAJA TOKEN ---');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Safaricom API Response Status:', error.response.status);
      console.error('Safaricom API Response Headers:', error.response.headers);
      console.error('Safaricom API Response Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from Safaricom API. Check network.');
      console.error('Error Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Axios Error Message:', error.message);
    }
    console.error('--- END OF DARAJA TOKEN ERROR ---');
    throw new Error('Failed to get M-Pesa access token. Check backend logs for details.');
  }
};

// Function to format timestamp (YYYYMMDDHHMMSS)
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

// --- STK PUSH (SAVINGS) ---

export const initiateSTKPush = async (phone, amount, accountReference) => {
  const token = await getDarajaToken(); // This will fail if auth is wrong
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
      console.error('Axios Error Message:', error.message);
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
      console.error('Axios Error Message:', error.message);
    }
    console.error('--- END OF B2C ERROR ---');
    throw new Error('Failed to initiate B2C disbursement');
  }
};
