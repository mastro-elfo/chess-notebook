import React, {Component} from 'react';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CheckIcon from '@material-ui/icons/Check';

class DetailLineHeader extends Component {
	render(){
		const {
			game,
			editTitle,
			editLines,
			editTitleValue,
			history,
			classes,
			handleToggleEditTitle,
			handleToggleEditLines,
			handleChangeTitle,
			handleConfirmEditTitle
		} = this.props;

		if(editTitle) {
			return (
				<AppBar
					position="static"
					color="default">
					<Toolbar>
						<IconButton
							onClick={()=>handleToggleEditTitle(false)}>
							<CloseIcon/>
						</IconButton>

						<TextField
							placeholder="Game title"
							value={editTitleValue}
							fullWidth
							onChange={({target})=>handleChangeTitle(target.value)}/>

						<IconButton
							onClick={handleConfirmEditTitle}>
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
							onClick={()=>handleToggleEditLines(false)}>
							<CloseIcon/>
						</IconButton>

						<Checkbox
							color="primary"
							/>

						<Typography
							variant="title"
							color="inherit"
							className={classes.grow}>
							Edit <small>()</small>
						</Typography>

						<IconButton>
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
							color="inherit"
							className={classes.grow}
							onClick={()=>handleToggleEditTitle(true)}>
							{game.title}
						</Typography>

						<IconButton>
							<SwapVertIcon/>
						</IconButton>

						<IconButton>
							<FastRewindIcon/>
						</IconButton>

						<IconButton>
							<PlayArrowIcon/>
						</IconButton>
					</Toolbar>
				</AppBar>
			);
		}
	}
}

const styles = theme => ({
	grow: {
		flexGrow: 1
	}
});

export default withStyles(styles)(DetailLineHeader);
