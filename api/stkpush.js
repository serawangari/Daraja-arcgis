"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
var axios = require("axios");
var darajaAuth_1 = require("../../utils/darajaAuth"); // adjust path if needed
// Example usage inside an async function
var accessToken = await (0, darajaAuth_1.getAccessToken)();
var response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', payload, {
    headers: {
        Authorization: "Bearer ".concat(accessToken),
    },
});
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, phone, amount, shortcode, passkey, timestamp, password, tokenRes, accessToken_1, data, error_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (req.method !== 'POST')
                        return [2 /*return*/, res.status(405).send('Only POST allowed')];
                    _a = req.body, phone = _a.phone, amount = _a.amount;
                    shortcode = process.env.DARAJA_BUSINESS_SHORT_CODE;
                    passkey = process.env.DARAJA_PASSKEY;
                    timestamp = new Date()
                        .toISOString()
                        .replace(/[-:TZ.]/g, '')
                        .slice(0, 14);
                    password = Buffer.from(shortcode + passkey + timestamp).toString('base64');
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
                            auth: {
                                username: process.env.DARAJA_CONSUMER_KEY,
                                password: process.env.DARAJA_CONSUMER_SECRET,
                            },
                        })];
                case 2:
                    tokenRes = (_c.sent()).data;
                    accessToken_1 = tokenRes.access_token;
                    return [4 /*yield*/, axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
                            BusinessShortCode: shortcode,
                            Password: password,
                            Timestamp: timestamp,
                            TransactionType: 'CustomerPayBillOnline',
                            Amount: amount,
                            PartyA: phone,
                            PartyB: shortcode,
                            PhoneNumber: phone,
                            CallBackURL: "".concat(process.env.BASE_URL, "/api/callback"),
                            AccountReference: 'Test',
                            TransactionDesc: 'Test Payment',
                        }, {
                            headers: {
                                Authorization: "Bearer ".concat(accessToken_1),
                            },
                        })];
                case 3:
                    data = (_c.sent()).data;
                    res.status(200).json({ message: 'STK push simulated', data: data });
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _c.sent();
                    console.error(((_b = error_1.response) === null || _b === void 0 ? void 0 : _b.data) || error_1.message);
                    res.status(500).json({ error: 'STK push failed', details: error_1.message });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
