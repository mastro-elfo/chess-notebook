import React, { Component } from 'react';
import './modal.css';
import ReactCenter from 'react-center';

export default class Modal extends Component {
	constructor(props){
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(){
		this.props.close &&
		this.props.close();
		this.props.onClose &&
		this.props.onClose();
	}
	render(){
		return (
			<div className="Modal">
				<div className="ModalUnderlay" onClick={this.handleClick}></div>
				<ReactCenter className="center">
					<div className="ModalContent">{this.props.children}</div>
				</ReactCenter>
			</div>
		)
	}
}
