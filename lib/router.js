/**
 * Created by weisong on 31/10/17.
 */


Router.configure({
    // we use the  ApplicationLayout template to define the layout for the entire app
    layoutTemplate: 'ApplicationLayout',
});


Router.route('home', {
    path: '/',
    yieldTemplates: {
        'home': {to: 'body'}
    }
});

// Router.route('dashboard', {
//     path: '/dashboard',
//     yieldTemplates: {
//         'dashboard': {to: 'body'}
//     },
//     subscriptions: function () {
//         Meteor.subscribe('watchlist');
//         Meteor.subscribe('history');
//     }
// });
//


Router.route('historyform', {
    path: '/history',
    yieldTemplates: {
        'historyform': {to: 'body'}
    },
});


Router.route('history', {
    path: '/history/:duration/:exchange/:code/:year/:month/:day',
    yieldTemplates: {
        'history': {to: 'body'}
    },
    subscriptions: function () {
        Meteor.subscribe('history');
    }
});

Router.route('liveform', {
    path: '/live',
    yieldTemplates: {
        'liveform': {to: 'body'}
    },
});


Router.route('live', {
    path: '/live/:exchange/:code',
    yieldTemplates: {
        'live': {to: 'body'}
    },
});
