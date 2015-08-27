var TodoTreeNode = React.createClass({
	getInitialState : function() {
		return { isOpen : true, text : "ummm" };
	},
	render : function() {
		if ( this.state.isParentOpen ) {
			return (
				<div>
					<button onClick={ this.addChild } className="todoButton"/>
					<textarea>{ this.state.text }</textarea>
					<div ref="children" />
				</div>
			);
		}
	}, 
	addChild : function() {
		React.render(
			<TodoTreeNode isParentOpen={ this.state.isOpen } />,
			React.findDOMNode(this)
		);
	}
});