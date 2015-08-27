var TodoTreeNode = React.createClass({displayName: "TodoTreeNode",
	getInitialState : function() {
		return { isOpen : true, text : "" };
	},
	render : function() {
		if ( this.state.isParentOpen ) {
			return (
				React.createElement("div", {onClick:  this.addChild, className: "todoButton"}, 
					 this.state.text
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