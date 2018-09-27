import React, {Component} from 'react';

import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import {prefix} from 'prefix-si';

import {Local} from '../Utils/Storage';

class SettingsContent extends Component {
	state = {
		settings: {
			rotateChessboard: false,
			searchOpenings: true,
			showLabels: true,
			lastEditLimit: 5
		},
		confirmClearStorage: false
	}

	componentDidMount(){
		const {
			rotateChessboard = false,
			searchOpenings = true,
			showLabels = true,
			lastEditLimit = 5
		} = Local.get("Settings") || {};
		this.setState({
			settings: {
				rotateChessboard,
				searchOpenings,
				showLabels,
				lastEditLimit
			}
		});
	}

	componentDidUpdate(){
		const {settings} = this.state;
		Local.set("Settings", {...settings});
	}

	render(){
		const {classes} = this.props;

		const {
			settings: {rotateChessboard, searchOpenings, showLabels, lastEditLimit},
			confirmClearStorage
		} = this.state;

		const storageSize =
			Array(Local.storage.length).fill(true)
			.map((i, index) =>
				Local.storage.getItem(Local.storage.key(index)).length)
			.reduce((a,b)=>a+b, 0);

		return (
			<main
				className={classes.main}>
				<List>
					<ListSubheader>Game</ListSubheader>

					<ListItem
						button
						onClick={this.handleToggle("rotateChessboard")}>
						<ListItemText
							primary="Rotate chessboard"
							secondary="Rotate chessboard to the side of the player in turn"
							/>
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
						<ListItemText
							primary="Local storage"
							secondary={prefix(storageSize, "B")}/>
						<IconButton
							onClick={()=>this.setState({confirmClearStorage: true})}>
							<DeleteForeverIcon
								color="error"/>
						</IconButton>

						<Dialog open={confirmClearStorage}>
							<DialogTitle>
								Confirm clear local storage
							</DialogTitle>
							<DialogContent>
								Do you really want to delete the storage? The operation can't be undone.
							</DialogContent>
							<DialogActions>
								<Button
									onClick={()=>this.setState({confirmClearStorage: false})}>
									Cancel
								</Button>
								<Button
									onClick={()=>this.handleConfirmClearStorage()}>
									Ok
								</Button>
							</DialogActions>
						</Dialog>
					</ListItem>
				</List>
			</main>
		);
	}

	handleToggle = name => () => {
		const {settings} = this.state;
		this.setState({
			settings: {
				...settings,
				[name]: !settings[name]
			}
		});
	}

	handleChange = name => ({target: {value}}) => {
		const {settings} = this.state;
		this.setState({
			settings: {
				...settings,
				[name]: value
			}
		});
	}

	handleConfirmClearStorage(){
		Local.clear();
		this.setState({
			confirmClearStorage: false
		});
	}
}

const styles = theme => ({
	main: {
		padding: theme.spacing.unit
	}
});

export default withStyles(styles)(SettingsContent);
