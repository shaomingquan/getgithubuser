'use strict'
const cheerio = require('cheerio')
const crypto = require('crypto')
const cache = require('lru-cache')(100)

function cheerWrapper (func) {
  return htmltext => {
    let shasum = crypto.createHash('sha1')
    shasum.update(htmltext)
    let hash = shasum.digest('hex')
    let $ = cache.get(hash);
    if(!$) {
      $ = cheerio.load(htmltext)
      cache.set(hash, $)
    }
    return func($, htmltext)
  }
}

exports.getHisMail = cheerWrapper($ => {
  return $('.u-email').text()
})

let keywords = ['JavaScript', 'Css', 'React', 'Vue', 'TypeScript']
exports.isHeJser = cheerWrapper($ => {
  let pinedProjectsHtml = $('.pinned-repos-list').html() || '';
  return keywords.some(keyword => pinedProjectsHtml.indexOf(keyword) > -1)
})

exports.getHisFollowing = cheerWrapper($ => {
  let list = $('.link-gray-dark + .link-gray').map((_, spanDom) => {return spanDom.children[0].data})
  return [].slice.call(list)
})

let positions = ['Beijing', 'China'];
exports.isHeFromChina = cheerWrapper($ => {
  let locationHtml = $('[aria-label="Home location"]').html();
  return positions.some(posi => locationHtml.indexOf(posi) > -1)
})

exports.getStarsAndStared = cheerWrapper($ => {
  let stared = [].slice
    .call($('.pinned-repo-meta'))
    .map((_, __) => { debugger; return parseInt((_.children && _.children[2]) ? _.children[2].data : "0") })
    .filter(_ => _ !== undefined)
    .reduce((ret, current) => ret + current)
  let tabinfo = [].slice.call($('.underline-nav-item > .Counter')).map(_ => parseInt(_.children[0].data))
  return {
    stared,
    tabinfo
  }
})

exports.isHeAGoodJser = cheerWrapper($ => {

})
