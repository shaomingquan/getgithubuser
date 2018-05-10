let from = ["shaomingquan"]
let jsers = [""]

const fs = require("fs")
const fetch = require("node-fetch")
const pageinfo = require("./pageinfo")
const getHisMainPage = async user => {
  return fetch(`https://github.com/${user}`).then(res => res.text())
}

const getHisFollowingPage = async user => {
  return fetch(`https://github.com/${user}?tab=following`).then(res => res.text())
}

const delay = async ms => {
  return new Promise (res => setTimeout(res, ms))
}

async function main () {
  let currentUser = '';
  while(currentUser = from.shift()) {
    // 先看他是不是一个写js的
    let hisMainPage = await getHisMainPage(currentUser);

    console.log(currentUser)
    // 有邮箱的都搞下来
    let email = pageinfo.getHisMail(hisMainPage)
    console.log(email)

    if(
        email && true
        // pageinfo.isHeFromChina(hisMainPage)
      ) {
      // 如果他是一个jser，且来自中国，拉取关注他的人放入队列
      let hisMetric = pageinfo.getStarsAndStared(hisMainPage)

      console.log({
        email,
        hisMetric,
      })
      
      // 被别人following的人，被认为是有效用户
      let hisFollowingHtml = await getHisFollowingPage(currentUser);
      let hisFollowing = pageinfo.getHisFollowing(hisFollowingHtml);
      from.push(...hisFollowing)
      from.splice(1000)
    }
    await delay(100)
  }
  // main().then(_ => _).catch(handleE)
}
main().then(_ => _).catch(handleE)

function handleE (e) {
  console.error(e);
}
