import React, {Component} from 'react';

import DetailLineHeader from './DetailLineHeader';
import DetailLineContent from './DetailLineContent';

import {Local} from '../Utils/Storage';

export default class DetailLine extends Component {
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
			match: {params: {gameId, lineId}},
		} = this.props;

		// Load games
		const games = Local.get("Games") || [];

		// Find the game
		const game = games.find(item => item.id === gameId);

		// Find the line
		const line = game.lines.find(item => item.id === lineId);

		return (
			<div>
				<DetailLineHeader
					{...this.props}
					{...this.state}
					game={game}
					line={line}
					handleToggleEditTitle={this.handleToggleEditTitle.bind(this)}
					handleChangeTitle={this.handleChangeTitle.bind(this)}
					handleConfirmEditTitle={this.handleConfirmEditTitle.bind(this)}/>

				<DetailLineContent
					{...this.props}
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
}
