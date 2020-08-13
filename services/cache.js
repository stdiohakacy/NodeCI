// const mongoose = require('mongoose')
// const redis = require('redis')
// const util = require('util')
// const redisURL = 'redis://127.0.0.1:6379'
// const redisClient = redis.createClient(redisURL)
// redisClient.hget = util.promisify(redisClient.hget)

// const exec = mongoose.Query.prototype.exec

// mongoose.Query.prototype.cache = function (options = {}) {
//     this.useCache = true
//     this.hashKey = JSON.stringify(options.key || '')
//     return this
// }

// mongoose.Query.prototype.exec = async function () {
//     if (!this.useCache)
//         return exec.apply(this, arguments)

//     const key = JSON.stringify(
//         Object.assign({}, this.getQuery(), {
//             collection: this.mongooseCollection.name
//         })
//     )

//     const cacheValue = await redisClient.hget(this.hashKey, key)

//     if (cacheValue) {
//         const document = JSON.parse(cacheValue)

//         return Array.isArray(document)
//             ? document.map(doc => new this.model(doc))
//             : new this.model(document)
//     }

//     const result = await exec.apply(this, arguments)
//     redisClient.hset(this.hashKey, key, JSON.stringify(result), 'EX', 60)
//     return result
// }

const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const client = redis.createClient('redis://127.0.0.1:6379');
client.hget = util.promisify(client.hget);

// create reference for .exec
const exec = mongoose.Query.prototype.exec;

// create new cache function on prototype
mongoose.Query.prototype.cache = function (options = { expire: 60 }) {
    this.useCache = true;
    this.expire = options.expire;
    this.hashKey = JSON.stringify(options.key || this.mongooseCollection.name);

    return this;
}

// override exec function to first check cache for data
mongoose.Query.prototype.exec = async function () {
    if (!this.useCache) {
        return await exec.apply(this, arguments);
    }

    const key = JSON.stringify({
        ...this.getQuery(),
        collection: this.mongooseCollection.name
    });

    // get cached value from redis
    const cacheValue = await client.hget(this.hashKey, key);

    // if cache value is not found, fetch data from mongodb and cache it
    if (!cacheValue) {
        console.log('Return data from MongoDB');
        const result = await exec.apply(this, arguments);
        client.hset(this.hashKey, key, JSON.stringify(result));
        client.expire(this.hashKey, this.expire);
        return result;
    }

    // return found cachedValue
    console.log('Return data from Redis');
    const doc = JSON.parse(cacheValue);
    return Array.isArray(doc)
        ? doc.map(d => new this.model(d))
        : new this.model(doc);
};

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
}
