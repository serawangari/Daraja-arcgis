import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as axios from 'axios';
import { getAccessToken } from '../../utils/darajaAuth'; // adjust path if needed

// Example usage inside an async function
const accessToken = await getAccessToken();
const response = await axios.post(
  'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
  payload,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Only POST allowed');

  const { phone, amount } = req.body;

  const shortcode = process.env.DARAJA_BUSINESS_SHORT_CODE!;
  const passkey = process.env.DARAJA_PASSKEY!;
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, '')
    .slice(0, 14); // EAT timestamp

  const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');

  try {
    const { data: tokenRes } = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        auth: {
          username: process.env.DARAJA_CONSUMER_KEY!,
          password: process.env.DARAJA_CONSUMER_SECRET!,
        },
      }
    );

    const accessToken = tokenRes.access_token;

    const { data } = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: `${process.env.BASE_URL}/api/callback`,
        AccountReference: 'Test',
        TransactionDesc: 'Test Payment',
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.status(200).json({ message: 'STK push simulated', data });
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'STK push failed', details: error.message });
  }
}
