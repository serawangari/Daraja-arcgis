import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as axios from 'axios';
import { getAccessToken } from '../utils/darajaAuth';


// Define payload interface
interface STKPayload {
  BusinessShortCode: string;
  Password: string;
  Timestamp: string;
  TransactionType: string;
  Amount: string;
  PartyA: string;
  PartyB: string;
  PhoneNumber: string;
  CallBackURL: string;
  AccountReference: string;
  TransactionDesc: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Get access token first
    const accessToken = await getAccessToken();

    // Define your payload
    const payload: STKPayload = {
      BusinessShortCode: process.env.DARAJA_BUSINESS_SHORT_CODE!,
      Password: Buffer.from(
        `${process.env.DARAJA_BUSINESS_SHORT_CODE}${process.env.DARAJA_PASSKEY}${new Date()
          .toISOString()
          .replace(/[-:TZ.]/g, '')
          .slice(0, 14)}`
      ).toString('base64'),
      Timestamp: new Date()
        .toISOString()
        .replace(/[-:TZ.]/g, '')
        .slice(0, 14),
      TransactionType: 'CustomerPayBillOnline',
      Amount: req.body.amount,
      PartyA: req.body.phone,
      PartyB: process.env.DARAJA_BUSINESS_SHORT_CODE!,
      PhoneNumber: req.body.phone,
      CallBackURL: `${process.env.BASE_URL}/api/callback`,
      AccountReference: 'Test',
      TransactionDesc: 'Test Payment'
    };
// In stkpush.ts
console.log('Full Password Generation:', 
  `${process.env.DARAJA_BUSINESS_SHORT_CODE}${process.env.DARAJA_PASSKEY}${payload.Timestamp}`
);

// Verify timestamp format matches:
console.log('Timestamp:', payload.Timestamp); // Should be YYYYMMDDHHmmss format
    // Make the request
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error('STK Push Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'STK push failed',
      details: error.response?.data || error.message
    });
  }
}