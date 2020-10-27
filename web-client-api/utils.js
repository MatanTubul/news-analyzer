const consts = require('./consts')

/**
 * Geting a Dates for start and end, calculating date range
 * @param start <Date object>
 * @param end <Date object>
 * @return {[]}
 */
function getDaysArray(start, end) {
  let arr = []
  let dt = start
  for(;dt < end; dt.setDate(dt.getDate()+1)) {

    dt.setHours(0,0,0,0)
    arr.push(new Date(dt).toISOString().slice(0,10));
  }
  // adding last date due to time diff compression and avoiding UTC casting
  arr.push(new Date(dt).toISOString().slice(0,10))
  return arr;
}

/**
 * build news-api url for axios fetch
 * @param {string} endPoint - news-api endpoint
 * @param {string} query
 * @return {string}
 */
function buildNewsUrl(endPoint, query) {
  return `${consts.NEWS_API_BASE_URL}${endPoint}${query}`
}

module.exports = {
  buildNewsUrl,
  getDaysArray
}