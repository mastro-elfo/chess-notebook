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
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import TextField from '@material-ui/core/TextField';

import DrawerIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import ViewListIcon from '@material-ui/icons/ViewList';
import SettingsIcon from '@material-ui/icons/Settings';
import InfoIcon from '@material-ui/icons/Info';

import {Local} from './Storage';
import Chessboard from './chessboard';

export default class Dashboard extends Component {
	constructor(props){
		super(props);
		this.state = {
			drawer: false,

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

				<DashboardContent {...this.props}/>
			</div>
		);
	}
}

class DashboardContent extends Component {
	constructor(props){
		super(props);
		this.state = {
			search: ""
		}
	}

	handleItemDetailClick(item){
		const {id} = item;
		const move = item.lines.find(line => line.play);
		const moveId = (move && move.id) || 0;
		this.props.history.push('/detail/'+id+'/'+moveId);
	}

	render(){
		const {search} = this.state;

		const list = Local.get('Games') || [];

		const filter = list.filter(item => this.filter(item, search));

		return (
			<div>
				<TextField
					fullWidth
					label="Search game"
					type="search"
					value={search}
					onChange={({target})=>this.setState({search: target.value})}
					/>

				{
					this.state.search &&
					<div>
						<Typography variant="title" color="primary">Search</Typography>
						{
							filter.length !== 0 &&
							<GridList>
								{filter.map((item, i) =>
									<GridListTile key={i}>
										<div>
											<Chessboard
												fen={item.fen}/>
										</div>
										<GridListTileBar
											title={item.title}
											actionIcon={
												<IconButton color="inherit"
													onClick={()=>this.handleItemDetailClick(item)}>
													<InfoIcon />
												</IconButton>
											}/>
									</GridListTile>)}
							</GridList>
						}

						{
							filter.length === 0 &&
							<Typography paragraph>No result found</Typography>
						}
					</div>
				}

				{
					!this.state.search &&
					<div>
						<Typography variant="title" color="primary">Last games</Typography>
						{
							// TODO: insert last game list here
						}
					</div>
				}
			</div>
		)
	}

	filter(item, search){
		const searchLowerCase = search.toLowerCase();
		return (
			item.title.toLowerCase()
				.indexOf(searchLowerCase) !== -1
		)
	}
}
