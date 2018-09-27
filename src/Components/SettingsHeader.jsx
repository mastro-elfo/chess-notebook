import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

function SettingsHeader (props) {
	const {history, classes} = props;

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
					className={classes.grow}>
					Settings
				</Typography>
			</Toolbar>
		</AppBar>
	);
}

const styles = theme => ({
	grow: {
		flexGrow: 1
	}
});

export default withStyles(styles)(SettingsHeader);
