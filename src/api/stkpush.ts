import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
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

// Helper to get EAT timestamp in YYYYMMDDHHmmss
function getEATTimestamp(): string {
  const date = new Date();
  date.setUTCHours(date.getUTCHours() + 3);
  const yyyy = date.getUTCFullYear();
  const MM = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const HH = String(date.getUTCHours()).padStart(2, '0');
  const mm = String(date.getUTCMinutes()).padStart(2, '0');
  const ss = String(date.getUTCSeconds()).padStart(2, '0');
  return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const accessToken = await getAccessToken();

    const shortcode = process.env.DARAJA_BUSINESS_SHORT_CODE!;
    const passkey = process.env.DARAJA_BUSINESS_SHORT_CODE_PASSKEY!;
    const baseUrl = process.env.BASE_URL!;

    if (!passkey) {
      console.error("❌ DARAJA_BUSINESS_SHORT_CODE_PASSKEY is undefined!");
    }

    const timestamp = getEATTimestamp();
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    const payload: STKPayload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: req.body.amount,
      PartyA: req.body.phone,
      PartyB: shortcode,
      PhoneNumber: req.body.phone,
      CallBackURL: `${baseUrl}/api/callback`,
      AccountReference: 'Test',
      TransactionDesc: 'Test Payment'
    };

    console.log('Full Password Generation:', `${shortcode}${passkey}${timestamp}`);
    console.log('Timestamp:', timestamp);

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    // ✅ SUCCESS: Send structured response
    res.status(200).json({
      success: true,
      message: "Prompt sent successfully",
      data: response.data
    });

  } catch (error: any) {
    console.error('STK Push Error:', error.response?.data || error.message);

    // ❌ ERROR: Send structured error response
    res.status(500).json({
      success: false,
      error: 'STK push failed',
      details: error.response?.data?.errorMessage || error.message
    });
  }
}
