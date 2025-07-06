// server/controllers/clerkwebhooks.js
import { Webhook } from 'svix';
import User from '../models/User.js';

export const clerkWebhooks = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // raw body → string
    const payload = req.body.toString('utf8');
    const headers = {
      'svix-id':        req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    };

    const { type, data } = wh.verify(payload, headers);

    const userData = {
      _id:      data.id,
      email:    data.email_addresses?.[0]?.email_address,
      username: `${data.first_name} ${data.last_name}`,
      image:    data.image_url,
    };

    if (type === 'user.created') await User.create(userData);
    if (type === 'user.updated') await User.findByIdAndUpdate(data.id, userData);
    if (type === 'user.deleted') await User.findByIdAndDelete(data.id);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};
