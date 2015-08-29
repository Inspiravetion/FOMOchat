
//Mailbox
var Mailbox = function(onmessage) {
	this.name = null;
	this.onmessage = onmessage;

	var location = window.location,
		port = parseInt(location.port) + 1;
		socketAddr = "ws://" + location.hostname + ":" + port;

	this.socket = new WebSocket(socketAddr);
}

Mailbox.prototype.activate = function(name) {
	this.name = name;
	this.socket.onmessage = this.parsed(this.onmessage);
}

Mailbox.prototype.send = function(msg) {
	if(this.name != null) {
		var a = this.socket.send(JSON.stringify({user : this.name, msg : msg}));
	}
}

Mailbox.prototype.parsed = function(callback) {
	return function(event) {
		var msg = JSON.parse(event.data);
		callback(msg);
	}	
}