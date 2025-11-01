import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import User from '../../../../models/User';
import connectDB from '../../../../lib/mongodb';

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.text();
  const body = JSON.parse(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400,
    });
  }

  // Handle the webhook
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log('Webhook body:', body);

  try {
    await connectDB();

    if (eventType === 'user.created') {
      const { id, email_addresses, username, first_name, last_name } = evt.data;
      
      // Create user in MongoDB
      const newUser = new User({
        clerkId: id,
        username: username || `${first_name || ''}${last_name || ''}`.trim() || email_addresses[0]?.email_address.split('@')[0],
        email: email_addresses[0]?.email_address,
      });

      await newUser.save();
      console.log('User created in MongoDB:', newUser);
    }

    if (eventType === 'user.updated') {
      const { id, email_addresses, username, first_name, last_name } = evt.data;
      
      // Update user in MongoDB
      const updatedUser = await User.findOneAndUpdate(
        { clerkId: id },
        {
          username: username || `${first_name || ''}${last_name || ''}`.trim() || email_addresses[0]?.email_address.split('@')[0],
          email: email_addresses[0]?.email_address,
        },
        { new: true }
      );

      console.log('User updated in MongoDB:', updatedUser);
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data;
      
      // Delete user from MongoDB
      await User.findOneAndDelete({ clerkId: id });
      console.log('User deleted from MongoDB');
    }

    return new Response('', { status: 200 });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return new Response('Error occurred', { status: 500 });
  }
}