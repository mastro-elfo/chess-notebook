import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Notebook from './Notebook';
import Chessboard from './Chessboard';
import {Local} from '../Utils/Storage';

function DetailLineContent (props) {
	const {rotateChessboard = false} = Local.get("Settings") || {};

	const {
		game: {side},
		line: {fen}
	} = props;

	const {
		classes,
		...other
	} = props;

	const turn = fen.split(" ")[1];

	return (
		<Grid container
			alignItems="stretch"
			classes={{
				container: classes.container
			}}>
			<Grid item
				xs={12} sm={6}>
				<Chessboard
					{...other}
					fen={fen}
					side={rotateChessboard ? turn : side}
					/>
			</Grid>

			<Grid item
				xs={12} sm={6}>
				<Notebook
					{...other}
					/>
			</Grid>
		</Grid>
	);
}

const styles = theme => ({
	container: {
		padding: theme.spacing.unit
	}
});

export default withStyles(styles)(DetailLineContent);
