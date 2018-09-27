import React from 'react';

import withWidth, {isWidthUp} from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import AddIcon from '@material-ui/icons/AddCircle';
import ViewListIcon from '@material-ui/icons/ViewList';
import SettingsIcon from '@material-ui/icons/Settings';
import InfoIcon from '@material-ui/icons/Info';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

function DashboardDrawer (props) {
	const {
		width,
		history,
		drawer,
		handleToggleDrawer,
		classes
	} = props;

	const variant = isWidthUp('lg', width) ? "temporary" : "temporary";
	// TODO: "permanent"

	return (
		<Drawer
			variant={variant}
			open={drawer}
			onClose={()=>handleToggleDrawer(false)}>
			<AppBar
				position="static"
				color="default"
				className={classes.noShadow}>
				<Toolbar>
					<Typography className={classes.grow}></Typography>
					<IconButton
						onClick={()=>handleToggleDrawer(false)}>
						<KeyboardArrowLeftIcon/>
					</IconButton>
				</Toolbar>
			</AppBar>

			<List>
				<ListItem
					button
					onClick={()=>history.push('/new-game')}>
					<ListItemIcon>
						<AddIcon/>
					</ListItemIcon>
					<ListItemText>Create new game</ListItemText>
				</ListItem>

				<ListItem
					button
					onClick={()=>history.push('/detail')}>
					<ListItemIcon>
						<ViewListIcon/>
					</ListItemIcon>
					<ListItemText>View all games</ListItemText>
				</ListItem>

				<ListItem
					button
					onClick={()=>history.push('/settings')}>
					<ListItemIcon>
						<SettingsIcon/>
					</ListItemIcon>
					<ListItemText>Settings</ListItemText>
				</ListItem>

				<ListItem
					button
					onClick={()=>history.push('/info')}>
					<ListItemIcon>
						<InfoIcon/>
					</ListItemIcon>
					<ListItemText>Info</ListItemText>
				</ListItem>
			</List>
		</Drawer>
	);
}

const styles = theme => ({
	grow: {
		flexGrow: 1
	},
	noShadow: {
		boxShadow: "none"
	}
});

export default withStyles(styles)(withWidth()(DashboardDrawer));
