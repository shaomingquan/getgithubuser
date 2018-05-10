const level = require("level")
const bb = require("bluebird")

const db = level('./userinfo')
bb.promisifyAll(db)

let latestIndex = -1
;(async function () {
    try {
        latestIndex = Number(await db.getAsync("__latestIndex"))
    } catch (e) {}
} ())

async function get (key) {
    let index = await db.getAsync(key)
    console.log(index)
    return db.getAsync(index)
}

async function getByIndex(index) {
    return db.getAsync("index-" + index)
}

async function put (key, value) {
    latestIndex += 1
    let newIndex = "index-" + latestIndex
    let exsit = false
    try {
        await db.getAsync(key)
        exsit = true
    } catch (e) {}
    if (exsit) {
        return
    }

    await db.putAsync(key, newIndex)
    console.log(newIndex)
    await db.putAsync(newIndex, value)
    await db.putAsync("__latestIndex", newIndex)
}

module.exports = {
    get,
    put,
    getByIndex,
}