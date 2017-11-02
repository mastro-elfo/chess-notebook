import React from 'react';
import {Link} from 'react-router-dom';
import {SettingsStorage} from './storage';
import {ICONS} from './icons';
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

	onChangeLastGames(event) {
		const value = parseInt(event.target.value, 10);
		this.storage.saveKey('lastEditLimit', value);
		this.setState({
			'lastEditLimit': value
		});
	}

	render(){
		return (
			<section className="Settings">
				<header>
					<div>
						<Link to="/" className="button left">
							<div><img alt="back" src={ICONS['back']}/></div>
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
									<button className="button" onClick={this.onClickToggleRotateChessboard.bind(this)}>
										<div>
											{this.state.rotateChessboard ? <img alt="" src={ICONS['boxChecked']}/> : <img alt="" src={ICONS['box']}/>}
										</div>
									</button>
									<h3>Rotate chessboard</h3>
									<p>Rotate chessboard to the side of the player in turn</p>
								</label>
							</li>
						</ul>

						<h2>Search settings</h2>
						<ul className="list">
							<li>
								<label>
									<h3>Last games</h3>
									<input type="number" min="0" value={this.state.lastEditLimit} onChange={this.onChangeLastGames.bind(this)}/>
								</label>
							</li>
						</ul>

						<h2>Memory</h2>
						<ul className="list">
							<li>
								<button className="button" onClick={this.onClickClearStorage.bind(this)}>
									<div><img alt="clear" src={ICONS['delete']}/></div>
								</button>
								<label>
									<h3>Local storage</h3>
									<p>{this.prefix(this.getStorageSize(), 0, 'B')}</p>
								</label>
							</li>
						</ul>

						<h2>About Chess-Notebook</h2>
						<ul className="list">
							<li>
								<label>
									<Link to="/info">
										<button className="button">
											<div>
												<img alt="info" src={ICONS['forward']}/>
											</div>
										</button>
										<span>Info</span>
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
