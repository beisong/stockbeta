drawCandleChart = function (divid, data) {
    console.log("data in methods is :");
    console.log(data);

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%d-%b-%y");

    var x = techan.scale.financetime()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);
    ////////////// VOLUME    //////////////////
    var yVolume = d3.scale.linear()
        .range([y(0), y(0.2)]);


    ////////////// VOLUME    //////////////////

    var candlestick = techan.plot.candlestick()
        .xScale(x)
        .yScale(y);

    var xAxis = d3.svg.axis()
        .orient("bottom")
        .scale(x);

    var yAxis = d3.svg.axis()
        .orient("left")
        .scale(y);

    var svg = d3.select("#" + divid)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // d3.csv("data.csv", function (error, data) {
    //     console.log("csv data is ");
    //     console.log(data);
    // });

    // var data = Session.get('data');

    var accessor = candlestick.accessor();

    data = data.map(function (d) {
        console.log(d.date);
        // console.log(parseDate.parse(d.date.trim()));
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

    draw(data);

    function draw(data) {
        x.domain(data.map(candlestick.accessor().d));
        y.domain(techan.scale.plot.ohlc(data, candlestick.accessor()).domain());
        ////////////// VOLUME    //////////////////
        yVolume.domain(techan.scale.plot.volume(data).domain());
        svg.select("g.volume").datum(data).call(volume);
        ////////////// VOLUME    //////////////////

        svg.selectAll("g.candlestick").datum(data).call(candlestick);
        svg.selectAll("g.x.axis").call(xAxis);
        svg.selectAll("g.y.axis").call(yAxis);
    }
}