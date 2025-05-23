"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handler(req, res) {
    console.log('Callback received:', req.body);
    res.status(200).json({ message: 'Callback received successfully' });
}
exports.default = handler;
