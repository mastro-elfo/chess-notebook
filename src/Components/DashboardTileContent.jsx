import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import InfoIcon from '@material-ui/icons/Info';

import Chessboard from '../Components/Chessboard';
import {Local} from '../Utils/Storage';

function DashboardTileContent (props) {
	const {
		game,
		game: {side},
		classes,
		history
	} = props;

	const line = game.lines.find(item => item.play);
	const turn = line.fen.split(" ")[1];

	const {rotateChessboard = false} = Local.get("Settings") || {};

	return (
		<div
			className={classes.TileContent}
			onClick={()=>history.push("/detail/"+game.id)}>
			<Chessboard
				fen={line.fen}
				disabled={true}
				showLabels={false}
				side={rotateChessboard ? turn : side}/>
			<GridListTileBar
				title={game.title || '\u00A0'}
				subtitle={line.comment || '\u00A0'}
				actionIcon={
					<IconButton
						color="inherit">
						<InfoIcon />
					</IconButton>
				}/>
		</div>
	);
}

const styles = theme => ({
	TileContent: {
		width: "100%",
		height: "100%",
		cursor: "pointer"
	}
});

export default withStyles(styles)(DashboardTileContent);
