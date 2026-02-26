import Redis from "ioredis";

const redisUpstashSessionClient = new Redis(process.env.REDIS_UPSTASH_SESSION!, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        if (times > 3) return null; // Stop retrying after 3 attempts
        return Math.min(times * 200, 2000);
    },
    lazyConnect: true,
});

redisUpstashSessionClient.on('error', (err) => {
    console.error('[Redis Session] Connection error:', err.message);
});

export default redisUpstashSessionClient;
