// utils/markNotification.ts
import { realtimeDB } from '@/firebase/firebaseAdmin';

export async function markNotificationAsRead(notificationId: string, receiverId: string) {
  try {
    // Reference to the specific notification
    const notificationRef = realtimeDB.ref(`notifications/${receiverId}/${notificationId}`);

    await notificationRef.update({ isRead: true });

    return { status: 'success', message: 'Notification marked as read successfully' };
  } catch (error) {
    if (error instanceof Error) {
      return { status: 'error', message: 'Failed to mark notification as read', error: error.message };
    } else {
      return { status: 'error', message: 'Failed to mark notification as read', error: 'Unknown error' };
    }
  }
}
