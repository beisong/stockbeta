Template.history.onCreated(function () {
    var year = +Router.current().params.year;
    var month = +Router.current().params.month;
    var day = +Router.current().params.day;

    var moment_start_date = moment([year, month - 1, day]);
    var now = moment();
    var monthfromnow = now.diff(moment_start_date, 'months');
    monthfromnow += 1;

    var period = monthfromnow + 'M'; //caluclate date from today take difference

    var graph_len = +Router.current().params.duration;

    var startdate = new Date();
    startdate.setFullYear(year, month - 1, day);
    startdate.setHours(0, 0, 0, 0);

    var interval = 3600; // Default interval 1hr

    if (graph_len <= 3) {
        interval = 60;
    }
    //Dynamic interval based on graphlen and how long ago // disabled for now
    // switch (true) {
    //     case graph_len <= 7 && monthfromnow < 11:    //10-29days        // less than 11 monthfromnow
    //         interval = 900;     //15min
    //         break;
    //     case graph_len <= 60 && monthfromnow < 20:    //10-29days        //less than 20 monthfromnow
    //         interval = 1800;    //30min
    //         break;
    //     default:
    //         break;
    // }

    Meteor.call("getStockData",
        Router.current().params.exchange.toUpperCase(),
        Router.current().params.code.toUpperCase(),
        period,
        interval,
        startdate,
        graph_len,
        function (error, results) {
            if (results) {
                Session.set('history_data', results);
            }
            else {
                alert("Nothing found. Please Try again...");
                Router.go('home');
            }
        });
});

Template.history.onRendered(function () {
    this.autorun(function () {
        console.log("AUTORAN!!");
        if (Session.get('history_data')) {
            drawCandleChart('historyChartArea', Session.get('history_data'));
        }
    });

});

Template.history.helpers({
    code: function () {
        return Router.current().params.code.toUpperCase();
    },
    paramdate: function () {
        var year = Router.current().params.year;
        var month = Router.current().params.month;
        var day = Router.current().params.day;
        date = new Date(month + '/' + day + '/' + year);
        return date;
    },
    historydata: function () {
        if (Session.get('history_data')) {
            return Session.get('history_data');
        }
    },
    daydata: function () {

        var code = Router.current().params.code.toUpperCase();
        var year = Router.current().params.year;
        var month = Router.current().params.month;
        var day = Router.current().params.day;

        startdate = new Date(month + '/' + day + '/' + year);
        enddate = new Date(month + '/' + (parseInt(day) + 1) + '/' + year);

        var result = History.find({
            code: code,
            date: {
                $gte: startdate,
                $lt: enddate
            }
        });
        Session.set("history_data", result.fetch());
        return result;
    }
});

