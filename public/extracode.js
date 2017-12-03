//  Day Summary     // Comment out for now
// CURRENT CONDITION FOR DAY SUMMARY : when a and i!=0
// CHANGE CONDITION TO : Compare DATE WITH PREVIOUS : if day change
if (i != 0) {
    daySummary.vol = Math.round(daySummary.vol * 10) / 10;
    dataarr.push(daySummary); // pushing day summary
}

//Create new total Obj
var daySummary = {};
daySummary.date = "Day Summary";
daySummary.close = splitagain[1];
daySummary.high = splitagain[2];
daySummary.low = splitagain[3];
daySummary.open = splitagain[4];
daySummary.vol = 0;


// Day Summary     // Comment out for now
daySummary.high = parseFloat(dataobj.high) > parseFloat(daySummary.high) ? dataobj.high : daySummary.high;
daySummary.low = parseFloat(dataobj.low) < parseFloat(daySummary.low) ? dataobj.low : daySummary.low;
daySummary.close = dataobj.close;
daySummary.vol += dataobj.vol;


//  Day Summary     // Comment out for now
daySummary.vol = Math.round(daySummary.vol * 10) / 10;
dataarr.push(daySummary);
