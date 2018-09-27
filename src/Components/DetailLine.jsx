import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';

import uuid from 'uuid/v1';
import Chess from 'chess.js';

import {Local} from '../Utils/Storage';
import {OPENINGS} from '../Utils/Openings';

import DetailLineHeader from './DetailLineHeader';
import DetailLineContent from './DetailLineContent';
import DetailLinePromotionDialog from './DetailLinePromotionDialog';
import DetailLineDeleteDialog from './DetailLineDeleteDialog';

class DetailLine extends Component {
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
			game,
			promotion: false,
			linesSelected: [],
			requestDeleteLines: false
		}
	}

	render(){
		const {match: {params: {lineId}}} = this.props;
		const {classes, ...other} = this.props;
		const {
			game, promotion, requestDeleteLines
		} = this.state;
		//
		const line = game.lines.find(item => item.id === lineId);

		return (
			<div className={classes.full}>
				<DetailLineHeader
					{...other}
					{...this.state}
					game={game}
					line={line}
					onToggleEditTitle={this.handleToggleEditTitle.bind(this)}
					onToggleEditLines={this.handleToggleEditLines.bind(this)}
					onToggleAllEditLines={this.handleToggleAllEditLines.bind(this)}
					onChangeTitle={this.handleChangeTitle.bind(this)}
					onConfirmEditTitle={this.handleConfirmEditTitle.bind(this)}
					onSwapChessboard={this.handleSwapChessboard.bind(this)}
					onRewindPosition={this.handleRewindPosition.bind(this)}
					onPlayMove={this.handlePlayMove.bind(this)}
					onRequestDeleteLines={()=>this.setState({requestDeleteLines: true})}
					/>

				<DetailLineContent
					{...other}
					{...this.state}
					game={game}
					line={line}
					onEditComment={this.handleEditComment.bind(this)}
					onChangeValue={this.handleChangeValue.bind(this)}
					onChangePositionValue={this.handleChangePositionValue.bind(this)}
					onRequestMove={this.handleRequestMove.bind(this)}
					onToggleLineSelect={this.handleToggleLineSelect.bind(this)}
					/>

				<DetailLinePromotionDialog
					promotion={promotion}
					onClose={()=>this.setState({promotion: false})}
					onRequestMove={this.handleRequestMove.bind(this)}/>

				<DetailLineDeleteDialog
					requestDeleteLines={requestDeleteLines}
					onClose={()=>this.setState({requestDeleteLines: false})}
					onCancelDeleteLines={this.handleCancelDeleteLines.bind(this)}
					onDeleteLines={this.handleDeleteLines.bind(this)}/>
			</div>
		);
	}

	handleRequestMove(start, end, promotion){
		const {match: {params: {lineId}}} = this.props;
		const {game} = this.state;
		// Find active line
		const line = game.lines.find(item => item.id === lineId);
		//
		const chess = new Chess(line.fen);
		// get all moves from start to end
		let moves = chess.moves({
			verbose: true,
			square: start
		}).filter(item => item.to === end);

		if(moves.length === 0) {
			// invalid move
			return;
		}

		if(moves[0].promotion) {
			if (promotion) {
				moves = moves.filter(item => item.promotion === promotion);
			}
			else {
				// request promotion
				this.setState({
					promotion: {
						start, end, color: moves[0].color
					}
				})
				return;
			}
		}

		// Do the move
		chess.move(moves[0]);

		// get the new fen
		const fen = chess.fen();

		const subline = game.lines.find(item => item.fen === fen);

		if(subline) {
			// This line already exists
			// redirect to it
			this.props.history.replace(`/detail/${game.id}/${subline.id}`);
			return;
		}

		let comment = "";
		const {searchOpenings = true} = Local.get("Settings") || {};
		if(searchOpenings) {
			// search a matchin fen
			const opening = OPENINGS.find(item => item.fen === fen);
			if(opening) {
				comment = opening.name + " ("+opening.eco+")";
			}
		}

		// create a new line
		const newline = {
			id: uuid(),
			move: moves[0].san, parent: lineId, play: false,
			value: false, positionValue: false,
			comment: comment,
			fen: fen
		}

		// append newline to game.lines
		game.lines.push(newline);
		game.edit = +new Date();
		// Update state
		this.setState({
			game, promotion: false
		});
		// Load games
		const games = Local.get("Games") || [];
		// Find the game
		const gameIndex = games.findIndex(item => item.id === game.id);
		// update games
		games[gameIndex] = game;
		// save to local storage
		Local.set("Games", games);
		// redirect to new line
		this.props.history.replace(`/detail/${game.id}/${newline.id}`);
	}

	handleChangeValue(value) {
		const {match: {params: {gameId, lineId}}} = this.props;
		// Load games
		const games = Local.get("Games") || [];
		// Find the game
		const gameIndex = games.findIndex(item => item.id === gameId);
		const game = games[gameIndex];
		// Find active line
		const lineIndex = game.lines.findIndex(item => item.id === lineId);
		const line = game.lines[lineIndex];
		// set new value
		line.value = value;
		// update game
		game.lines[lineIndex] = line;
		game.edit = +new Date();
		// update games
		games[gameIndex] = game;
		// save local storage
		Local.set("Games", games);
		// update state
		this.setState({game});
	}

	handleChangePositionValue(value) {
		const {match: {params: {gameId, lineId}}} = this.props;
		// Load games
		const games = Local.get("Games") || [];
		// Find the game
		const gameIndex = games.findIndex(item => item.id === gameId);
		const game = games[gameIndex];
		// Find active line
		const lineIndex = game.lines.findIndex(item => item.id === lineId);
		const line = game.lines[lineIndex];
		// set new value
		line.positionValue = value;
		// update game
		game.lines[lineIndex] = line;
		game.edit = +new Date();
		// update games
		games[gameIndex] = game;
		// save local storage
		Local.set("Games", games);
		// update state
		this.setState({game});
	}

	handleChangeTitle(editTitleValue) {
		this.setState({editTitleValue});
	}

	handleToggleEditTitle(editTitle){
		this.setState({
			editTitle,
			editTitleValue: this.state.title
		});
	}

	handleConfirmEditTitle(){
		const {
			game,
			editTitleValue
		} = this.state;
		// Update value
		game.title = editTitleValue;
		game.edit = +new Date();
		//
		this.setState({
			editTitle: false,
			game
		});
		// Load games
		let games = Local.get("Games") || [];
		// Find game index
		const index = games.findIndex(item => item.id === game.id);
		//
		games[index] = game;
		//
		Local.set("Games", games);
	}

	handleCancelDeleteLines(){
		this.setState({
			linesSelected: [],
			editLines: false,
			requestDeleteLines: false
		});
	}

	handleDeleteLines(){
		const {game, linesSelected} = this.state;

		function recursiveFilter(lines) {
			let output = [];
			lines.forEach(line => {
				const subLines = game.lines.filter(item => item.parent === line.id);
				output = output.concat(subLines, recursiveFilter(subLines));
			})
			return output;
		}

		let linesToFilter = game.lines.slice()
			.filter(item => linesSelected.find(id => id === item.id));
		linesToFilter = linesToFilter.concat(recursiveFilter(linesToFilter));

		const linesToKeep = game.lines.filter(item => !linesToFilter.find(line => line.id === item.id));

		game.lines = linesToKeep;
		// Update state
		this.setState({game});
		// Load games
		let games = Local.get("Games") || [];
		// Find the game
		const gameIndex = games.findIndex(item => item.id === game.id);
		// Update games
		games[gameIndex] = game;
		// Save to local storage
		Local.set("Games", games);
		//
		this.setState({
			linesSelected: [],
			editLines: false,
			requestDeleteLines: false
		});
	}

	handleToggleEditLines(editLines){
		this.setState({
			editLines,
			linesSelected: []
		});
	}

	handleToggleAllEditLines(){
		const {match: {params: {lineId}}} = this.props;
		const {game, linesSelected} = this.state;
		const subLines = game.lines.filter(item => item.parent === lineId);
		if(subLines.length === linesSelected.length) {
			this.setState({
				linesSelected: []
			});
		}
		else {
			this.setState({
				linesSelected: subLines.map(item => item.id)
			});
		}
	}

	handleToggleLineSelect(lineId) {
		let {linesSelected} = this.state;
		const lineIndex = linesSelected.findIndex(item => item === lineId);
		if(lineIndex !== -1) {
			linesSelected.splice(lineIndex, 1);
		}
		else {
			linesSelected.push(lineId);
		}
		this.setState({
			editLines: true,
			linesSelected
		})
	}

	handleSwapChessboard(){
		const {rotateChessboard = false} = Local.get("Settings") || {};
		if(!rotateChessboard) {
			const {game} = this.state;
			// Set side
			game.side = game.side === "w" ? "b" : "w";
			game.edit = +new Date();
			// Update state
			this.setState({game});
			// Load games
			let games = Local.get("Games") || [];
			// Find the game index
			const gameIndex = games.findIndex(item => item.id === game.id);
			// Update games
			games[gameIndex] = game;
			// Save to local storage
			Local.set("Games", games);
		}
	}

	handleRewindPosition(){
		const {game} = this.state;
		// Find play line
		const line = game.lines.find(item => item.play);
		// Replace location
		this.props.history.replace(`/detail/${game.id}/${line.id}`);
	}

	handlePlayMove(){
		const {match: {params: {lineId}}} = this.props;
		const {game} = this.state;
		// Find play line
		const linePlayIndex = game.lines.findIndex(item => item.play);
		const linePlay = game.lines[linePlayIndex];
		// Find active line
		const lineActiveIndex = game.lines.findIndex(item => item.id === lineId);
		const lineActive = game.lines[lineActiveIndex];
		// Set play line false
		linePlay && (linePlay.play = false);
		// Set play line true
		lineActive.play = true;
		// Update game.lines
		linePlay && (game.lines[linePlayIndex] = linePlay);
		game.lines[lineActiveIndex] = lineActive;
		game.edit = +new Date();
		// Update state
		this.setState({game});
		// Load games
		let games = Local.get("Games") || [];
		// Find the game
		const gameIndex = games.findIndex(item => item.id === game.id);
		// Update games
		games[gameIndex] = game;
		// Save to local storage
		Local.set("Games", games);
	}

	handleEditComment(value){
		const {match: {params: {lineId}}} = this.props;
		const {game} = this.state;
		// Find active line
		const lineIndex = game.lines.findIndex(item => item.id === lineId);
		const line = game.lines[lineIndex];
		// Set comment
		line.comment = value;
		// Set game
		game.lines[lineIndex] = line;
		game.edit = +new Date();
		// Update state
		this.setState({game});
		// Load games
		let games = Local.get("Games") || [];
		// Find the game
		const gameIndex = games.findIndex(item => item.id === game.id);
		// Set games
		games[gameIndex] = game;
		// Save to local storage
		Local.set("Games", games);
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
