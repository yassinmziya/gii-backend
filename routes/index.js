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
  res.send({
    data:gii.getCountryData(req.params.iso3)
  })
});

router.get('/v1/data/region/:regionCode/:year', function(req, res) {
  var gii = new GII(req.params.year);
  var data = gii.getRegion(req.params.regionCode)
  res.send(data);
});

router.get('/v1/data/incomeGroup/:incomeGroupCode/:year', function(req, res) {
  var gii = new GII(req.params.year);
  var data = gii.getIncomeGroup(req.params.incomeGroupCode);
  res.send(data);
});

router.get('/v1/data/summary/:iso3/:year', (req, res) => {
  var gii = new GII(req.params.year);
  var summary = gii.summary(req.params.iso3, req.params.year);
  res.send(summary);
});

// returns ordered list of country code/name data
router.get('/v1/countries/', function(req, res) {
  var codes = d3.csvParse(require('./common/iso3'))[0] // unsorted
  var keys = Object.keys(codes);
  keys.sort((a, b) => {
    if(a < b) return -1;
    if(a > b) return 1;
    return 0;
  })

  var sorted = keys.map((x) => {
    return {
      iso3: x,
      country: codes[x],
    };
  }); 

  res.send({
    countries: sorted,
  })
})


// returns country name, given an iso3 code
router.get('/v1/countries/:iso3', function(req, res) {
  var codes = d3.csvParse(require('./common/iso3'))
  res.send({
    iso3 : codes[0][req.params.iso3.toUpperCase()]
  })
})


// returns all gii indicator->label mappings for a given year, as well as an array of keys
router.get('/v1/categories/:year/', function(req, res) {
  var gii = new GII(req.params.year);
  res.send(gii.getIndicators(req.params.year));
})

// returns appropriate gii indicator lablel given a gii indicator code and a valid year
router.get('/v1/categories/:year/:code/', function(req, res) {
  var gii = new GII(req.params.year);
  res.send(gii.getIndicators(req.params.year)[req.params.code]);
})

router.get('/v1/indicators/:year', (req, res) => {
  var gii = new GII(req.params.year);
  res.send(gii.getIndicators(req.params.year));
});

module.exports = router;