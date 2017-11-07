import React, { Component } from 'react';
import './modal.css';
import ReactCenter from 'react-center';

export default class Modal extends Component {
	constructor(props){
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(){
		this.props.onClose &&
		this.props.onClose();
	}
	render(){
		const className = ['Modal', this.props.className].join(' ');
		return (
			<div className={className}>
				<div className="ModalUnderlay" onClick={this.handleClick}></div>
				<ReactCenter className="center">
					<div className="ModalContent">
						{this.props.children}
					</div>
				</ReactCenter>
			</div>
		)
	}
}

export function ModalButton(props) {
	const className = ['ModalButton', props.className].join(' ');
	return (
		<button className={className} onClick={props.onClick} title={props.title} disabled={props.disabled}>
			{props.children}
		</button>
	);
}

export function ModalButtons(props) {
	return (
		<div className="ModalButtons">
			{props.children}
		</div>
	);
}
