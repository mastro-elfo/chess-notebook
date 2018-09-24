import React, {Component} from 'react';

import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';

import {Local} from '../Utils/Storage';
import DashboardTileContent from './DashboardTileContent';

const GridListCols = {
	"xs": 1,
	"sm": 2,
	"md": 3
};

// TODO: Use function
class DashboardContent extends Component {
	render(){
		const {
			classes,
			theme,
			width,
			history,
			location: {search}
		} = this.props;

		const searchEntry = search.substring(1);

		const {lastEditLimit = 5} = Local.get("Settings") || {};
		const listOfGames = Local.get('Games') || [];
		const lastPlayedGames = listOfGames
			.sort((a,b) => a.edit - b.edit)
			.slice(0, lastEditLimit);
		const searchResult = listOfGames
			.filter(item =>
				item.title
				.toLowerCase()
				.indexOf(searchEntry.toLowerCase()) !== -1);

		return (
			<main
				className={classes.main}>
				<Button
					className={classes.FabButton}
					variant="fab"
					color="primary"
					onClick={()=>history.push('/new-game')}>
					<AddIcon/>
				</Button>

				{
					searchEntry &&
					<div>
						<Typography
							variant="title"
							color="primary">
							Search result <small>({searchResult.length})</small>
						</Typography>

						{
							searchResult.length === 0 &&
							<Typography
								paragraph>
								No result found
							</Typography>
						}

						{
							searchResult.length > 0 &&
							<GridList
								cols={GridListCols[width] || 4}
								spacing={theme.spacing.unit}>
								{
									searchResult.map((item, i) =>{
										const {classes, ...other} = this.props;
										return (
											<GridListTile
												key={i}>
												<DashboardTileContent
													{...other}
													game={item}
													/>
											</GridListTile>
										);
									})}
							</GridList>
						}
					</div>
				}

				{
					!searchEntry &&
					<div>
						<Typography
							variant="title"
							color="primary">
							Last played games
						</Typography>

						{
							lastPlayedGames.length > 0 &&
							<GridList
								cols={GridListCols[width] || 4}
								spacing={theme.spacing.unit}>
								{
									lastPlayedGames.map((item, i) =>{
										const {classes, ...other} = this.props;
										return (
											<GridListTile
												key={i}>
												<DashboardTileContent
													{...other}
													game={item}
													/>
											</GridListTile>
										);
									})}
							</GridList>
						}
					</div>
				}
			</main>
		);
	}
}

const styles = theme => ({
	FabButton: {
		position: "absolute",
		bottom: theme.spacing.unit *2,
		right: theme.spacing.unit *2
	},
	main: {
		paddingTop: theme.spacing.unit *2,
		paddingLeft: theme.spacing.unit,
		paddingRight: theme.spacing.unit,
		paddingBottom: theme.spacing.unit
	}
});

export default withWidth()(withStyles(styles, {withTheme: true})(DashboardContent));
