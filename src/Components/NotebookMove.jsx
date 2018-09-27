import React, {Component} from 'react';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
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
			classes,
			onEditComment,
			onChangeValue,
			onChangePositionValue
		} = this.props;

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
						<TextField
							helperText="Move value"
							select
							className={classes.Select}
							value={value || false}
							onChange={({target})=>onChangeValue(target.value)}
							margin="normal">
							<MenuItem value="!!">!!</MenuItem>
							<MenuItem value="!">!</MenuItem>
							<MenuItem value={false}>None</MenuItem>
							<MenuItem value="?">?</MenuItem>
							<MenuItem value="??">??</MenuItem>
						</TextField>}

					{move &&
						<TextField
							select
							helperText="Position value"
							value={positionValue || false}
							className={classes.Select}
							onChange={({target})=>onChangePositionValue(target.value)}
							margin="normal">
							<MenuItem value="OK">
								<ThumbUpIcon fontSize="small"/>&nbsp;Good
							</MenuItem>
							<MenuItem value={false}>
								None
							</MenuItem>
							<MenuItem value="KO">
								<ThumbDownIcon fontSize="small"/>&nbsp;Bad
							</MenuItem>
						</TextField>}
				</Toolbar>

				<FormControl
					fullWidth>
					<TextField
						multiline
						rows={3}
						variant="outlined"
						value={comment}
						label="Comment"
						onChange={({target})=>onEditComment(target.value)}
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
