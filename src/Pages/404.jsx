import React from 'react';
// import {Route, Switch} from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

function PageNotFound (props) {
	const {
		classes
	} = props;

	return (
		<div>
			<AppBar position="static">
				<Toolbar>
					<Typography
						style={{flexGrow: 1}}
						variant="title">
						Page not found
					</Typography>
				</Toolbar>
			</AppBar>

			<main
				className={classes.main}>
				<Typography paragraph>
					The page you were looking for can't be found.
				</Typography>

				<Button
					onClick={()=>props.history.replace("/")}>
					Back to dashboard
				</Button>
			</main>
		</div>
	);
}

const styles = theme => ({
	main: {
		padding: theme.spacing.unit
	}
});

export default withStyles(styles)(PageNotFound);
