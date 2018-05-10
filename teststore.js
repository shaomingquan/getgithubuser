const store = require('./store')

;(async function () {
    await store.put("a", 1)
    await store.put("b", 2)
    await store.put("c", 3)

    var latestindex = await store.get("__latestIndex")
    console.log(latestindex)
    for (var i = 0 ; i < latestindex ; i ++) {
        let val = await store.getByIndex(i)
        console.log(val)
    }

    let val = await store.get("a")
    val = await store.get("b")
    val = await store.get("c")
    console.log(val)
} ())