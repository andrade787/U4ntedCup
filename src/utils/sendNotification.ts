// utils/sendNotification.ts
import { realtimeDB } from '@/firebase/firebaseAdmin';
import { z } from 'zod';
import { serverTimestamp } from 'firebase/database';
// Define the notification schema using zod
const notificationSchema = z.object({
  type: z.string(),
  message: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
  teamId: z.string().optional(),
  additionalInfo: z.string().array().optional(),
});

interface NotificationData {
  type: string;
  message: string;
  senderId: string;
  receiverId: string;
  teamId?: string;
  additionalInfo?: Array<string>;
}

export async function sendNotification(notificationData: NotificationData) {
  const { type, message, senderId, receiverId, teamId, additionalInfo } =
    notificationSchema.parse(notificationData);

  // Reference for the receiver's notifications node
  const notificationsRef = realtimeDB.ref(`notifications/${receiverId}`).push();

  await notificationsRef.set({
    notificationId: notificationsRef.key,
    type,
    isRead: false,
    message,
    senderId,
    receiverId,
    teamId,
    additionalInfo,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { message: 'Notification sent successfully' };
}
