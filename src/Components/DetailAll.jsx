import React, {Component} from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import DetailAllHeader from './DetailAllHeader';
import DetailAllContent from './DetailAllContent';

import {Local} from '../Utils/Storage';

export default class DetailAll extends Component {
	state = {
		edit: false,
		editList: [],
		dialogDelete: false
	}

	render(){
		const {
			dialogDelete
		} = this.state;

		return (
			<div>
				<DetailAllHeader
					{...this.props}
					{...this.state}
					handleToggleAll={this.handleToggleAll.bind(this)}
					handleCloseEdit={this.handleCloseEdit.bind(this)}
					handleRequestDelete={this.handleRequestDelete.bind(this)}
					/>

				<DetailAllContent
					{...this.props}
					{...this.state}
					handleToggleGame={this.handleToggleGame.bind(this)}
					/>

				<Dialog
					open={dialogDelete}
					onClose={this.handleCancelDelete.bind(this)}>
					<DialogTitle>Confirm delete selected games</DialogTitle>

					<DialogContent>
						<DialogContentText>
							If you confirm the games will be permanently deleted. This operation can't be undone.
						</DialogContentText>
					</DialogContent>

					<DialogActions>
						<Button
							onClick={this.handleCancelDelete.bind(this)}>
							Cancel
						</Button>
						<Button
							onClick={this.handleConfirmDelete.bind(this)}>
							Ok
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}

	handleRequestDelete(){
		this.setState({
			dialogDelete: true
		});
	}

	handleCancelDelete(){
		this.setState({
			dialogDelete: false
		});
	}

	handleConfirmDelete(){
		// Load games
		const games = Local.get("Games") || [];

		const {
			editList
		} = this.state;

		editList.map(item => {
			const index = games.findIndex(game => game.id = item);
			if(index !== -1) {
				games.splice(index, 1);
			}
			else {
				console.warn("Something strange: request to delete an item not in storage", item, games);
			}
			return index;
		});

		Local.set("Games", games);

		this.setState({
			dialogDelete: false,
			edit: false,
			editList: []
		});
	}

	handleCloseEdit(){
		this.setState({
			edit: false,
			editList: []
		})
	}

	handleToggleGame(id){
		let {
			editList
		} = this.state;

		const index = editList.findIndex(item => item === id);

		if(index !== -1) {
			editList.splice(index, 1);
		}
		else {
			editList.push(id);
		}

		this.setState({
			editList,
			edit: true
		});
	}

	handleToggleAll(){
		// Load games
		const games = Local.get("Games") || [];

		const {
			editList
		} = this.state;

		if(games.length === editList.length) {
			this.setState({
				editList: []
			})
		}
		else {
			this.setState({
				editList: games.map(item => item.id)
			})
		}
	}
}
