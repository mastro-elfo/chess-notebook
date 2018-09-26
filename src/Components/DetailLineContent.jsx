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
		theme,
		...other
	} = props;

	const turn = fen.split(" ")[1];

	return (
		<main className={classes.main}>
			<Grid container
				spacing={theme.spacing.unit}
				className={classes.container}>
				<Grid item
					xs={12} sm={6}>
					<div style={{height: "20em"}}>
						<Chessboard
							{...other}
							fen={fen}
							side={rotateChessboard ? turn : side}
							/>
					</div>
				</Grid>

				<Grid item
					xs={12} sm={6}>
					<Notebook
						{...other}
						/>
				</Grid>
			</Grid>
		</main>
	);
}

const styles = theme => ({
	main: {
		padding: theme.spacing.unit
	}
});

export default withStyles(styles, {withTheme: true})(DetailLineContent);
