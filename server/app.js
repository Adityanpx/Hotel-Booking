import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';
import { clerkWebhooks } from './controllers/clerkwebhooks.js';

connectDB();

const app = express();
app.use(cors());
app.use(clerkMiddleware());

// Raw body for webhooks
app.post('/api/clerk/webhook', express.raw({ type: 'application/json' }), clerkWebhooks);

// For other routes
app.use(express.json());

app.get('/api', (req, res) => {
  res.send('API is working 🚀');
});

export default app;
