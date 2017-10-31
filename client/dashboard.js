Template.dashboard.onRendered(function () {

});

Template.dashboard.events({
    'click .codebutton': function (event) {
        console.log("asds");
        Meteor.call("getStockData", event.target.value, '1d', "600", function (error, results) {
            if (results) {
                Session.set('data', results);
            }
        });
    }
});


Template.dashboard.helpers({
    data: function () {
        return Session.get('data');
    }
});
