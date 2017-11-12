Template.dashboard.onRendered(function () {

    //TODO separate to 2 section
    // 1) historical data -  20min interval across few months
    // 2) today live data - 1min refresh , Today only

    //TODO !!!!! METOER UP

});

Template.dashboard.events({
    'click .codebutton': function (event) {
        console.log("asds");
        Meteor.call("getStockData", event.target.value, '1d', "1200", function (error, results) {
            if (results) {
                Session.set('data', results);
            }
        });
    },
    'click #fetchHistoryBut': function (event) {
        Meteor.call("fetchHistory", function (error, results) {
            console.log("history fetched");
        });
    },
    'submit #addCodeForm': function (event) {
        event.preventDefault();
        var stockcode = event.target["code"].value;
        Meteor.call("addToWatchlist", stockcode.toUpperCase(), function (error, results) {
        });
    }
});


Template.dashboard.helpers({
    watchlist: function () {
        return Watchlist.find();
    },
    data: function () {
        return Session.get('data');
    },
    mongodata: function () {
        return History.find();
    }
});
