// src/utils/darajaAuth.ts
import axios from 'axios';

export const getAccessToken = async (): Promise<string> => {
  const consumerKey = process.env.DARAJA_CONSUMER_KEY!;
  const consumerSecret = process.env.DARAJA_CONSUMER_SECRET!;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  interface AuthResponse {
    access_token: string;
    expires_in:   string;
  }

  try {
    const { data } = await axios.get<AuthResponse>(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );
    return data.access_token;
  } catch (e: any) {
    console.error('Auth Error:', e.response?.data || e.message);
    throw new Error('Failed to get access token');
  }
}


// import * as axios from 'axios';

// export const getAccessToken = async (): Promise<string> => {
//   const consumerKey = process.env.DARAJA_CONSUMER_KEY!;
//   const consumerSecret = process.env.DARAJA_CONSUMER_SECRET!;
//   const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

//   try {
//     interface AuthResponse {
//       access_token: string;
//       expires_in: string;
//     }

//     const response = await axios.get<AuthResponse>(
//       'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
//       {
//         headers: {
//           Authorization: `Basic ${auth}`,
//         },
//       }
//     );

//     return response.data.access_token;
//   } catch (error: any) {
//     console.error('Auth Error:', error.response?.data || error.message);
//     throw new Error('Failed to get access token');
//   }
// };

// // export default { getAccessToken };