import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import DetailLineHeader from './DetailLineHeader';
import DetailLineContent from './DetailLineContent';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';

import uuid from 'uuid/v1';
import Chess from 'chess.js';
import {Local} from '../Utils/Storage';
import {OPENINGS} from '../Utils/Openings';
import PieceToIcon from '../Utils/PieceToIcon';

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
			promotion: false
		}
	}

	render(){
		const {match: {params: {lineId}}} = this.props;
		const {classes, ...other} = this.props;
		const {
			game, promotion
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
					onEditComment={this.handleEditComment.bind(this)}
					onChangeValue={this.handleChangeValue.bind(this)}
					onChangePositionValue={this.handleChangePositionValue.bind(this)}
					onRequestMove={this.handleRequestMove.bind(this)}
					/>

				<Dialog
					open={!!promotion}
					onClose={()=>this.setState({promotion: false})}>
					<DialogContent>
						<Grid container
							justify="center"
							className={classes.PromotionGrid}>
							<Grid item>
								<IconButton
									onClick={()=>this.handleRequestMove(promotion.start, promotion.end, "q")}>
									<img alt="Queen" src={PieceToIcon(promotion.color === "w" ? "Q" : "q")}/>
								</IconButton>
							</Grid>
							<Grid item>
								<IconButton
									onClick={()=>this.handleRequestMove(promotion.start, promotion.end, "r")}>
									<img alt="Rook" src={PieceToIcon(promotion.color === "w" ? "R" : "r")}/>
								</IconButton>
							</Grid>
							<Grid item>
								<IconButton
									onClick={()=>this.handleRequestMove(promotion.start, promotion.end, "n")}>
									<img alt="Knight" src={PieceToIcon(promotion.color === "w" ? "N" : "n")}/>
								</IconButton>
							</Grid>
							<Grid item>
								<IconButton
									onClick={()=>this.handleRequestMove(promotion.start, promotion.end, "b")}>
									<img alt="Bishop" src={PieceToIcon(promotion.color === "w" ? "B" : "b")}/>
								</IconButton>
							</Grid>
						</Grid>
					</DialogContent>
				</Dialog>
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

	handleToggleEditLines(editLines){
		this.setState({editLines});
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
		// TODO: add feedback
		const {match: {params: {lineId}}} = this.props;
		const {game} = this.state;
		// Find play line
		const linePlayIndex = game.lines.findIndex(item => item.play);
		const linePlay = game.lines[linePlayIndex];
		// Find active line
		const lineActiveIndex = game.lines.findIndex(item => item.id === lineId);
		const lineActive = game.lines[lineActiveIndex];
		// Set play line false
		linePlay.play = false;
		// Set play line true
		lineActive.play = true;
		// Update game.lines
		game.lines[linePlayIndex] = linePlay;
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
	},
	PromotionGrid: {

	}
});

export default withStyles(styles)(DetailLine);
