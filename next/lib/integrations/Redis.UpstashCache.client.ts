import Redis from "ioredis";

const redisClient = new Redis(process.env.REDIS_UPSTASH_CACHE!, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        if (times > 3) return null; // Stop retrying after 3 attempts
        return Math.min(times * 200, 2000);
    },
    lazyConnect: true,
});

redisClient.on('error', (err) => {
    console.error('[Redis Cache] Connection error:', err.message);
});

export default redisClient;
