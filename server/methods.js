Meteor.methods({
    getStockData: function (exchange, code, period, interval, startdate, graphlen) {
        this.unblock();
        var apiCallString = "https://finance.google.com/finance/getprices?" +
            "&x=" + exchange +
            "&q=" + code +
            "&p=" + period +
            "&i=" + interval +
            "&f=d,c,h,l,o,v";
        console.log(apiCallString);

        var result = Meteor.http.call("GET", apiCallString);

        var result_arr = parse_and_clean_resultstring(result, exchange);

        if (result_arr.length < 1) {
            return;      //invalid content , return
        }

        return parse_and_clean_resultarray(result_arr, interval, startdate, graphlen);

    },
    fetchHistory: function () {
        var watchlist = Watchlist.find();
        var interval = 1200;

        History.remove({});

        //loop thru watchlist and fetch all
        watchlist.forEach(function (each) {
            console.log(each.code);
            //HTTP GET HISTORY INSERT INTO collection

            var apiCallString = "https://finance.google.com/finance/getprices?" +
                "x=" + 'SGX' +
                "&q=" + each.code +
                "&p=" + "1Y" +
                "&i=" + interval +
                "&f=d,c,h,l,o,v";

            console.log(apiCallString);
            var result = Meteor.http.call("GET", apiCallString);
            var result_arr = parseResultStringToArray(result.content);
            var adate;
            for (var i = 0; i < result_arr.length; i++) {
                var curdata = {};
                var splitagain = result_arr[i].split(',');

                curdata.code = each.code;
                curdata.close = splitagain[1];
                curdata.high = splitagain[2];
                curdata.low = splitagain[3];
                curdata.open = splitagain[4];
                curdata.vol = parseFloat(splitagain[5]) / 1000;//Math.round(parseFloat(splitagain[5]) / 100) / 10;

                //Parse Date
                var datestring = splitagain[0];
                if (datestring.charAt(0) == 'a') {
                    datestring = datestring.substring(1);  // remove a
                    adate = getDateFromString(datestring);
                    curdata.date = getDateFromString(datestring);
                }
                else {
                    curdata.date = getDateFromInterval(adate, interval, splitagain[0]);
                }
                History.insert(curdata);
            }
        });


    },
    addToWatchlist: function (stockcode) {
        Watchlist.insert({
            code: stockcode
        });
    }
});


function getDateFromString(datestring) {
    var date = new Date(0);
    date.setUTCSeconds(datestring);
    return date;
}

function getDateFromInterval(thisdate, interval, offset) {
    var initdate = new Date(0);
    initdate.setUTCSeconds(thisdate.getTime() / 1000 + interval * offset);
    return initdate;
}

function parseResultStringToArray(string) {
    var result = string.split(/\r?\n/); // split into array by '\n'
    result.splice(0, 7);
    result.splice(-1, 1);
    return result;
}


parse_and_clean_resultstring = function (result, exchange) {

    // Default dump 7lines
    var linesToDump = 7;
    // If exchange     =      HKG/TYO/SHA/SGX
    if (exchange === 'SKG' || exchange === 'TYO' || exchange === 'SHA' || exchange === 'SGX') {
        linesToDump = 8;
    }

    var result_arr = result.content.split(/\r?\n/); // split into array by '\n'

    result_arr.splice(0, linesToDump);
    result_arr.splice(-1, 1);

    return result_arr;
};

parse_and_clean_resultarray = function (result_arr, interval, startdate, graphlen) {

    var firstdate;
    var day_counter = 0;
    var dataarr = [];

    for (var i = 0; i < result_arr.length; i++) {

        var dataobj = {};
        var splitagain = result_arr[i].split(','); // split into array by '\n'
        var datestring = splitagain[0];
        if (datestring.charAt(0) == 'a') {
            datestring = datestring.substring(1);  // remove a
            var date = new Date(0);
            date.setUTCSeconds(datestring);
            firstdate = date;
            dataobj.date = firstdate;
        }
        else {
            var thisdate = new Date(0);
            thisdate.setUTCSeconds(firstdate.getTime() / 1000 + interval * splitagain[0]);
            dataobj.date = thisdate;
        }

        // REJECT IF:
        // Array Date Earlier than startdate
        // graphlen reach 0   ->  enough data for duration
        if (startdate && ((startdate > dataobj.date) || (graphlen <= 0))) {
            continue;
        }

        if (day_counter == 0) {
            day_counter = dataobj.date.getDate();
        }
        else {
            if (day_counter != dataobj.date.getDate()) {
                day_counter = dataobj.date.getDate();
                graphlen--;
                if (graphlen == 0) {
                    continue;
                }
            }
        }

        dataobj.close = splitagain[1];
        dataobj.high = splitagain[2];
        dataobj.low = splitagain[3];
        dataobj.open = splitagain[4];
        dataobj.vol = parseFloat(splitagain[5]) / 1000;//Math.round(parseFloat(splitagain[5]) / 100) / 10;

        dataarr.push(dataobj);

    }
    return dataarr;
};