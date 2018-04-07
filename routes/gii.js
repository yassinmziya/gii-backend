var d3 = require('d3');

class GII {
    constructor(year) {
        this.year = year
        this.country_codes = d3.csvParse(require(`./common/iso3`))
        this.data = d3.csvParse(require(`./common/${year}`))
        this.indicators = d3.csvParse(require(`./common/${parseInt(year) < 2016?'titles-2015':'titles-2016'}`))[0];
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

    // given a valid GII code, returns the child level as an array
    getSubLevel(code) {
        console.log(this.indicators)
        var sub = Object.keys(this.indicators).filter((x) => {
            return code.charAt(0) === x.charAt(0) && (x.length>code.length && x.length<=code.length + 2) 
        })
        return sub;
    }

    // returns heirarchy of indicators. goes down to tertiary level.
    getIndicatorHeirarchy() {
        var top = Object.keys(this.indicators).filter((x) => {
            return x.length === 2
        });
        var accum = {};
        top.forEach((x) => {
            accum[x] = {};
            accum[x]["secondary"] = this.getSubLevel(x);
            accum[x]["tertiary"] = [];
            accum[x]["secondary"].forEach((y) => {
                accum[x]["tertiary"].push(this.getSubLevel(y))
            })
        })
        return accum;
    }
}

module.exports = GII