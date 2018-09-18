import React, {Component} from 'react';

import { withStyles } from '@material-ui/core/styles';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import FastRewindIcon from '@material-ui/icons/FastRewind';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CloseIcon from '@material-ui/icons/Close';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import {Local} from '../Storage';

class NotebookHeader extends Component {
	static defaultProps = {
		edit: false
	}

	render(){
		const {
			game,
			line,
			edit,
			classes,
			history
		} = this.props;

		// Find the previous line if exists
		const previous = game.lines.find(item => item.id === line.parent);

		// Find the actual line
		const play = game.lines.find(item => item.play);

		return (
			<div>
				{edit &&
					<Toolbar>
						<IconButton>
							<CloseIcon/>
						</IconButton>

						<Typography
							variant="title"
							className={classes.grow}>
							Edit <small>()</small>
						</Typography>

						<IconButton>
							<DeleteForeverIcon/>
						</IconButton>
					</Toolbar>
				}

				{!edit &&
					<Toolbar>
						<IconButton
							disabled={play.id === line.id}
							onClick={()=>history.replace("/detail/"+game.id+"/"+play.id)}>
							<FastRewindIcon/>
						</IconButton>

						<IconButton
							disabled={!previous}
							onClick={()=>history.replace("/detail/"+game.id+"/"+previous.id)}>
							<ArrowBackIcon/>
						</IconButton>

						<IconButton
							disabled={play.id === line.id}
							onClick={()=>this.handleClickPlay()}>
							<PlayArrowIcon/>
						</IconButton>
					</Toolbar>
				}
			</div>
		);
	}

	handleClickPlay(){
		// Load games
		let games = Local.get("Games");

		// Find active game
		let game = games.find(item => item.id === this.props.game.id)

		// Find active game index
		const gameIndex = games.findIndex(item => item.id === this.props.game.id);

		// Find active line
		let activeLine = game.lines.find(item => item.play);

		// Find active line index
		const activeIndex = game.lines.findIndex(item => item.play);

		// Find this line
		let thisLine = game.lines.find(item => item.id === this.props.line.id);

		// Find this line index
		const thisIndex = game.lines.findIndex(item => item.id === this.props.line.id);

		// Set active line `play = false`
		activeLine.play = false;

		// Set this line `play = true`
		thisLine.play = true;

		// Save "active" line
		game.lines[activeIndex] = activeLine;

		// Save this line
		game.lines[thisIndex] = thisLine;

		// Save games
		games[gameIndex] = game;

		// Store
		Local.set("Games", games);
	}
}

const styles = theme => ({
	grow: {
		flexGrow: 1
	}
});

export default withStyles(styles, {withTheme: true})(NotebookHeader);
