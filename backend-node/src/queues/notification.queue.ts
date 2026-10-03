import { Queue } from 'bullmq';
import { getRedisConnection } from '../lib/redis';

export const NOTIFICATION_QUEUE_NAME = 'notification-queue';

export interface NotificationJobData {
  notification_id: string;
}

export const notificationQueue = new Queue<NotificationJobData>(NOTIFICATION_QUEUE_NAME, {
  connection: getRedisConnection(),
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: {
      age: 3600, // Keep completed jobs for 1 hour for monitoring
      count: 1000,
    },
    removeOnFail: {
      age: 86400, // Keep failed jobs for 24 hours for inspection
      count: 500,
    },
  },
});

export async function enqueueNotificationJob(notificationId: string) {
  if (!notificationId) {
    throw new Error('Notification ID is required to enqueue job');
  }

  const job = await notificationQueue.add(
    'process-notification',
    { notification_id: notificationId },
    {
      jobId: `notif-${notificationId}`,
    }
  );

  console.log(`[Queue] Enqueued notification job ${job.id} for notification ${notificationId}`);
  return job;
}
