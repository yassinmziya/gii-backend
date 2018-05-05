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

    // returns all countries in the given region, sorted by GIIRank. Uses "RegionUN"
    getRegion(region) {
        var data = this.data.filter((countryData) => countryData["RegionUN"].toLowerCase() === region.toLowerCase());
        return data;
    }

    // returns all countries in the given incomeGroup, sorted by GIIRank. Uses key("Income short", "Income", or "Income group")
    getIncomeGroup(incomeGroup, key) {
        var data = this.data.filter((countryData) => countryData[key].toUpperCase() === incomeGroup.toUpperCase());
        return data;
    }

    strengthAndWeakness(countryData) {
        var keys = Object.keys(countryData);
        var startIndex = keys.find((e) => e === "1.score");
        var keys = keys.slice(startIndex);
        var keys = keys.filter((key) => key.includes('score'));
        var keys = keys.slice(4);

        var strengths = keys.map((indicator) => {
            return {indicator: indicator, score: countryData[indicator]};
        })

        strengths.sort((a,b) => parseInt(a.score - b.score))
        return strengths;

    }

    // returns summary data for given country in the given year
    summary(iso3, year) {
        const data = this.getCountryData(iso3.toUpperCase());
        var summary = {};
        summary.GII = {rank: parseInt(data['GIIrank']), score: parseInt(data['GIIscore'])};
        summary.input = {rank: parseInt(data['Inputrank']), score: parseInt(data['Inputscore'])};
        summary.output = {rank: parseInt(data['Outputrank']), score: parseInt(data['Outputscore'])};

        var region = this.getRegion(data['RegionUN']);
        var regionRank = region.findIndex((e) => e.ISO3 === iso3.toUpperCase()) + 1;
        summary.region = {name: data['RegionUN'], rank: regionRank, total: region.length};


        var incomeGroup;
        var key;
        try {
            key = "Income";
            incomeGroup = this.getIncomeGroup(data[key], key);
        } catch (error) {
            try {
                key = "Income short";
                incomeGroup = this.getIncomeGroup(data["Income short"], "Income short");
            } catch (error) {
                key = "Income group";
                incomeGroup = this.getIncomeGroup(data["Income group"], "Income group");
            }
        } 
        var incomeGroupRank = incomeGroup.findIndex((e) => e.ISO3 === iso3.toUpperCase()) + 1;
        summary.incomeGroup = {name: data[key], rank: incomeGroupRank, total: incomeGroup.length}

        summary.test = this.strengthAndWeakness(data);

        return summary;
    }

    // given a valid GII code, returns the child level as an array
    getSubLevel(code) {
        //console.log(this.indicators)
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