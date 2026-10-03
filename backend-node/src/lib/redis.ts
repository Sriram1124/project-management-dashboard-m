import IORedis from 'ioredis';

let redisInstance: IORedis | null = null;

export function getRedisUrl(): string {
  return process.env.REDIS_URL || 'redis://127.0.0.1:6379';
}

export function getRedisConnection(): IORedis {
  if (!redisInstance) {
    const url = getRedisUrl();
    redisInstance = new IORedis(url, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy(times) {
        // Exponential backoff up to 2 seconds
        return Math.min(times * 100, 2000);
      },
    });

    redisInstance.on('error', (err) => {
      console.error('[Redis] Connection error:', err.message);
    });

    redisInstance.on('connect', () => {
      console.log('[Redis] Connected successfully to', url.replace(/:\/\/[^@]*@/, '://***@'));
    });
  }

  return redisInstance;
}

export function createNewRedisConnection(): IORedis {
  const url = getRedisUrl();
  return new IORedis(url, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy(times) {
      return Math.min(times * 100, 2000);
    },
  });
}
