Template.liveform.events({
    'submit .live_form'(event) {
        event.preventDefault();

        var exchange = event.target.exchange.value;
        var code = event.target.code.value;
        
        Router.go('/live/' + exchange + '/' + code);

    }
});