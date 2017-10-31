Meteor.methods({

    getStockData: function (code, period, interval) {
        this.unblock();
        var apiCallString = "https://finance.google.com/finance/getprices?x=SGX&" +
            "q=" + code +
            "&p=" + period +
            "&i=" + interval +
            "&f=d,o,h,l,c,v";
        console.log(apiCallString);

        var result = Meteor.http.call("GET", apiCallString);

        //Result.content is a long string
        var result_arr = result.content.split(/\r?\n/); // split into array by '\n'

        //get interval =
        console.log(result_arr[3]);
        var interval = result_arr[3].substr(9);


        //dump first 7 lines and last line
        result_arr.splice(0, 7);
        result_arr.splice(-1, 1);

        var firstdate;
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

                //TODO CURRENT CONDITION FOR DAY SUMMARY : when a and i!=0
                //TODO CHANGE CONDITION TO : Compare DATE WITH PREVIOUS : if day change
                if (i != 0) {
                    daySummary.vol = Math.round(daySummary.vol * 10) / 10;
                    dataarr.push(daySummary); // pushing day summary
                }

                //Create new total Obj
                var daySummary = {};
                daySummary.date = "Day Summary";
                daySummary.open = splitagain[1];
                daySummary.high = splitagain[2];
                daySummary.low = splitagain[3];
                daySummary.close = splitagain[4];
                daySummary.vol = 0;

            }
            else {
                var thisdate = new Date(0);
                thisdate.setUTCSeconds(firstdate.getTime() / 1000 + interval * splitagain[0]);
                dataobj.date = thisdate;
            }

            dataobj.open = splitagain[1];
            dataobj.high = splitagain[2];
            dataobj.low = splitagain[3];
            dataobj.close = splitagain[4];
            dataobj.vol = parseFloat(splitagain[5]) / 1000;//Math.round(parseFloat(splitagain[5]) / 100) / 10;

            daySummary.high = parseFloat(dataobj.high) > parseFloat(daySummary.high) ? dataobj.high : daySummary.high;
            daySummary.low = parseFloat(dataobj.low) < parseFloat(daySummary.low) ? dataobj.low : daySummary.low;
            daySummary.close = dataobj.close;
            daySummary.vol += dataobj.vol;
            dataarr.push(dataobj);
        }

        daySummary.vol = Math.round(daySummary.vol * 10) / 10;
        dataarr.push(daySummary);
        return dataarr;

    }
});