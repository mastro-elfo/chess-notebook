import React from 'react';

export default class Modal extends React.Component {
	static defaultProps = {
		show: false,
		styles: {
			Modal: {
				display: 'none'
			},
			ModalUnderlay: {
				position: 'fixed',
				top: 0,
				left: 0,
				display: 'block',
				width: '100%',
				height: '100%',
				background: 'rgba(0,0,0,0.25)'
			},
			ModalContent: {}
		}
	}
	
	on
	render(){
		const className = [
			'Modal',
			this.props.show ? 'show' : ''
		];
		const style = Object.assign({}, this.props.styles.Modal, this.props.show ? {display: 'block'} : {});
		return (
			<div className={className.join(' ')} style={style}>
				<div className="ModalUnderlay" style={this.props.styles.ModalUnderlay} onClick={this.props.onCancel}></div>
				<div className="ModalContent" style={this.props.styles.ModalContent}>{this.props.children}</div>
			</div>
		);
	}
}