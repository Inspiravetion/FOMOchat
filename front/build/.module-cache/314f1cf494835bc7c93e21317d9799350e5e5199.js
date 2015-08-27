var TodoTreeNode = React.createClass({displayName: "TodoTreeNode",
	getInitialState : function() {
		return { isOpen : true, text : "ummm" };
	},
	render : function() {
		if ( this.state.isParentOpen ) {
			return (
				React.createElement("div", null, 
					React.createElement("button", {onClick:  this.addChild, className: "todoButton"}), 
					React.createElement("textarea", null,  this.state.text), 
					React.createElement("div", {ref: "children"})
				)
			);
		}
	}, 
	addChild : function() {
		React.render(
			React.createElement(TodoTreeNode, {isParentOpen:  this.state.isOpen}),
			React.findDOMNode(this)
		);
	}
});