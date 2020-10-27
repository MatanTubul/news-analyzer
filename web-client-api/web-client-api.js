#!/usr/bin/env node
const winston = require('./config/winston');
// HTTP request logger middleware
const morgan = require('morgan');
const express = require('express');
const mongoClient = require('mongodb').MongoClient;
// parsing middleware, parse incoming request bodies
const bodyParser = require('body-parser')
// enable Cross-origin resource sharing for all endpoints
const cors = require('cors')
const news_api = require('./news_api')
const app = express()
const server = require('http').Server(app);
const mongoURI = 'mongodb://mongo:27017';

app.use(morgan('combined', { stream: winston.stream }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors());

app.use('/api/news', news_api);

mongoClient.connect(mongoURI
).then((client) => {
  winston.info("MongoDB connected")
  const db = client.db('news-analyzer')
  // share db instance between all routes
  app.locals.db = db
}).then(server.listen(8000, function () {
      winston.info('WebClient API listening');
    }))
    .catch(err => winston.error(err));