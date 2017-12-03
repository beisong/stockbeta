Template.historyform.rendered = function () {
    var fivedaysago = new Date();
    fivedaysago.setDate(fivedaysago.getDate() - 7);

    $("#start-datepicker").datepicker({
        format: 'dd-mm-yyyy'
    }).datepicker('setDate', fivedaysago)
};

Template.historyform.events({
    'submit .history_form'(event) {
        event.preventDefault();

        var exchange = event.target.exchange.value;
        var code = event.target.code.value;
        var date = event.target.date.value;
        var duration = event.target.duration.value;

        var spliteddate = date.split("-");

        var day = spliteddate[0];
        var month = spliteddate[1];
        var year = spliteddate[2];


        if (exchange == 'Choose Market') {
            alert("Please Select a Stock Exchange");
        }
        else if (!code) {
            alert("Please enter a Stock Ticker Symbol Code");
        }
        else {
            localStorage.setItem('stockexchange', exchange);

            Router.go('/history/' + duration + '/' + exchange + '/' + code + '/' + year + '/' + month + '/' + day);
            ///history/:duration/:exchange/:code/:year/:month/:day
        }


    }
});

