Template.liveform.events({
    'submit .live_form'(event) {
        event.preventDefault();

        console.log("submit clicked");

        var exchange = event.target.exchange.value;
        var code = event.target.code.value;

        console.log(exchange);
        console.log(code);

        Router.go('/live/' + exchange + '/' + code);

    }
});