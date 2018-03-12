var d3 = require('d3');

class GII {
    constructor(year) {
        this.year = year
        this.data = d3.csvParse(require(`./common/${year}`))
    }

    // returns an array of all country statistics for this years
    getAll() {
        return this.data
    }

    // given a valid iso3 string, will return JSON data for corresponding country for this year
    getCountry(iso3) {
        var data = this.data.filter(country => country.ISO3 === iso3.toUpperCase())
        return data[0]
    }
}

module.exports = GII