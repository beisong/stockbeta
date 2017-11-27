Template.liveform.events({
    'submit .live_form'(event) {
        event.preventDefault();

        var exchange = event.target.exchange.value;
        var code = event.target.code.value;

        if (exchange == 'Choose Market') {
            alert("Please Select a Stock Exchange");
        }
        else if (!code) {
            alert("Please enter a Stock Ticker Symbol Code");
        }
        else {
            localStorage.setItem('stockexchange', exchange);

            Router.go('/live/' + exchange + '/' + code);
        }
    }
});

