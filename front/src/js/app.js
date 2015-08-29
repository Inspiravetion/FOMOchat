var App = function(onmessage) {
	this.mailbox = new Mailbox(onmessage.bind(this));
	this.ui = new UI(this.mailbox);
}

window.onload = function(){

    new App(function(msg) {
    	this.ui.addMessage(msg);
    });

};