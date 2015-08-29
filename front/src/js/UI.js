
//UI
var UI = function(mailbox) {
	//capture mailbox for later use
	this.mailbox = mailbox;

	//setup name prompt button so users can get to the chat ui
	this.button().click(this._submitName.bind(this));

	//setup keyboard listener
	// this.input().keypress(this._keyPressed.bind(this));
}

//Return UI elements from the DOM so they can be manipulated
UI.prototype.button = function() {
	return $("#myButton");
};

UI.prototype.input = function() {
	return $("#myInput");
};

UI.prototype.top = function() {
	return $("#top");
};

UI.prototype.middle = function() {
	return $("#middle");
};

UI.prototype.bottom = function() {
	return $("#bottom");
};

UI.prototype.form = function() {
	return $("#form");
};

UI.prototype.messages = function() {
	return $("#messages");
};

//Add a message to the chat window
UI.prototype.addMessage = function(msg) {
	//create an html element with the username and message
	var html = $("<p>").append(
		$("<strong>").text(msg.user + " : "),
		$("<span>").text(msg.msg)
	),
	//get the message container element
	messages = this.messages();

	//add the message to the messages container
	messages.append(html);

	//make sure that the scroll window stays scrolled down as new messages are added
	// messages.animate({ scrollTop: messages[0].scrollHeight }, "slow");
};

//Change from the name prompt to the chat UI
UI.prototype.setupChat = function() {
	//get all of the elements
	var button = this.button(),
		input = this.input(),
		top = this.top(),
		bottom = this.bottom(),
		form = this.form(),
		messages = this.messages();

	//update button behavior
	button.off("click");
	button.click(this._sendMessage.bind(this));
	button.text("Send");

	//update textbox to be a text area
	input.replaceWith($('<textarea id="myInput" type="text" class="form-control" rows="1" style="width: 480px;"></textarea>'));
	
	//update the new input field to have the keypress listener
	// this.input().keypress(this._keyPressed.bind(this));

	//Add classes to change the sizes of everything	
	top.addClass("chat");
	bottom.addClass("padding");
	form.addClass("chatform");
	form.removeClass("nameform");
	messages.addClass("fomo-messages");
};

//Click handler for the name prompt
UI.prototype._submitName = function(e) {
	//make sure no default behavior gets done
	e.preventDefault();

	//get the name from the text box
	var name = this.input().val();

	//change to the chat ui
	this.setupChat();

	//activate the mailbox so the app can start recieving messages
	this.mailbox.activate(name);
};

//Click handler for the chat button
UI.prototype._sendMessage = function(e) {
	//make sure no default behavior gets done
	e.preventDefault();

	//get the message from the text box
	var input = this.input(),
		msg = input.val();

	//Erase the text in the textarea
	input.val("");

	//send the message
	this.mailbox.send(msg);
};

//Click handler for the chat button
UI.prototype._keyPressed = function(e) {
	//enter key
	if(e.which == 13) {
		this.button().click();
	}
};