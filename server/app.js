// server/app.js   (ESM)
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';
import { clerkWebhooks } from './controllers/clerkwebhooks.js';

connectDB();                              // one Mongo connection per cold‑start

const app = express();
app.use(cors());
app.use(clerkMiddleware());

/* -- Clerk webhook: needs raw body BEFORE JSON parser -------------------- */
app.post(
  '/api/clerk/webhook',
  express.raw({ type: 'application/json' }),
  clerkWebhooks
);
/* ----------------------------------------------------------------------- */

app.use(express.json());                  // JSON for every other route

app.get('/api', (_, res) => res.send('API is working'));
export default app;                       // ⬅️  No app.listen()
