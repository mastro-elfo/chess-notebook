import React, {Component} from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';

import DrawerIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import ViewListIcon from '@material-ui/icons/ViewList';
import SettingsIcon from '@material-ui/icons/Settings';
import InfoIcon from '@material-ui/icons/Info';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

import {Local} from './Storage';
import Chessboard from './chessboard';

class Dashboard extends Component {
	constructor(props){
		super(props);
		this.state = {
			drawer: false,
			search: ""
		};
	}

	onToggleDrawer(drawer){
		this.setState({drawer});
	}

	render(){
		const {classes} = this.props;
		return (
			<div>
				<AppBar position="static">
					<Toolbar>
						<IconButton
							onClick={()=>this.setState({drawer: true})}>
							<DrawerIcon/>
						</IconButton>

						<Typography variant="title">
							Dashboard
						</Typography>

						<div className={classes.grow} />

						<div className={classes.search}>
							<div className={classes.searchIcon}><SearchIcon/></div>
							<Input
								classes={{
									root: classes.root,
									input: classes.input
								}}
								placeholder="Search..."
								disableUnderline
								type="search"
								value={this.state.search}
								onChange={({target})=>this.setState({search: target.value})}
								endAdornment={<InputAdornment position="end">
									<IconButton
										onClick={()=>this.setState({search: ""})}
										disabled={!this.state.search}>
										<CloseIcon/>
									</IconButton>
								</InputAdornment>}
								/>
						</div>
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

				<Button
					classes={{fab: classes.fab}}
					variant="fab"
					color="primary"
					onClick={()=>this.props.history.push('/new-game')}>
					<AddIcon/>
				</Button>

				<DashboardContent {...this.props} {...this.state}/>
			</div>
		);
	}
}

const styles = theme => ({
	input: {
		paddingTop: theme.spacing.unit,
		paddingRight: theme.spacing.unit,
		paddingBottom: theme.spacing.unit,
		paddingLeft: theme.spacing.unit * 10,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			width: 120,
			'&:focus': {
				width: 200,
			}
		}
	},
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing.unit,
			width: 'auto',
		}
	},
	grow: {
		flexGrow: 1
	},
	searchIcon: {
		width: theme.spacing.unit * 9,
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	root: {
		width: '100%',
	},
	fab: {
		position: "absolute",
		bottom: theme.spacing.unit *2,
		right: theme.spacing.unit *2
	}
})

export default withStyles(styles, {withTheme: true})(Dashboard);

class DashboardContent extends Component {
	handleItemDetailClick(game){
		const {id} = game;
		const move = game.lines.find(line => line.play);
		const moveId = (move && move.id) || 0;
		this.props.history.push('/detail/'+id+'/'+moveId);
	}

	render(){
		const {search} = this.props;

		const list = Local.get('Games') || [];

		const filter = list.filter(item => this.filter(item, search));
		const last = list.slice().sort((a,b) => b.edit - a.edit);

		return (
			<div>
				{
					search &&
					<div>
						<Typography variant="title" color="primary">Search result <small>({filter.length})</small></Typography>
						{
							filter.length !== 0 &&
							<GridList>
								{filter.map((item, i) =>
									<GridListTile key={i}><DashboardTile
										key={i}
										game={item}
										onClick={()=>this.handleItemDetailClick(item)}
										/>
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
					!search &&
					<div>
						<Typography variant="title" color="primary">Last played games</Typography>
							{
								last.length !== 0 &&
								<GridList>
									{last.map((item, i) =>
										<GridListTile key={i}><DashboardTile
											key={i}
											game={item}
											onClick={()=>this.handleItemDetailClick(item)}
											/>
										</GridListTile>)}
								</GridList>
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

function DashboardTile (props) {
	const {game} = props;
	const line = game.lines
		.find(item => item.play)
		|| game.lines[0];

	// TODO: Check line
	// TODO: use side or turn

	const {rotateChessboard} = Local.get("Settings") || {};
	const side = rotateChessboard
		? line.fen.split(" ")[1]
		: game.side;

	return (
		<div style={{
				width: "100%",
				height: "100%"
			}}>
			<Chessboard
				fen={line.fen}
				side={side}/>
			<GridListTileBar
				title={game.title}
				actionIcon={
					<IconButton
						onClick={props.onClick}>
						<InfoIcon />
					</IconButton>
				}/>
		</div>
	)
}
