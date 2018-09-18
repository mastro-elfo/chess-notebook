import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export default function (props) {
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

			<div>
				<Button
					onClick={()=>props.history.replace("/")}>
					Back to dashboard
				</Button>
			</div>
		</div>
	);
}
