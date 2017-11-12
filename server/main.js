import {Meteor} from 'meteor/meteor';

Meteor.startup(() => {
    // code to run on server at startup

    if (Watchlist.find().count() == 0) {
        //seed data
        Watchlist.insert({code: "B2F"});
        // Watchlist.insert({code: "F34"});
        // Watchlist.insert({code: "B73"});
        // Watchlist.insert({code: "BSL"});
        // Watchlist.insert({code: "BN4"});//
        
    }
});


