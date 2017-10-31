/**
 * Created by weisong on 31/10/17.
 */


Router.configure({
    // we use the  ApplicationLayout template to define the layout for the entire app
    layoutTemplate: 'ApplicationLayout',
});


Router.route('home', {
    path: '/home',
    yieldTemplates: {
        'hello': {to: 'body'}
    }
});

Router.route('dashboard', {
    path: '/',
    yieldTemplates: {
        'dashboard': {to: 'body'}
    },
    subscriptions: function () {
        Meteor.subscribe('watchlist');
    }
});