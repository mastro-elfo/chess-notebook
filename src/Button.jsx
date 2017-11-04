import React from 'react';
import {Link} from 'react-router-dom';
import './button.css';

export function Button(props) {
	const className = 'Button ' + (props.className || '');
	return (
		<button className={className} onClick={props.onClick} disabled={props.disabled}>
			<div>
				{props.children}
			</div>
		</button>
	);
}

export function LinkButton(props) {
	const className = 'Button ' + (props.className || '');
	return (
		<Link to={props.to} className={className} disabled={props.disabled}>
			<div>
				{props.children}
			</div>
		</Link>
	);
}
