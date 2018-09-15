import React, {Component} from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
// import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import {Local} from './Storage';

export default class Settings extends Component {
	constructor(props){
		super(props)

		this.state = {
			rotateChessboard: false,
			searchOpenings: false,
			showLabels: false,
			lastEditLimit: 5,
			...Local.get("Settings"),
			confirmClearStorage: false
		}
	}

	componentDidUpdate(){
		const {
			rotateChessboard, searchOpenings, showLabels, lastEditLimit
		} = this.state;
		Local.set("Settings", {
			rotateChessboard, searchOpenings, showLabels, lastEditLimit
		})
	}

	handleToggle = name => () => {
		this.setState({
			[name]: !this.state[name]
		})
	}

	handleChange = name => ({target}) => {
		this.setState({
			[name]: target.value
		})
	}

	handleClearStorage(){
		Local.clear();
		this.setState({
			confirmClearStorage: false
		})
	}

	handleCloseClearStorage(){
		this.setState({
			confirmClearStorage: false
		})
	}

	render () {
		const {
			rotateChessboard, searchOpenings, showLabels, lastEditLimit,
			confirmClearStorage
		} = this.state;

		const storageSize = Array(Local.storage.length).fill(true)
			.map((i, index) => Local.storage.getItem(Local.storage.key(index)).length).reduce((a,b)=>a+b, 0);

		return (
			<div>
				<AppBar position="static">
					<Toolbar>
						<IconButton
							onClick={()=>this.props.history.goBack()}>
							<ArrowBackIcon/>
						</IconButton>
						<Typography variant="title" style={{flexGrow: 1}}>
							Settings
						</Typography>
					</Toolbar>
				</AppBar>
				<List>
					<ListSubheader>Game</ListSubheader>
					<ListItem
						button
						onClick={this.handleToggle("rotateChessboard")}>
						<ListItemText primary="Rotate chessboard" secondary="Rotate chessboard to the side of the player in turn"/>
						<Checkbox
							checked={rotateChessboard}
							disableRipple/>
					</ListItem>
					<ListItem
						button
						onClick={this.handleToggle("searchOpenings")}>
						<ListItemText primary="Search openings" secondary="When move add opening name as comment"/>
						<Checkbox
							checked={searchOpenings}
							disableRipple/>
					</ListItem>
					<ListItem
						button
						onClick={this.handleToggle("showLabels")}>
						<ListItemText primary="Show labels" secondary="Show/hide rows and file labels on chessboard"/>
						<Checkbox
							checked={showLabels}
							disableRipple/>
					</ListItem>

					<ListSubheader>Search</ListSubheader>
					<ListItem>
						<ListItemText primary="Last games" secondary="How many items to display"/>
						<TextField
							fullWidth
							type="number"
							value={lastEditLimit}
							inputProps={{
								min: 0
							}}
							onChange={this.handleChange("lastEditLimit")}
							/>
					</ListItem>

					<ListSubheader>Memory</ListSubheader>
					<ListItem>
						<ListItemText primary="Local storage" secondary={this.prefix(storageSize, 0, "B")}/>
						<IconButton
							onClick={()=>this.setState({confirmClearStorage: true})}>
							<DeleteForeverIcon color="error"/>
						</IconButton>

						<Dialog open={confirmClearStorage}>
							<DialogTitle>Confirm clear local storage</DialogTitle>
							<DialogContent>
								Do you really want to delete the storage? The operation can't be undone.
							</DialogContent>
							<DialogActions>
								<Button
									onClick={()=>this.handleCloseClearStorage()}
									color="primary">
									Cancel
								</Button>
								<Button
									onClick={()=>this.handleClearStorage()}
									color="primary">
									Ok
								</Button>
							</DialogActions>
						</Dialog>
					</ListItem>
				</List>
			</div>
		)
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

/*
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


}
*/
