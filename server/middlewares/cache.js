const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => {
    console.error('Redis Error:', err);
});

exports.cacheMiddleware = (req, res, next) => {
    const { userId } = req.params;
    client.get(userId, (err, data) => {
        if (err) throw err;
        if (data !== null) {
            res.send(JSON.parse(data));
        } else {
            next();
        }
    });
};

exports.setCache = (key, data) => {
    client.setex(key, 3600, JSON.stringify(data)); // Cache for 1 hour
};
