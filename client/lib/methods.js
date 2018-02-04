Template.registerHelper('checkLastUsed', (value)=> {
        if (localStorage.getItem("stockexchange")) {
            if (localStorage.getItem("stockexchange") == value) {
                return 'selected';
            }
        }
        else {
            if ('default' == value) {
                return 'selected';
            }
        }
    }
);

Template.registerHelper('formatedate', (thisdate)=> {
        return moment(thisdate).calendar(
            null, {
                lastDay: '[Yesterday at] LT',
                sameDay: '[Today at] LT',
                nextDay: '[Tomorrow at] LT',
                lastWeek: 'dddd [at] LT',
                nextWeek: 'dddd [at] LT',
                sameElse: 'DD/MM/YYYY [at] LT'
            });
    }
);

Template.registerHelper('dateWithoutTime', (thisdate)=> {
        return moment(thisdate).calendar(
            null, {
                lastDay: '[Yesterday] ',
                sameDay: '[Today] ',
                nextDay: '[Tomorrow] ',
                lastWeek: 'dddd ',
                nextWeek: 'dddd ',
                sameElse: 'DD/MM/YYYY '
            });
    }
);


Template.registerHelper("lastdone", function (array) {
    if (array) {
        return array[array.length - 1].close;
    }
});

Template.registerHelper("bigtrade", function (close, vol) {
    return (vol > Session.get('bigvol'));

});
Template.registerHelper("getcolor", function (open, close) {
    if (open > close) {
        return "#ff8080";
    }
    else if (close > open) {
        return "#00e6ac";
    }
    else {
        return "white";
    }
});
Template.registerHelper("diff", function (open, close) {
    var precisionopen, precisionclose, precision;

    if ((open + "").indexOf(".") > 0) { // Check decimal avail
        precisionopen = (open + "").split(".")[1].length;
    }
    else {
        precisionopen = 0;
    }

    if ((close + "").indexOf(".") > 0) {
        precisionclose = (close + "").split(".")[1].length;
    }
    else {
        precisionclose = 0;
    }

    if (precisionopen == precisionclose) {
        precision = precisionopen;
    }
    if (precisionopen > precisionclose) {
        precision = precisionopen
    }
    if (precisionopen < precisionclose) {
        precision = precisionclose
    }
    return (close - open).toFixed(precision);
});

drawCandleChart = function (divid, data) {

    var margin = {top: 20, right: 20, bottom: 30, left: 50}, width, height;
    // var width = 360 - margin.left - margin.right;
    // var height = 260 - margin.top - margin.bottom;

    width = window.innerWidth - margin.left - margin.right;


    if (window.innerWidth < 799) {
        width = window.innerWidth - margin.left - margin.right;
        height = Math.round(width * 0.8);
    }
    else {
        width = Math.round(window.innerWidth * 0.8) - margin.left - margin.right;
        // height = window.innerHeight * 0.7;
        height = Math.round(width * 0.45);
    }

    var parseDate = d3.timeParse("%d-%b-%y");

    var x = techan.scale.financetime()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);
    ////////////// VOLUME    //////////////////
    var yVolume = d3.scaleLinear()
        .range([y(0), y(0.2)]);
    ////////////// VOLUME    //////////////////

    var candlestick = techan.plot.candlestick()
        .xScale(x)
        .yScale(y);

    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);


    ////////////// CROSSHAIR    //////////////////
    var ohlcAnnotation = techan.plot.axisannotation()
        .axis(yAxis)
        .orient('left')
        .format(d3.format(',.2f'));

    var timeAnnotation = techan.plot.axisannotation()
        .axis(xAxis)
        .orient('bottom')
        .format(d3.timeFormat('%d %b %H:%M'))
        .width(90)
        .translate([0, height]);

    var crosshair = techan.plot.crosshair()
        .xScale(x)
        .yScale(y)
        .xAnnotation(timeAnnotation)
        .yAnnotation(ohlcAnnotation)
        .on("enter", enter)
        .on("out", out)
        .on("move", move);
    ////////////// CROSSHAIR    //////////////////

    d3.selectAll("svg > *").remove(); // Clear svg child element first

    var svg = d3.select("#" + divid)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var coordsText = svg.append('text')
        .style("text-anchor", "end")
        .attr("class", "coords")
        .attr("x", width - 5)
        .attr("y", 15);

    var accessor = candlestick.accessor();

    data = data.map(function (d) {
        // console.log(d.date);
        return {
            // date: parseDate.parse(d.date.trim()),
            date: d.date,
            open: +d.open,
            high: +d.high,
            low: +d.low,
            close: +d.close,
            volume: +d.vol
        };
    }).sort(function (a, b) {
        return d3.ascending(accessor.d(a), accessor.d(b));
    });

    svg.append("g")
        .attr("class", "candlestick");

    ////////////// VOLUME    //////////////////
    var volume = techan.plot.volume()
        .accessor(candlestick.accessor())   // Set the accessor to a ohlc accessor so we get highlighted bars
        .xScale(x)
        .yScale(yVolume);

    svg.append("g")
        .attr("class", "volume");

    svg.append("g")
        .attr("class", "volume axis");
    ////////////// VOLUME    //////////////////

    ////////////// CROSSHAIR    //////////////////
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")");

    svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");

    svg.append('g')
        .attr("class", "crosshair");
    ////////////// CROSSHAIR    //////////////////

    draw(data);

    function draw(data) {
        x.domain(data.map(candlestick.accessor().d));
        y.domain(techan.scale.plot.ohlc(data, candlestick.accessor()).domain());
        ////////////// VOLUME    //////////////////
        yVolume.domain(techan.scale.plot.volume(data).domain());
        svg.select("g.volume").datum(data).call(volume);
        ////////////// VOLUME    //////////////////

        ////////////// CROSSHAIR    //////////////////
        svg.selectAll("g.candlestick").datum(data).call(candlestick);
        svg.selectAll("g.x.axis").call(xAxis);
        svg.selectAll("g.y.axis").call(yAxis);
        svg.selectAll("g.crosshair")
            .datum({x: x.domain()[80], y: 67.5})
            .call(crosshair)
            .each(function (d) {
                move(d);
            });
        ////////////// CROSSHAIR    //////////////////
    }

    function enter() {
        coordsText.style("display", "inline");
    }

    function out() {
        coordsText.style("display", "none");
    }

    function move(coords) {
        coordsText.text(
            timeAnnotation.format()(coords.x) + ", " + ohlcAnnotation.format()(coords.y)
        );
    }
};
