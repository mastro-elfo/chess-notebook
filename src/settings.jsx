import React from 'react';
import {SettingsStorage} from './storage';
import {ICONS} from './icons';
import './settings.css';
import {Button} from './Button';
import Modal, {ModalButtons, ModalButton} from './modal';

export default class Settings extends React.Component {
	constructor(props){
		super(props);
		this.storage = new SettingsStorage();
		const settings = this.storage.load({
			rotateChessboard: false,
			lastEditLimit: 2,
			searchOpenings: true,
			showLabels: true
		});
		this.state = {
			...settings,
			confirmClearStorage: false
		};
	}

	onClickClearStorage(){
		this.storage.clear();
		this.setState({
			confirmClearStorage: false
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
			lastEditLimit: value
		});
	}

	onClickToggleSearchOpenings(){
		this.storage.saveKey('searchOpenings', !this.state.searchOpenings);
		this.setState({
			searchOpenings: !this.state.searchOpenings
		});
	}

	onClickToggleShowLabels(){
		this.storage.saveKey('showLabels', !this.state.showLabels);
		this.setState({
			showLabels: !this.state.showLabels
		});
	}

	render(){
		return (
			<section className="Settings">
				<header>
					<div>
						<Button className="left" title="Go back" onClick={this.props.history.goBack}>
							<img alt="back" src={ICONS['back']}/>
						</Button>
						<h1>Settings</h1>
					</div>
				</header>
				<main>
					<div>
						<h2>Game settings</h2>
						<ul className="list">
							<li>
								<label>
									<Button onClick={this.onClickToggleRotateChessboard.bind(this)} title="Check to rotate chessboard each move">
										{this.state.rotateChessboard ? <img alt="y" src={ICONS['boxChecked']}/> : <img alt="n" src={ICONS['box']}/>}
									</Button>
									<h3>Rotate chessboard</h3>
									<p>Rotate chessboard to the side of the player in turn</p>
								</label>
							</li>
							<li>
								<label>
									<Button onClick={this.onClickToggleSearchOpenings.bind(this)} title="Check to search openings when move">
										{this.state.searchOpenings ? <img alt="y" src={ICONS['boxChecked']}/> : <img alt="n" src={ICONS['box']}/>}
									</Button>
									<h3>Search openings</h3>
									<p>When move add opening name as comment</p>
								</label>
							</li>
							<li>
								<label>
									<Button onClick={this.onClickToggleShowLabels.bind(this)}>
										{this.state.showLabels ? <img alt="y" src={ICONS['boxChecked']}/> : <img alt="n" src={ICONS['box']}/>}
									</Button>
									<h3>Show labels</h3>
									<p>Show/hide rows and file labels on chessboard</p>
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
								<Button onClick={()=>this.setState({confirmClearStorage: true})} title="Delete local storage">
									<img alt="clear" src={ICONS['delete']}/>
								</Button>
								<label>
									<h3>Local storage</h3>
									<p>{this.prefix(this.storage.size(), 0, 'B')}</p>
								</label>
								{this.state.confirmClearStorage &&
									<Modal onClose={()=>this.setState({confirmClearStorage: false})}>
										<h1>Confirm clear storage</h1>
										<p>Do you really want to delete the storage?<br/>The operation can't be undone.</p>
										<ModalButtons>
											<ModalButton onClick={this.onClickClearStorage.bind(this)}>
												<img src={ICONS['boxChecked']} alt="ok"/> Confirm
											</ModalButton>
											<ModalButton onClick={()=>this.setState({confirmClearStorage: false})}>
												<img src={ICONS['delete']} alt="x"/> Cancel
											</ModalButton>
										</ModalButtons>
									</Modal>}
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
