import React from 'react';
import {Link} from 'react-router-dom';
import {SettingsStorage} from './storage';
import './settings.css';

export default class Settings extends React.Component {
	constructor(props){
		super(props);
		this.storage = new SettingsStorage();
		this.state = {
			...this.storage.load('Settings')
		};
	}

	getStorageSize(){
		let sum = 0;
		for(var i in localStorage) {
			if(typeof localStorage[i] === 'string') {
				sum += localStorage[i].length;
			}
		}
		return sum;
	}

	onClickClearStorage(){
		this.storage.clear();
		this.setState({
			update: +new Date()
		});
	}

	onClickToggleRotateChessboard(){
		this.storage.saveKey('rotateChessboard', !this.state.rotateChessboard);
		this.setState({
			rotateChessboard: !this.state.rotateChessboard
		});
	}

	render(){
		return (
			<section className="Settings">
				<header>
					<div>
						<Link to="/" className="button left">
							<div><img alt="back" src={process.env.PUBLIC_URL+"/assets/back.svg"}/></div>
						</Link>
						<h1>Settings</h1>
					</div>
				</header>
				<main>
					<div>
						<h2>Game settings</h2>
						<ul className="list">
							<li>
								<label>
									<button className="button right" onClick={this.onClickToggleRotateChessboard.bind(this)}>
										<div>
											{this.state.rotateChessboard ? <img alt="" src={process.env.PUBLIC_URL+"/assets/box_checked.svg"}/> : <img alt="" src={process.env.PUBLIC_URL+"/assets/box.svg"}/>}
										</div>
									</button>
									<span>Rotate chessboard</span>
								</label>
							</li>
						</ul>

						<h2>Memory</h2>
						<ul className="list">
							<li>
								<button className="button right" onClick={this.onClickClearStorage.bind(this)}>
									<div><img alt="clear" src={process.env.PUBLIC_URL+"/assets/delete.svg"}/></div>
								</button>
								<label>
									<span>Local storage</span>
									<p>{this.prefix(this.getStorageSize(), 0, 'B')}</p>
								</label>
							</li>
						</ul>

						<h2>About Chess-Notebook</h2>
						<ul className="list">
							<li>
								<label>
									<Link to="/info">
										<div>
											<img className="right" alt="info" src={process.env.PUBLIC_URL+"/assets/forward.svg"}/>
											<span>Info</span>
										</div>
									</Link>
								</label>
							</li>
						</ul>
					</div>
				</main>
			</section>
		);
	}

	prefix(value, precision, mu) {
		let output = '';
		[	{div: 1e12, prefix: 'T'},
			{div: 1e9, prefix: 'G'},
			{div: 1e6, prefix: 'M'},
			{div: 1e3, prefix: 'k'},
			{div: 1, prefix: ''},
			{div: 1e-3, prefix: 'm'},
			{div: 1e-6, prefix: 'u'},
			{div: 1e-9, prefix: 'n'}
		].map(prefix => {
			let val = value /prefix.div;
			if(Math.abs(val) >= 0.1 && Math.abs(val) <= 1000) {
				output = val.toFixed(precision) + prefix.prefix + mu;
			}
			return true;
		});
		if(!output) {
			return value.toFixed(precision) + mu;
		}
		return output;
	}
}
