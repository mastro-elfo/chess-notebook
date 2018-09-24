import React, {Component} from 'react';

import NewGameHeader from './NewGameHeader';
import NewGameContent from './NewGameContent'

import uuid from 'uuid/v1';

import {Local} from '../Utils/Storage';

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
					/>
				<NewGameContent
					{...this.props}
					{...this.state}
					onChange={this.handleChange.bind(this)}
					/>
			</div>
		);
	}

	handleClickPlay(){
		// Load from state
		const {
			title, description, turn
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
					fen: this.toFen()
				}
			]
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

	toFen(){
		// Load from state
		const {
			position, turn, whiteCastling, blackCastling, enPassant, drawMoves, totalMoves
		} = this.state;

		// Removes the first occurence of "-"
		// KQkq -> KQkq
		// -kq -> kq
		// KQ- -> KQ
		// -- -> -
		const castling = (whiteCastling + blackCastling).replace('-', '');

		return [
			position, turn, castling, enPassant, drawMoves, totalMoves
		].join(' ');
	}
}
