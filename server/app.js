// server/app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';
import { clerkWebhooks } from './controllers/clerkwebhooks.js';

connectDB();

const app = express();

app.use(cors());
app.use(clerkMiddleware());

// Webhook with raw body
app.post(
  '/api/clerk/webhook',
  express.raw({ type: 'application/json' }),
  clerkWebhooks
);

// All other routes use JSON body
app.use(express.json());

app.get('/api', (req, res) => {
  res.send('API is working');
});

export default app;
