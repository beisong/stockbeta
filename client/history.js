Template.history.onRendered(function () {
    this.autorun(function () {
        console.log("AUTORAN!!");
        if (Session.get('history_data')) {
            drawCandleChart('chartArea', Session.get('history_data'));
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

