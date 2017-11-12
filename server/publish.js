Meteor.publish("watchlist", function () {
    return Watchlist.find({}, {sort: {date: 1}});
});

Meteor.publish("history", function () {
    return History.find();
});