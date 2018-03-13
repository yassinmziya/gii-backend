var d3 = require('d3');

class GII {
    constructor(year) {
        this.year = year
        this.country_codes = d3.csvParse(require(`./common/iso3`))
        this.data = d3.csvParse(require(`./common/${year}`))
    }

    // returns an array of all country statistics for this years
    getAll() {
        return this.data
    }

    // given a valid iso3 string, will return JSON data for corresponding country for this year
    getCountryData(iso3) {
        // need to handle errors i.e. incorrect iso3
        var data = this.data.filter(country => country.ISO3 === iso3.toUpperCase())
        return data[0]
    }

    // given an iso3 code, returns the corresponding country name
    getCountry(iso3) {
        //need to handle errors
        var data = this.country_codes.filter(country => country.ISO3 === iso3.toUpperCase())
        return data[0]
    }
}

module.exports = GII