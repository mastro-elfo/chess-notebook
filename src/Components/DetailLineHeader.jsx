import React, {Component} from 'react';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CheckIcon from '@material-ui/icons/Check';

import {Local} from '../Utils/Storage';

class DetailLineHeader extends Component {
	state = {
		handlePlayFeedback: false
	}

	render(){
		const {
			game,
			editTitle,
			editLines,
			linesSelected,
			editTitleValue,
			history,
			classes,
			onToggleEditTitle,
			onToggleEditLines,
			onChangeTitle,
			onConfirmEditTitle,
			onSwapChessboard,
			onRewindPosition,
			onToggleAllEditLines,
			onRequestDeleteLines,
			match: {params: {lineId}}
		} = this.props;

		const {
			handlePlayFeedback
		} = this.state;

		const {rotateChessboard = false} = Local.get("Settings") || {};
		const subLines = game.lines.filter(item => item.parent === lineId);

		if(editTitle) {
			return (
				<AppBar
					position="static"
					color="default">
					<Toolbar>
						<IconButton
							onClick={()=>onToggleEditTitle(false)}>
							<CloseIcon/>
						</IconButton>

						<TextField
							placeholder="Game title"
							value={editTitleValue||""}
							fullWidth
							onChange={({target})=>onChangeTitle(target.value)}/>

						<IconButton
							onClick={onConfirmEditTitle}>
							<CheckIcon/>
						</IconButton>
					</Toolbar>
				</AppBar>
			);
		}
		else if(editLines) {
			return (
				<AppBar
					position="static"
					color="default">
					<Toolbar>
						<IconButton
							onClick={()=>onToggleEditLines(false)}>
							<CloseIcon/>
						</IconButton>

						<Checkbox
							color="primary"
							onClick={onToggleAllEditLines}
							checked={subLines.length === linesSelected.length}
							/>

						<Typography
							variant="title"
							color="inherit"
							className={classes.grow}>
							{linesSelected.length} Selected
						</Typography>

						<IconButton
							onClick={onRequestDeleteLines}>
							<DeleteForeverIcon/>
						</IconButton>
					</Toolbar>
				</AppBar>
			);
		}
		else {
			return (
				<AppBar
					position="static"
					color="primary">
					<Toolbar>
						<IconButton
							onClick={()=>history.goBack()}>
							<ArrowBackIcon/>
						</IconButton>

						<Typography
							variant="title"
							className={classNames(classes.grow, {
								[classes.hint]: !game.title
							})}
							noWrap
							onClick={()=>onToggleEditTitle(true)}>
							{game.title || "Click here to edit"}
						</Typography>

						<IconButton
							onClick={onSwapChessboard}
							disabled={rotateChessboard}>
							<SwapVertIcon/>
						</IconButton>

						<IconButton
							onClick={onRewindPosition}>
							<FastRewindIcon/>
						</IconButton>

						<Tooltip
							open={handlePlayFeedback}
							onClose={()=>this.setState({handlePlayFeedback: false})}
							onOpen={()=>{}}
							title="Move set to play"
							placement="left">
							<IconButton
								onClick={this.handlePlayMove.bind(this)}>
								<PlayArrowIcon/>
							</IconButton>
						</Tooltip>
					</Toolbar>
				</AppBar>
			);
		}
	}

	handlePlayMove(){
		this.setState({handlePlayFeedback: true});
		this.props.onPlayMove();
	}
}

const styles = theme => ({
	grow: {
		flexGrow: 1
	},
	hint: {
		color: theme.palette.text.hint
	}
});

export default withStyles(styles)(DetailLineHeader);
