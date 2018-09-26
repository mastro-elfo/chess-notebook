import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Checkbox from '@material-ui/core/Checkbox';

import InfoIcon from '@material-ui/icons/Info';

import Chessboard from '../Components/Chessboard';
import {Local} from '../Utils/Storage';

function DetailAllTileContent (props) {
	const {
		game,
		game: {side},
		editList,
		classes,
		history,
		handleToggleGame
	} = props;

	const line = game.lines.find(item => item.play);
	const turn = line.fen.split(" ")[1];

	const {rotateChessboard = false} = Local.get("Settings") || {};

	return (
		<div className={classes.TileContent}>
			<Chessboard
				fen={line.fen}
				disabled={true}
				showLabels={false}
				side={rotateChessboard ? turn : side}/>

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

			<GridListTileBar
				titlePosition="top"
				actionIcon={
					<Checkbox
						checked={!!editList.find(item => item === game.id)}
						color="primary"
						onClick={()=>handleToggleGame(game.id)}/>
				}
				className={classes.CheckboxBar}/>
		</div>
	);
}

const styles = theme => ({
	TileContent: {
		width: "100%",
		height: "100%"
	},
	CheckboxBar: {
		background: "transparent"
	}
});

export default withStyles(styles)(DetailAllTileContent);
