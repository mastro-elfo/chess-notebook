import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import InfoIcon from '@material-ui/icons/Info';

import Chessboard from '../Components/Chessboard';

function DashboardTileContent (props) {
	const {
		game,
		classes,
		history
	} = props;

	const line = game.lines.find(item => item.play);

	return (
		<div className={classes.TileContent}>
			<Chessboard
				fen={line.fen}
				disabled={true}
				showRowLabels={[]}
				showColumnLabels={[]}/>
			<GridListTileBar
				title={game.title}
				subtitle={line.comment}
				actionIcon={
					<IconButton
						onClick={()=>history.push("/detail/"+game.id)}
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
		height: "100%"
	}
});

export default withStyles(styles)(DashboardTileContent);
