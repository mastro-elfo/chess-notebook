import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import {Local} from '../Utils/Storage';

import DetailAllTileContent from './DetailAllTileContent';

const GridListCols = {
	"xs": 1,
	"sm": 2,
	"md": 3
};

function DetailAllContent (props) {
	const {
		classes,
		theme,
		width
	} = props;

	const listOfGames = Local.get('Games') || [];

	return (
		<main
			className={classes.main}>
			<GridList
				cols={GridListCols[width] || 4}
				spacing={theme.spacing.unit}>
				{
					listOfGames.map((item, i) => {
						const {classes, ...other} = props;
						return (
							<GridListTile
								key={i}>
								<DetailAllTileContent
									{...other}
									game={item}
									/>
							</GridListTile>
						);
					})
				}
			</GridList>
		</main>
	);
}

const styles = theme => ({
	main: {
		padding: theme.spacing.unit
	},
	TileContent: {
		width: "100%",
		height: "100%"
	}
});

export default withWidth()(withStyles(styles, {withTheme: true})(DetailAllContent));
