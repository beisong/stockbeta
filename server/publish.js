Meteor.publish("watchlist", function () {
    return Watchlist.find();
});