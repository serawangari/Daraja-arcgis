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
const axios = __importStar(require("axios"));
const darajaAuth_1 = require("../utils/darajaAuth");
async function handler(req, res) {
    try {
        // Get access token first
        const accessToken = await (0, darajaAuth_1.getAccessToken)();
        // Define your payload
        const payload = {
            BusinessShortCode: process.env.DARAJA_BUSINESS_SHORT_CODE,
            Password: Buffer.from(`${process.env.DARAJA_BUSINESS_SHORT_CODE}${process.env.DARAJA_PASSKEY}${new Date()
                .toISOString()
                .replace(/[-:TZ.]/g, '')
                .slice(0, 14)}`).toString('base64'),
            Timestamp: new Date()
                .toISOString()
                .replace(/[-:TZ.]/g, '')
                .slice(0, 14),
            TransactionType: 'CustomerPayBillOnline',
            Amount: req.body.amount,
            PartyA: req.body.phone,
            PartyB: process.env.DARAJA_BUSINESS_SHORT_CODE,
            PhoneNumber: req.body.phone,
            CallBackURL: `${process.env.BASE_URL}/api/callback`,
            AccountReference: 'Test',
            TransactionDesc: 'Test Payment'
        };
        // In stkpush.ts
        console.log('Full Password Generation:', `${process.env.DARAJA_BUSINESS_SHORT_CODE}${process.env.DARAJA_PASSKEY}${payload.Timestamp}`);
        // Verify timestamp format matches:
        console.log('Timestamp:', payload.Timestamp); // Should be YYYYMMDDHHmmss format
        // Make the request
        const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        res.status(200).json(response.data);
    }
    catch (error) {
        console.error('STK Push Error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'STK push failed',
            details: error.response?.data || error.message
        });
    }
}
exports.default = handler;
