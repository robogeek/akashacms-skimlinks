
var skimlinks = require('skimlinksjs');
var util      = require('util');
var async     = require('async');

module.exports.setup = function(token, theSiteId) {
    skimlinks.setup(token, theSiteId);
}

var currencySymbol = function(currency) {
    if (currency === "USD") {
        return "$";
    } else if (currency === "GBP") {
        return "&pound;";
    } else if (currency === "EU") {
        return "&euro;";
    } else {
        return "";
    }
}
        
module.exports.query = function(config, partial, query, callback) {

    skimlinks.query(query, function(err, data) {
        if (err) {
            throw err;
        } else {
            util.log("# found: " + data.skimlinksProductAPI.numFound);
            var render2 = "";
            async.forEachSeries(data.skimlinksProductAPI.products,
                function(row, cb) {
                    row.currencySymbol = currencySymbol(row.currency);
                    // util.log(util.inspect(row));
                    // util.log(util.inspect(config));
                    var rndrd = config.partial(partial, {
                        row: row
                    }, function(err, data) {
                        if (err) throw err;
                        render2 += data; // .content; // Wrap rndrd in any way?
                        util.log('data ' + util.inspect(data));
                        cb();
                    });
                },
                function(err) {
                    if (err) throw err;
                    else callback(null, render2);
                }
            );    
        }
    });
    
}