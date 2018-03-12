var express = require('express');
var router = express.Router();
var d3 = require('d3')
var parse = require('csv-parse')
var data = require('./common/2011')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/v1/data/:year', function(req, res) {
  res.send(d3.csvParse(require(`./common/${req.params.year}`)))
});

module.exports = router;
