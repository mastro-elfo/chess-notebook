import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import {OPENINGS} from '../openings';

function Info (props) {
	const {
		classes
	} = props;

	return (
		<div>
			<AppBar position="static">
				<Toolbar>
					<IconButton
						onClick={()=>props.history.goBack()}>
						<ArrowBackIcon/>
					</IconButton>
					<Typography
						variant="title"
						className={classes.grow}>
						Info
					</Typography>
				</Toolbar>
			</AppBar>

			<main
				className={classes.main}>
				<Typography
					variant="title"
					color="primary">
					License MIT
				</Typography>
				<Typography paragraph>
					Copyright (c) 2017 mastro-elfo<br/>
					<br/>
					Permission is hereby granted, free of charge, to any person
					obtaining a copy of this software and associated documentation
					files (the "Software"), to deal in the Software without
					restriction, including without limitation the rights to use,
					copy, modify, merge, publish, distribute, sublicense, and/or sell
					copies of the Software, and to permit persons to whom the
					Software is furnished to do so, subject to the following
					conditions:<br/>
					<br/>
					The above copyright notice and this permission notice shall be
					included in all copies or substantial portions of the Software.<br/>
					<br/>
					THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
					EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
					OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
					NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
					HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
					WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
					FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
					OTHER DEALINGS IN THE SOFTWARE.
				</Typography>

				<Typography
					variant="title"
					color="primary">
					Credits
				</Typography>

				<Typography
					variant="subheading"
					color="secondary">
					Chess Pieces
				</Typography>

				<Typography paragraph>
					By jurgenwesterhof (adapted from work of Cburnett) - <a className="external free" href="http://commons.wikimedia.org/wiki/Template:SVG_chess_pieces">http://commons.wikimedia.org/wiki/Template:SVG_chess_pieces</a>, <a className="external" href="https://creativecommons.org/licenses/by-sa/3.0" title="Creative Commons Attribution-Share Alike 3.0">CC BY-SA 3.0</a>, <a className="external"  href="https://commons.wikimedia.org/w/index.php?curid=35634436">Link</a>
				</Typography>

				<Typography
					variant="title"
					color="primary">
					Development
				</Typography>

				<Typography paragraph>
					<a className="external" title="Click to open Chess-Notebook repository on Github" href="https://github.com/mastro-elfo/chess-notebook">https://github.com/mastro-elfo/chess-notebook</a>
				</Typography>

				<Typography
					variant="title"
					color="primary">
					Chess-Notebook
				</Typography>

				<Typography paragraph>
					There are {OPENINGS.length} openings in the library
				</Typography>
			</main>
		</div>
	)
}

const styles = theme => ({
	grow: {
		flexGrow: 1
	},
	main: {
		paddingTop: theme.spacing.unit *2,
		paddingLeft: theme.spacing.unit,
		paddingRight: theme.spacing.unit,
		paddingBottom: theme.spacing.unit
	}
});

export default withStyles(styles)(Info);
