Template.live.onCreated(function () {

    Meteor.call("getStockData",
        Router.current().params.exchange.toUpperCase(),
        Router.current().params.code.toUpperCase(),
        '1d',
        "60",
        function (error, results) {
            if (results) {
                Session.set('data', results);
                // console.log("getStockData API CALL");
            }
            else {
                alert("Nothing found. Please Try again...");
                Router.go('home');
            }
        });
});

Template.live.onRendered(function () {
    this.autorun(function () {
        if (Session.get('data')) {
            drawCandleChart('candleChartArea', Session.get('data'));
        }
    });
});


Template.live.helpers({
    code: function () {
        return Router.current().params.code.toUpperCase();
    },
    data: function () {
        if (Session.get('data')) {
            return Session.get('data');
        }
    },
});
