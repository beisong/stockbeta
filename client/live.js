Template.live.onCreated(function () {
    if (!Session.get('duration')) {
        Session.set('duration', 1);
    }
    Meteor.call("getStockData",
        Router.current().params.exchange.toUpperCase(),
        Router.current().params.code.toUpperCase(),
        '4d',
        "86400",
        function (error, results) {
            if (results) {
                var avevol = (results[0].vol + results[1].vol + results[2].vol) / 300;
                Session.set('bigvol', avevol);
            }
            else {
                console.log("bigvol not found");
            }
        });
});

Template.live.onRendered(function () {
    this.autorun(function () {
        Meteor.call("getStockData",
            Router.current().params.exchange.toUpperCase(),
            Router.current().params.code.toUpperCase(),
            Session.get('duration') + 'd',
            "60",
            function (error, results) {
                if (results) {
                    Session.set('data', results);
                }
                else {
                    alert("Nothing found. Please Try again...");
                    Router.go('home');
                }
            });

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

Template.live.events({
    'change #1daybut'(event) {
        Session.set('duration', 1);
    },
    'change #3daybut'(event) {
        Session.set('duration', 3);
    },
    'change #7daybut'(event) {
        Session.set('duration', 7);
    },

});
