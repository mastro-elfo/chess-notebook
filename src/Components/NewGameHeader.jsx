import React, {Component} from 'react';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

class NewGameHeader extends Component {
	state = {
		pgnDialog: false,
		pgnInput: "",
		playTooltip: true
	}

	render(){
		const {
			history,
			classes,
			onClickPlay
			// ...other
		} = this.props;

		const {
			pgnDialog, pgnInput, playTooltip
		} = this.state;

		return (
			<AppBar
				position="static">
				<Toolbar>
					<IconButton
						onClick={()=>history.goBack()}>
						<ArrowBackIcon/>
					</IconButton>

					<Typography
						variant="title"
						className={classes.grow}
						color="inherit">
						New Game
					</Typography>

					<Button
						variant="outlined"
						onClick={this.handleOpenPGNDialog.bind(this)}>
						PGN
					</Button>

					<Tooltip
						open={playTooltip}
						onClose={()=>this.setState({playTooltip: false})}
						onOpen={()=>this.setState({playTooltip: true})}
						PopperProps={{
							onMouseLeave:()=>this.setState({playTooltip: false}),
							onClick:()=>this.setState({playTooltip: false})
						}}
						title="When you're done, click play">
						<IconButton
							onClick={onClickPlay}>
							<PlayArrowIcon/>
						</IconButton>
					</Tooltip>
				</Toolbar>

				<Dialog
					open={pgnDialog}
					onClose={this.handleClosePGNDialog.bind(this)}>
					<DialogTitle>Create game from PGN</DialogTitle>

					<DialogContent>
						<DialogContentText>
							Paste a valid PGN into the text field below.
						</DialogContentText>
						<TextField
							autoFocus fullWidth
							label="PGN" placeholder="Paste PGN here"
							onChange={({target})=>this.setState({pgnInput: target.value})}
							value={pgnInput}
							/>
					</DialogContent>

					<DialogActions>
						<Button
							color="primary"
							onClose={this.handleClosePGNDialog.bind(this)}>
							Cancel
						</Button>
						<Button
							color="primary"
							onClick={this.handleUpdateFromPGN.bind(this)}>
							Ok
						</Button>
					</DialogActions>
				</Dialog>
			</AppBar>
		);
	}

	handleUpdateFromPGN(){
		this.props.onUpdateFromPGN(this.state.pgnInput);
		this.setState({
			pgnInput: "",
			pgnDialog: false
		})
	}

	handleOpenPGNDialog(){
		this.setState({
			pgnInput: "",
			pgnDialog: true
		})
	}

	handleClosePGNDialog(){
		this.setState({
			pgnInput: "",
			pgnDialog: false
		})
	}
}

const styles = theme => ({
	grow: {
		flexGrow: 1
	}
});

export default withStyles(styles)(NewGameHeader);
