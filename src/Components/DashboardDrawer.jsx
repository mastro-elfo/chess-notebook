import React from 'react';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import AddIcon from '@material-ui/icons/Add';
import ViewListIcon from '@material-ui/icons/ViewList';
import SettingsIcon from '@material-ui/icons/Settings';
import InfoIcon from '@material-ui/icons/Info';

export default function DashboardDrawer (props) {
	const {
		history,
		drawer,
		handleToggleDrawer
	} = props;

	return (
		<Drawer
			open={drawer}
			onClose={()=>handleToggleDrawer(false)}>

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
