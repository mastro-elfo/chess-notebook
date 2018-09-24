import React, {Component} from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import {Local} from '../Utils/Storage';

export default class DetailGame extends Component {
	componentDidMount(){
		// Get gameId from params
		const {
			match: {params: {gameId}},
			history
		} = this.props;

		// Load games
		const games = Local.get("Games") || [];

		// Find game
		const game = games.find(item => ""+item.id === gameId);

		if(!game) {
			// Game not found
			history.replace('/404/GameNotFound');
		}
		else {
			// Find active line
			let line = game.lines.find(item => item.play);
			if (!line) {
				// Line not found
				// very strange, but so it is
				// Get the first line
				console.warn("Game has no active line", game);
				line = game.lines[0];
			}
			if(!line) {
				// this game has no lines? Something very wrong happened here!
				history.replace('/404/LineNotFound');
			}
			else {
				// Ok, very well
				history.replace(`/detail/${gameId}/${line.id}`);
			}
		}
	}

	render(){
		return (
			<CircularProgress
				color="primary"
				/>
		);
	}
}
