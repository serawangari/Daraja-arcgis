"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = void 0;
// src/utils/darajaAuth.ts
const axios = __importStar(require("axios")); // ← CommonJS/namespace import
const getAccessToken = async () => {
    const consumerKey = process.env.DARAJA_CONSUMER_KEY;
    const consumerSecret = process.env.DARAJA_CONSUMER_SECRET;
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    try {
        const { data } = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', { headers: { Authorization: `Basic ${auth}` } });
        return data.access_token;
    }
    catch (e) {
        console.error('Auth Error:', e.response?.data || e.message);
        throw new Error('Failed to get access token');
    }
};
exports.getAccessToken = getAccessToken;
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
