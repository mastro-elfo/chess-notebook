import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import {Local} from '../Utils/Storage';

function DetailAllHeader (props) {
	const {
		edit,
		editList,
		history,
		classes,
		handleCloseEdit,
		handleToggleAll,
		handleRequestDelete
	} = props;

	// Load games
	const games = Local.get("Games") || [];

	if (edit) {
		return (
			<AppBar
				position="static"
				color="default">
				<Toolbar>
					<IconButton
						onClick={handleCloseEdit}>
						<CloseIcon/>
					</IconButton>

					<Checkbox
						color="primary"
						checked={editList.length === games.length}
						onClick={handleToggleAll}
						/>

					<Typography
						variant="title"
						color="inherit"
						className={classes.grow}>
						{editList.length} Selected
					</Typography>

					<IconButton
						disabled={editList.length === 0}
						onClick={handleRequestDelete}>
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
						className={classes.grow}>
						All games
					</Typography>
				</Toolbar>
			</AppBar>
		);
	}
}

const styles = theme => ({
	grow: {
		flexGrow: 1
	}
});

export default withStyles(styles)(DetailAllHeader);
