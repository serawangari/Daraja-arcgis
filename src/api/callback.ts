import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Callback received:', req.body);
  res.status(200).json({ message: 'Callback received successfully' });
}
