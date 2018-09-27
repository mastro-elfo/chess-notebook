import React, {Component} from 'react';

import NewGameHeader from './NewGameHeader';
import NewGameContent from './NewGameContent'

import uuid from 'uuid/v1';
import Chess from 'chess.js';

import {Local} from '../Utils/Storage';
import toFen from '../Utils/ToFen';

export default class NewGame extends Component {
	state = {
		title: "",
		description: "",
		position: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
		turn: "w",
		whiteCastling: 'KQ',
		blackCastling: 'kq',
		enPassant: "-",
		drawMoves: 0,
		totalMoves: 1
	}

	render(){
		return (
			<div>
				<NewGameHeader
					{...this.props}
					{...this.state}
					onClickPlay={this.handleClickPlay.bind(this)}
					onUpdateFromPGN={this.handleUpdateFromPGN.bind(this)}
					/>
				<NewGameContent
					{...this.props}
					{...this.state}
					onChange={this.handleChange.bind(this)}
					onRequestMove={this.handleRequestMove.bind(this)}
					/>
			</div>
		);
	}

	handleClickPlay(){
		// Load from state
		const {
			title, description, position, turn, whiteCastling, blackCastling, enPassant, drawMoves, totalMoves
		} = this.state;

		// Create a Game object
		const game = {
			id: uuid(),
			title, description,
			side: turn,
			lines: [
				{
					id: uuid(),
					move: null, parent: null, play: true,
					value: false, positionValue: false,
					comment: description,
					fen: toFen(position, turn, whiteCastling, blackCastling, enPassant, drawMoves, totalMoves)
				}
			],
			edit: +new Date()
		};

		// Add game object to local Storage
		let games = Local.get("Games") || [];
		games.push(game);
		Local.set("Games", games);

		// Redirect to new game
		this.props.history.push(`/detail/${game.id}`);
	}

	handleChange(value){
		this.setState(value);
	}

	handleRequestMove(start, end) {
		const {
			position, turn, whiteCastling, blackCastling, enPassant, drawMoves, totalMoves
		} = this.state;

		let chess = new Chess(toFen(position, turn, whiteCastling, blackCastling, enPassant, drawMoves, totalMoves))

		const startPiece = chess.get(start);
		if(startPiece) {
			chess.put(startPiece, end);
			chess.remove(start);
			const fen = chess.fen().split(' ');
			this.setState({
				position: fen[0],
				turn: fen[1],
				whiteCastling: fen[2].split('').filter(a=>a==='K'||a==='Q').join(''),
				blackCastling: fen[2].split('').filter(a=>a==='k'||a==='q').join(''),
				enPassant: fen[3],
				drawMoves: fen[4],
				totalMoves: fen[5]
			})
		}
	}

	handleUpdateFromPGN(pgn){
		const headersPart = pgn.match(/\[(.*?)]/g);
		const movesPart = pgn.match(/\s{2}1\..*/);

		if(!headersPart || !movesPart) {
			return;
		}

		pgn = headersPart.join("\n")
			+"\n\n"
			+movesPart[0].trim();
		let chess = new Chess();

		const loadSuccess = chess.load_pgn(pgn);
		if(!loadSuccess){
			return;
		}

		// Get FEN
		const fen = chess.fen();

		// Split FEN
		const [position, turn, castling, enPassant, drawMoves, totalMoves] = fen.split(' ');

		// Update FEN state
		this.setState({
			position, turn, enPassant, drawMoves, totalMoves,
			whiteCastling: castling.split('').filter(a=>a==='K'||a==='Q').join('')||'-',
			blackCastling: castling.split('').filter(a=>a==='k'||a==='q').join('')||'-'
		});

		// Get headers
		const headers = chess.header();

		// Create a base title/description
		// TODO: Can be configurable?
		this.setState({
			title: [headers.Event, headers.Site, headers.Date].join(" - "),
			description: [headers.White+" - "+headers.Black, "Round: "+headers.Round, "Result: "+headers.Result].join("\n")
		})
	}
}
