import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

function NewGameHeader (props) {
	const {
		history,
		classes,
		onClickPlay
		// ...other
	} = props;

	return (
		<AppBar
			position="static">
			<Toolbar>
				<IconButton
					onClick={()=>history.goBack()}>
					<ArrowBackIcon/>
				</IconButton>

				<Typography
					variant="title"
					className={classes.grow}
					color="inherit">
					New Game
				</Typography>

				<IconButton
					onClick={onClickPlay}>
					<PlayArrowIcon/>
				</IconButton>
			</Toolbar>
		</AppBar>
	);
}

const styles = theme => ({
	grow: {
		flexGrow: 1
	}
});

export default withStyles(styles)(NewGameHeader);
