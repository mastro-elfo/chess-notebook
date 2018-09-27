import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

import DrawerIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

function DashboardHeader (props){
	const {
		classes,
		history,
		location,
		location: {search},
		handleToggleDrawer
	} = props;

	const searchEntry = search.substring(1);

	return (
		<AppBar
			position="static">
			<Toolbar>
				<IconButton
					onClick={()=>handleToggleDrawer(true)}>
					<DrawerIcon/>
				</IconButton>

				<Typography
					variant="title"
					className={classes.grow}
					color="inherit">
					Dashboard
				</Typography>

				<TextField
					placeholder="Search..."
					className={classes.Search}
					value={searchEntry}
					onChange={({target})=>history.replace({...location, search: target.value})}
					InputProps={{
						disableUnderline: true,
						classes: {
							root: classes.Input,
							focused: classes.InputFocused
						},
						startAdornment: (
							<InputAdornment
								position="start">
								<SearchIcon/>
							</InputAdornment>
						),
						endAdornment: (
							<InputAdornment
								position="end">
								<IconButton
									disabled={searchEntry === ""}
									onClick={()=>history.replace({...location, search: ""})}>
									<CloseIcon/>
								</IconButton>
							</InputAdornment>
						)
					}}
					/>
			</Toolbar>
		</AppBar>
	);
}

const styles = theme => ({
	grow: {
		flexGrow: 1
	},
	Search: {
		backgroundColor: emphasize(theme.palette.primary.main),
		borderRadius: theme.shape.borderRadius,
	},
	Input: {
		width: 300,
		transition: theme.transitions.create('width')
	},
	InputFocused: {
		width: 400
	}
});

export default withStyles(styles)(DashboardHeader);
