const express = require('express');
const app = express.Router();
const winston = require('./config/winston');
const consts = require('./consts')
const axios = require('axios')
const { buildNewsUrl, getDaysArray} = require('./utils')
const {AGGREGATE_OCCURRENCES} = require('./db/queries')
const Occurences = require('occurences')
const util = require('util')

app.get('/load', async (req, res) => {
  try {
    // mongo db instance
    const db = req.app.locals.db
    const {source, fromDate, toDate} = req.query
    winston.info(`Fetching source ${source} news`)
    const daysList = getDaysArray(new Date(fromDate), new Date(toDate))

    let requestsPromises = daysList.map(day => {
      const query = `?language=en&pageSize=100&sortBy=publishedAt&from=${day}&to=${day}&sources=${source}&apiKey=${consts.NEWS_API_KEY}`
      return axios.get(buildNewsUrl('everything', query))
    })

    Promise.all(requestsPromises).then(responses => {
      const dbPromises = insertOccurences(responses, db)
      Promise.all(dbPromises).then(response => {
        // aggregate all words occurrences iterating all collection documents
        db.collection('occurrences').aggregate(AGGREGATE_OCCURRENCES).toArray(function (err, docs) {
          res.json({words: buildWordsCloudObject(docs)})
          // clean history collection before each load in order to load most updated data
          db.collection('occurrences').deleteMany({})
        })
      }).catch(err => console.log(err))
    }).catch(err => console.log(err))
  } catch (err) {
    winston.error(err)
    res.status(500).json({error: 'Internal server error'})
  }
})

app.get('/sources', async (req, res ) => {
  try {
    const query = `?language=en&apiKey=${consts.NEWS_API_KEY}`
    const response = await axios.get(buildNewsUrl('sources', query))
    if (response.data) {

      const {sources} = response.data
      if (sources) {
        let sourcesList = sources.map(source => {
          const {id, name} = source
          return {
            id,
            name
          }
        })
        res.json({message: sourcesList})
      }
    }
  } catch (err) {
    winston.error(err)
    res.status(500).json({error: 'Internal server error'})
  }

})

/**
 * Handling multiple promises returned for all news-api requests
 * @param {AxiosResponse<any>[]} responses
 * @return {[<Promise>]}
 */

function insertOccurences(responses, db) {
  return responses.map(response => {
    let totalOccurences = []
    if(response.data.articles) {
      winston.info(`Handling total ${response.data.totalResults}`)
      for (let article of response.data.articles) {
        try {
          const {title, description} = article
          totalOccurences.push(new Occurences(title)._stats)
          totalOccurences.push(new Occurences(description)._stats)
        } catch (err) {
          winston.error(err)
        }
      }
      // push all occurrences found by day only if there is results
      if(totalOccurences.length > 0) {
        return db.collection('occurrences').insertMany(totalOccurences)
      }
    }
  })
}

/**
 * Convert aggregation result into WordsCloud object according to
 * https://www.npmjs.com/package/react-wordcloud
 * @param {object[]} data
 * @return {[]}

 */
function buildWordsCloudObject(data) {
  let results = []
  // data is aggregation result, containing array with 1 object
  for(let [key, value] of Object.entries(data[0])) {
    results.push({
      text: key,
      value: value
    })
  }
  return results
}
module.exports = news_api = app