import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';

import DetailLineHeader from './DetailLineHeader';
import DetailLineContent from './DetailLineContent';

import {Local} from '../Utils/Storage';

class DetailLine extends Component {
	state = {
		editTitle: false,
		editLines: false,
		editTitleValue: "",
		loading: true
	}

	constructor(props) {
		super(props);

		const {match: {params: {gameId}}} = props;

		// Load games
		const games = Local.get("Games") || [];

		// Find the game
		const game = games.find(item => item.id === gameId);

		this.state = {
			editTitle: false,
			editLines: false,
			editTitleValue: "",
			loading: true,
			game
		}
	}

	render(){
		const {
			match: {params: {gameId, lineId}}
		} = this.props;

		const {classes, ...other} = this.props;

		// Load games
		const games = Local.get("Games") || [];

		// Find the game
		const game = games.find(item => item.id === gameId);

		// Find the line
		const line = game.lines.find(item => item.id === lineId);

		return (
			<div className={classes.full}>
				<DetailLineHeader
					{...other}
					{...this.state}
					game={game}
					line={line}
					handleToggleEditTitle={this.handleToggleEditTitle.bind(this)}
					handleChangeTitle={this.handleChangeTitle.bind(this)}
					handleConfirmEditTitle={this.handleConfirmEditTitle.bind(this)}
					handleSwapChessboard={this.handleSwapChessboard.bind(this)}
					handleRewindPosition={this.handleRewindPosition.bind(this)}
					handlePlayMove={this.handlePlayMove.bind(this)}/>

				<DetailLineContent
					{...other}
					{...this.state}
					game={game}
					line={line}
					/>
			</div>
		);
	}

	handleChangeTitle(editTitleValue) {
		this.setState({editTitleValue});
	}

	handleToggleEditTitle(editTitle){
		const {
			game: {title}
		} = this.state;

		this.setState({
			editTitle,
			editTitleValue: title
		});
	}

	handleConfirmEditTitle(){
		const {
			game,
			game: {id},
			editTitleValue
		} = this.state;

		// Load games
		let games = Local.get("Games") || [];

		// Find game index
		const index = games.findIndex(item => item.id === id);

		games[index] = {
			...game,
			title: editTitleValue
		};

		Local.set("Games", games);

		this.setState({
			editTitle: false,
			game: {
				...game,
				title: editTitleValue
			}
		})
	}

	handleToggleEditLines(editLines){
		this.setState({editLines});
	}

	handleSwapChessboard(){
		const {rotateChessboard = false} = Local.get("Settings") || {};

		// console.debug("Rotate", rotateChessboard);

		if(!rotateChessboard) {
			const {match: {params: {gameId}}} = this.props;

			// Load games
			let games = Local.get("Games") || [];

			// Find the game
			let game = games.find(item => item.id === gameId);
			const gameIndex = games.findIndex(item => item.id === gameId);

			// Set side
			game.side = game.side === "w" ? "b" : "w";

			// Update games
			games[gameIndex] = game;

			// Save to local storage
			Local.set("Games", games);

			// Update state
			this.setState({game});
		}
	}

	handleRewindPosition(){
		const {match: {params: {gameId}}} = this.props;

		// Load games
		const games = Local.get("Games") || [];

		// Find the game
		const game = games.find(item => item.id === gameId);

		// Find play line
		const line = game.lines.find(item => item.play);

		// Replace location
		this.props.history.replace(`/detail/${gameId}/${line.id}`);
	}

	handlePlayMove(){
		const {match: {params: {gameId, lineId}}} = this.props;

		// Load games
		let games = Local.get("Games") || [];

		// Find the game
		let game = games.find(item => item.id === gameId);
		const gameIndex = games.findIndex(item => item.id === gameId);

		// Find play line
		let linePlay = game.lines.find(item => item.play);
		const linePlayIndex = game.lines.findIndex(item => item.play);

		// Find active line
		let lineActive = game.lines.find(item => item.id === lineId);
		const lineActiveIndex = game.lines.findIndex(item => item.id === lineId);

		// Set play line false
		linePlay.play = false;

		// Set play line true
		lineActive.play = true;

		// Update game.lines
		game[linePlayIndex] = linePlay;
		game[lineActiveIndex] = lineActive;

		// Update games
		games[gameIndex] = game;

		// Save to local storage
		Local.set("Games", games);

		// Update state
		this.setState({game});
	}
}

const styles = theme => ({
	full: {
		position: "fixed",
		top: 0, left: 0, right: 0, bottom: 0,
		overflowY: "auto"
	}
});

export default withStyles(styles)(DetailLine);
