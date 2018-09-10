import React, {Component} from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Paper from '@material-ui/core/Paper';

import DrawerIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import ViewListIcon from '@material-ui/icons/ViewList';
import SettingsIcon from '@material-ui/icons/Settings';
import InfoIcon from '@material-ui/icons/Info';

export default class Dashboard extends Component {
	constructor(props){
		super(props);
		this.state = {
			drawer: false
		};
	}

	onToggleDrawer(drawer){
		this.setState({drawer});
	}

	render(){
		return (
			<div>
				<AppBar position="static">
					<Toolbar>
						<IconButton
							onClick={()=>this.setState({drawer: true})}>
							<DrawerIcon/>
						</IconButton>
						<Typography variant="title" style={{flexGrow: 1}}>
							Dashboard
						</Typography>
					</Toolbar>
				</AppBar>

				<Drawer
					open={this.state.drawer}
					onClose={()=>this.setState({drawer: false})}>
					<List>
						<ListItem button
							onClick={()=>this.props.history.push('/new-game')}>
							<ListItemIcon>
								<AddIcon/>
							</ListItemIcon>
							<ListItemText>Create new game</ListItemText>
						</ListItem>
						<ListItem button
							onClick={()=>this.props.history.push('/detail')}>
							<ListItemIcon>
								<ViewListIcon/>
							</ListItemIcon>
							<ListItemText>View all games</ListItemText>
						</ListItem>
						<ListItem button
							onClick={()=>this.props.history.push('/settings')}>
							<ListItemIcon>
								<SettingsIcon/>
							</ListItemIcon>
							<ListItemText>Settings</ListItemText>
						</ListItem>
						<ListItem button
							onClick={()=>this.props.history.push('/info')}>
							<ListItemIcon>
								<InfoIcon/>
							</ListItemIcon>
							<ListItemText>Info</ListItemText>
						</ListItem>
					</List>
				</Drawer>

				<DashboardContent />
			</div>
		);
	}
}

function DashboardContent (props) {
	return (
		<div>
			<Typography variant="title" color="primary">Search</Typography>
			{
				// // TODO: insert search field here
			}

			<Typography variant="title" color="primary">Last games</Typography>
			{
				// TODO: insert last game list here
			}
		</div>
	)
}
