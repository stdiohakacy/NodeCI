const mongoose = require('mongoose')
const redis = require('redis')
const util = require('util')
const redisURL = 'redis://127.0.0.1:6379'
const redisClient = redis.createClient(redisURL)
redisClient.get = util.promisify(redisClient.get)

const exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.exec = async function () {
    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }))

    const cacheValue = await redisClient.get(key)

    if (cacheValue) {
        const document = JSON.parse(cacheValue)

        return Array.isArray(document)
            ? document.map(doc => new this.model(doc))
            : new this.model(document)
    }

    const result = await exec.apply(this, arguments)
    redisClient.set(key, JSON.stringify(result))
    return result
}
