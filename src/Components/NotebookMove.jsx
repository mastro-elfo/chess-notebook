import React, {Component} from 'react';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import { withStyles } from '@material-ui/core/styles';

import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

import NotebookFirstMove from './NotebookFirstMove';

class NotebookMove extends Component {
	render(){
		const {
			line,
			classes
		} = this.props;
		// console.debug(line)

		const {
			move,
			comment,
			value,
			positionValue
		} = line;

		return (
			<div>
				<Toolbar>
					<Typography
						variant="title">
						{move &&
							<NotebookFirstMove
								{...this.props}
								withChip={false}
								/>}
					</Typography>

					{move &&
						<FormControl>
							<Select
								className={classes.Select}
								value={value || false}>
								<MenuItem value="!!">!!</MenuItem>
								<MenuItem value="!">!</MenuItem>
								<MenuItem value={false}>None</MenuItem>
								<MenuItem value="?">?</MenuItem>
								<MenuItem value="??">??</MenuItem>
							</Select>
							<FormHelperText>Move value</FormHelperText>
						</FormControl>}

					{move &&
						<FormControl>
							<Select
								className={classes.Select}
								value={positionValue || false}>
								<MenuItem value="OK">
									<ThumbUpIcon color="inherit"/>
								</MenuItem>

								<MenuItem value={false}>None</MenuItem>

								<MenuItem value="KO">
									<ThumbDownIcon/>
								</MenuItem>
							</Select>
							<FormHelperText>Position value</FormHelperText>
						</FormControl>}
				</Toolbar>

				<FormControl
					fullWidth>
					<TextField
						multiline
						rows={2}
						variant="outlined"
						value={comment}
						label="Comment"
						/>
				</FormControl>
			</div>
		);
	}
}

const styles = theme => ({
	Select: {
		marginLeft: theme.spacing.unit
	}
});

export default withStyles(styles, {withTheme: true})(NotebookMove);
