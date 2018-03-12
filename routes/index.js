var express = require('express');
var router = express.Router();
var d3 = require('d3')
var parse = require('csv-parse')
var GII = require('./gii')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/v1/data/:year', function(req, res) {
  var gii = new GII(req.params.year)
  res.send(gii.getAll())
});

router.get('/v1/data/:iso3/:year', function(req, res) {
  var gii = new GII(req.params.year)
  res.send(gii.getCountry(req.params.iso3))
});

module.exports = router;
